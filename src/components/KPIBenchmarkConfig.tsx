import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Target, Loader2, CheckCircle2, Lock } from 'lucide-react';
import { SlideOutPanel } from './common/SlideOutPanel';
import { getSchoolBenchmarks, updateSchoolBenchmark, getDistrictBenchmarks } from '../lib/api';
import { supabase } from '../lib/supabase';
import { KPIBenchmarkConfig as KPIConfig } from '../types';

interface KPIBenchmarkConfigProps {
  isOpen: boolean;
  onClose: () => void;
}

const getKPIConfig = (kpi: any): KPIConfig => {
  const config: Partial<KPIConfig> = {
    kpiId: kpi.id,
    name: kpi.name,
    unit: kpi.unit,
    description: kpi.description || '',
    defaultBenchmark: kpi.benchmark,
    relationships: kpi.relationships || []
  };

  switch (kpi.name) {
    case 'Meals Served':
      return {
        ...config,
        format: 'integer',
        min: 0,
        max: 10000,
        step: 1,
        description: 'Daily target for total meals served across all meal periods',
        readOnly: true // Make read-only since it's driven by participation rate
      } as KPIConfig;
    case 'Participation Rate':
      return {
        ...config,
        format: 'percentage',
        min: 0,
        max: 100,
        step: 1,
        description: 'Target percentage of enrolled students participating in meal programs per day'
      } as KPIConfig;
    case 'Food Waste':
      return {
        ...config,
        format: 'percentage',
        min: 0,
        max: 100,
        step: 1,
        description: 'Target maximum percentage of prepared food that should go to waste'
      } as KPIConfig;
    case 'Cost per Meal':
      return {
        ...config,
        format: 'decimal',
        min: 0,
        max: 10,
        step: 0.01,
        description: 'Target average cost per meal including food, labor, and supplies'
      } as KPIConfig;
    case 'Meals Per Labor Hour':
      return {
        ...config,
        format: 'decimal',
        min: 0,
        max: 50,
        step: 0.1,
        description: 'Target number of meal equivalents produced per labor hour'
      } as KPIConfig;
    default:
      return {
        ...config,
        format: 'decimal',
        min: 0,
        max: 1000,
        step: 1,
        description: 'Daily target value for this metric'
      } as KPIConfig;
  }
};

const KPIBenchmarkConfig: React.FC<KPIBenchmarkConfigProps> = ({ isOpen, onClose }) => {
  const darkMode = useStore((state) => state.darkMode);
  const { user, kpis } = useStore();
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [schools, setSchools] = useState<any[]>([]);
  const [benchmarks, setBenchmarks] = useState<Record<string, number>>({});
  const [districtBenchmarks, setDistrictBenchmarks] = useState<any[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Get KPI configurations for non-hidden KPIs
  const kpiConfigs = kpis
    .filter(kpi => !kpi.is_hidden)
    .map(getKPIConfig);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.district_id || !isOpen) return;

      try {
        setLoading(true);
        
        // Fetch schools
        const { data: schoolsData } = await supabase
          .from('schools')
          .select('*')
          .eq('district_id', user.district_id)
          .order('name');
        
        setSchools(schoolsData || []);

        // Fetch district benchmarks for overview
        const districtData = await getDistrictBenchmarks(user.district_id);
        setDistrictBenchmarks(districtData || []);

        // If a school is selected, fetch its benchmarks
        if (selectedSchool) {
          const schoolBenchmarks = await getSchoolBenchmarks(selectedSchool);
          const benchmarkMap = schoolBenchmarks.reduce((acc, b) => ({
            ...acc,
            [b.kpi_id]: b.benchmark
          }), {});
          setBenchmarks(benchmarkMap);
        } else {
          // Reset benchmarks when no school is selected
          setBenchmarks({});
        }
      } catch (error) {
        console.error('Error fetching benchmarks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, isOpen, selectedSchool]);

  const handleSchoolChange = async (schoolId: string) => {
    setSelectedSchool(schoolId);
    if (schoolId) {
      setLoading(true);
      try {
        const schoolBenchmarks = await getSchoolBenchmarks(schoolId);
        const benchmarkMap = schoolBenchmarks.reduce((acc, b) => ({
          ...acc,
          [b.kpi_id]: b.benchmark
        }), {});
        setBenchmarks(benchmarkMap);
      } catch (error) {
        console.error('Error fetching school benchmarks:', error);
      } finally {
        setLoading(false);
      }
    } else {
      setBenchmarks({});
    }
  };

  const handleBenchmarkChange = (kpiId: string, value: number) => {
    setBenchmarks(prev => ({
      ...prev,
      [kpiId]: value
    }));
  };

  const handleSave = async () => {
    if (!selectedSchool) return;

    try {
      setSaving(true);
      setSaveStatus('saving');

      // Save each benchmark
      const savePromises = Object.entries(benchmarks).map(([kpiId, value]) =>
        updateSchoolBenchmark(selectedSchool, kpiId, value)
      );

      await Promise.all(savePromises);
      setSaveStatus('success');

      // Trigger a refresh of the dashboard data
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('benchmarks-updated'));
      }

      // Reset status after a delay
      setTimeout(() => {
        setSaveStatus('idle');
        onClose(); // Close the panel after successful save
      }, 2000);
    } catch (error) {
      console.error('Error saving benchmarks:', error);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'percentage':
        return `${value}%`;
      case 'decimal':
        return value.toFixed(2);
      default:
        return value.toString();
    }
  };

  const getDistrictAverage = (kpiId: string) => {
    const kpiBenchmarks = districtBenchmarks.filter(b => b.kpi_id === kpiId);
    if (!kpiBenchmarks.length) return null;
    
    const sum = kpiBenchmarks.reduce((acc, b) => acc + b.benchmark, 0);
    return sum / kpiBenchmarks.length;
  };

  return (
    <SlideOutPanel
      isOpen={isOpen}
      onClose={onClose}
      title="Benchmark Configuration"
      icon={<Target className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-2`} />}
      subtitle="Configure daily benchmark targets for each KPI"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 px-4 py-6 sm:px-6">
          {/* School selector */}
          <div className="mb-6">
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Select School
            </label>
            <select
              value={selectedSchool}
              onChange={(e) => handleSchoolChange(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm ${
                darkMode 
                  ? 'bg-gray-700 text-gray-300 border-gray-600' 
                  : 'bg-white text-gray-900 border-gray-200'
              } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="">All Schools (Overview)</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className={`w-8 h-8 animate-spin ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
            </div>
          ) : selectedSchool ? (
            <div className="space-y-6">
              {kpiConfigs.map((config) => (
                <div key={config.kpiId} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className={`text-sm font-medium ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      <div className="flex items-center">
                        {config.name}
                        {config.readOnly && (
                          <Lock className={`w-4 h-4 ml-2 ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                        )}
                      </div>
                    </label>
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      Default: {formatValue(config.defaultBenchmark, config.format)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <input
                      type="range"
                      min={config.min}
                      max={config.max}
                      step={config.step}
                      value={benchmarks[config.kpiId] || config.defaultBenchmark}
                      onChange={(e) => handleBenchmarkChange(config.kpiId, Number(e.target.value))}
                      disabled={config.readOnly}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 disabled:opacity-50"
                    />
                    <input
                      type="number"
                      min={config.min}
                      max={config.max}
                      step={config.step}
                      value={benchmarks[config.kpiId] || config.defaultBenchmark}
                      onChange={(e) => handleBenchmarkChange(config.kpiId, Number(e.target.value))}
                      disabled={config.readOnly}
                      className={`w-24 px-2 py-1 text-sm rounded-md ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-300 border-gray-600' 
                          : 'bg-white text-gray-900 border-gray-300'
                      } border disabled:opacity-50`}
                    />
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {config.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {kpiConfigs.map((config) => {
                const avgBenchmark = getDistrictAverage(config.kpiId);
                return (
                  <div key={config.kpiId} className={`p-4 rounded-lg ${
                    darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                  }`}>
                    <h3 className={`text-sm font-medium mb-2 ${
                      darkMode ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {config.name}
                    </h3>
                    <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <p className="mb-2">
                        District Default: {formatValue(config.defaultBenchmark, config.format)}
                      </p>
                      {avgBenchmark !== null && (
                        <p>
                          Average School Benchmark: {formatValue(avgBenchmark, config.format)}
                        </p>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      {districtBenchmarks
                        .filter(b => b.kpi_id === config.kpiId)
                        .map((b, index) => (
                          <div key={index} className="flex justify-between text-xs">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                              {b.schools?.name}
                            </span>
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                              {formatValue(b.benchmark, config.format)}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Save button */}
        {selectedSchool && (
          <div className="flex-shrink-0 px-4 py-4 sm:px-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              {saveStatus === 'success' && (
                <span className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  Benchmarks saved successfully!
                </span>
              )}
              {saveStatus === 'error' && (
                <span className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                  Error saving benchmarks. Please try again.
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving || !Object.keys(benchmarks).length}
                className={`ml-auto px-4 py-2 rounded-lg text-white ${
                  saving || !Object.keys(benchmarks).length
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                } flex items-center space-x-2`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </SlideOutPanel>
  );
};

export default KPIBenchmarkConfig;