import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { RailwayBlock } from '../../types';
import { BlockDetailModal } from '../modals/BlockDetailModal';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Play,
  AlertTriangle,
  ThumbsUp,
} from 'lucide-react';

export const ApprovalsView: React.FC = () => {
  const { blocks, approveBlock, activateBlock, rejectBlock, cancelBlock } = useRailway();
  const [selectedBlock, setSelectedBlock] = useState<RailwayBlock | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    action: 'APPROVE' | 'ACTIVATE' | 'REJECT' | 'CANCEL';
    block: RailwayBlock;
  } | null>(null);

  const pendingOrRecommended = blocks.filter((b) => b.status === 'PLANNED' || b.status === 'RECOMMENDED');
  const approvedBlocks = blocks.filter((b) => b.status === 'APPROVED');

  const executeConfirmAction = () => {
    if (!confirmModal) return;
    const { action, block } = confirmModal;
    if (action === 'APPROVE') approveBlock(block.id);
    if (action === 'ACTIVATE') activateBlock(block.id);
    if (action === 'REJECT') rejectBlock(block.id, 'Section controller operational hold');
    if (action === 'CANCEL') cancelBlock(block.id);
    setConfirmModal(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-l-[#0B3B60]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#0B3B60] uppercase">
              OPERATIONS CONTROL AUTHORITY • SECTION CLEARANCE
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded bg-blue-100 text-blue-900 border border-blue-300 font-mono font-bold">
              SANCTION DESK
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans mt-0.5">
            Possession Block Approvals & Line Clear Desk
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Section Controller verification of 25kV traction power cut, station master block messages, and train regulation.
          </p>
        </div>
      </div>

      {/* Section 1: Pending Approvals */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono font-bold uppercase text-slate-800 tracking-wider flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>Blocks Pending Formal Sanction ({pendingOrRecommended.length})</span>
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">Authorizes Section Master to issue Traffic Block</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pendingOrRecommended.map((blk) => (
            <div
              key={blk.id}
              className="bg-white border border-slate-300 rounded p-4 space-y-3 shadow-sm hover:border-[#0B3B60] transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-base font-black font-mono text-slate-900">{blk.blockNumber}</span>
                  {blk.isJointBlock && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-900 border border-purple-300 uppercase font-mono font-bold">
                      Joint Multi-Dept
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-300">
                  {blk.status}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900">{blk.title}</h3>
                <div className="text-[11px] text-slate-600 mt-0.5 font-mono">
                  Corridor: {blk.corridor} • Window: {blk.plannedStartTime} – {blk.plannedEndTime}
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
                <div>Depts: {blk.departments.join(' + ')}</div>
                <div>Crews: {blk.crews.join(', ')}</div>
                <div className="text-emerald-800 font-bold">
                  Downtime Saved: {Math.floor(blk.downtimeSavedMinutes / 60)}h {blk.downtimeSavedMinutes % 60}m
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                <button
                  onClick={() => setSelectedBlock(blk)}
                  className="text-xs text-[#0B3B60] hover:underline font-bold font-mono"
                >
                  Verify Safety Checklist
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setConfirmModal({ action: 'REJECT', block: blk })}
                    className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-red-700 font-bold text-xs border border-slate-300"
                  >
                    Hold
                  </button>
                  <button
                    onClick={() => setConfirmModal({ action: 'APPROVE', block: blk })}
                    className="px-3.5 py-1 rounded bg-[#0B3B60] hover:bg-[#07253d] text-white font-bold font-mono text-xs shadow-sm flex items-center space-x-1"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Approve Block</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: Approved Blocks Ready to Activate */}
      <div className="space-y-3 pt-2">
        <h2 className="text-xs font-mono font-bold uppercase text-slate-800 tracking-wider flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-[#0B3B60]" />
          <span>Sanctioned Blocks Ready for Track Possession ({approvedBlocks.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {approvedBlocks.map((blk) => (
            <div
              key={blk.id}
              className="bg-white border-2 border-[#0B3B60] rounded p-4 space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-black font-mono text-slate-900">{blk.blockNumber}</span>
                <span className="text-xs font-mono font-bold text-[#0B3B60] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  APPROVED (READY FOR CORRIDOR OCCUPATION)
                </span>
              </div>
              <h3 className="text-xs font-bold text-slate-900">{blk.title}</h3>
              <div className="text-[11px] font-mono text-slate-600">
                Approved by: {blk.approvedBy || 'Operations Controller (SDAH Desk)'}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <button
                  onClick={() => setSelectedBlock(blk)}
                  className="text-xs text-slate-600 hover:text-slate-900 underline font-mono"
                >
                  View Details
                </button>
                <button
                  onClick={() => setConfirmModal({ action: 'ACTIVATE', block: blk })}
                  className="px-3.5 py-1.5 rounded bg-[#15803D] hover:bg-[#166534] text-white font-black font-mono text-xs shadow-sm flex items-center space-x-1"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Authorize Live Possession</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-[#0B3B60] w-full max-w-md rounded p-4 space-y-3 shadow-2xl">
            <div className="flex items-center space-x-2 text-slate-900 font-mono font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Confirm Operations Order: {confirmModal.action}</span>
            </div>
            <p className="text-xs text-slate-700">
              Are you sure you wish to <strong>{confirmModal.action}</strong> Block {confirmModal.block.blockNumber} on corridor {confirmModal.block.corridor}?
            </p>
            <div className="p-2 rounded bg-slate-100 font-mono text-[11px] text-slate-700 border border-slate-200">
              Notice: All Section Station Masters and Traction Controllers will receive synchronized possession telegrams.
            </div>
            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-3 py-1.5 rounded bg-slate-200 text-slate-800 text-xs font-mono font-bold"
              >
                Cancel
              </button>
              <button
                onClick={executeConfirmAction}
                className="px-3.5 py-1.5 rounded bg-[#0B3B60] hover:bg-[#07253d] text-white font-mono font-bold text-xs"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedBlock && (
        <BlockDetailModal block={selectedBlock} onClose={() => setSelectedBlock(null)} />
      )}
    </div>
  );
};
