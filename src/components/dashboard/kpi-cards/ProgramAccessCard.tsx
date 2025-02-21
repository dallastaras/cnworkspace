import React from 'react';
import { useStore } from '../../../store/useStore';
import { Users } from 'lucide-react';
import { KPI } from '../../../types';

interface ProgramAccessCardProps {
  kpi: KPI;
  value: number;
  trend: number;
  schoolBenchmark?: number;
  expectedBenchmark: number;
  onClick?: () => void;
}

export const ProgramAccessCard: React.FC<ProgramAccessCardProps> = ({
  kpi,
  value,
  trend,
  schoolBenchmark,
  expectedBenchmark,
  onClick
}) => {
  const darkMode = useStore((state) => state.darkMode);

  // Determine if the value is above or below benchmark
  const isAboveBenchmark = value >= expectedBenchmark;
  const isPerformingWell = isAboveBenchmark;

  // Get performance indicator styles
  const getPerformanceStyles = () => {
    if (isPerformingWell) {
      return {
        color: darkMode ? 'text-green-400' : 'text-green-600',
        bgColor: darkMode ? 'bg-green-400/10' : 'bg-green-50',
        borderColor: darkMode ? 'border-green-400' : 'border-green-500'
      };
    }
    return {
      color: darkMode ? 'text-red-400' : 'text-red-600',
      bgColor: darkMode ? 'bg-red-400/10' : 'bg-red-50',
      borderColor: darkMode ? 'border-red-400' : 'border-red-500'
    };
  };

  const performanceStyles = getPerformanceStyles();

  return (
    <div 
      className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm border-t-4 ${
        performanceStyles.borderColor
      } cursor-pointer`}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Eco Dis
            </h3>
            <div className={`mt-1 text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {Math.round(value)}%
            </div>
          </div>
          <div className={`flex items-center space-x-2 ${performanceStyles.color}`}>
            <div className={`p-1 rounded-full ${performanceStyles.bgColor}`}>
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
              Benchmark
            </span>
            <span className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {Math.round(expectedBenchmark)}%
            </span>
          </div>
        </div>

        <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Free
              </div>
              <div className={`mt-1 text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {Math.round(value * 0.8)}%
              </div>
            </div>
            <div>
              <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Reduced
              </div>
              <div className={`mt-1 text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {Math.round(value * 0.2)}%
              </div>
            </div>
            <div>
              <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Paid
              </div>
              <div className={`mt-1 text-sm font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                {Math.round(100 - value)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};