import React, { useState, useEffect } from 'react';
import { RailwayProvider, useRailway } from './context/RailwayContext';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { PlanningView } from './components/planning/PlanningView';
import { BlocksView } from './components/blocks/BlocksView';
import { TasksView } from './components/tasks/TasksView';
import { NetworkView } from './components/network/NetworkView';
import { ApprovalsView } from './components/approvals/ApprovalsView';
import { FieldView } from './components/field/FieldView';
import { AssetsView } from './components/assets/AssetsView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { DemoControlsModal } from './components/modals/DemoControlsModal';
import { PresentationMode } from './components/presentation/PresentationMode';

const MainApp: React.FC = () => {
  const { userRole, setUserRole, isPresentationMode } = useRailway();

  // Determine initial tab from path or window width
  const getInitialTab = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (['dashboard', 'planning', 'blocks', 'tasks', 'network', 'approvals', 'field', 'assets', 'analytics', 'settings'].includes(path)) {
        return path;
      }
      // On small mobile viewports, default to dedicated Field view
      if (window.innerWidth < 768) {
        return 'field';
      }
    }
    return 'dashboard';
  };

  const [currentTab, setCurrentTab] = useState<string>(getInitialTab);

  // Sync tab with URL
  const handleSetTab = (tab: string) => {
    setCurrentTab(tab);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', `/${tab}`);
    }
  };

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/^\//, '').toLowerCase();
      if (path && ['dashboard', 'planning', 'blocks', 'tasks', 'network', 'approvals', 'field', 'assets', 'analytics', 'settings'].includes(path)) {
        setCurrentTab(path);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Detect mobile viewport resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && userRole === 'OPERATIONS_CONTROLLER' && currentTab === 'dashboard') {
        // Keep smooth, don't force disrupt if user is navigating
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [userRole, currentTab]);

  // Keyboard navigation shortcuts for high-efficiency operations: Alt+1 to Alt+0
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        const keyMap: Record<string, string> = {
          '1': 'dashboard',
          '2': 'planning',
          '3': 'blocks',
          '4': 'tasks',
          '5': 'network',
          '6': 'approvals',
          '7': 'field',
          '8': 'assets',
          '9': 'analytics',
          '0': 'settings',
        };
        if (keyMap[e.key]) {
          e.preventDefault();
          handleSetTab(keyMap[e.key]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-slate-800 flex flex-col font-sans">
      {/* Fullscreen Presentation Mode Wall Display */}
      {isPresentationMode && <PresentationMode />}

      {/* Control Room Top Header */}
      <TopBar currentTab={currentTab} setCurrentTab={handleSetTab} />

      {/* Main Layout: Sidebar + Viewport */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden md:flex">
          <Sidebar currentTab={currentTab} setCurrentTab={handleSetTab} />
        </div>

        {/* Viewport Content Area */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-6 pb-20 md:pb-6">
          {currentTab === 'dashboard' && <DashboardView onNavigateTab={handleSetTab} />}
          {currentTab === 'planning' && <PlanningView />}
          {currentTab === 'blocks' && <BlocksView />}
          {currentTab === 'tasks' && <TasksView />}
          {currentTab === 'network' && <NetworkView />}
          {currentTab === 'approvals' && <ApprovalsView />}
          {currentTab === 'field' && <FieldView />}
          {currentTab === 'assets' && <AssetsView />}
          {currentTab === 'analytics' && <AnalyticsView />}
          {currentTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav currentTab={currentTab} setCurrentTab={handleSetTab} />

      {/* Demo Controls Floating Dialog */}
      <DemoControlsModal onNavigateTab={handleSetTab} />
    </div>
  );
};

export function App() {
  return (
    <RailwayProvider>
      <MainApp />
    </RailwayProvider>
  );
}

export default App;
