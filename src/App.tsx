import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { getCurrentUser } from './lib/auth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Workspace from './pages/Workspace';
import MyWork from './pages/MyWork';
import Dashboard from './pages/Dashboard';
import Inbox from './pages/Inbox';
import Tasks from './pages/Tasks';
import Goals from './pages/Goals';
import Learning from './pages/Learning';
import Products from './pages/Products';
import Distribution from './pages/Distribution';
import OrderDetails from './pages/Distribution/OrderDetails';
import Workflow from './pages/Distribution/Workflow';
import Onboarding from './pages/Onboarding';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Preferences from './pages/Preferences';
import Productivity from './pages/Productivity';
import Community from './pages/Community';
import LearningModule from './pages/LearningModule';
import LearningResource from './pages/LearningResource';

// Import module pages
import Accountability from './pages/modules/Accountability';
import POS from './pages/modules/POS';
import Eligibility from './pages/modules/Eligibility';
import AccountManagement from './pages/modules/AccountManagement';
import ItemManagement from './pages/modules/ItemManagement';
import MenuPlanning from './pages/modules/MenuPlanning';
import Production from './pages/modules/Production';
import Inventory from './pages/modules/Inventory';
import Operations from './pages/modules/Operations';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useStore((state) => state.user);
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Workspace />} />
          <Route path="my-work" element={<MyWork />} />
          <Route path="insights" element={<Dashboard />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="goals" element={<Goals />} />
          <Route path="learning" element={<Learning />} />
          <Route path="learning/:moduleId" element={<LearningModule />} />
          <Route path="learning/resources/:id" element={<LearningResource />} />
          <Route path="products" element={<Products />} />
          <Route path="distribution" element={<Distribution />} />
          <Route path="distribution/daily/:date" element={<OrderDetails />} />
          <Route path="distribution/workflow" element={<Workflow />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="chat" element={<Chat />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />
          <Route path="preferences" element={<Preferences />} />
          <Route path="productivity" element={<Productivity />} />
          <Route path="community" element={<Community />} />

          {/* Module routes */}
          <Route path="modules/accountability" element={<Accountability />} />
          <Route path="modules/pos" element={<POS />} />
          <Route path="modules/eligibility" element={<Eligibility />} />
          <Route path="modules/account-management" element={<AccountManagement />} />
          <Route path="modules/item-management" element={<ItemManagement />} />
          <Route path="modules/menu-planning" element={<MenuPlanning />} />
          <Route path="modules/production" element={<Production />} />
          <Route path="modules/inventory" element={<Inventory />} />
          <Route path="modules/operations" element={<Operations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;