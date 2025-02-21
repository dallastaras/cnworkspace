import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, AlertTriangle, TrendingDown, ArrowRight } from 'lucide-react';

const Inventory = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <Box className="w-8 h-8 text-indigo-600" />
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
        </div>
        <button
          onClick={() => navigate('/tasks')}
          className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Take me to Inventory
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-lg shadow-sm mb-8">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 mt-1">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <span className="text-indigo-600 font-medium">AI</span>
            </div>
          </div>
          <div>
            <p className="text-gray-700 mb-4">
              Based on your inventory data, here are important updates:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-amber-700">
                <AlertTriangle className="w-5 h-5 mr-2" />
                8 items below minimum stock level
              </li>
              <li className="flex items-center text-green-700">
                <TrendingDown className="w-5 h-5 mr-2" />
                Waste reduced by 15% this month
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Quick Actions</h2>
          <ul className="space-y-2">
            <li>Count inventory</li>
            <li>Create purchase orders</li>
            <li>Receive deliveries</li>
            <li>Generate reports</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Inventory Status</h2>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>$45,000 total inventory value</li>
            <li>250 unique items tracked</li>
            <li>98% inventory accuracy</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Inventory;