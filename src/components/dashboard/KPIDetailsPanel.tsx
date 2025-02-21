import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Target, 
  Info,
  Bot,
  Calendar,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { KPI } from '../../types';
import { SlideOutPanel } from '../common/SlideOutPanel';
import { LunchParticipationDetails } from './kpi-details/LunchParticipationDetails';
import { FoodWasteDetails } from './kpi-details/FoodWasteDetails';
import { EnrollmentDetails } from './kpi-details/EnrollmentDetails';
import { RevenueDetails } from './kpi-details/RevenueDetails';
import { MealTypeDetails } from './kpi-details/MealTypeDetails';
import { getSchoolDailyMetrics } from '../../lib/api';
import { SchoolMetrics } from '../../types';

interface KPIDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  kpi: KPI;
  value: number;
  trend: number;
  dateRange: {
    start: Date;
    end: Date;
  };
  selectedSchool: string;
  schoolBenchmark?: number;
  expectedBenchmark: number;
}

export const KPIDetailsPanel: React.FC<KPIDetailsPanelProps> = ({
  isOpen,
  onClose,
  kpi,
  value,
  trend,
  dateRange,
  selectedSchool,
  schoolBenchmark,
  expectedBenchmark
}) => {
  const darkMode = useStore((state) => state.darkMode);
  const { user } = useStore();
  const [metrics, setMetrics] = useState<SchoolMetrics[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user?.district_id || !kpi) return;

      try {
        setLoading(true);
        setError(null);
        
        const data = await getSchoolDailyMetrics(user.district_id, dateRange);
        
        const filteredMetrics = selectedSchool !== 'district'
          ? data.filter(m => m.school_id === selectedSchool)
          : data;

        setMetrics(filteredMetrics || []);
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setError(error instanceof Error ? error : new Error('Failed to fetch metrics'));
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user, kpi, dateRange, selectedSchool]);

  const getMealBreakdown = () => {
    if (!metrics.length || !['Lunch Participation', 'Breakfast Participation', 'Snack Participation'].includes(kpi?.name || '')) {
      return null;
    }

    const isLunch = kpi?.name === 'Lunch Participation';
    const isBreakfast = kpi?.name === 'Breakfast Participation';
    const isSnack = kpi?.name === 'Snack Participation';
    
    // Filter metrics for the selected date range
    const dateFilteredMetrics = metrics.filter(metric => {
      const metricDate = new Date(metric.date);
      return metricDate >= dateRange.start && metricDate <= dateRange.end;
    });

    // Count days with meals for the selected meal type
    const servingDays = dateFilteredMetrics.filter(metric => {
      if (isLunch) return metric.lunch_count > 0;
      if (isBreakfast) return metric.breakfast_count > 0;
      if (isSnack) return metric.snack_count > 0;
      return false;
    }).length;

    if (selectedSchool !== 'district') {
      // For single school, sum up all metrics for the period
      const schoolMetrics = dateFilteredMetrics[0]; // Get first record for enrollment data
      if (!schoolMetrics) return null;

      const mealCounts = dateFilteredMetrics.reduce((acc, metric) => ({
        totalMeals: acc.totalMeals + (isLunch ? metric.lunch_count 
                    : isBreakfast ? metric.breakfast_count
                    : metric.snack_count || 0),
        freeMeals: acc.freeMeals + (isLunch ? metric.free_meal_lunch 
                    : isBreakfast ? metric.free_meal_breakfast
                    : metric.free_meal_snack || 0),
        reducedMeals: acc.reducedMeals + (isLunch ? metric.reduced_meal_lunch 
                      : isBreakfast ? metric.reduced_meal_breakfast
                      : metric.reduced_meal_snack || 0),
        paidMeals: acc.paidMeals + (isLunch ? metric.paid_meal_lunch 
                    : isBreakfast ? metric.paid_meal_breakfast
                    : metric.paid_meal_snack || 0)
      }), {
        totalMeals: 0,
        freeMeals: 0,
        reducedMeals: 0,
        paidMeals: 0
      });

      return {
        ...mealCounts,
        totalEnrollment: schoolMetrics.total_enrollment,
        freeCount: schoolMetrics.free_count,
        reducedCount: schoolMetrics.reduced_count,
        operatingDays: servingDays || 1
      };
    }
    
    // For district view, sum up all schools' metrics for the period
    return dateFilteredMetrics.reduce((acc, m) => ({
      totalMeals: acc.totalMeals + (isLunch ? m.lunch_count 
                  : isBreakfast ? m.breakfast_count
                  : m.snack_count || 0),
      freeMeals: acc.freeMeals + (isLunch ? m.free_meal_lunch 
                  : isBreakfast ? m.free_meal_breakfast
                  : m.free_meal_snack || 0),
      reducedMeals: acc.reducedMeals + (isLunch ? m.reduced_meal_lunch 
                    : isBreakfast ? m.reduced_meal_breakfast
                    : m.reduced_meal_snack || 0),
      paidMeals: acc.paidMeals + (isLunch ? m.paid_meal_lunch 
                  : isBreakfast ? m.paid_meal_breakfast
                  : m.paid_meal_snack || 0),
      totalEnrollment: acc.totalEnrollment + m.total_enrollment,
      freeCount: acc.freeCount + m.free_count,
      reducedCount: acc.reducedCount + m.reduced_count,
      operatingDays: servingDays || 1
    }), { 
      totalMeals: 0, 
      freeMeals: 0, 
      reducedMeals: 0,
      paidMeals: 0,
      totalEnrollment: 0,
      freeCount: 0,
      reducedCount: 0,
      operatingDays: servingDays || 1
    });
  };

  const getEnrollmentBreakdown = () => {
    if (!metrics.length || kpi?.name !== 'Program Access') return null;

    if (selectedSchool !== 'district') {
      const schoolMetrics = metrics[0];
      if (!schoolMetrics) return null;

      return {
        totalEnrollment: schoolMetrics.total_enrollment || 0,
        freeCount: schoolMetrics.free_count || 0,
        reducedCount: schoolMetrics.reduced_count || 0,
        paidCount: (schoolMetrics.total_enrollment || 0) - 
                  ((schoolMetrics.free_count || 0) + (schoolMetrics.reduced_count || 0))
      };
    }

    // For district view, prepare school breakdown
    const schoolBreakdown = metrics.map(m => ({
      schoolName: m.school_name || 'Unknown School',
      totalEnrollment: m.total_enrollment || 0,
      freeCount: m.free_count || 0,
      reducedCount: m.reduced_count || 0,
      paidCount: (m.total_enrollment || 0) - ((m.free_count || 0) + (m.reduced_count || 0))
    }));

    // Calculate district totals
    const totals = metrics.reduce((acc, m) => ({
      totalEnrollment: acc.totalEnrollment + (m.total_enrollment || 0),
      freeCount: acc.freeCount + (m.free_count || 0),
      reducedCount: acc.reducedCount + (m.reduced_count || 0),
      paidCount: acc.paidCount + ((m.total_enrollment || 0) - ((m.free_count || 0) + (m.reduced_count || 0)))
    }), {
      totalEnrollment: 0,
      freeCount: 0,
      reducedCount: 0,
      paidCount: 0
    });

    return {
      ...totals,
      schoolBreakdown
    };
  };

  if (!kpi) return null;

  const formatValue = (val: number) => {
    if (kpi.unit === '%') return `${Math.round(val)}%`;
    if (kpi.unit === '$') return `$${val.toFixed(2)}`;
    return val.toLocaleString();
  };

  const renderKPISpecificDetails = () => {
    if (loading) {
      return (
        <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4 text-center`}>
          <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Loading data...
          </span>
        </div>
      );
    }

    if (kpi.name === 'Program Access') {
      const breakdown = getEnrollmentBreakdown();
      if (breakdown) {
        return (
          <EnrollmentDetails 
            {...breakdown}
            isDistrictView={selectedSchool === 'district'}
          />
        );
      }
    }

    if (['Lunch Participation', 'Breakfast Participation', 'Snack Participation'].includes(kpi.name)) {
      const breakdown = getMealBreakdown();
      if (breakdown) {
        return (
          <LunchParticipationDetails 
            {...breakdown}
            dateRange={dateRange}
            operatingDays={breakdown.operatingDays}
            attendanceFactor={0.93}
          />
        );
      }
    }

    if (kpi.name === 'Food Waste') {
      const wasteMetrics = {
        planned: 1135035,
        produced: 1081132,
        served: 830857,
        waste: 62040,
        rts: 115559,
        carryOver: 72676,
        leftOver: 188235,
        spoilage: {
          temperature: 12500,
          quality: 8750,
          expired: 15000
        }
      };

      return (
        <FoodWasteDetails 
          metrics={wasteMetrics}
          dateRange={dateRange}
        />
      );
    }

    if (kpi.name === 'Revenue') {
      return (
        <RevenueDetails 
          metrics={metrics}
          dateRange={dateRange}
        />
      );
    }

    if (kpi.name === 'Meals Served') {
      return (
        <MealTypeDetails 
          metrics={metrics}
          dateRange={dateRange}
        />
      );
    }

    return null;
  };

  return (
    <SlideOutPanel
      isOpen={isOpen}
      onClose={onClose}
      title={kpi.name}
      icon={<Target className={`h-6 w-6 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'} mr-2`} />}
      subtitle={`Analysis for ${format(dateRange.start, 'MMM d, yyyy')} - ${format(dateRange.end, 'MMM d, yyyy')}`}
      width="half"
    >
      <div className="px-4 py-6 sm:px-6 space-y-6">
        {/* Current Value */}
        <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              Current {kpi.name}
            </h3>
          </div>
          <div className="flex items-baseline">
            <span className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {formatValue(value)}
            </span>
          </div>
        </div>

        {/* Period Information */}
        {['Lunch Participation', 'Breakfast Participation', 'Snack Participation'].includes(kpi.name) && (
          <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray -300' : 'text-gray-600'}`}>
                    {getMealBreakdown()?.operatingDays || 0} serving day{(getMealBreakdown()?.operatingDays || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    93% attendance factor
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* KPI-specific details */}
        {renderKPISpecificDetails()}

        {/* Description */}
        <div>
          <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            About This Metric
          </h3>
          <div className={`${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} rounded-lg p-4`}>
            <div className="flex items-start space-x-3">
              <Info className={`w-5 h-5 mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {kpi.description || 'No description available.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </SlideOutPanel>
  );
};