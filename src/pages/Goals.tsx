import React from 'react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';
import { Target, CheckCircle2, Circle } from 'lucide-react';

const Goals = () => {
  const { user } = useStore();

  // Example goals data - will be replaced with real data from Supabase
  const goals = [
    {
      id: '1',
      name: 'Reduce Food Waste',
      target: 10,
      current: 8,
      start_date: '2025-01-01',
      end_date: '2025-12-31',
    },
    {
      id: '2',
      name: 'Increase Meal Participation',
      target: 85,
      current: 75,
      start_date: '2025-01-01',
      end_date: '2025-12-31',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">
          {user?.role === 'director' ? 'District Goals' : 'School Goals'}
        </h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Add New Goal
        </button>
      </div>

      <div className="grid gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Target className="w-6 h-6 text-indigo-600" />
                <h3 className="text-lg font-medium text-gray-900">{goal.name}</h3>
              </div>
              <div className="text-sm text-gray-500">
                {format(new Date(goal.start_date), 'MMM d, yyyy')} -{' '}
                {format(new Date(goal.end_date), 'MMM d, yyyy')}
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-700">
                  {goal.current}% of {goal.target}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${(goal.current / goal.target) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-4">
              {goal.current >= goal.target ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Goal Achieved!</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-600">
                  <Circle className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">In Progress</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Goals;