import React from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  HardHat,
  CheckSquare,
  Layers,
  AlertTriangle,
  MoreHorizontal,
  LayoutDashboard,
  CalendarRange,
} from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { kpis, userRole } = useRailway();

  const isFieldRole = userRole === 'FIELD_ENGINEER';

  const navItems = isFieldRole
    ? [
        { id: 'field', label: 'Field Desk', icon: <HardHat className="w-5 h-5" />, badge: null },
        { id: 'tasks', label: 'Work Orders', icon: <CheckSquare className="w-5 h-5" />, badge: null },
        { id: 'blocks', label: 'Possessions', icon: <Layers className="w-5 h-5" />, badge: kpis.activeBlocks },
        { id: 'approvals', label: 'Safety Log', icon: <AlertTriangle className="w-5 h-5" />, badge: null },
        { id: 'settings', label: 'Settings', icon: <MoreHorizontal className="w-5 h-5" />, badge: null },
      ]
    : [
        { id: 'dashboard', label: 'Control Room', icon: <LayoutDashboard className="w-5 h-5" />, badge: null },
        { id: 'planning', label: 'Joint Plan', icon: <CalendarRange className="w-5 h-5" />, badge: kpis.pendingRequests },
        { id: 'blocks', label: 'Blocks', icon: <Layers className="w-5 h-5" />, badge: kpis.activeBlocks },
        { id: 'field', label: 'Field Desk', icon: <HardHat className="w-5 h-5" />, badge: null },
        { id: 'more', label: 'Network/More', icon: <MoreHorizontal className="w-5 h-5" />, badge: null },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-2 border-[#0B3B60] text-slate-700 px-2 py-1 shadow-2xl safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentTab === item.id || (item.id === 'more' && ['network', 'assets', 'analytics', 'settings'].includes(currentTab));
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'more') {
                  setCurrentTab('network');
                } else {
                  setCurrentTab(item.id);
                }
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg relative transition-all ${
                isActive ? 'text-[#0B3B60] font-black' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className="relative">
                {item.icon}
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#800000] text-white text-[9px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
