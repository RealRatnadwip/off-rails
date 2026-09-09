import React from 'react';
import { RailwayBlock } from '../../types';
import { useRailway } from '../../context/RailwayContext';
import {
  X,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ShieldCheck,
  Check,
  Play,
  CheckSquare,
  Ban,
  ThumbsUp,
  Layers,
} from 'lucide-react';

interface BlockDetailModalProps {
  block: RailwayBlock | null;
  onClose: () => void;
}

export const BlockDetailModal: React.FC<BlockDetailModalProps> = ({ block, onClose }) => {
  const {
    approveBlock,
    activateBlock,
    cancelBlock,
    toggleSafetyChecklist,
    startTask,
    completeTask,
  } = useRailway();

  if (!block) return null;

  const completedChecks = block.safetyChecklist.filter((c) => c.isCompleted).length;
  const totalChecks = block.safetyChecklist.length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black';
      case 'APPROVED':
        return 'bg-blue-100 text-[#0B3B60] border-blue-300 font-bold';
      case 'COMPLETED':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'PLANNED':
      case 'RECOMMENDED':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      default:
        return 'bg-red-100 text-red-900 border-red-300';
    }
  };

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-[#0B3B60] border-blue-300 font-black';
      case 'READY':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border-2 border-[#0B3B60] w-full max-w-3xl rounded shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#0B3B60] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Layers className="w-5 h-5 text-amber-300" />
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-black font-mono">{block.blockNumber}</h2>
                <span
                  className={`px-2 py-0.2 rounded text-[10px] font-mono border uppercase ${getStatusBadge(
                    block.status
                  )}`}
                >
                  {block.status}
                </span>
                {block.isJointBlock && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-purple-900 text-purple-200 border border-purple-700 uppercase">
                    Joint Multi-Dept Block
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-200 font-medium">{block.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-amber-300 text-lg font-bold px-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* Top Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-50 p-2.5 rounded border border-slate-300">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center space-x-1">
                <Clock className="w-3 h-3 text-[#0B3B60]" />
                <span>Window</span>
              </span>
              <div className="text-sm font-black font-mono text-slate-900 mt-1">
                {block.plannedStartTime} – {block.plannedEndTime}
              </div>
              <span className="text-[10px] text-slate-500">120 Min Possession</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-300">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-red-600" />
                <span>Corridor</span>
              </span>
              <div className="text-sm font-black font-mono text-slate-900 mt-1">{block.corridor}</div>
              <span className="text-[10px] text-slate-500 font-mono">{block.line}</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-300">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center space-x-1">
                <Users className="w-3 h-3 text-amber-700" />
                <span>Deployment</span>
              </span>
              <div className="text-sm font-black font-mono text-slate-900 mt-1">{block.fieldCrewsCount} Crews Active</div>
              <span className="text-[10px] text-slate-500">{block.equipment.length} Track Machines</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-300">
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-700" />
                <span>Safety Checklist</span>
              </span>
              <div className="text-sm font-black font-mono text-emerald-800 mt-1">
                {completedChecks}/{totalChecks} Verified
              </div>
              <span className="text-[10px] text-slate-500">
                {completedChecks === totalChecks ? 'Cleared for Traffic' : 'Pending Sign-off'}
              </span>
            </div>
          </div>

          {/* Timeline / Gantt Chart in Light Mode */}
          <div className="bg-slate-50 border border-slate-300 rounded p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-slate-800">
                Gantt Coordination Schedule (Possession Window)
              </span>
              <span className="text-[10px] font-mono text-[#0B3B60] font-bold">
                Window: 22:00 – 00:00 (120 min)
              </span>
            </div>

            {/* Time Axis */}
            <div className="grid grid-cols-4 text-[10px] font-mono text-slate-500 border-b border-slate-200 pb-1">
              <div>22:00 (Start)</div>
              <div>22:30</div>
              <div>23:15</div>
              <div className="text-right">00:00 (Clearance)</div>
            </div>

            {/* Task Bars */}
            <div className="space-y-2 pt-1">
              {block.tasks.map((tsk) => {
                const pct = (tsk.durationMinutes / 120) * 100;
                return (
                  <div key={tsk.taskId} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${
                          tsk.department === 'ENGINEERING' ? 'bg-amber-50 text-amber-900 border-amber-300' :
                          tsk.department === 'ELECTRICAL' ? 'bg-yellow-50 text-yellow-900 border-yellow-300' : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        }`}>
                          {tsk.department}
                        </span>
                        <span className="text-slate-800 font-bold">{tsk.title}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-slate-500 text-[10px]">{tsk.durationMinutes} min</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${getTaskStatusBadge(tsk.status)}`}>
                          {tsk.status}
                        </span>
                      </div>
                    </div>
                    {/* Gantt Bar */}
                    <div className="w-full bg-slate-200 h-3.5 rounded overflow-hidden flex items-center p-0.5 border border-slate-300">
                      <div
                        className={`h-full rounded transition-all duration-300 ${
                          tsk.status === 'COMPLETED' ? 'bg-[#15803D]' :
                          tsk.status === 'IN_PROGRESS' ? 'bg-[#0B3B60]' :
                          'bg-slate-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>Crew: {tsk.crewName}</span>
                      <span>Equip: {tsk.equipment.join(', ')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Department Work Packages with Live Action Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase font-bold text-slate-800">
              Department Execution Status
            </span>
            <div className="space-y-2">
              {block.tasks.map((tsk) => (
                <div key={tsk.taskId} className="bg-white p-3 rounded border border-slate-300 flex items-center justify-between shadow-2xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs">{tsk.title}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${getTaskStatusBadge(tsk.status)}`}>
                        {tsk.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Assigned: <span className="text-slate-900 font-semibold">{tsk.crewName}</span> | Machines: <span className="font-mono text-slate-800">{tsk.equipment.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {tsk.status !== 'COMPLETED' && (
                      <>
                        {tsk.status !== 'IN_PROGRESS' ? (
                          <button
                            onClick={() => startTask(tsk.taskId)}
                            className="px-2.5 py-1.5 rounded bg-[#15803D] hover:bg-[#166534] text-white font-bold font-mono text-xs flex items-center space-x-1 shadow-sm"
                          >
                            <Play className="w-3 h-3" />
                            <span>Start Work</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => completeTask(tsk.taskId)}
                            className="px-2.5 py-1.5 rounded bg-[#0B3B60] hover:bg-[#07253d] text-white font-bold font-mono text-xs flex items-center space-x-1 shadow-sm"
                          >
                            <CheckSquare className="w-3 h-3" />
                            <span>Complete</span>
                          </button>
                        )}
                      </>
                    )}
                    {tsk.status === 'COMPLETED' && (
                      <span className="flex items-center space-x-1 text-emerald-800 font-mono text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Completed</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Checklist Interactivity in Light Mode */}
          <div className="bg-slate-50 border border-slate-300 rounded p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase font-bold text-slate-800 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>Mandatory Safety Verification Protocol (IRPWM Chapter 8)</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500">Tap to sign-off</span>
            </div>
            <div className="space-y-1.5">
              {block.safetyChecklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleSafetyChecklist(block.id, item.id)}
                  className={`w-full text-left p-2.5 rounded flex items-start space-x-2.5 border transition-colors ${
                    item.isCompleted
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-white border-slate-300 text-slate-800 hover:border-slate-400'
                  }`}
                >
                  <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center border shrink-0 ${
                    item.isCompleted ? 'bg-emerald-700 border-emerald-800 text-white' : 'border-slate-400 bg-white'
                  }`}>
                    {item.isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold">{item.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                      Dept: <span className="text-slate-800 font-bold">{item.department}</span>
                      {item.completedBy && (
                        <span> • Signed by: <span className="text-emerald-800 font-bold">{item.completedBy}</span> ({item.completedAt})</span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] font-mono text-slate-600">
            Downtime Saved: <span className="text-emerald-800 font-bold">{Math.floor(block.downtimeSavedMinutes / 60)}h {block.downtimeSavedMinutes % 60}m</span> | Train Conflicts: <span className="text-slate-900 font-bold">{block.trainConflictsCount}</span>
          </div>

          <div className="flex items-center space-x-2">
            {(block.status === 'PLANNED' || block.status === 'RECOMMENDED') && (
              <button
                onClick={() => {
                  approveBlock(block.id);
                  onClose();
                }}
                className="px-3.5 py-1.5 bg-[#0B3B60] hover:bg-[#07253d] text-white rounded font-bold font-mono text-xs flex items-center space-x-1 shadow-sm"
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Approve Block</span>
              </button>
            )}

            {block.status === 'APPROVED' && (
              <button
                onClick={() => {
                  activateBlock(block.id);
                  onClose();
                }}
                className="px-3.5 py-1.5 bg-[#15803D] hover:bg-[#166534] text-white rounded font-bold font-mono text-xs flex items-center space-x-1 shadow-sm"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Authorize Live Activation</span>
              </button>
            )}

            {block.status === 'ACTIVE' && (
              <button
                onClick={() => {
                  cancelBlock(block.id);
                  onClose();
                }}
                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-900 border border-red-300 rounded font-bold font-mono text-xs flex items-center space-x-1"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Cancel / Relinquish Block</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-mono font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
