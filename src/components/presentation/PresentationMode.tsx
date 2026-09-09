import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { KpiCard } from '../dashboard/KpiCard';
import { ActivityFeed } from '../dashboard/ActivityFeed';
import { TrainConflictWidget } from '../dashboard/TrainConflictWidget';
import { BlockDetailModal } from '../modals/BlockDetailModal';
import { RailwayBlock } from '../../types';
import {
  Minimize2,
  Layers,
  Clock,
  Wrench,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Sliders,
} from 'lucide-react';

export const PresentationMode: React.FC = () => {
  const {
    setIsPresentationMode,
    setIsDemoControlsOpen,
    kpis,
    blocks,
    trains,
    activityLog,
    currentTimeStr,
    activeDivision,
  } = useRailway();

  const [selectedBlock, setSelectedBlock] = useState<RailwayBlock | null>(null);

  const jointBlock1042 = blocks.find((b) => b.id === 'blk-1042') || blocks[0];

  return (
    <div className="fixed inset-0 z-50 bg-[#F1F5F9] text-slate-900 overflow-y-auto p-4 sm:p-6 select-none animate-in fade-in duration-200">
      {/* High-Impact Wall Display Header */}
      <div className="bg-[#0B3B60] text-white rounded-lg p-4 flex items-center justify-between shadow-md mb-5 border-b-4 border-b-amber-500">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-white p-1 shadow shrink-0 flex items-center justify-center border-2 border-amber-400">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="46" fill="#800000" stroke="#C27803" strokeWidth="3" />
              <circle cx="50" cy="50" r="38" fill="#0B3B60" stroke="#FFFFFF" strokeWidth="1" />
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
              <circle cx="50" cy="50" r="10" fill="#C27803" stroke="#FFFFFF" strokeWidth="1.5" />
              <circle cx="50" cy="50" r="4" fill="#800000" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black font-sans tracking-tight text-white">OFF-RAILS</h1>
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-[#072136] text-emerald-400 border border-slate-600 flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>CENTRAL WALL DISPLAY (COA)</span>
              </span>
            </div>
            <p className="text-xs text-slate-200 font-mono mt-0.5">
              {activeDivision} • DIVISION OPERATIONS CONTROL COMMAND
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right font-mono hidden sm:block">
            <div className="text-[10px] text-slate-300">STANDARD OPERATIONAL TIME (IST)</div>
            <div className="text-xl font-bold text-white tracking-widest">{currentTimeStr}</div>
          </div>

          <button
            onClick={() => setIsDemoControlsOpen(true)}
            className="px-3 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold flex items-center space-x-1.5 shadow"
          >
            <Sliders className="w-4 h-4" />
            <span>Demo Controls</span>
          </button>

          <button
            onClick={() => setIsPresentationMode(false)}
            className="px-3 py-2 rounded bg-[#072136] hover:bg-[#051829] text-white border border-slate-600 text-xs font-mono font-medium flex items-center space-x-1.5"
            title="Exit Presentation Mode"
          >
            <Minimize2 className="w-4 h-4" />
            <span>Exit Wall Mode</span>
          </button>
        </div>
      </div>

      {/* Enlarged KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3.5 mb-5">
        <KpiCard
          title="Active Blocks"
          value={kpis.activeBlocks}
          subValue="Corridors"
          statusColor="emerald"
          icon={<Layers className="w-5 h-5" />}
          subtitle="Live Possessions"
        />

        <KpiCard
          title="Pending Requests"
          value={kpis.pendingRequests}
          subValue="Tasks"
          statusColor="blue"
          icon={<Clock className="w-5 h-5" />}
          subtitle="Awaiting Block Windows"
        />

        <KpiCard
          title="Maintenance Tasks"
          value={kpis.maintenanceTasks}
          subValue="Scheduled"
          statusColor="purple"
          icon={<Wrench className="w-5 h-5" />}
          subtitle="Pipeline Volume"
        />

        <KpiCard
          title="Asset Availability"
          value={`${kpis.assetAvailability}%`}
          statusColor="emerald"
          icon={<CheckCircle2 className="w-5 h-5" />}
          subtitle="30 Monitored Assets"
        />

        <KpiCard
          title="Block Utilisation"
          value={`${kpis.blockUtilisation}%`}
          statusColor="amber"
          icon={<TrendingUp className="w-5 h-5" />}
          subtitle="Window Synergy"
        />

        <KpiCard
          title="Train Conflicts"
          value={kpis.trainConflicts}
          subValue="Regulated"
          statusColor={kpis.trainConflicts > 0 ? 'red' : 'emerald'}
          icon={<AlertTriangle className="w-5 h-5" />}
          subtitle="0 Cancellations"
        />
      </div>

      {/* Main Presentation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Joint Block #1042 Large Hero Box & Active Blocks Table */}
        <div className="lg:col-span-2 space-y-5">
          {/* Joint Block #1042 Giant Live Showcase in Light Mode */}
          <div className="bg-white border-2 border-[#0B3B60] rounded p-5 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-3">
                <span className="text-2xl font-black font-mono text-slate-900">
                  {jointBlock1042.blockNumber}
                </span>
                <span
                  className={`px-3 py-1 rounded text-xs font-mono font-black border uppercase tracking-wider ${
                    jointBlock1042.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black'
                      : jointBlock1042.status === 'APPROVED'
                      ? 'bg-blue-100 text-[#0B3B60] border-blue-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {jointBlock1042.status}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-100 text-purple-900 border border-purple-300 uppercase">
                  JOINT MULTI-DEPARTMENT POSSESSION
                </span>
              </div>

              <div className="font-mono text-right">
                <div className="text-xs text-slate-500 font-bold uppercase">WINDOW</div>
                <div className="text-base font-black text-slate-900">
                  {jointBlock1042.plannedStartTime} – {jointBlock1042.plannedEndTime}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {jointBlock1042.tasks.map((tsk) => (
                <div
                  key={tsk.taskId}
                  className="bg-slate-50 border border-slate-200 rounded p-3.5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#800000] uppercase">
                      {tsk.department}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                        tsk.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : tsk.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-[#0B3B60] border-blue-300 font-black'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {tsk.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-900">{tsk.title}</div>
                  <div className="text-[10px] font-mono text-slate-500">Crew: {tsk.crewName}</div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-slate-200">
              <span className="text-slate-700">
                Corridor: <strong className="text-slate-900">{jointBlock1042.corridor} ({jointBlock1042.line})</strong>
              </span>
              <span className="text-emerald-800 font-black text-sm bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                Corridor Downtime Saved: 2 Hours 15 Minutes
              </span>
            </div>
          </div>

          {/* Active Corridors Table */}
          <div className="bg-white border border-slate-300 rounded overflow-hidden shadow-sm">
            <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#0B3B60]" />
                <h3 className="text-xs font-mono font-bold uppercase text-slate-800">
                  Live Division Corridor Possession Status
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 font-bold">{blocks.length} Total Registered</span>
            </div>

            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-600">
                  <th className="py-2.5 px-3">Block #</th>
                  <th className="py-2.5 px-3">Corridor</th>
                  <th className="py-2.5 px-3">Window</th>
                  <th className="py-2.5 px-3">Departments</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {blocks.slice(0, 5).map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{b.blockNumber}</td>
                    <td className="py-2.5 px-3 text-slate-700">{b.corridor}</td>
                    <td className="py-2.5 px-3 text-slate-600">{b.plannedStartTime} – {b.plannedEndTime}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-bold">{b.departments.join(', ')}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        b.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-900 border-emerald-400' : 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Live Telemetry Feed & Train Conflict */}
        <div className="space-y-5">
          <TrainConflictWidget trains={trains} blocks={blocks} />
          <ActivityFeed events={activityLog} maxItems={12} />
        </div>
      </div>

      {selectedBlock && (
        <BlockDetailModal block={selectedBlock} onClose={() => setSelectedBlock(null)} />
      )}
    </div>
  );
};
