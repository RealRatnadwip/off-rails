import React from 'react';
import { ActivityEvent, Department } from '../../types';
import { Activity, Clock, MapPin, Wrench, Zap, Radio, Train } from 'lucide-react';

interface ActivityFeedProps {
  events: ActivityEvent[];
  maxItems?: number;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ events, maxItems = 10 }) => {
  const getDeptBadge = (dept: Department) => {
    switch (dept) {
      case 'ENGINEERING':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'ELECTRICAL':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'S_AND_T':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'OPERATIONS':
      default:
        return 'bg-blue-100 text-[#0B3B60] border-blue-300';
    }
  };

  const getSeverityPill = (sev: string) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'WARNING':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'SUCCESS':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'INFO':
      default:
        return 'bg-blue-50 text-[#0B3B60] border-blue-200';
    }
  };

  return (
    <div className="bg-white border border-slate-300 rounded shadow-sm flex flex-col h-full overflow-hidden">
      <div className="px-3.5 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#0B3B60]" />
          <h3 className="text-xs font-mono font-bold uppercase text-slate-800 tracking-wider">
            Operational Log & Field Telemetry Feed
          </h3>
        </div>
        <div className="flex items-center space-x-1.5 text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300 font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-ping"></span>
          <span>LIVE STREAM</span>
        </div>
      </div>

      <div className="divide-y divide-slate-100 overflow-y-auto max-h-[380px] text-xs">
        {events.slice(0, maxItems).map((evt) => (
          <div
            key={evt.id}
            className="p-2.5 hover:bg-slate-50 transition-colors space-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border uppercase ${getDeptBadge(
                    evt.department
                  )}`}
                >
                  {evt.department}
                </span>
                <span className="text-[11px] font-bold text-slate-800 truncate max-w-[190px] sm:max-w-none">
                  {evt.title}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-[10px] font-mono text-slate-500 shrink-0 font-semibold">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{evt.timestamp}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-600 pl-1 leading-relaxed">{evt.detail}</p>

            <div className="flex items-center justify-between text-[10px] text-slate-500 pl-1 pt-0.5 font-mono">
              <span className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-red-500" />
                <span>{evt.location}</span>
              </span>
              <span>Off: {evt.actorRole}</span>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="p-6 text-center text-slate-400 text-xs">No activity logged yet.</div>
        )}
      </div>
    </div>
  );
};
