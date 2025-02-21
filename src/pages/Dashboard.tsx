import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import {
  DashboardHeader,
  KPICard,
  PerformanceTrends,
  SchoolPerformanceSection,
  SchoolScoreCard
} from '../components/dashboard';
import { SchoolieInsightsPanel } from '../components/dashboard/SchoolieInsightsPanel';
import { KPIDetailsPanel } from '../components/dashboard/KPIDetailsPanel';
import KPIBenchmarkConfig from '../components/KPIBenchmarkConfig';
import { useDashboardData } from '../hooks/useDashboardData';
import { useSchoolMetrics } from '../hooks/useSchoolMetrics';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { EmptyState } from '../components/common/EmptyState';
import { NonServingDayMessage } from '../components/common/NonServingDayMessage';
import { LoadingOverlay } from '../components/common/LoadingOverlay';
import { getSchoolBenchmarks } from '../lib/api';
import { KPI } from '../types';
import {
  MealsServedCard,
  ParticipationRateCard,
  FoodWasteCard,
  RevenueCard,
  SnackParticipationCard,
  BaseKPICard
} from '../components/dashboard/kpi-cards';

const Dashboard = () => {
  const [selectedSchool, setSelectedSchool] = useState('district');
  const [isBenchmarkConfigOpen, setIsBenchmarkConfigOpen] = useState(false);
  const [isSchoolieOpen, setIsSchoolieOpen] = useState(false);
  const [selectedKPI, setSelectedKPI] = useState<KPI | null>(null);
  const [schoolBenchmarks, setSchoolBenchmarks] = useState<Record<string, number>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const darkMode = useStore((state) => state.darkMode);
  const { user } = useStore();

  const {
    schools,
    kpis,
    kpiValues,
    loading: dashboardLoading,
    error: dashboardError,
    dateRange,
    isNonServingPeriod,
    nonServingReason,
    getAggregatedKPIValue,
    getKPITrend,
    getExpectedBenchmark,
    refreshData
  } = useDashboardData(selectedSchool);

  const {
    metrics: schoolMetrics,
    loading: metricsLoading,
    error: metricsError
  } = useSchoolMetrics({
    districtId: user?.district_id || '',
    selectedSchool,
    dateRange
  });

  useEffect(() => {
    const fetchSchoolBenchmarks = async () => {
      if (selectedSchool === 'district') {
        setSchoolBenchmarks({});
        return;
      }

      try {
        const benchmarks = await getSchoolBenchmarks(selectedSchool);
        const benchmarkMap = benchmarks.reduce((acc, b) => ({
          ...acc,
          [b.kpi_id]: b.benchmark
        }), {});
        setSchoolBenchmarks(benchmarkMap);
      } catch (error) {
        console.error('Error fetching school benchmarks:', error);
      }
    };

    fetchSchoolBenchmarks();
  }, [selectedSchool]);

  useEffect(() => {
    const handleBenchmarkUpdate = async () => {
      setIsRefreshing(true);
      try {
        await refreshData();
        if (selectedSchool !== 'district') {
          const benchmarks = await getSchoolBenchmarks(selectedSchool);
          const benchmarkMap = benchmarks.reduce((acc, b) => ({
            ...acc,
            [b.kpi_id]: b.benchmark
          }), {});
          setSchoolBenchmarks(benchmarkMap);
        }
      } catch (error) {
        console.error('Error refreshing data:', error);
      } finally {
        setTimeout(() => {
          setIsRefreshing(false);
        }, 1000);
      }
    };

    window.addEventListener('benchmarks-updated', handleBenchmarkUpdate);
    return () => {
      window.removeEventListener('benchmarks-updated', handleBenchmarkUpdate);
    };
  }, [refreshData, selectedSchool]);

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <LoadingSpinner 
          size="lg" 
          className={darkMode ? 'text-gray-400' : 'text-gray-500'} 
        />
      </div>
    );
  }

  if (dashboardError || metricsError) {
    return (
      <div className="h-[calc(100vh-8rem)]">
        <EmptyState
          icon={AlertCircle}
          title="Error Loading Dashboard"
          message="There was a problem loading the dashboard data. Please try again later."
        />
      </div>
    );
  }

  const selectedSchoolMetrics = selectedSchool !== 'district' 
    ? schoolMetrics?.find(m => m.school_id === selectedSchool)
    : null;

  // Order KPIs in the specified sequence
  const orderedKPIs = kpis?.sort((a, b) => {
    const order = [
      'Program Access',
      'Meals Served',
      'Revenue',
      'Meal Equivalents',
      'Breakfast Participation',
      'Lunch Participation',
      'Snack Participation',
      'Food Waste'
    ];
    const aIndex = order.indexOf(a.name);
    const bIndex = order.indexOf(b.name);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  return (
    <div className="space-y-6">
      <LoadingOverlay isVisible={isRefreshing} />

      <DashboardHeader
        selectedSchool={selectedSchool}
        schools={schools}
        onSchoolChange={setSelectedSchool}
        onOpenBenchmarks={() => setIsBenchmarkConfigOpen(true)}
        onOpenSchoolie={() => setIsSchoolieOpen(true)}
      />

      {isNonServingPeriod && nonServingReason ? (
        <NonServingDayMessage 
          date={dateRange.start}
          reason={nonServingReason}
        />
      ) : (
        <>
          {selectedSchool !== 'district' && selectedSchoolMetrics && (
            <SchoolScoreCard metrics={selectedSchoolMetrics} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {orderedKPIs?.filter(kpi => !kpi.is_hidden).map(kpi => {
              const value = getAggregatedKPIValue(kpi.id);
              const expectedBenchmark = getExpectedBenchmark(kpi, schoolBenchmarks[kpi.id]);
              const props = {
                kpi,
                value: value || 0,
                trend: getKPITrend(kpi.id),
                schoolBenchmark: schoolBenchmarks[kpi.id],
                expectedBenchmark,
                onClick: () => setSelectedKPI(kpi)
              };

              switch (kpi.name) {
                case 'Program Access': {
                  const metrics = selectedSchool !== 'district'
                    ? selectedSchoolMetrics
                    : schoolMetrics?.reduce((acc, m) => ({
                        freeReducedCount: (acc.freeReducedCount || 0) + m.free_reduced_count
                      }), { freeReducedCount: 0 });
                  
                  return (
                    <BaseKPICard 
                      key={kpi.id} 
                      {...props} 
                    />
                  );
                }
                case 'Meals Served':
                  return <MealsServedCard key={kpi.id} {...props} />;
                case 'Revenue':
                  return <RevenueCard key={kpi.id} {...props} />;
                case 'Lunch Participation':
                case 'Breakfast Participation':
                case 'Snack Participation':
                  return <ParticipationRateCard key={kpi.id} {...props} />;
                case 'Food Waste':
                  return <FoodWasteCard key={kpi.id} {...props} />;
                default:
                  return <BaseKPICard key={kpi.id} {...props} />;
              }
            })}
          </div>

          {selectedSchool === 'district' && !isNonServingPeriod && (
            <SchoolPerformanceSection
              loading={metricsLoading}
              metrics={schoolMetrics || []}
              dateRange={dateRange}
            />
          )}

          {kpis?.length > 0 && kpiValues?.length > 0 && (
            <PerformanceTrends 
              kpis={kpis} 
              kpiValues={kpiValues} 
              selectedSchool={selectedSchool}
              dateRange={dateRange}
            />
          )}
        </>
      )}

      <KPIBenchmarkConfig 
        isOpen={isBenchmarkConfigOpen}
        onClose={() => setIsBenchmarkConfigOpen(false)}
      />

      <SchoolieInsightsPanel
        isOpen={isSchoolieOpen}
        onClose={() => setIsSchoolieOpen(false)}
        kpis={kpis || []}
        kpiValues={kpiValues || []}
        selectedSchool={selectedSchool}
        schoolMetrics={selectedSchoolMetrics}
        dateRange={dateRange}
      />

      {selectedKPI && (
        <KPIDetailsPanel
          isOpen={!!selectedKPI}
          onClose={() => setSelectedKPI(null)}
          kpi={selectedKPI}
          value={getAggregatedKPIValue(selectedKPI.id) || 0}
          trend={getKPITrend(selectedKPI.id)}
          dateRange={dateRange}
          selectedSchool={selectedSchool}
          schoolBenchmark={schoolBenchmarks[selectedKPI.id]}
          expectedBenchmark={getExpectedBenchmark(selectedKPI, schoolBenchmarks[selectedKPI.id])}
        />
      )}
    </div>
  );
};

export default Dashboard;