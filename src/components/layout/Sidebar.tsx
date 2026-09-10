import React from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  LayoutDashboard,
  CalendarRange,
  Layers,
  CheckSquare,
  Network,
  ShieldCheck,
  HardHat,
  Database,
  BarChart3,
  Settings,
  Zap,
  Wrench,
  Activity,
  Sliders,
  FileSpreadsheet,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { kpis, setIsDemoControlsOpen } = useRailway();

  const navItems = [
    { id: 'dashboard', label: 'Control Dashboard', icon: <LayoutDashboard className="w-4 h-4" />, badge: null, hotkey: '1' },
    { id: 'planning', label: 'Joint Block Planning', icon: <CalendarRange className="w-4 h-4" />, badge: kpis.pendingRequests > 0 ? kpis.pendingRequests : null, badgeColor: 'bg-[#0B3B60] text-white', hotkey: '2' },
    { id: 'blocks', label: 'Possession Register', icon: <Layers className="w-4 h-4" />, badge: kpis.activeBlocks > 0 ? kpis.activeBlocks : null, badgeColor: 'bg-emerald-700 text-white', hotkey: '3' },
    { id: 'tasks', label: 'Maintenance Pipeline', icon: <CheckSquare className="w-4 h-4" />, badge: null, hotkey: '4' },
    { id: 'network', label: 'Schematic Network', icon: <Network className="w-4 h-4" />, badge: kpis.trainConflicts > 0 ? `${kpis.trainConflicts} Reg` : null, badgeColor: 'bg-amber-600 text-white', hotkey: '5' },
    { id: 'approvals', label: 'Sanction & Approvals', icon: <ShieldCheck className="w-4 h-4" />, badge: null, hotkey: '6' },
    { id: 'field', label: 'Field Mobile Desk', icon: <HardHat className="w-4 h-4" />, badge: 'LIVE', badgeColor: 'bg-orange-600 text-white', hotkey: '7' },
    { id: 'assets', label: 'Permanent Way Assets', icon: <Database className="w-4 h-4" />, badge: null, hotkey: '8' },
    { id: 'analytics', label: 'Operations Analytics', icon: <BarChart3 className="w-4 h-4" />, badge: null, hotkey: '9' },
    { id: 'settings', label: 'System Configuration', icon: <Settings className="w-4 h-4" />, badge: null, hotkey: '0' },
    { id: 'demo', label: 'Landing Tour (/demo)', icon: <Sparkles className="w-4 h-4 text-amber-500" />, badge: 'TOUR', badgeColor: 'bg-amber-500 text-slate-950 font-bold', hotkey: 'D' },
  ];

  return (
    <aside className="w-60 bg-white border-r border-slate-300 flex flex-col justify-between select-none shrink-0 shadow-sm">
      {/* Navigation Module Links */}
      <div className="py-3 px-2 space-y-0.5">
        <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center justify-between">
          <span>Modules (COA-BLOCK)</span>
          <span className="text-[9px] text-slate-400">ALT+KEY</span>
        </div>
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full group flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-semibold transition-all border ${
                isActive
                  ? 'bg-[#0B3B60] text-white border-[#0B3B60] shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100 border-transparent hover:border-slate-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className={isActive ? 'text-amber-300' : 'text-slate-500'}>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center space-x-1 shrink-0">
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold ${
                      item.badgeColor || 'bg-slate-200 text-slate-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                <span
                  className={`text-[9px] font-mono px-1 py-0.2 rounded border ${
                    isActive
                      ? 'bg-[#072136] text-amber-300 border-slate-700'
                      : 'bg-slate-50 text-slate-400 border-slate-200 group-hover:border-slate-300 group-hover:text-slate-600'
                  }`}
                  title={`Press Alt+${item.hotkey} to switch`}
                >
                  {item.hotkey}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Department Coordination Indicator Box */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
        <div className="text-[10px] font-mono text-slate-600 flex items-center justify-between font-bold">
          <span>DEPT SYNERGY MATRIX</span>
          <span className="text-emerald-700 bg-emerald-100 px-1 py-0.2 rounded border border-emerald-300">
            ONLINE
          </span>
        </div>

        <div className="grid grid-cols-3 gap-1 text-[9px] font-mono text-center">
          <div className="bg-white py-1 px-0.5 rounded border border-slate-200 text-slate-800 font-bold flex flex-col items-center">
            <Wrench className="w-3 h-3 mb-0.5 text-[#800000]" />
            <span>P-WAY</span>
          </div>
          <div className="bg-white py-1 px-0.5 rounded border border-slate-200 text-slate-800 font-bold flex flex-col items-center">
            <Zap className="w-3 h-3 mb-0.5 text-amber-600" />
            <span>TRD/OHE</span>
          </div>
          <div className="bg-white py-1 px-0.5 rounded border border-slate-200 text-slate-800 font-bold flex flex-col items-center">
            <Activity className="w-3 h-3 mb-0.5 text-emerald-700" />
            <span>S&T</span>
          </div>
        </div>

        <button
          onClick={() => setIsDemoControlsOpen(true)}
          className="w-full mt-2 py-1.5 px-2 rounded bg-amber-50 hover:bg-amber-100 border border-amber-300 text-[11px] text-amber-900 font-bold flex items-center justify-center space-x-1.5 transition-colors shadow-sm"
        >
          <Sliders className="w-3.5 h-3.5 text-amber-700" />
          <span>Demo Control Deck</span>
        </button>
      </div>
    </aside>
  );
};
