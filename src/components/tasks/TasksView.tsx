import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { MaintenanceTask, Department } from '../../types';
import { AiPriorityModal } from '../modals/AiPriorityModal';
import {
  CheckSquare,
  Search,
  Wrench,
  Zap,
  Radio,
  Train,
  Play,
  CheckCircle2,
  Clock,
  MapPin,
  Plus,
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const { tasks, startTask, completeTask, addNewTask } = useRailway();
  const [activeDept, setActiveDept] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [inspectedTask, setInspectedTask] = useState<MaintenanceTask | null>(null);

  const filteredTasks = tasks.filter((t) => {
    if (activeDept !== 'ALL' && t.department !== activeDept) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        t.code.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getLightBadge = (score: number) => {
    if (score >= 80) return { bg: 'bg-red-50', text: 'text-red-900', border: 'border-red-300' };
    if (score >= 65) return { bg: 'bg-amber-50', text: 'text-amber-900', border: 'border-amber-300' };
    if (score >= 45) return { bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-300' };
    return { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300' };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-l-[#0B3B60]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#0B3B60] uppercase">
              DIVISION TRACK MAINTENANCE PIPELINE (TMS)
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded bg-blue-100 text-blue-900 border border-blue-300 font-mono font-bold">
              DEPARTMENT REQUISITIONS
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans mt-0.5">
            Maintenance Work Orders Portfolio
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Track machine schedules, ultrasonic testing logs, and statutory inspection compliance across Engineering, Electrical and S&T.
          </p>
        </div>

        <button
          onClick={() =>
            addNewTask({
              department: 'ENGINEERING',
              title: 'Track Slewing & Ballast Packing',
              location: 'KM 27.2 UP Main',
              durationMinutes: 60,
            })
          }
          className="px-3 py-2 rounded bg-[#0B3B60] hover:bg-[#07253d] text-white font-mono font-bold text-xs flex items-center space-x-1.5 shadow transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          <span>New Work Order</span>
        </button>
      </div>

      {/* Dept Tabs & Search Bar */}
      <div className="bg-white border border-slate-300 rounded p-3 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-1.5 font-mono">
          {[
            { id: 'ALL', label: 'All Depts' },
            { id: 'ENGINEERING', label: 'Engineering (P-Way)' },
            { id: 'ELECTRICAL', label: 'Electrical (TRD/OHE)' },
            { id: 'S_AND_T', label: 'Signal & Telecom' },
            { id: 'OPERATIONS', label: 'Operations' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDept(d.id)}
              className={`px-3 py-1.5 rounded transition-colors ${
                activeDept === d.id ? 'bg-[#0B3B60] text-white font-bold' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search code, work, location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0B3B60]"
          />
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredTasks.map((t) => {
          const badge = getLightBadge(t.priorityScore);

          return (
            <div
              key={t.id}
              className="bg-white border border-slate-300 rounded p-3.5 hover:border-[#0B3B60] transition-all shadow-sm flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="font-mono font-bold text-slate-900">{t.code}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${
                        t.department === 'ENGINEERING'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : t.department === 'ELECTRICAL'
                          ? 'bg-yellow-50 text-yellow-900 border-yellow-300'
                          : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      }`}
                    >
                      {t.department === 'ENGINEERING' ? 'P-WAY' : t.department === 'ELECTRICAL' ? 'TRD' : t.department}
                    </span>
                  </div>

                  <button
                    onClick={() => setInspectedTask(t)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-black border ${badge.bg} ${badge.text} ${badge.border}`}
                  >
                    AI {t.priorityScore}
                  </button>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-slate-900">{t.title}</h3>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-mono flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                    <span>{t.location}</span>
                  </div>
                </div>

                <div className="bg-slate-50 p-2 rounded border border-slate-200 text-[11px] font-mono text-slate-700 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <span className="font-bold">{t.durationMinutes} Minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Preferred Slot:</span>
                    <span>{t.preferredWindowStart} – {t.preferredWindowEnd}</span>
                  </div>
                  {t.assignedCrewName && (
                    <div className="text-slate-500 truncate">
                      Crew: <span className="text-slate-800 font-bold">{t.assignedCrewName}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border uppercase ${
                    t.status === 'COMPLETED'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : t.status === 'IN_PROGRESS'
                      ? 'bg-blue-50 text-[#0B3B60] border-blue-300 font-black'
                      : t.status === 'READY'
                      ? 'bg-amber-50 text-amber-900 border-amber-300'
                      : 'bg-slate-100 text-slate-700 border-slate-300'
                  }`}
                >
                  {t.status}
                </span>

                <div className="flex items-center space-x-1.5">
                  {t.status !== 'COMPLETED' && (
                    <>
                      {t.status !== 'IN_PROGRESS' ? (
                        <button
                          onClick={() => startTask(t.id)}
                          className="px-2 py-1 rounded bg-[#15803D] hover:bg-[#166534] text-white font-bold text-[11px] flex items-center space-x-1 shadow-xs"
                        >
                          <Play className="w-3 h-3" />
                          <span>Start</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => completeTask(t.id)}
                          className="px-2 py-1 rounded bg-[#0B3B60] hover:bg-[#07253d] text-white font-bold text-[11px] flex items-center space-x-1 shadow-xs"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Complete</span>
                        </button>
                      )}
                    </>
                  )}
                  {t.status === 'COMPLETED' && (
                    <span className="text-emerald-800 font-mono text-xs font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Cleared</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {inspectedTask && (
        <AiPriorityModal task={inspectedTask} onClose={() => setInspectedTask(null)} />
      )}
    </div>
  );
};
