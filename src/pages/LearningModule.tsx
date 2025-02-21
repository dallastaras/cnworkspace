import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  Play,
  FileText,
  CheckCircle,
  Lock,
  Award,
  ArrowLeft,
  ChevronRight,
  AlertCircle,
  BookOpen,
  Video,
  BarChart,
  Download,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  Share2,
  Bookmark,
  Clock
} from 'lucide-react';

interface ModuleContent {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  instructor: {
    name: string;
    title: string;
    avatar: string;
  };
  objectives: string[];
  prerequisites?: string[];
  sections: {
    title: string;
    content: string[];
    timestamp?: string;
  }[];
  resources: {
    title: string;
    description: string;
    type: 'pdf' | 'doc' | 'video' | 'link';
    url: string;
    size?: string;
  }[];
  quiz: {
    questions: {
      id: string;
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
    passingScore: number;
  };
  progress?: {
    completed: boolean;
    lastPosition?: number;
    quizAttempts?: number;
    quizPassed?: boolean;
  };
}

const LearningModule = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const darkMode = useStore((state) => state.darkMode);
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'resources' | 'discussion'>('overview');
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [noteContent, setNoteContent] = useState('');

  // Mock module data - in production this would come from your API
  const module: ModuleContent = {
    id: 'module-1',
    title: 'Understanding Menu Planning Fundamentals',
    description: 'Learn the essential principles of effective menu planning for school nutrition programs.',
    videoUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1280&h=720&fit=crop',
    duration: '45 minutes',
    instructor: {
      name: 'Sarah Johnson',
      title: 'Senior Nutrition Specialist',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
    },
    objectives: [
      'Understand USDA meal pattern requirements',
      'Learn menu planning strategies for different age groups',
      'Master cost-effective ingredient selection',
      'Implement nutritional analysis techniques'
    ],
    prerequisites: [
      'Basic nutrition knowledge',
      'Understanding of USDA guidelines'
    ],
    sections: [
      {
        title: 'Introduction to Menu Planning',
        content: [
          'Overview of menu planning importance',
          'Key components of successful menu planning'
        ],
        timestamp: '0:00'
      },
      {
        title: 'USDA Requirements',
        content: [
          'Detailed breakdown of meal patterns',
          'Age/grade group specifications'
        ],
        timestamp: '10:15'
      }
    ],
    resources: [
      {
        title: 'Menu Planning Worksheet',
        description: 'Template for creating compliant menus',
        type: 'pdf',
        url: '#',
        size: '2.4 MB'
      },
      {
        title: 'Nutritional Guidelines Quick Reference',
        description: 'Quick reference for nutritional requirements',
        type: 'pdf',
        url: '#',
        size: '1.8 MB'
      }
    ],
    quiz: {
      questions: [
        {
          id: 'q1',
          question: 'What is the minimum grain requirement for grades 9-12?',
          options: [
            '1 oz equivalent',
            '2 oz equivalent',
            '2.5 oz equivalent',
            '3 oz equivalent'
          ],
          correctAnswer: 2
        }
      ],
      passingScore: 80
    },
    progress: {
      completed: false,
      lastPosition: 325,
      quizAttempts: 0
    }
  };

  const renderVideoSection = () => (
    <div className="space-y-6">
      <div className="relative pt-[56.25%] bg-gray-900 rounded-lg overflow-hidden">
        {!videoPlaying ? (
          <>
            <img
              src={module.videoUrl}
              alt="Video thumbnail"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <button 
                onClick={() => setVideoPlaying(true)}
                className="p-4 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
              >
                <Play className="w-12 h-12 text-white" />
              </button>
            </div>
            {module.progress?.lastPosition && (
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-gray-900 bg-opacity-90 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 text-white mr-2" />
                    <span className="text-white text-sm">
                      Resume from {Math.floor(module.progress.lastPosition / 60)}:
                      {(module.progress.lastPosition % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Continue
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <span className="text-gray-500">Video player would be here</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className={`col-span-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Video Chapters
          </h2>
          <div className="space-y-4">
            {module.sections.map((section, index) => (
              <button
                key={index}
                className={`w-full flex items-center p-3 rounded-lg ${
                  darkMode 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-50'
                } transition-colors`}
              >
                <div className={`w-8 h-8 rounded-full ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                } flex items-center justify-center mr-3`}>
                  <span className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 text-left">
                  <h3 className={`text-sm font-medium ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {section.title}
                  </h3>
                  <p className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {section.timestamp}
                  </p>
                </div>
                <ChevronRight className={`w-5 h-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </button>
            ))}
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-medium ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Notes
            </h2>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-indigo-600 hover:text-indigo-500 text-sm"
            >
              {showNotes ? 'Hide' : 'Show'}
            </button>
          </div>
          
          {showNotes && (
            <div className="space-y-4">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Take notes while watching..."
                className={`w-full h-32 p-3 rounded-lg resize-none ${
                  darkMode
                    ? 'bg-gray-700 text-gray-200 placeholder-gray-400'
                    : 'bg-gray-50 text-gray-900 placeholder-gray-500'
                } focus:ring-2 focus:ring-indigo-500 border-none`}
              />
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Save Notes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderOverviewSection = () => (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            About This Module
          </h2>
          <p className={`text-sm mb-6 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {module.description}
          </p>
          
          <h3 className={`text-sm font-medium mb-2 ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Learning Objectives
          </h3>
          <ul className="list-disc list-inside space-y-2 mb-6">
            {module.objectives.map((objective, index) => (
              <li
                key={index}
                className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {objective}
              </li>
            ))}
          </ul>

          {module.prerequisites && (
            <>
              <h3 className={`text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Prerequisites
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {module.prerequisites.map((prerequisite, index) => (
                  <li
                    key={index}
                    className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                  >
                    {prerequisite}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Module Content
          </h2>
          <div className="space-y-4">
            {module.sections.map((section, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <h3 className={`text-sm font-medium mb-2 ${
                  darkMode ? 'text-gray-200' : 'text-gray-900'
                }`}>
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.content.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                    >
                      • {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={module.instructor.avatar}
              alt={module.instructor.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className={`text-sm font-medium ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {module.instructor.name}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {module.instructor.title}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className={`flex items-center space-x-2 text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{module.duration}</span>
            </div>
            <div className={`flex items-center space-x-2 text-sm ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <Award className="w-4 h-4" />
              <span>Certificate upon completion</span>
            </div>
          </div>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6`}>
          <h2 className={`text-lg font-medium mb-4 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Resources
          </h2>
          <div className="space-y-4">
            {module.resources.map((resource, index) => (
              <a
                key={index}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-start p-3 rounded-lg ${
                  darkMode 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-50'
                } transition-colors`}
              >
                <div className={`p-2 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                } mr-3`}>
                  {resource.type === 'pdf' ? (
                    <FileText className="w-5 h-5 text-indigo-600" />
                  ) : resource.type === 'video' ? (
                    <Video className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <ExternalLink className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-medium ${
                    darkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {resource.title}
                  </h3>
                  <p className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {resource.description}
                  </p>
                  {resource.size && (
                    <span className={`text-xs ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {resource.size}
                    </span>
                  )}
                </div>
                <Download className={`w-5 h-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/learning')}
          className={`flex items-center space-x-2 ${
            darkMode ? 'text-gray-300 hover:text-gray-100' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Learning</span>
        </button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Clock className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {module.duration}
            </span>
          </div>
          {module.progress?.completed ? (
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Completed
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Lock className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                In Progress
              </span>
            </div>
          )}
        </div>
      </div>

      {renderVideoSection()}

      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-sm mt-6`}>
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'content', label: 'Course Content', icon: FileText },
              { id: 'resources', label: 'Resources', icon: Download },
              { id: 'discussion', label: 'Discussion', icon: MessageSquare }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm
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
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && renderOverviewSection()}
          {/* Add other tab content sections as needed */}
        </div>
      </div>
    </div>
  );
};

export default LearningModule;