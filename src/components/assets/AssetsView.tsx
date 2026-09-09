import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { RailwayAsset } from '../../types';
import {
  Database,
  Search,
  ShieldAlert,
  Activity,
  Zap,
  Wrench,
  Radio,
  Clock,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export const AssetsView: React.FC = () => {
  const { assets, reportAssetIssue } = useRailway();
  const [deptFilter, setDeptFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<RailwayAsset | null>(null);
  const [issueText, setIssueText] = useState<string>('');

  const filteredAssets = assets.filter((a) => {
    if (deptFilter !== 'ALL' && a.department !== deptFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.code.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleReportIssue = (assetId: string) => {
    if (!issueText.trim()) return;
    reportAssetIssue(assetId, issueText);
    setIssueText('');
    setSelectedAsset(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-l-[#0B3B60]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#0B3B60] uppercase">
              PERMANENT WAY & ROLLING ASSET INVENTORY (TMS)
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded bg-blue-100 text-blue-900 border border-blue-300 font-mono font-bold">
              30 ASSETS MONITORED
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans mt-0.5">
            Railway Infrastructure Assets & Health Register
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            USFD ultrasonic testing logs, point machine throws, 25kV traction isolators, and statutory inspection cycles.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-300 rounded p-3 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 font-mono">
          {['ALL', 'ENGINEERING', 'ELECTRICAL', 'S_AND_T'].map((d) => (
            <button
              key={d}
              onClick={() => setDeptFilter(d)}
              className={`px-3 py-1.5 rounded transition-colors ${
                deptFilter === d ? 'bg-[#0B3B60] text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {d === 'ALL' ? 'All Asset Classes' : d === 'ENGINEERING' ? 'P-Way' : d === 'ELECTRICAL' ? 'TRD/OHE' : d}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search asset, code, station..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3B60]"
          />
        </div>
      </div>

      {/* Assets Grid in Light Mode */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredAssets.map((ast) => {
          return (
            <div
              key={ast.id}
              className="bg-white border border-slate-300 rounded p-3.5 hover:border-[#0B3B60] transition-all shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono font-bold text-slate-900 text-xs">{ast.code}</span>
                  <span className="text-[10px] text-slate-500 block font-bold">{ast.category}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase border ${
                      ast.status === 'OPERATIONAL'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : ast.status === 'DEGRADED'
                        ? 'bg-red-50 text-red-800 border-red-200'
                        : 'bg-amber-50 text-amber-800 border-amber-200'
                    }`}
                  >
                    {ast.status}
                  </span>
                  <div className="font-mono text-xs font-bold text-slate-700 mt-0.5">
                    Health: {ast.healthScore}%
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-900">{ast.name}</h3>
                <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                  Location: {ast.location} ({ast.station})
                </div>
              </div>

              {/* Specs */}
              <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[10px] font-mono text-slate-700 space-y-1">
                {Object.entries(ast.specifications).slice(0, 2).map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between">
                    <span className="text-slate-500">{k}:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[150px]">{v}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-200">
                <span>Next Due: {ast.nextMaintenanceDue}</span>
                <button
                  onClick={() => setSelectedAsset(ast)}
                  className="text-amber-800 hover:text-amber-900 underline font-bold"
                >
                  Flag Defect
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flag Defect Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border-2 border-[#0B3B60] w-full max-w-md rounded p-4 space-y-3 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900 font-mono">
              Flag Operational Defect: {selectedAsset.code}
            </h3>
            <p className="text-xs text-slate-700">
              Reporting a defect will lower the health score and generate an urgent maintenance requisition.
            </p>
            <textarea
              rows={3}
              placeholder="Specify defect (e.g. USFD ultrasonic flaw echo, loose fastener, point obstruction)..."
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3B60]"
            />
            <div className="flex items-center justify-end space-x-2 pt-1">
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-3 py-1.5 rounded bg-slate-200 text-slate-800 text-xs font-mono font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReportIssue(selectedAsset.id)}
                className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-700 text-white font-mono font-bold text-xs shadow"
              >
                Submit Defect Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
