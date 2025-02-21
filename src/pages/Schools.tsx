import React from 'react';
import { useStore } from '../store/useStore';
import { School, TrendingUp, Award, Star } from 'lucide-react';

const Schools = () => {
  const { user } = useStore();

  // Example schools data - will be replaced with real data from Supabase
  const schools = [
    {
      id: '1',
      name: 'Washington Elementary',
      rank: 1,
      score: 95,
      metrics: {
        mealsServed: 450,
        costPerMeal: 2.35,
        wastePercentage: 8,
      },
    },
    {
      id: '2',
      name: 'Lincoln Middle School',
      rank: 2,
      score: 92,
      metrics: {
        mealsServed: 780,
        costPerMeal: 2.45,
        wastePercentage: 10,
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">School Performance</h1>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50">
            Filter
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50">
            Export
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {schools.map((school) => (
          <div key={school.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <School className="w-6 h-6 text-indigo-600" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{school.name}</h3>
                  <div className="flex items-center mt-1">
                    <Award className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-500">Rank #{school.rank}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-lg font-semibold">{school.score}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Meals Served</div>
                <div className="mt-1 flex items-center">
                  <span className="text-2xl font-semibold text-gray-900">
                    {school.metrics.mealsServed}
                  </span>
                  <TrendingUp className="w-4 h-4 text-green-500 ml-2" />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Cost per Meal</div>
                <div className="mt-1 flex items-center">
                  <span className="text-2xl font-semibold text-gray-900">
                    ${school.metrics.costPerMeal}
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500">Waste %</div>
                <div className="mt-1 flex items-center">
                  <span className="text-2xl font-semibold text-gray-900">
                    {school.metrics.wastePercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schools;