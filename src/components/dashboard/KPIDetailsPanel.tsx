import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Target, Info, Bot, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { KPI } from '../../types';
import { SlideOutPanel } from '../common/SlideOutPanel';
import { LunchParticipationDetails } from './kpi-details/LunchParticipationDetails';
import { FoodWasteDetails } from './kpi-details/FoodWasteDetails';
import { EnrollmentDetails } from './kpi-details/EnrollmentDetails';
import { RevenueDetails } from './kpi-details/RevenueDetails';
import { MealTypeDetails } from './kpi-details/MealTypeDetails';

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
  metrics?: any; // Will be typed based on the KPI
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
  expectedBenchmark,
  metrics
}) => {
  const darkMode = useStore((state) => state.darkMode);

  const formatValue = (val: number) => {
    if (kpi.unit === '%') return `${Math.round(val)}%`;
    if (kpi.unit === '$') return `$${val.toFixed(2)}`;
    return val.toLocaleString();
  };

  const renderKPISpecificDetails = () => {
    if (kpi.name === 'Program Access') {
      return (
        <EnrollmentDetails 
          totalEnrollment={metrics?.total_enrollment || 0}
          freeCount={metrics?.free_count || 0}
          reducedCount={metrics?.reduced_count || 0}
          paidCount={metrics?.paid_count || 0}
          isDistrictView={selectedSchool === 'district'}
          schoolBreakdown={metrics?.schoolBreakdown || []}
        />
      );
    }

    if (['Lunch Participation', 'Breakfast Participation', 'Snack Participation'].includes(kpi.name)) {
      return (
        <LunchParticipationDetails 
          totalMeals={metrics?.totalMeals || 0}
          freeMeals={metrics?.freeMeals || 0}
          reducedMeals={metrics?.reducedMeals || 0}
          paidMeals={metrics?.paidMeals || 0}
          totalEnrollment={metrics?.totalEnrollment || 0}
          freeCount={metrics?.freeCount || 0}
          reducedCount={metrics?.reducedCount || 0}
          dateRange={dateRange}
          operatingDays={metrics?.operatingDays || 1}
          attendanceFactor={0.93}
        />
      );
    }

    if (kpi.name === 'Food Waste') {
      return metrics ? (
        <FoodWasteDetails 
          metrics={metrics}
          dateRange={dateRange}
        />
      ) : null;
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