import React from 'react';
import { useStore } from '../../store/useStore';
import { Target, Bot } from 'lucide-react';
import { TimeframeSelector } from './TimeframeSelector';
import { Select } from '../common/Select';

interface DashboardHeaderProps {
  selectedSchool: string;
  schools: Array<{ id: string; name: string }>;
  onSchoolChange: (schoolId: string) => void;
  onOpenBenchmarks: () => void;
  onOpenSchoolie: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  selectedSchool,
  schools,
  onSchoolChange,
  onOpenBenchmarks,
  onOpenSchoolie
}) => {
  const darkMode = useStore((state) => state.darkMode);

  const schoolOptions = [
    { value: 'district', label: 'All Schools' },
    ...schools.map(school => ({
      value: school.id,
      label: school.name
    }))
  ];

  return (
    <div className="flex justify-between items-center">
      <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Insights
      </h1>
      <div className="flex items-center space-x-4">
        <TimeframeSelector />
        <button
          onClick={onOpenSchoolie}
          className={`p-2 rounded-lg ${
            darkMode 
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          title="Ask Schoolie"
        >
          <Bot className="w-5 h-5" />
        </button>
        <button
          onClick={onOpenBenchmarks}
          className={`p-2 rounded-lg ${
            darkMode 
              ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          title="Configure Benchmarks"
        >
          <Target className="w-5 h-5" />
        </button>
        <Select
          value={selectedSchool}
          onChange={(e) => onSchoolChange(e.target.value)}
          options={schoolOptions}
        />
      </div>
    </div>
  );
};