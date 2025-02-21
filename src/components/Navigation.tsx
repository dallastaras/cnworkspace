import React from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { 
  Home, 
  Briefcase, 
  BarChart2, 
  Inbox, 
  Clock, 
  Target, 
  GraduationCap, 
  Package, 
  Bot, 
  Settings, 
  Users, 
  Rocket,
  Truck
} from 'lucide-react';

const Navigation = () => {
  const darkMode = useStore((state) => state.darkMode);
  
  const navItems = [
    { to: '/', icon: Home, label: 'Workspace' },
    { to: '/my-work', icon: Briefcase, label: 'My Work' },
    { to: '/insights', icon: BarChart2, label: 'Insights' },
    { 
      to: '/inbox', 
      icon: Inbox, 
      label: 'Inbox',
      badge: 3,
      badgeColor: 'bg-indigo-200 text-indigo-700' 
    },
    { 
      to: '/productivity', 
      icon: Clock, 
      label: 'Productivity',
      badge: 5,
      badgeColor: 'bg-amber-200 text-amber-700'
    },
    { to: '/goals', icon: Target, label: 'Goals' },
    { to: '/learning', icon: GraduationCap, label: 'Learning' },
    { to: '/products', icon: Package, label: 'Products' },
    { to: '/distribution', icon: Truck, label: 'Distribution' },
    { to: '/onboarding', icon: Rocket, label: 'Onboarding' },
    { to: '/community', icon: Users, label: 'Community' },
    { to: '/chat', icon: Bot, label: 'AI Assistant' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`w-64 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
      <nav className="mt-8">
        <div className="px-2 space-y-1">
          {navItems.map(({ to, icon: Icon, label, badge, badgeColor }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? darkMode
                      ? 'bg-gray-900 text-indigo-400'
                      : 'bg-indigo-100 text-indigo-700'
                    : darkMode
                      ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <div className="flex items-center flex-1">
                <Icon className={`mr-3 h-5 w-5 ${
                  darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-400 group-hover:text-gray-500'
                }`} />
                {label}
              </div>
              {badge && (
                <span className={`${badgeColor} text-xs font-medium px-2 py-0.5 rounded-full`}>
                  {badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;