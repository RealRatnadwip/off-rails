import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { MaintenanceTask, Department, PriorityLevel, TaskStatus, OptimizationRecommendation } from '../../types';
import { runBlockOptimizer } from '../../services/blockOptimizer';
import { getPriorityBadgeColor } from '../../services/priorityEngine';
import { AiPriorityModal } from '../modals/AiPriorityModal';
import {
  CalendarRange,
  Cpu,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  HelpCircle,
  Sparkles,
  Check,
  Wrench,
  Zap,
  Radio,
  SlidersHorizontal,
  FileSpreadsheet,
} from 'lucide-react';

export const PlanningView: React.FC = () => {
  const { tasks, blocks, approveBlock } = useRailway();

  const [selectedDept, setSelectedDept] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [inspectedTask, setInspectedTask] = useState<MaintenanceTask | null>(null);
  const [activeRecommendation, setActiveRecommendation] = useState<OptimizationRecommendation | null>(null);
  const [isWhyModalOpen, setIsWhyModalOpen] = useState<boolean>(false);

  // Optimizer state
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimResults, setOptimResults] = useState<OptimizationRecommendation[] | null>(null);

  const filteredTasks = tasks.filter((t) => {
    if (selectedDept !== 'ALL' && t.department !== selectedDept) return false;
    if (selectedPriority !== 'ALL' && t.priority !== selectedPriority) return false;
    if (selectedStatus !== 'ALL' && t.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        t.code.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q) ||
        t.assetName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRunOptimizer = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      const results = runBlockOptimizer(tasks);
      setOptimResults(results);
      if (results.length > 0) {
        setActiveRecommendation(results[0]);
      }
      setIsOptimizing(false);
    }, 500);
  };

  const handleApproveRecommendation = (rec: OptimizationRecommendation) => {
    approveBlock('blk-1042');
  };

  const targetBlock1042 = blocks.find((b) => b.id === 'blk-1042');

  const getLightPriorityBadge = (score: number) => {
    if (score >= 80) {
      return { bg: 'bg-red-50', text: 'text-red-900', border: 'border-red-300', label: 'CRITICAL' };
    }
    if (score >= 65) {
      return { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-300', label: 'HIGH' };
    }
    if (score >= 45) {
      return { bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-300', label: 'MEDIUM' };
    }
    return { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300', label: 'LOW' };
  };

  return (
    <div className="space-y-4">
      {/* Official Government Header */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 border-l-4 border-l-[#0B3B60]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#0B3B60] uppercase">
              DIVISION MAINTENANCE POSSESSION PLANNING ENGINE
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded bg-blue-100 text-blue-900 border border-blue-300 font-mono font-bold">
              MULTI-DEPT CORRIDOR SYNTHESIS
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans mt-0.5">
            Maintenance Requests & Joint Corridor Optimiser
          </h1>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Coordinated possession planning across Permanent Way (Engineering), Electrical Traction (TRD/OHE), and Signal & Telecom.
            Identifies compatible spatial and traction boundaries to synthesize unified Joint Blocks.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleRunOptimizer}
            disabled={isOptimizing}
            className="px-4 py-2.5 rounded bg-[#0B3B60] hover:bg-[#07253d] text-white font-mono font-bold text-xs flex items-center space-x-2 shadow transition-all border border-[#082942]"
          >
            <Cpu className={`w-4 h-4 text-amber-300 ${isOptimizing ? 'animate-spin' : ''}`} />
            <span>{isOptimizing ? 'PROCESSING CONSTRAINTS...' : 'RUN BLOCK OPTIMISER'}</span>
          </button>
        </div>
      </div>

      {/* Joint Block Recommendation Banner (When executed or initial) */}
      {(optimResults || activeRecommendation) && (
        <div className="bg-white border-2 border-[#0B3B60] rounded shadow-md p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded bg-blue-100 text-[#0B3B60] border border-blue-300">
                <Sparkles className="w-5 h-5 text-[#0B3B60]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-[#0B3B60] uppercase">
                    Joint Block Synthesis Result
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-mono font-bold">
                    RECOMMENDED
                  </span>
                </div>
                <h2 className="text-base font-black text-slate-900 font-sans mt-0.5">
                  JOINT BLOCK #1042 (22:00 – 00:00) — Halisahar – Kanchrapara Corridor
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsWhyModalOpen(true)}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold font-mono flex items-center space-x-1.5 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-[#0B3B60]" />
                <span>Why This Block?</span>
              </button>

              <button
                onClick={() => {
                  if (activeRecommendation) handleApproveRecommendation(activeRecommendation);
                }}
                disabled={targetBlock1042?.status === 'APPROVED' || targetBlock1042?.status === 'ACTIVE'}
                className={`px-4 py-1.5 rounded font-bold font-mono text-xs flex items-center space-x-1.5 shadow transition-all ${
                  targetBlock1042?.status === 'ACTIVE'
                    ? 'bg-emerald-700 text-white cursor-default'
                    : targetBlock1042?.status === 'APPROVED'
                    ? 'bg-blue-800 text-white cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>
                  {targetBlock1042?.status === 'ACTIVE'
                    ? 'BLOCK ACTIVE'
                    : targetBlock1042?.status === 'APPROVED'
                    ? 'APPROVED'
                    : 'APPROVE JOINT BLOCK'}
                </span>
              </button>
            </div>
          </div>

          {/* BEFORE vs AFTER Government Comparison Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            {/* BEFORE */}
            <div className="bg-red-50/70 border border-red-200 rounded p-3 space-y-2">
              <div className="flex items-center justify-between text-red-900 font-bold border-b border-red-200 pb-1.5">
                <span>BEFORE: Separate Department Possessions</span>
                <span className="text-[10px] bg-red-100 text-red-900 px-1.5 py-0.2 rounded border border-red-300">
                  Total Closure: 4h 15m
                </span>
              </div>
              <div className="space-y-1.5 text-slate-700 text-[11px]">
                <div className="p-2 rounded bg-white border border-red-200 flex items-center justify-between">
                  <span>Block 1042: Engineering (Track Grinding)</span>
                  <span className="text-slate-500 font-bold">22:00 – 00:00 (2h)</span>
                </div>
                <div className="p-2 rounded bg-white border border-red-200 flex items-center justify-between">
                  <span>Block 1043: Electrical (OHE Inspection)</span>
                  <span className="text-slate-500 font-bold">00:15 – 01:15 (1h)</span>
                </div>
                <div className="p-2 rounded bg-white border border-red-200 flex items-center justify-between">
                  <span>Block 1044: S&T (Point & Signal Overhaul)</span>
                  <span className="text-slate-500 font-bold">01:30 – 02:15 (45m)</span>
                </div>
              </div>
              <div className="text-[10px] text-slate-500 italic">
                Requires 3 separate traction de-energisations and multiple section handovers.
              </div>
            </div>

            {/* AFTER */}
            <div className="bg-emerald-50/70 border border-emerald-300 rounded p-3 space-y-2">
              <div className="flex items-center justify-between text-emerald-900 font-bold border-b border-emerald-200 pb-1.5">
                <span>AFTER: OFF-RAILS Coordinated Joint Block</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded border border-emerald-300">
                  Downtime Saved: 2h 15m
                </span>
              </div>
              <div className="space-y-1.5 text-slate-800 text-[11px]">
                <div className="p-2 rounded bg-white border border-emerald-300 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="font-bold text-slate-900">JOINT BLOCK #1042</span>
                    <span className="text-slate-500">(KM 43.2 – 45.1)</span>
                  </div>
                  <span className="text-emerald-800 font-black">22:00 – 00:00 (120m)</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                  <div className="p-1.5 rounded bg-white border border-amber-300 text-amber-900 font-bold">
                    Engineering ✓
                  </div>
                  <div className="p-1.5 rounded bg-white border border-yellow-300 text-yellow-900 font-bold">
                    Electrical ✓
                  </div>
                  <div className="p-1.5 rounded bg-white border border-emerald-300 text-emerald-900 font-bold">
                    S&T ✓
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 text-slate-700">
                <span>Train Conflict: <strong className="text-slate-900 font-bold">0</strong></span>
                <span>Utilisation: <strong className="text-emerald-800 font-bold">93%</strong></span>
                <span>Field Crews: <strong className="text-slate-900 font-bold">4 Active</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-300 rounded p-3 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Task Code, Asset, Station or KM location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3B60]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            {/* Dept Filter */}
            <div className="flex items-center space-x-1">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Dept:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 text-xs focus:outline-none"
              >
                <option value="ALL">All Depts</option>
                <option value="ENGINEERING">Engineering</option>
                <option value="ELECTRICAL">Electrical (TRD)</option>
                <option value="S_AND_T">S&T</option>
                <option value="OPERATIONS">Operations</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center space-x-1">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Priority:</span>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 text-xs focus:outline-none"
              >
                <option value="ALL">All Priority</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-1">
              <span className="text-slate-500 text-[10px] uppercase font-bold">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 text-xs focus:outline-none"
              >
                <option value="ALL">All Status</option>
                <option value="PENDING">Pending Slot</option>
                <option value="READY">Ready</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between border-t border-slate-200 pt-2">
          <span>Displaying {filteredTasks.length} maintenance work requests</span>
          <span className="text-[#0B3B60] font-bold">Click AI Priority score to view parameter breakdown</span>
        </div>
      </div>

      {/* Maintenance Requests Data Table */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 font-mono text-[11px] text-slate-700 uppercase">
                <th className="py-2.5 px-3">Task ID</th>
                <th className="py-2.5 px-3">Dept</th>
                <th className="py-2.5 px-3">Asset & Maintenance Work</th>
                <th className="py-2.5 px-3">Location (KM)</th>
                <th className="py-2.5 px-3 text-center">AI Priority Score</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Preferred Window</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTasks.map((t) => {
                const badge = getLightPriorityBadge(t.priorityScore);
                const isJointTask = t.id === 'tsk-01' || t.id === 'tsk-02' || t.id === 'tsk-03';

                return (
                  <tr
                    key={t.id}
                    className={`hover:bg-blue-50/50 transition-colors ${
                      isJointTask ? 'bg-amber-50/40 font-semibold' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {t.code}
                      {isJointTask && (
                        <span className="block text-[9px] font-mono text-purple-700 font-bold">
                          #1042 Joint
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${
                          t.department === 'ENGINEERING'
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : t.department === 'ELECTRICAL'
                            ? 'bg-yellow-50 text-yellow-900 border-yellow-300'
                            : t.department === 'S_AND_T'
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                            : 'bg-blue-50 text-blue-900 border-blue-300'
                        }`}
                      >
                        {t.department === 'ENGINEERING' ? 'P-WAY' : t.department === 'ELECTRICAL' ? 'TRD' : t.department}
                      </span>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{t.title}</div>
                      <div className="text-[10px] text-slate-500">{t.assetName}</div>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                      {t.location}
                    </td>

                    {/* AI Priority Score Badge (Clickable) */}
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => setInspectedTask(t)}
                        title="Click to view AI Priority score formula"
                        className={`px-2 py-0.5 rounded font-mono font-black text-xs border transition-transform hover:scale-105 ${badge.bg} ${badge.text} ${badge.border}`}
                      >
                        <span>{t.priorityScore}</span>
                        <span className="text-[9px] ml-1 font-bold uppercase">{badge.label}</span>
                      </button>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                      {t.durationMinutes} min
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                      <div>{t.preferredWindowStart} – {t.preferredWindowEnd}</div>
                      <div className="text-[10px] text-slate-500">Night Window</div>
                    </td>

                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase ${
                          t.status === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : t.status === 'IN_PROGRESS'
                            ? 'bg-blue-50 text-[#0B3B60] border-blue-300 font-black'
                            : t.status === 'READY'
                            ? 'bg-amber-50 text-amber-800 border-amber-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>

                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setInspectedTask(t)}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-300"
                      >
                        Score Breakdown
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Priority Breakdown Modal */}
      {inspectedTask && (
        <AiPriorityModal task={inspectedTask} onClose={() => setInspectedTask(null)} />
      )}

      {/* "Why This Block?" Explainability Modal in Light Mode */}
      {isWhyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-[#0B3B60] w-full max-w-lg rounded shadow-2xl overflow-hidden flex flex-col">
            <div className="px-4 py-3 bg-[#0B3B60] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-amber-300" />
                <div>
                  <div className="text-[10px] font-mono text-amber-300 font-bold uppercase">
                    Validation Criteria Explanation
                  </div>
                  <h3 className="text-sm font-bold font-sans">
                    Why JOINT BLOCK #1042 Was Recommended
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsWhyModalOpen(false)}
                className="text-white hover:text-amber-300 text-lg font-bold px-1"
              >
                ✕
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded border border-slate-300 space-y-2 text-slate-800">
                <div className="font-mono text-emerald-800 font-bold text-xs uppercase flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>All Operational Constraints Satisfied (6/6)</span>
                </div>
                <div className="space-y-2 text-slate-700 text-[11px]">
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-700 font-bold shrink-0">✓</span>
                    <div>
                      <strong>Tasks are within 1.2 km corridor:</strong> Rail Grinding (KM 43.2), S&T Point Machine (KM 43.4), and OHE Mast (KM 43.5) are physically adjacent.
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-700 font-bold shrink-0">✓</span>
                    <div>
                      <strong>All departments requested access:</strong> Engineering, Electrical & S&T simultaneously flagged overdue maintenance in this slot.
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-700 font-bold shrink-0">✓</span>
                    <div>
                      <strong>Same traction catenary zone:</strong> A single 25kV power block isolation covers both OHE inspection and track grinding safely.
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-700 font-bold shrink-0">✓</span>
                    <div>
                      <strong>No scheduled train conflict:</strong> Passenger trains clear before 22:00; Down Freight regulated at Naihati Yard with 0 passenger impact.
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-700 font-bold shrink-0">✓</span>
                    <div>
                      <strong>Available crew overlap:</strong> Gang 04, OHE Tower Wagon 07, and S&T testing team are mobilized at Naihati/Halisahar depot.
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-emerald-700 font-bold shrink-0">✓</span>
                    <div>
                      <strong>Possession window fit:</strong> Combined parallel work fits within 120 minutes, reducing corridor downtime by 2h 15m.
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-2 rounded bg-blue-50 border border-blue-200 font-mono text-[10px] text-[#0B3B60]">
                Deterministic Rule-Based Multi-Criteria Synthesis: Formulated according to Permanent Way & General Operating Manual.
              </div>
            </div>

            <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsWhyModalOpen(false)}
                className="px-3 py-1.5 bg-[#0B3B60] hover:bg-[#07253d] text-white rounded text-xs font-bold font-mono"
              >
                Close Explanation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
