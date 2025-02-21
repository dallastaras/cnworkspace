import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { modules } from '../data/learningModules';
import { GraduationCap, ChevronRight, Play, Award, Clock } from 'lucide-react';

const Learning = () => {
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);
  const [activeTab, setActiveTab] = useState<'product' | 'industry' | 'compliance'>('product');

  const earnedBadges = modules
    .filter(module => module.progress?.completed)
    .map(module => module.badge)
    .filter(badge => badge) as NonNullable<typeof modules[0]['badge']>[];

  const handleModuleClick = (moduleId: string) => {
    navigate(`/learning/${moduleId}`);
  };

  const renderBadges = () => (
    <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6 mb-6`}>
      <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Your Achievements
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {earnedBadges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={index}
              className={`flex flex-col items-center p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className={`p-3 rounded-full ${
                darkMode ? 'bg-gray-600' : 'bg-white'
              } mb-3`}>
                <Icon className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className={`text-sm font-medium text-center ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                {badge.name}
              </h3>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderModules = () => (
    <div className="grid gap-6">
      {modules.map((module) => (
        <div
          key={module.id}
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm overflow-hidden cursor-pointer`}
          onClick={() => handleModuleClick(module.id)}
        >
          <div className="flex flex-col md:flex-row">
            <div className="relative md:w-64 md:flex-shrink-0">
              <img
                src={module.videoUrl}
                alt={module.title}
                className="w-full h-48 md:h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Play className="w-12 h-12 text-white" />
              </div>
              {module.progress?.lastPosition && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                  <div
                    className="h-full bg-indigo-600"
                    style={{ width: `${(module.progress.lastPosition / 600) * 100}%` }}
                  />
                </div>
              )}
            </div>
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className={`text-xl font-medium mb-2 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    {module.title}
                  </h2>
                  <p className={`text-sm mb-4 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {module.description}
                  </p>
                </div>
                {module.badge && (
                  <div className={`flex items-center p-2 rounded-lg ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <module.badge.icon className={`w-5 h-5 ${
                      module.progress?.completed
                        ? 'text-indigo-600'
                        : darkMode ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center">
                  <Clock className={`w-4 h-4 mr-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {module.duration}
                  </span>
                </div>
                {module.progress?.completed && (
                  <div className="flex items-center">
                    <Award className="w-4 h-4 mr-1 text-green-500" />
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Completed
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleModuleClick(module.id);
                }}
                className="flex items-center text-indigo-600 hover:text-indigo-500"
              >
                <span className="text-sm font-medium">
                  {module.progress?.lastPosition ? 'Continue Learning' : 'Start Learning'}
                </span>
                <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <GraduationCap className={`w-8 h-8 ${
            darkMode ? 'text-indigo-400' : 'text-indigo-600'
          }`} />
          <h1 className={`text-2xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Learning Center
          </h1>
        </div>
      </div>

      {earnedBadges.length > 0 && renderBadges()}

      <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'product', label: 'Learn the Product' },
            { id: 'industry', label: 'Learn the Industry' },
            { id: 'compliance', label: 'Learn Regulation' }
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === id
                  ? `${darkMode 
                      ? 'border-indigo-400 text-indigo-400' 
                      : 'border-indigo-600 text-indigo-600'}`
                  : `${darkMode
                      ? 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                }
              `}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'product' && renderModules()}
      {activeTab === 'industry' && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Industry Learning
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Coming soon! Industry-specific learning content is being developed.
          </p>
        </div>
      )}
      {activeTab === 'compliance' && (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Compliance Learning
          </h2>
          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Coming soon! Regulatory compliance learning content is being developed.
          </p>
        </div>
      )}
    </div>
  );
};

export default Learning;