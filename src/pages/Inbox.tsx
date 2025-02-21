import React from 'react';
import { Mail, Star, Archive, Trash2 } from 'lucide-react';

const Inbox = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Inbox</h1>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-500">
            <Archive className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-500">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="divide-y divide-gray-200">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="flex-shrink-0 mr-4">
                <Mail className="w-5 h-5 text-gray-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    Menu Update Notification
                  </p>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-gray-300 hover:text-yellow-400" />
                    <span className="ml-2 flex-shrink-0 text-xs text-gray-500">
                      1h ago
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  New menu items have been added to next week's rotation
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Inbox;