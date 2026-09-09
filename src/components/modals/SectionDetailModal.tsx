import React from 'react';
import { TrackSection, RailwayBlock, MaintenanceTask } from '../../types';
import { X, MapPin, Zap, Radio, Layers } from 'lucide-react';

interface SectionDetailModalProps {
  section: TrackSection | null;
  blocks: RailwayBlock[];
  tasks: MaintenanceTask[];
  onClose: () => void;
  onOpenBlock: (block: RailwayBlock) => void;
}

export const SectionDetailModal: React.FC<SectionDetailModalProps> = ({
  section,
  blocks,
  tasks,
  onClose,
  onOpenBlock,
}) => {
  if (!section) return null;

  const associatedBlock = blocks.find(
    (b) => b.id === section.activeBlockId || (b.kmStart <= section.kmEnd && b.kmEnd >= section.kmStart)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border-2 border-[#0B3B60] w-full max-w-lg rounded shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-4 py-3 bg-[#0B3B60] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <MapPin className="w-5 h-5 text-amber-300" />
            <div>
              <div className="text-[10px] font-mono text-amber-300 uppercase tracking-wider font-bold">
                Railway Corridor Track Segment
              </div>
              <h3 className="text-sm font-bold font-sans">
                {section.code} ({section.fromStation} ↔ {section.toStation})
              </h3>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-amber-300 text-lg font-bold px-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3.5 text-xs overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded border border-slate-300">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Chainage Limits</span>
              <div className="text-sm font-black font-mono text-slate-900 mt-0.5">
                KM {section.kmStart.toFixed(1)} – {section.kmEnd.toFixed(1)}
              </div>
              <div className="text-[10px] text-slate-600 mt-0.5">{section.lineName}</div>
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Possession Status</span>
              <div className="mt-0.5">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${
                    section.status === 'BLOCK_ACTIVE'
                      ? 'bg-red-100 text-red-900 border-red-300 font-black'
                      : section.status === 'MAINTENANCE_PLANNED'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}
                >
                  {section.status}
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-600 mt-0.5">Section Speed: {section.speedLimitKmph} km/h</div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-300 space-y-1 text-[11px] font-mono text-slate-700">
            <div className="flex items-center space-x-2">
              <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Traction: {section.electrification}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Radio className="w-3.5 h-3.5 text-[#0B3B60] shrink-0" />
              <span>Signalling: {section.signallingType}</span>
            </div>
          </div>

          {/* Associated Active Block */}
          {associatedBlock ? (
            <div className="bg-blue-50/70 border border-blue-200 rounded p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase font-bold text-[#0B3B60] flex items-center space-x-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Current Possession: {associatedBlock.blockNumber}</span>
                </span>
                <span className="text-[10px] font-mono bg-blue-100 text-[#0B3B60] px-1.5 py-0.2 rounded border border-blue-300 font-bold">
                  {associatedBlock.plannedStartTime} – {associatedBlock.plannedEndTime}
                </span>
              </div>
              <div className="text-[11px] text-slate-800 font-bold">{associatedBlock.title}</div>

              {/* Department Tasks in Section */}
              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Coordinated Work:</span>
                {associatedBlock.tasks.map((t) => (
                  <div
                    key={t.taskId}
                    className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {t.department}: {t.title}
                      </div>
                      <div className="text-[10px] text-slate-500">Crew: {t.crewName}</div>
                    </div>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${
                        t.status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : t.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-[#0B3B60] border-blue-300 font-black'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenBlock(associatedBlock);
                }}
                className="w-full mt-2 py-1.5 rounded bg-[#0B3B60] hover:bg-[#07253d] text-white font-bold font-mono text-xs transition-colors shadow-sm"
              >
                Inspect Block #{associatedBlock.blockNumber} Gantt & Safety Log
              </button>
            </div>
          ) : (
            <div className="p-3 rounded bg-slate-50 border border-slate-200 text-slate-500 text-center text-xs font-mono">
              No active or scheduled possession blocks on this track section.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-xs font-mono font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
