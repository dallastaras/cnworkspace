import React from 'react';
import { useStore } from '../store/useStore';
import { Settings as SettingsIcon, Bell, Shield, Database } from 'lucide-react';

const Settings = () => {
  const { user } = useStore();

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <SettingsIcon className="w-6 h-6 text-indigo-600 mr-3" />
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      <div className="grid gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-medium text-gray-900">KPI Configuration</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Default Benchmark Values
              </label>
              <p className="text-sm text-gray-500 mb-4">
                Set default benchmark values for KPIs across all schools
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500">Meals Served Daily</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    defaultValue={500}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Cost per Meal ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    defaultValue={2.50}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  KPI Alert Notifications
                </label>
                <p className="text-sm text-gray-500">
                  Receive alerts when KPIs fall below benchmark
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>

        {user?.role === 'director' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-medium text-gray-900">Access Control</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  School Manager Access
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Configure what data school managers can access
                </p>
                <div className="space-y-2">
                  {['View District-wide KPIs', 'Export Reports', 'Modify Goals'].map(
                    (permission) => (
                      <div key={permission} className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700">{permission}</label>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;