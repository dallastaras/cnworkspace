import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Grid } from 'lucide-react';
import { Logo } from './Logo';
import Navigation from './Navigation';
import ModuleLauncher from './ModuleLauncher';
import UserMenu from './UserMenu';
import ChatPanel from './ChatPanel';

export default function Layout() {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const darkMode = useStore((state) => state.darkMode);
  const navigate = useNavigate();
  const [isModuleLauncherOpen, setIsModuleLauncherOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <nav className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b fixed top-0 left-0 right-0 z-10`}>
        <div className="px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center flex-shrink-0">
              <Logo className={`h-12 -mt-0.5 ${darkMode ? 'text-white' : 'text-gray-900'}`} />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsModuleLauncherOpen(true)}
                className={`p-2 rounded-md ${
                  darkMode 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
                } focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500`}
              >
                <Grid className="h-6 w-6" />
              </button>
              <UserMenu user={user} setUser={setUser} navigate={navigate} />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-4rem)] pt-16">
        <Navigation />
        <main className={`flex-1 overflow-auto p-8 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
          <Outlet />
        </main>
      </div>

      <ModuleLauncher 
        isOpen={isModuleLauncherOpen} 
        onClose={() => setIsModuleLauncherOpen(false)} 
      />

      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}