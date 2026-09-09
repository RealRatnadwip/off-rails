import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { RailwayBlock, BlockStatus } from '../../types';
import { BlockDetailModal } from '../modals/BlockDetailModal';
import {
  Layers,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Filter,
  ThumbsUp,
  Play,
  FileSpreadsheet,
} from 'lucide-react';

export const BlocksView: React.FC = () => {
  const { blocks, approveBlock, activateBlock } = useRailway();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedBlock, setSelectedBlock] = useState<RailwayBlock | null>(null);

  const filteredBlocks = blocks.filter((b) => {
    if (selectedStatus === 'ALL') return true;
    return b.status === selectedStatus;
  });

  const getStatusBadge = (status: BlockStatus) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-emerald-100 text-emerald-900 border-emerald-400 font-black';
      case 'APPROVED':
        return 'bg-blue-100 text-[#0B3B60] border-blue-300 font-bold';
      case 'COMPLETED':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'PLANNED':
      case 'RECOMMENDED':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
      default:
        return 'bg-red-100 text-red-900 border-red-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-l-[#0B3B60]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#0B3B60] uppercase">
              DIVISION TRACK POSSESSION LOG (COA)
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded bg-blue-100 text-blue-900 border border-blue-300 font-mono font-bold">
              OFFICIAL BLOCK REGISTER
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans mt-0.5">
            Railway Possession Blocks Registry
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Statutory log of sanctioned and live corridor possessions, traction power isolations, and joint multi-department clearings.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded border border-slate-300 text-xs font-mono">
          {['ALL', 'ACTIVE', 'APPROVED', 'PLANNED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1 rounded transition-colors ${
                selectedStatus === st
                  ? 'bg-[#0B3B60] text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Blocks Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredBlocks.map((blk) => {
          const completedChecks = blk.safetyChecklist.filter((c) => c.isCompleted).length;
          const totalChecks = blk.safetyChecklist.length;

          return (
            <div
              key={blk.id}
              onClick={() => setSelectedBlock(blk)}
              className={`bg-white border rounded shadow-sm p-4 cursor-pointer hover:border-[#0B3B60] transition-all space-y-3 ${
                blk.id === 'blk-1042' ? 'border-[#0B3B60] bg-amber-50/20' : 'border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-base font-black font-mono text-slate-900">
                    {blk.blockNumber}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border uppercase ${getStatusBadge(
                      blk.status
                    )}`}
                  >
                    {blk.status}
                  </span>
                  {blk.isJointBlock && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-purple-100 text-purple-900 border border-purple-300 uppercase">
                      Joint Multi-Dept
                    </span>
                  )}
                </div>

                <div className="text-right font-mono text-xs text-slate-700">
                  <Clock className="w-3 h-3 inline mr-1 text-slate-500" />
                  <span className="font-bold">{blk.plannedStartTime} – {blk.plannedEndTime}</span>
                </div>
              </div>

              {/* Title & Corridor */}
              <div>
                <h3 className="text-xs font-bold text-slate-900">{blk.title}</h3>
                <div className="flex items-center space-x-2 text-[11px] text-slate-600 mt-1 font-mono">
                  <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                  <span>{blk.corridor} ({blk.line})</span>
                </div>
              </div>

              {/* Coordinated Tasks Summary */}
              <div className="space-y-1 bg-slate-50 p-2.5 rounded border border-slate-200 text-xs">
                <div className="text-[10px] font-mono text-slate-500 uppercase font-bold flex items-center justify-between">
                  <span>Coordinated Work Items</span>
                  <span>{blk.tasks.length} Packages</span>
                </div>
                {blk.tasks.map((t) => (
                  <div key={t.taskId} className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-800 truncate max-w-[220px]">
                      • {t.department}: {t.title}
                    </span>
                    <span
                      className={`font-mono text-[9px] font-bold px-1 rounded ${
                        t.status === 'COMPLETED'
                          ? 'text-emerald-800 bg-emerald-100'
                          : t.status === 'IN_PROGRESS'
                          ? 'text-blue-900 bg-blue-100'
                          : 'text-amber-900 bg-amber-100'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200">
                <div className="flex items-center space-x-3 text-[11px] text-slate-600 font-mono">
                  <span>
                    Safety: <strong className="text-emerald-800">{completedChecks}/{totalChecks}</strong>
                  </span>
                  <span>
                    Saved: <strong className="text-slate-900">{Math.floor(blk.downtimeSavedMinutes / 60)}h {blk.downtimeSavedMinutes % 60}m</strong>
                  </span>
                </div>

                <div className="flex items-center space-x-1.5">
                  {blk.status === 'PLANNED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        approveBlock(blk.id);
                      }}
                      className="px-2 py-1 rounded bg-[#0B3B60] hover:bg-[#07253d] text-white font-bold text-[11px] flex items-center space-x-1 shadow-xs"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Approve</span>
                    </button>
                  )}
                  {blk.status === 'APPROVED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        activateBlock(blk.id);
                      }}
                      className="px-2 py-1 rounded bg-[#15803D] hover:bg-[#166534] text-white font-bold text-[11px] flex items-center space-x-1 shadow-xs"
                    >
                      <Play className="w-3 h-3" />
                      <span>Activate</span>
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBlock(blk);
                    }}
                    className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedBlock && (
        <BlockDetailModal block={selectedBlock} onClose={() => setSelectedBlock(null)} />
      )}
    </div>
  );
};
