import React from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  Sliders,
  RotateCcw,
  Train,
  PlusCircle,
  Cpu,
  Play,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
  FastForward,
  Sparkles,
} from 'lucide-react';

interface DemoControlsModalProps {
  onRunOptimizer?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const DemoControlsModal: React.FC<DemoControlsModalProps> = ({ onRunOptimizer, onNavigateTab }) => {
  const {
    isDemoControlsOpen,
    setIsDemoControlsOpen,
    resetDemo,
    simulateTrainMovement,
    advanceSimulatedTime,
    simulateDelay,
    addNewTask,
    startTask,
    completeTask,
  } = useRailway();

  if (!isDemoControlsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border-2 border-[#0B3B60] w-full max-w-2xl rounded shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-4 py-3 bg-[#0B3B60] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-sm font-black font-sans tracking-wide uppercase">
                OPERATIONS DEMO CONTROL DECK — SIH 2026
              </h2>
              <p className="text-[11px] text-slate-200">
                Deterministic scenario controls for seamless jury evaluation
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDemoControlsOpen(false)}
            className="text-white hover:text-amber-300 text-lg font-bold px-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content in Light Mode */}
        <div className="p-4 space-y-4 overflow-y-auto text-xs">
          {/* Scenario script */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-slate-800 space-y-1">
            <div className="flex items-center space-x-2 font-bold text-[#0B3B60] mb-0.5">
              <Sparkles className="w-4 h-4 text-[#0B3B60]" />
              <span>Recommended Presentation Flow</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-700">
              <li>Open Desktop Control Room (Active Blocks: 04, Pending: 12, Block #1042 PLANNED).</li>
              <li>Go to Planning → Click <strong className="text-slate-900">RUN BLOCK OPTIMISER</strong> to show multi-dept synergy.</li>
              <li>Click <strong className="text-slate-900">APPROVE</strong> on Joint Block #1042.</li>
              <li>Open Mobile browser (or switch role to Field Engineer) → Tap <strong className="text-slate-900">START WORK</strong>.</li>
              <li>Instantly watch Desktop switch to <strong className="text-emerald-700 font-bold">ACTIVE</strong> with streaming activity feed!</li>
              <li>Tap <strong className="text-slate-900">COMPLETE TASK</strong> on mobile → Watch progress jump to 33% / 100%!</li>
            </ol>
          </div>

          {/* Quick 1-Click Triggers Grid */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase text-slate-700 mb-2">1-Click Live Triggers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Step 2 Trigger: Run Optimiser */}
              <button
                onClick={() => {
                  if (onRunOptimizer) onRunOptimizer();
                  if (onNavigateTab) onNavigateTab('planning');
                  setIsDemoControlsOpen(false);
                }}
                className="flex items-center space-x-2.5 p-2.5 rounded bg-slate-50 hover:bg-blue-50 border border-slate-300 text-left text-xs transition-colors"
              >
                <Cpu className="w-4 h-4 text-[#0B3B60] shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Run Block Optimiser</div>
                  <div className="text-[10px] text-slate-500">Synthesizes Joint Block #1042 recommendation</div>
                </div>
              </button>

              {/* Step 5 Trigger: Start Block (Field) */}
              <button
                onClick={() => {
                  startTask('tsk-01');
                  setIsDemoControlsOpen(false);
                }}
                className="flex items-center space-x-2.5 p-2.5 rounded bg-slate-50 hover:bg-emerald-50 border border-slate-300 text-left text-xs transition-colors"
              >
                <Play className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Start Work (Field Gang 04)</div>
                  <div className="text-[10px] text-slate-500">Starts Rail Grinding → Activates Block #1042</div>
                </div>
              </button>

              {/* Step 6 Trigger: Complete Task */}
              <button
                onClick={() => {
                  completeTask('tsk-01');
                  setIsDemoControlsOpen(false);
                }}
                className="flex items-center space-x-2.5 p-2.5 rounded bg-slate-50 hover:bg-blue-50 border border-slate-300 text-left text-xs transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-[#0B3B60] shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Complete Rail Grinding Task</div>
                  <div className="text-[10px] text-slate-500">Updates asset health & block progress</div>
                </div>
              </button>

              {/* Step 7 Trigger: Complete All 3 Tasks */}
              <button
                onClick={() => {
                  completeTask('tsk-01');
                  completeTask('tsk-02');
                  completeTask('tsk-03');
                  setIsDemoControlsOpen(false);
                }}
                className="flex items-center space-x-2.5 p-2.5 rounded bg-slate-50 hover:bg-purple-50 border border-slate-300 text-left text-xs transition-colors"
              >
                <FastForward className="w-4 h-4 text-purple-700 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Complete Full Joint Block</div>
                  <div className="text-[10px] text-slate-500">Completes all 3 depts → 100% saved 2h 15m</div>
                </div>
              </button>

              {/* Advance 5 Minutes */}
              <button
                onClick={() => advanceSimulatedTime(5)}
                className="flex items-center space-x-2.5 p-2.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-300 text-left text-xs transition-colors"
              >
                <Clock className="w-4 h-4 text-slate-700 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Advance 5 Minutes</div>
                  <div className="text-[10px] text-slate-500">Advances clock & progresses active work</div>
                </div>
              </button>

              {/* Simulate Train Movement */}
              <button
                onClick={simulateTrainMovement}
                className="flex items-center space-x-2.5 p-2.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-300 text-left text-xs transition-colors"
              >
                <Train className="w-4 h-4 text-[#0B3B60] shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Simulate Train Movement</div>
                  <div className="text-[10px] text-slate-500">Advances live train locations along track</div>
                </div>
              </button>

              {/* Generate Maintenance Request */}
              <button
                onClick={() =>
                  addNewTask({
                    department: 'ENGINEERING',
                    title: 'Urgent Track Tamping & Alignment',
                    location: 'KM 30.2 UP Main',
                    kmStart: 30.2,
                    kmEnd: 31.0,
                    priority: 'HIGH',
                    durationMinutes: 90,
                  })
                }
                className="flex items-center space-x-2.5 p-2.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-300 text-left text-xs transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Generate Work Request</div>
                  <div className="text-[10px] text-slate-500">Adds realistic P-Way task to pipeline</div>
                </div>
              </button>

              {/* Simulate Delay */}
              <button
                onClick={() => simulateDelay(15)}
                className="flex items-center space-x-2.5 p-2.5 rounded bg-slate-50 hover:bg-slate-100 border border-slate-300 text-left text-xs transition-colors"
              >
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">Simulate Train Delay (+15m)</div>
                  <div className="text-[10px] text-slate-500">Triggers operational conflict warning</div>
                </div>
              </button>
            </div>
          </div>

          {/* Reset button */}
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => {
                resetDemo();
                setIsDemoControlsOpen(false);
              }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded bg-red-50 hover:bg-red-100 text-red-900 border border-red-300 text-xs font-bold font-mono transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset All Demo Data to Initial State</span>
            </button>

            <button
              onClick={() => setIsDemoControlsOpen(false)}
              className="px-3 py-1.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold font-mono"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
