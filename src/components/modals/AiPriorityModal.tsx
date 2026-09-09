import React from 'react';
import { MaintenanceTask } from '../../types';
import { explainPriorityScore } from '../../services/priorityEngine';
import { X, Cpu, ShieldAlert, AlertOctagon, Clock, Activity, BarChart2, CheckCircle2 } from 'lucide-react';

interface AiPriorityModalProps {
  task: MaintenanceTask | null;
  onClose: () => void;
}

export const AiPriorityModal: React.FC<AiPriorityModalProps> = ({ task, onClose }) => {
  if (!task) return null;

  const b = task.priorityBreakdown;
  const explanations = explainPriorityScore(b);

  const getLightBadge = (score: number) => {
    if (score >= 80) return { bg: 'bg-red-50', text: 'text-red-900', border: 'border-red-300', label: 'CRITICAL' };
    if (score >= 65) return { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-300', label: 'HIGH' };
    if (score >= 45) return { bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-300', label: 'MEDIUM' };
    return { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300', label: 'LOW' };
  };

  const badge = getLightBadge(b.finalScore);

  const metrics = [
    { label: 'Asset Criticality', value: b.assetCriticality, weight: '25%', icon: <ShieldAlert className="w-4 h-4 text-red-600" />, desc: 'Class of asset & corridor tonnage (GMT)' },
    { label: 'Safety Risk', value: b.safetyRisk, weight: '30%', icon: <AlertOctagon className="w-4 h-4 text-amber-600" />, desc: 'Derailment risk, track geometry tolerance, OHE tension' },
    { label: 'Overdue Factor', value: b.overdueFactor, weight: '15%', icon: <Clock className="w-4 h-4 text-yellow-600" />, desc: 'Days elapsed since statutory inspection cycle' },
    { label: 'Operational Impact', value: b.operationalImpact, weight: '20%', icon: <BarChart2 className="w-4 h-4 text-[#0B3B60]" />, desc: 'Interference with scheduled passenger & express rakes' },
    { label: 'Estimated Failure Probability', value: b.failureProbability, weight: '10%', icon: <Activity className="w-4 h-4 text-purple-600" />, desc: 'USFD ultrasonic flaw growth rate & vibration history' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-white border-2 border-[#0B3B60] w-full max-w-xl rounded shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-[#0B3B60] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-amber-300" />
            <div>
              <div className="text-[10px] font-mono text-amber-300 font-bold uppercase tracking-wider">
                AI Priority Score — Demonstration Model
              </div>
              <h3 className="text-sm font-bold font-sans">{task.code}: {task.title}</h3>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-amber-300 text-lg font-bold px-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
          {/* Top Score Banner */}
          <div className="bg-slate-50 border border-slate-300 rounded p-3 flex items-center justify-between">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-mono font-bold">Calculated Multi-Factor Score</span>
              <div className="flex items-baseline space-x-2 mt-0.5">
                <span className="text-3xl font-black font-mono text-slate-900">{b.finalScore}</span>
                <span className="text-slate-500 text-xs">/ 100</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                  {badge.label}
                </span>
              </div>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-600">
              <div>Dept: <span className="text-slate-900 font-bold">{task.department}</span></div>
              <div>Location: <span className="text-slate-900">{task.location}</span></div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono uppercase font-bold text-slate-700">
              Weighted Parameter Decomposition
            </div>
            <div className="space-y-2">
              {metrics.map((m) => (
                <div key={m.label} className="bg-white border border-slate-200 rounded p-2.5 shadow-2xs">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      {m.icon}
                      <span className="font-bold text-slate-800">{m.label}</span>
                      <span className="text-[10px] font-mono text-slate-500">({m.weight} wt)</span>
                    </div>
                    <span className="font-mono font-black text-slate-900 text-xs">{m.value} / 100</span>
                  </div>
                  {/* Progress Bar in Light Mode */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1 border border-slate-200">
                    <div
                      className={`h-full rounded-full ${
                        m.value >= 80 ? 'bg-red-600' : m.value >= 60 ? 'bg-amber-500' : 'bg-[#0B3B60]'
                      }`}
                      style={{ width: `${m.value}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-500">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Justification */}
          <div className="bg-slate-50 border border-slate-300 rounded p-3 space-y-1.5">
            <div className="font-mono text-[11px] text-slate-800 font-bold uppercase flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Safety & Operating Rules Justification</span>
            </div>
            <ul className="space-y-1 text-[11px] text-slate-700 pl-4 list-disc">
              {explanations.map((p, idx) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>

          <div className="p-2 rounded bg-amber-50 border border-amber-300 text-[10px] text-amber-900 font-mono">
            ⚠️ Demonstration Model: Uses deterministic multi-factor railway safety rules formulated for SIH 2026.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-[#0B3B60] hover:bg-[#07253d] text-white rounded text-xs font-mono font-bold"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
