import React from 'react';
import { useStore } from '../../store/useStore';
import { History, Clock, Calendar, CalendarDays, CalendarRange } from 'lucide-react';

const timeframes = [
  { value: 'prior-day', label: 'Prior Day', icon: History },
  { value: 'day', label: 'Today', icon: Clock },
  { value: 'week', label: 'This Week', icon: Calendar },
  { value: 'month', label: 'This Month', icon: CalendarDays },
  { value: 'year', label: 'Year to Date', icon: CalendarRange },
];

export const TimeframeSelector = () => {
  const { selectedTimeframe, setSelectedTimeframe } = useStore();
  const darkMode = useStore((state) => state.darkMode);

  return (
    <div className="flex space-x-2">
      {timeframes.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => setSelectedTimeframe(value as any)}
          className={`p-2 rounded-lg flex items-center ${
            selectedTimeframe === value
              ? 'bg-indigo-600 text-white'
              : darkMode 
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          title={label}
        >
          <Icon className="w-5 h-5" />
        </button>
      ))}
    </div>
  );
};