import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { MaintenanceTask, RailwayBlock } from '../../types';
import {
  HardHat,
  Play,
  Pause,
  CheckCircle2,
  AlertOctagon,
  ShieldCheck,
  MapPin,
  Radio,
  Clock,
  Wrench,
  Users,
  Check,
  ChevronRight,
  AlertTriangle,
  Send,
  Sparkles,
} from 'lucide-react';

export const FieldView: React.FC = () => {
  const {
    tasks,
    blocks,
    startTask,
    pauseTask,
    completeTask,
    toggleSafetyChecklist,
    reportObstruction,
    currentTimeStr,
  } = useRailway();

  const [activeTab, setActiveTab] = useState<'HOME' | 'CHECKLIST' | 'CREW' | 'REPORT'>('HOME');
  const [noteText, setNoteText] = useState<string>('');
  const [isObstructionModalOpen, setIsObstructionModalOpen] = useState<boolean>(false);
  const [obstructionDetail, setObstructionDetail] = useState<string>('');
  const [noteSuccess, setNoteSuccess] = useState<boolean>(false);

  // Focus on Joint Block #1042 and its Engineering task (tsk-01)
  const currentBlock: RailwayBlock | undefined = blocks.find((b) => b.id === 'blk-1042') || blocks[0];
  const assignedTask: MaintenanceTask | undefined = tasks.find((t) => t.id === 'tsk-01') || tasks[0];

  const completedChecks = currentBlock?.safetyChecklist.filter((c) => c.isCompleted).length || 0;
  const totalChecks = currentBlock?.safetyChecklist.length || 6;

  const handleStartWork = () => {
    if (assignedTask) {
      startTask(assignedTask.id);
    }
  };

  const handlePauseWork = () => {
    if (assignedTask) {
      pauseTask(assignedTask.id);
    }
  };

  const handleCompleteWork = () => {
    if (assignedTask) {
      completeTask(assignedTask.id);
    }
  };

  const handleSendObstruction = () => {
    if (!obstructionDetail.trim()) return;
    reportObstruction(currentBlock?.corridor || 'KM 43.47', obstructionDetail);
    setObstructionDetail('');
    setIsObstructionModalOpen(false);
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    setNoteSuccess(true);
    setTimeout(() => {
      setNoteText('');
      setNoteSuccess(false);
    }, 2000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-3 pb-20 text-slate-800">
      {/* Official Field Banner with GPS Status */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-3.5 border-t-4 border-t-[#0B3B60]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-orange-100 text-orange-800 border border-orange-300 flex items-center justify-center">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold tracking-widest text-orange-900 uppercase">
                OFF-RAILS • FIELD OPERATIONS DESK
              </div>
              <h1 className="text-base font-black text-slate-900 font-sans">
                Permanent Way Site Operations
              </h1>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>DGPS VERIFIED</span>
            </span>
          </div>
        </div>

        {/* Simulated GPS Location */}
        <div className="mt-2.5 grid grid-cols-2 gap-2 bg-slate-50 p-2 rounded border border-slate-200 font-mono text-xs">
          <div>
            <span className="text-[9px] text-slate-500 uppercase font-bold">Corridor KM:</span>
            <div className="text-sm font-black text-slate-900 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span>KM 43.47</span>
            </div>
            <span className="text-[10px] text-slate-500">UP Main Line (Halisahar)</span>
          </div>
          <div className="text-right">
            <span className="text-[9px] text-slate-500 uppercase font-bold">Accuracy:</span>
            <div className="text-sm font-bold text-emerald-800">±8m (DGPS High)</div>
            <span className="text-[10px] text-slate-500">OHE 25kV Isolated</span>
          </div>
        </div>
      </div>

      {/* Main Assigned Block Card in Light Mode */}
      {currentBlock && (
        <div className="bg-white border-2 border-[#0B3B60] rounded shadow-md p-4 space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div>
              <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                Assigned Joint Possession
              </div>
              <div className="flex items-center space-x-2 mt-0.5">
                <span className="text-xl font-black font-mono text-slate-900">
                  {currentBlock.blockNumber}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-mono font-black border uppercase ${
                    currentBlock.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black'
                      : currentBlock.status === 'COMPLETED'
                      ? 'bg-slate-100 text-slate-800 border-slate-300'
                      : currentBlock.status === 'APPROVED'
                      ? 'bg-blue-100 text-[#0B3B60] border-blue-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {currentBlock.status}
                </span>
              </div>
            </div>

            <div className="text-right font-mono text-xs">
              <div className="text-slate-500 text-[10px] uppercase font-bold">WINDOW</div>
              <div className="text-slate-900 font-black">{currentBlock.plannedStartTime} – {currentBlock.plannedEndTime}</div>
            </div>
          </div>

          {/* Limits */}
          <div className="bg-slate-50 p-2 rounded border border-slate-200 text-xs">
            <div className="text-slate-500 text-[10px] font-mono uppercase font-bold">Possession Limits</div>
            <div className="font-bold text-slate-900 mt-0.5">{currentBlock.corridor} ({currentBlock.line})</div>
          </div>

          {/* Assignment Banner */}
          <div className="bg-amber-50/70 p-3 rounded border border-amber-200 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-amber-900 text-[10px] uppercase font-bold flex items-center space-x-1">
                <Wrench className="w-3.5 h-3.5 text-[#800000]" />
                <span>Your Department Assignment</span>
              </span>
              <span
                className={`px-2 py-0.2 rounded text-[10px] font-mono font-bold border uppercase ${
                  assignedTask?.status === 'COMPLETED'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : assignedTask?.status === 'IN_PROGRESS'
                    ? 'bg-blue-100 text-[#0B3B60] border-blue-300 font-black'
                    : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}
              >
                {assignedTask?.status || 'READY'}
              </span>
            </div>
            <div className="text-base font-black text-slate-900 font-sans">
              {assignedTask?.title || 'Rail Grinding & Profile Rectification'}
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-700 pt-1 border-t border-amber-200">
              <div>Machine: <strong className="text-slate-900">RG-12 Heavy Grinder</strong></div>
              <div>Gang: <strong className="text-slate-900">Gang 04 (8 Men)</strong></div>
            </div>
          </div>

          {/* Safety Checklist Summary */}
          <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2 text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span className="font-bold">Safety Checklist (IRPWM 8)</span>
            </div>
            <div className="font-black text-emerald-800">
              {completedChecks}/{totalChecks} Verified
            </div>
          </div>

          {/* GIANT TOUCH ACTION BUTTONS */}
          <div className="pt-2 space-y-2">
            {assignedTask?.status !== 'IN_PROGRESS' && assignedTask?.status !== 'COMPLETED' && (
              <button
                onClick={handleStartWork}
                className="w-full py-4 rounded bg-[#15803D] hover:bg-[#166534] text-white font-mono font-black text-lg tracking-wider shadow-md flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
              >
                <Play className="w-6 h-6 fill-white" />
                <span>START WORK (GANG 04)</span>
              </button>
            )}

            {assignedTask?.status === 'IN_PROGRESS' && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handlePauseWork}
                  className="py-3.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-mono font-bold text-sm flex items-center justify-center space-x-1.5 shadow"
                >
                  <Pause className="w-5 h-5 fill-white" />
                  <span>PAUSE WORK</span>
                </button>

                <button
                  onClick={handleCompleteWork}
                  className="py-3.5 rounded bg-[#0B3B60] hover:bg-[#07253d] text-white font-mono font-black text-sm flex items-center justify-center space-x-1.5 shadow"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>COMPLETE TASK</span>
                </button>
              </div>
            )}

            {assignedTask?.status === 'COMPLETED' && (
              <div className="w-full py-3.5 rounded bg-emerald-50 border-2 border-emerald-400 text-emerald-900 font-mono font-black text-sm text-center flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <span>WORK COMPLETED & TRACK CLEARED</span>
              </div>
            )}

            {/* Emergency Obstruction Button */}
            <button
              onClick={() => setIsObstructionModalOpen(true)}
              className="w-full py-2.5 rounded bg-red-50 hover:bg-red-100 border border-red-300 text-red-900 font-mono font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <AlertOctagon className="w-4 h-4 text-red-700" />
              <span>REPORT TRACK OBSTRUCTION / DEFECT</span>
            </button>
          </div>
        </div>
      )}

      {/* Tabs for Safety / Crew / Notes in Light Mode */}
      <div className="bg-white border border-slate-300 rounded p-3 space-y-3 shadow-sm">
        <div className="flex border-b border-slate-200 pb-2 text-xs font-mono font-bold">
          <button
            onClick={() => setActiveTab('CHECKLIST')}
            className={`flex-1 py-1 text-center transition-colors ${
              activeTab === 'CHECKLIST' ? 'text-[#0B3B60] border-b-2 border-[#0B3B60]' : 'text-slate-500'
            }`}
          >
            Safety Checks ({completedChecks}/{totalChecks})
          </button>
          <button
            onClick={() => setActiveTab('CREW')}
            className={`flex-1 py-1 text-center transition-colors ${
              activeTab === 'CREW' ? 'text-[#0B3B60] border-b-2 border-[#0B3B60]' : 'text-slate-500'
            }`}
          >
            Crew & VHF
          </button>
          <button
            onClick={() => setActiveTab('REPORT')}
            className={`flex-1 py-1 text-center transition-colors ${
              activeTab === 'REPORT' ? 'text-[#0B3B60] border-b-2 border-[#0B3B60]' : 'text-slate-500'
            }`}
          >
            Site Memo
          </button>
        </div>

        {/* Tab 1: Safety Checklist */}
        {activeTab === 'CHECKLIST' && currentBlock && (
          <div className="space-y-2 text-xs">
            <p className="text-[11px] text-slate-500">
              Tap checkmark to verify mandatory track possession safety measures:
            </p>
            <div className="space-y-1.5">
              {currentBlock.safetyChecklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleSafetyChecklist(currentBlock.id, item.id)}
                  className={`w-full text-left p-2.5 rounded flex items-start space-x-2.5 border transition-colors ${
                    item.isCompleted
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border shrink-0 ${
                      item.isCompleted ? 'bg-emerald-700 border-emerald-800 text-white' : 'border-slate-400 bg-white'
                    }`}
                  >
                    {item.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold leading-snug">{item.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                      Department: {item.department}
                      {item.completedBy && <span> • Signed by: {item.completedBy}</span>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Crew & Comms */}
        {activeTab === 'CREW' && (
          <div className="space-y-2 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">Track Supervisor Incharge (P-Way)</div>
              <div className="text-slate-700 font-sans">S. K. Banerjee (Senior Track Supervisor)</div>
              <div className="text-[11px] text-slate-600">VHF Radio: Channel 04 (156.800 MHz)</div>
              <div className="text-[11px] text-[#0B3B60] font-bold">Direct Phone: +91-94330-18421</div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">Section Operations Controller (SC)</div>
              <div className="text-slate-700 font-sans">Division Operations Controller (Sealdah Desk)</div>
              <div className="text-[11px] text-slate-600">VHF Radio: Channel 01 (156.050 MHz Control)</div>
              <div className="text-[11px] text-[#0B3B60] font-bold">Railway Hotline: #2204</div>
            </div>
          </div>
        )}

        {/* Tab 3: Site Memo */}
        {activeTab === 'REPORT' && (
          <div className="space-y-3 text-xs">
            <textarea
              rows={3}
              placeholder="Enter site memo (e.g. USFD rail testing completed, rail temp 32°C)..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3B60]"
            />
            <button
              onClick={handleSaveNote}
              className="w-full py-2 rounded bg-[#0B3B60] hover:bg-[#07253d] text-white font-mono font-bold text-xs flex items-center justify-center space-x-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Transmit Note to Control Log</span>
            </button>
            {noteSuccess && (
              <div className="p-2 rounded bg-emerald-50 text-emerald-800 border border-emerald-300 text-center font-mono text-xs">
                ✓ Transmitted to Section Operations Control Log.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Obstruction Modal in Light Mode */}
      {isObstructionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-red-600 w-full max-w-md rounded p-4 space-y-3 shadow-2xl">
            <div className="flex items-center space-x-2 text-red-700 font-mono font-bold text-sm">
              <AlertOctagon className="w-5 h-5" />
              <span>Report Immediate Track Hazard / Defect</span>
            </div>
            <p className="text-xs text-slate-700">
              Triggers emergency stop notification to Section Control Office and halts approaching train services.
            </p>
            <textarea
              rows={3}
              placeholder="Specify hazard (e.g. sheared fishplate, fallen tree on catenary)..."
              value={obstructionDetail}
              onChange={(e) => setObstructionDetail(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800"
            />
            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                onClick={() => setIsObstructionModalOpen(false)}
                className="px-3 py-1.5 rounded bg-slate-200 text-slate-800 text-xs font-bold font-mono"
              >
                Cancel
              </button>
              <button
                onClick={handleSendObstruction}
                className="px-4 py-1.5 rounded bg-red-700 hover:bg-red-800 text-white font-mono font-bold text-xs shadow"
              >
                Broadcast Emergency Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
