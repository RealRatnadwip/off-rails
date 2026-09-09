import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { UserRole } from '../../types';
import {
  Train,
  Radio,
  Sliders,
  Maximize2,
  Minimize2,
  Bell,
  ChevronDown,
  Shield,
  Zap,
  Wrench,
  Activity,
  HardHat,
  RotateCcw,
  CheckCircle2,
  Printer,
  HelpCircle,
} from 'lucide-react';

interface TopBarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentTab, setCurrentTab }) => {
  const {
    userRole,
    setUserRole,
    activeDivision,
    setActiveDivision,
    currentTimeStr,
    isPresentationMode,
    setIsPresentationMode,
    isDemoControlsOpen,
    setIsDemoControlsOpen,
    activityLog,
  } = useRailway();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isDivisionDropdownOpen, setIsDivisionDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const roles: { role: UserRole; label: string; icon: React.ReactNode; dept: string }[] = [
    { role: 'OPERATIONS_CONTROLLER', label: 'Section Controller (SC)', icon: <Train className="w-4 h-4 text-[#0B3B60]" />, dept: 'Divisional Control Office' },
    { role: 'ENGINEERING', label: 'SSE / Permanent Way (P-Way)', icon: <Wrench className="w-4 h-4 text-[#800000]" />, dept: 'Track Maintenance Division' },
    { role: 'ELECTRICAL', label: 'SSE / Traction Distribution (OHE)', icon: <Zap className="w-4 h-4 text-amber-700" />, dept: '25kV Traction Branch' },
    { role: 'S_AND_T', label: 'SSE / Signal & Interlocking', icon: <Activity className="w-4 h-4 text-emerald-800" />, dept: 'Signalling & Telecom Dept' },
    { role: 'FIELD_ENGINEER', label: 'Site Field Engineer / Gang Incharge', icon: <HardHat className="w-4 h-4 text-orange-700" />, dept: 'On-Corridor Track Gang' },
  ];

  const divisions = [
    'Eastern Railway / Sealdah Division (SDAH - NH - KNJ)',
    'Eastern Railway / Howrah Division (HWH - BWN Main)',
    'South Eastern Railway / Kharagpur Division',
    'Northern Railway / Delhi Division',
  ];

  const currentRoleObj = roles.find((r) => r.role === userRole) || roles[0];
  const unreadAlerts = activityLog.filter((a) => a.severity === 'WARNING' || a.severity === 'CRITICAL').length;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-300 shadow-sm text-slate-800 select-none">
      {/* 1. Official National Operations Top Ribbon */}
      <div className="bg-[#072136] text-slate-200 text-[11px] px-3 lg:px-6 py-1 flex items-center justify-between border-b border-[#051726]">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-100 tracking-wide">CENTRAL CORRIDOR RAILWAY NETWORK</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300 font-medium hidden sm:inline">DIVISION OPERATIONS CONTROL COMMAND</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4 text-[10px] sm:text-[11px] font-mono">
          <div className="flex items-center space-x-1">
            <span className="text-slate-400">CLOCK:</span>
            <span className="font-bold text-white tracking-wider">IST {currentTimeStr}</span>
          </div>
          <span className="hidden md:inline text-slate-500">|</span>
          <div className="hidden md:flex items-center space-x-1.5 text-slate-300">
            <span>PORTAL: OFF-RAILS COA-v2.6</span>
          </div>
          <span className="hidden sm:inline text-slate-500">|</span>
          <div className="flex items-center space-x-1 text-slate-300">
            <span className="font-semibold text-white">English</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400 hover:text-white cursor-pointer">हिन्दी</span>
          </div>
        </div>
      </div>

      {/* 2. Main Rail Operations Nav Bar */}
      <div className="bg-[#0B3B60] text-white px-3 lg:px-6 py-2 flex items-center justify-between gap-3 shadow-md">
        {/* Left: Railway Wheel Emblem & Portal Title */}
        <div className="flex items-center space-x-3">
          {/* Authentic Railway Wheel Emblem SVG */}
          <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-sm shrink-0 flex items-center justify-center border-2 border-amber-500">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="46" fill="#800000" stroke="#C27803" strokeWidth="3" />
              <circle cx="50" cy="50" r="38" fill="#0B3B60" stroke="#FFFFFF" strokeWidth="1" />
              {/* Wheel spokes */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="50"
                  y1="50"
                  x2={50 + 34 * Math.cos((deg * Math.PI) / 180)}
                  y2={50 + 34 * Math.sin((deg * Math.PI) / 180)}
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                />
              ))}
              {/* Center hub */}
              <circle cx="50" cy="50" r="10" fill="#C27803" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="50" cy="4" fill="#800000" />
            </svg>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold tracking-wider uppercase text-amber-300 font-sans">
                DIVISION OPERATIONS CONTROL • PERMANENT WAY & TRACTION
              </span>
              <span className="hidden lg:inline-block bg-[#072136] text-slate-200 px-1.5 py-0.2 rounded text-[10px] font-mono border border-slate-600">
                OFFICIAL DESK
              </span>
            </div>
            <div className="flex items-baseline space-x-2">
              <h1 className="text-base sm:text-lg font-black tracking-tight font-sans text-white">
                OFF-RAILS
              </h1>
              <span className="text-xs sm:text-sm text-slate-200 font-medium">
                Automated Corridor Possession & Multi-Dept Block Coordination
              </span>
            </div>
          </div>
        </div>

        {/* Center/Right: Live Sync Status, Demo Control, Role Selector */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Live Sync Badge */}
          <div className="hidden sm:flex items-center space-x-1.5 bg-[#072136] px-2.5 py-1 rounded border border-slate-600/80 text-[11px] font-mono text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold">CRIS-SYNC LIVE</span>
          </div>

          {/* Division Selector */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsDivisionDropdownOpen(!isDivisionDropdownOpen)}
              className="flex items-center space-x-1 text-xs bg-[#072136] hover:bg-[#051829] text-white px-2.5 py-1.5 rounded border border-slate-600 transition-colors"
            >
              <span className="text-slate-300 font-mono text-[10px] uppercase">Div:</span>
              <span className="font-semibold truncate max-w-[150px] lg:max-w-[200px] text-amber-300">
                {activeDivision.split('(')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {isDivisionDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-80 bg-white text-slate-800 border border-slate-300 rounded shadow-xl py-1 z-50 text-xs">
                <div className="px-3 py-1.5 text-[10px] text-slate-500 uppercase font-mono font-bold border-b border-slate-200 bg-slate-50">
                  Select Operational Railway Division
                </div>
                {divisions.map((div) => (
                  <button
                    key={div}
                    onClick={() => {
                      setActiveDivision(div);
                      setIsDivisionDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center justify-between ${
                      activeDivision === div ? 'text-[#0B3B60] font-bold bg-blue-50' : 'text-slate-700'
                    }`}
                  >
                    <span>{div}</span>
                    {activeDivision === div && <CheckCircle2 className="w-4 h-4 text-[#0B3B60]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Demo Control Trigger (Styled like an official Operations Deck button) */}
          <button
            onClick={() => setIsDemoControlsOpen(true)}
            className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1.5 rounded text-xs shadow-sm transition-colors border border-amber-600"
            title="Open Demo Control Deck for SIH 2026 Presentation"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono uppercase">DEMO CONTROLS</span>
          </button>

          {/* Large Screen Presentation Mode Toggle */}
          <button
            onClick={() => setIsPresentationMode(!isPresentationMode)}
            className="hidden lg:flex items-center space-x-1 bg-[#072136] hover:bg-[#051829] text-white px-2 py-1.5 rounded border border-slate-600 text-xs font-mono"
            title="Toggle Control Room Wall Display"
          >
            {isPresentationMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{isPresentationMode ? 'Exit Wall' : 'Wall Display'}</span>
          </button>

          {/* Notification Alert Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-1.5 rounded bg-[#072136] hover:bg-[#051829] text-white border border-slate-600 relative"
              title="Operational Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadAlerts}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white text-slate-800 border border-slate-300 rounded shadow-2xl z-50 overflow-hidden text-xs">
                <div className="px-3 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                  <div className="font-bold text-slate-800 font-mono text-xs uppercase">
                    Central Operations Activity Log
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Realtime Stream</span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-200">
                  {activityLog.slice(0, 6).map((evt) => (
                    <div key={evt.id} className="p-2.5 hover:bg-slate-50">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                          evt.severity === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-300' :
                          evt.severity === 'WARNING' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          evt.severity === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          'bg-blue-100 text-blue-800 border border-blue-300'
                        }`}>
                          {evt.department}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">{evt.timestamp}</span>
                      </div>
                      <p className="font-bold text-slate-800 text-xs">{evt.title}</p>
                      <p className="text-[11px] text-slate-600 mt-0.5">{evt.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Official Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center space-x-1.5 bg-white text-[#0B3B60] font-bold px-2.5 py-1.5 rounded shadow-sm hover:bg-slate-50 border border-slate-200 text-xs"
            >
              {currentRoleObj.icon}
              <div className="text-left hidden sm:block">
                <div className="text-[9px] text-slate-500 font-mono uppercase">User Role</div>
                <div className="text-xs font-bold leading-tight truncate max-w-[130px]">
                  {currentRoleObj.label.split('(')[0]}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-72 bg-white text-slate-800 border border-slate-300 rounded shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] text-slate-500 uppercase font-mono font-bold border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span>Switch Operational Desk</span>
                  <span className="text-[#0B3B60]">DEMO MODE</span>
                </div>
                {roles.map((r) => (
                  <button
                    key={r.role}
                    onClick={() => {
                      setUserRole(r.role);
                      setIsRoleDropdownOpen(false);
                      if (r.role === 'FIELD_ENGINEER') {
                        setCurrentTab('field');
                      }
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-slate-100 flex items-center space-x-2 text-xs ${
                      userRole === r.role ? 'bg-blue-50 text-[#0B3B60] font-bold' : 'text-slate-700'
                    }`}
                  >
                    {r.icon}
                    <div className="flex-1">
                      <div className="font-bold">{r.label}</div>
                      <div className="text-[10px] text-slate-500">{r.dept}</div>
                    </div>
                    {userRole === r.role && <CheckCircle2 className="w-4 h-4 text-[#0B3B60]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Divisional Operations Caution Notice Strip */}
      <div className="bg-amber-50 border-t border-b border-amber-300 px-3 lg:px-6 py-1 flex items-center justify-between text-[11px] text-amber-950 overflow-hidden font-mono select-none">
        <div className="flex items-center space-x-2 shrink-0">
          <span className="px-1.5 py-0.5 rounded bg-amber-600 text-white font-bold text-[9px] uppercase tracking-wider animate-pulse">
            CAUTION ORDER
          </span>
          <span className="font-bold text-amber-900 hidden sm:inline">MEMO #CO-842:</span>
        </div>
        <div className="truncate mx-2 text-[10.5px] text-amber-900 flex-1">
          <span>UP MAIN LINE KM 38/2 – 44/6 JOINT POSSESSION SANCTIONED (01:15–04:30 HRS). SPEED RESTRICTION 30 KMPH ENFORCED ON ADJACENT LOOP. TPC 25kV POWER ISOLATION CONFIRMED.</span>
        </div>
        <div className="hidden md:flex items-center space-x-2.5 text-[10px] text-slate-600 shrink-0 font-sans">
          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-[9px] text-slate-700">
            Shift: Night 22:00–06:00
          </span>
          <span className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-[9px] text-slate-700">
            IRPWM Para 802
          </span>
        </div>
      </div>
    </header>
  );
};
