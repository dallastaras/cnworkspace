import React from 'react';
import { CheckSquare, Calendar, Users, Filter } from 'lucide-react';

const Tasks = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 text-sm text-gray-600 bg-white rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Add Task
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Review inventory levels
                      </p>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">Due today</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Check stock levels and prepare order list
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <CheckSquare className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Total Tasks</span>
                </div>
                <span className="text-sm font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Due Today</span>
                </div>
                <span className="text-sm font-medium">4</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">Assigned to me</span>
                </div>
                <span className="text-sm font-medium">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;