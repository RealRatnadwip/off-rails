import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { KpiCard } from './KpiCard';
import { ActivityFeed } from './ActivityFeed';
import { TrainConflictWidget } from './TrainConflictWidget';
import { BlockDetailModal } from '../modals/BlockDetailModal';
import { RailwayBlock } from '../../types';
import {
  Layers,
  Clock,
  Wrench,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Play,
  ThumbsUp,
  ChevronRight,
  Zap,
  Radio,
  Train,
  Sparkles,
  FileText,
  Printer,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const { kpis, blocks, tasks, trains, activityLog, activeDivision } = useRailway();
  const [selectedBlock, setSelectedBlock] = useState<RailwayBlock | null>(null);

  const activeAndPlannedBlocks = blocks.filter(
    (b) => b.status === 'ACTIVE' || b.status === 'PLANNED' || b.status === 'APPROVED'
  );

  return (
    <div className="space-y-4">
      {/* Official Government Control Room Header Banner */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-l-[#0B3B60]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#0B3B60] uppercase">
              EASTERN DIVISION • SEALDAH CORRIDOR CONTROL ROOM
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 font-mono font-bold">
              CENTRAL SHIFT DESK
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans mt-0.5">
            Division Operations Control Room (COA-BLOCK)
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Realtime Multi-Department Maintenance Possession Coordination, Traction Isolation (TPC) & Train Path Protection
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onNavigateTab('planning')}
            className="px-3 py-2 rounded bg-[#0B3B60] hover:bg-[#082942] text-white text-xs font-bold font-mono flex items-center space-x-1.5 shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>OPEN JOINT OPTIMISER</span>
          </button>
          <button
            onClick={() => onNavigateTab('network')}
            className="px-3 py-2 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
          >
            <Train className="w-3.5 h-3.5 text-[#0B3B60]" />
            <span>Schematic Diagram</span>
          </button>
        </div>
      </div>

      {/* 6 Realtime KPIs in Light Mode */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-2.5 sm:gap-3">
        <KpiCard
          title="Active Blocks"
          value={kpis.activeBlocks}
          subValue="Corridors"
          trend="+1 in progress"
          isPositive={true}
          statusColor="emerald"
          icon={<Layers className="w-4 h-4" />}
          subtitle="Live Possessions"
        />

        <KpiCard
          title="Pending Requests"
          value={kpis.pendingRequests}
          subValue="Tasks"
          trend="3 dept backlog"
          isPositive={false}
          statusColor="blue"
          icon={<Clock className="w-4 h-4" />}
          subtitle="Awaiting Block Slot"
        />

        <KpiCard
          title="Maintenance Tasks"
          value={kpis.maintenanceTasks}
          subValue="Scheduled"
          trend="Today's Pipeline"
          isPositive={true}
          statusColor="purple"
          icon={<Wrench className="w-4 h-4" />}
          subtitle="Across 4 Departments"
        />

        <KpiCard
          title="Asset Availability"
          value={`${kpis.assetAvailability}%`}
          trend="Target: 95.0%"
          isPositive={kpis.assetAvailability >= 94}
          statusColor="emerald"
          icon={<CheckCircle2 className="w-4 h-4" />}
          subtitle="30 Track & Signal Assets"
        />

        <KpiCard
          title="Block Utilisation"
          value={`${kpis.blockUtilisation}%`}
          trend="Joint Synergy"
          isPositive={true}
          statusColor="amber"
          icon={<TrendingUp className="w-4 h-4" />}
          subtitle="Window Efficiency"
        />

        <KpiCard
          title="Train Conflicts"
          value={kpis.trainConflicts}
          subValue="Regulated"
          trend={kpis.trainConflicts === 0 ? 'Zero Delays' : 'Regulated Loops'}
          isPositive={kpis.trainConflicts === 0}
          statusColor={kpis.trainConflicts > 0 ? 'red' : 'emerald'}
          icon={<AlertTriangle className="w-4 h-4" />}
          subtitle="0 Cancellations"
        />
      </div>

      {/* Main Grid: Active Possessions Table on Left, Live Telemetry & Conflicts on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Active & Coordinated Possessions Register */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#0B3B60]" />
                <h2 className="text-xs font-mono font-bold uppercase text-slate-800 tracking-wider">
                  Corridor Possession Register (COA Block Log)
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab('blocks')}
                className="text-xs text-[#0B3B60] hover:underline flex items-center space-x-1 font-bold font-mono"
              >
                <span>View Full Register ({blocks.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Table in Light Mode */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-600 uppercase">
                    <th className="py-2.5 px-3">Block #</th>
                    <th className="py-2.5 px-3">Corridor & Line</th>
                    <th className="py-2.5 px-3">Window (IST)</th>
                    <th className="py-2.5 px-3">Depts Involved</th>
                    <th className="py-2.5 px-3">Possession Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {activeAndPlannedBlocks.map((blk) => (
                    <tr
                      key={blk.id}
                      onClick={() => setSelectedBlock(blk)}
                      className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                        blk.id === 'blk-1042' ? 'bg-amber-50/60' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <div className="flex items-center space-x-1.5">
                          <span>{blk.blockNumber}</span>
                          {blk.isJointBlock && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-purple-100 text-purple-800 border border-purple-300 uppercase font-mono font-bold">
                              Joint
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-800">{blk.corridor}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{blk.line}</div>
                      </td>

                      <td className="py-3 px-3 font-mono whitespace-nowrap">
                        <div className="text-slate-800 font-bold">
                          {blk.plannedStartTime} – {blk.plannedEndTime}
                        </div>
                        <div className="text-[10px] text-slate-500">120 min possession</div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {blk.departments.map((dept) => (
                            <span
                              key={dept}
                              className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${
                                dept === 'ENGINEERING'
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : dept === 'ELECTRICAL'
                                  ? 'bg-yellow-50 text-yellow-900 border-yellow-300'
                                  : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                              }`}
                            >
                              {dept === 'ENGINEERING' ? 'P-WAY' : dept === 'ELECTRICAL' ? 'TRD' : 'S&T'}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase ${
                            blk.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-400 font-black'
                              : blk.status === 'APPROVED'
                              ? 'bg-blue-100 text-[#0B3B60] border-blue-400'
                              : 'bg-amber-100 text-amber-900 border-amber-400'
                          }`}
                        >
                          {blk.status}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBlock(blk);
                          }}
                          className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-300 transition-colors"
                        >
                          Inspect Log
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Block #1042 Official Callout */}
            <div className="p-3 bg-amber-50 border-t border-amber-200 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="px-1.5 py-0.5 rounded bg-[#0B3B60] text-white font-mono font-bold text-[10px]">
                  #1042
                </span>
                <span className="text-slate-800 font-medium">
                  Coordinated Joint Block: Engineering (P-Way), Electrical (TRD) & S&T saves <strong>2h 15m</strong> of corridor closure.
                </span>
              </div>
              <button
                onClick={() => {
                  const b = blocks.find((x) => x.id === 'blk-1042');
                  if (b) setSelectedBlock(b);
                }}
                className="text-[#0B3B60] hover:underline font-bold text-xs shrink-0 font-mono"
              >
                Inspect Block #1042 →
              </button>
            </div>
          </div>

          {/* Department Telemetry Readiness Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white border border-slate-300 rounded p-3 space-y-1 shadow-sm border-t-2 border-t-[#800000]">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-[#800000] flex items-center space-x-1">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Engineering (P-Way)</span>
                </span>
                <span className="font-mono text-emerald-700 text-[10px] font-bold bg-emerald-50 px-1 rounded border border-emerald-200">
                  READY
                </span>
              </div>
              <div className="text-[11px] text-slate-700">Gang 04 on-site at KM 43.2 with Rail Grinder RG-12.</div>
              <div className="text-[10px] font-mono text-slate-500">VHF: CH-04 (156.800 MHz)</div>
            </div>

            <div className="bg-white border border-slate-300 rounded p-3 space-y-1 shadow-sm border-t-2 border-t-amber-600">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-amber-700 flex items-center space-x-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Electrical (TRD/OHE)</span>
                </span>
                <span className="font-mono text-emerald-700 text-[10px] font-bold bg-emerald-50 px-1 rounded border border-emerald-200">
                  READY
                </span>
              </div>
              <div className="text-[11px] text-slate-700">25kV Power block sanction ready. Tower Wagon OHE-07 poised.</div>
              <div className="text-[10px] font-mono text-slate-500">VHF: CH-06 (157.250 MHz)</div>
            </div>

            <div className="bg-white border border-slate-300 rounded p-3 space-y-1 shadow-sm border-t-2 border-t-emerald-700">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-emerald-700 flex items-center space-x-1">
                  <Radio className="w-3.5 h-3.5" />
                  <span>Signal & Telecom</span>
                </span>
                <span className="font-mono text-emerald-700 text-[10px] font-bold bg-emerald-50 px-1 rounded border border-emerald-200">
                  READY
                </span>
              </div>
              <div className="text-[11px] text-slate-700">Point Machine PM-434 & Axle counter test team ready.</div>
              <div className="text-[10px] font-mono text-slate-500">VHF: CH-08 (158.100 MHz)</div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Train Conflicts & Live Telemetry Feed */}
        <div className="space-y-4">
          <TrainConflictWidget trains={trains} blocks={blocks} />
          <ActivityFeed events={activityLog} maxItems={8} />
        </div>
      </div>

      {/* Block Detail Modal */}
      {selectedBlock && (
        <BlockDetailModal block={selectedBlock} onClose={() => setSelectedBlock(null)} />
      )}
    </div>
  );
};
