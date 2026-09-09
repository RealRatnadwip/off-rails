import React from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Wrench,
  Radio,
  Train,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { kpis } = useRailway();

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-l-[#0B3B60]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#0B3B60] uppercase">
              OPERATIONS EFFICIENCY & MACHINE PRODUCTIVITY
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded bg-blue-100 text-blue-900 border border-blue-300 font-mono font-bold">
              SYNTHETIC DEMONSTRATION DATA
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans mt-0.5">
            Possession Planning & Multi-Dept Efficiency Analytics
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Tangible track downtime reduction, passenger punctuality safeguarding, and joint possession coordination synergy.
          </p>
        </div>
      </div>

      {/* Top 3 Impact Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="bg-white border border-slate-300 rounded p-4 space-y-1 shadow-sm border-t-4 border-t-emerald-600">
          <div className="text-[10px] font-mono uppercase text-emerald-800 font-bold">
            Total Corridor Downtime Saved
          </div>
          <div className="text-3xl font-black font-mono text-slate-900">
            {Math.floor(kpis.downtimeSavedTotalMinutes / 60)}h {kpis.downtimeSavedTotalMinutes % 60}m
          </div>
          <div className="text-[11px] text-slate-600">
            Achieved by replacing 3 separate single-department possessions with Joint Block #1042.
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded p-4 space-y-1 shadow-sm border-t-4 border-t-[#0B3B60]">
          <div className="text-[10px] font-mono uppercase text-[#0B3B60] font-bold">
            Passenger Train Delay Protection
          </div>
          <div className="text-3xl font-black font-mono text-slate-900">0 mins</div>
          <div className="text-[11px] text-slate-600">
            Zero passenger EMU / Rajdhani train cancellations or path infringements.
          </div>
        </div>

        <div className="bg-white border border-slate-300 rounded p-4 space-y-1 shadow-sm border-t-4 border-t-amber-600">
          <div className="text-[10px] font-mono uppercase text-amber-800 font-bold">
            Possession Window Utilisation
          </div>
          <div className="text-3xl font-black font-mono text-slate-900">{kpis.blockUtilisation}%</div>
          <div className="text-[11px] text-slate-600">
            Track occupation density vs 48% industry average for uncoordinated blocks.
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        {/* Chart 1: Downtime Saved vs Traditional Scheduling */}
        <div className="bg-white border border-slate-300 rounded p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-slate-900 uppercase text-xs">
              Corridor Block Possession Hours: Before vs After
            </span>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-300 font-bold">
              62% Downtime Cut
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-red-700 font-bold">Before: 3 Uncoordinated Separate Blocks</span>
                <span className="text-slate-900 font-bold">4.25 Hours</span>
              </div>
              <div className="w-full bg-slate-100 h-5 rounded overflow-hidden p-0.5 border border-slate-300">
                <div className="bg-red-600 h-full rounded" style={{ width: '85%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono mb-1">
                <span className="text-emerald-700 font-bold">After: OFF-RAILS Coordinated Joint Block #1042</span>
                <span className="text-slate-900 font-bold">2.00 Hours</span>
              </div>
              <div className="w-full bg-slate-100 h-5 rounded overflow-hidden p-0.5 border border-slate-300">
                <div className="bg-emerald-600 h-full rounded" style={{ width: '40%' }}></div>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-600">
            Coordinated possession eliminates 135 minutes of repeated track isolation and handovers.
          </p>
        </div>

        {/* Chart 2: Department Compliance */}
        <div className="bg-white border border-slate-300 rounded p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-slate-900 uppercase text-xs">
              Department Statutory Maintenance Compliance
            </span>
            <span className="text-[10px] font-mono text-[#0B3B60] font-bold">Target: 90%</span>
          </div>

          <div className="space-y-2 pt-1 font-mono">
            <div>
              <div className="flex justify-between text-[10px] text-slate-700 mb-0.5">
                <span>Civil Track Engineering (P-Way)</span>
                <span className="text-emerald-800 font-bold">94%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div className="bg-[#800000] h-full rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-700 mb-0.5">
                <span>Electrical Traction & OHE</span>
                <span className="text-emerald-800 font-bold">91%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: '91%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-700 mb-0.5">
                <span>Signal & Telecommunication (S&T)</span>
                <span className="text-emerald-800 font-bold">96%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-700 mb-0.5">
                <span>Operations & Safety Clearance</span>
                <span className="text-emerald-800 font-bold">98%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                <div className="bg-[#0B3B60] h-full rounded-full" style={{ width: '98%' }}></div>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-600">
            High joint block adherence prevents overdue inspection risks on critical 60kg rail assets.
          </p>
        </div>

        {/* Chart 3: Weekly Possession Slot Distribution */}
        <div className="bg-white border border-slate-300 rounded p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-slate-900 uppercase text-xs">
              Daily Possession Windows & Utilisation (Hours)
            </span>
            <span className="text-[10px] font-mono text-slate-500">Sealdah Main Corridor</span>
          </div>

          <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-200">
            {[
              { day: 'Mon', h: 3.5, active: false },
              { day: 'Tue', h: 2.8, active: false },
              { day: 'Wed', h: 4.2, active: false },
              { day: 'Thu', h: 3.1, active: false },
              { day: 'Fri', h: 4.8, active: false },
              { day: 'Sat', h: 5.5, active: false },
              { day: 'Sun (Today)', h: 6.2, active: true },
            ].map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t transition-all ${
                    d.active ? 'bg-[#0B3B60] shadow-sm' : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                  style={{ height: `${(d.h / 7.0) * 100}%` }}
                  title={`${d.day}: ${d.h} hrs`}
                />
                <span className="text-[9px] font-mono text-slate-600 truncate max-w-full font-bold">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-600 font-mono">
            <span>Sunday Major Corridor Window: 6.2h</span>
            <span className="text-emerald-800 font-bold">Peak Multi-Dept Slot</span>
          </div>
        </div>

        {/* Chart 4: Train Punctuality Index */}
        <div className="bg-white border border-slate-300 rounded p-4 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono font-bold text-slate-900 uppercase text-xs">
              Train Punctuality Index Safeguarding
            </span>
            <span className="text-[10px] font-mono text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-300">
              99.2% Punctuality
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-xs">Vande Bharat & Rajdhani Express Services</div>
                <div className="text-[10px] text-slate-500 font-mono">Protected green-wave priority scheduling</div>
              </div>
              <span className="font-mono text-emerald-800 font-black text-xs">0 Min Delay</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 text-xs">Suburban EMU Passenger Services</div>
                <div className="text-[10px] text-slate-500 font-mono">Non-peak night window allocation (22:00 - 04:00)</div>
              </div>
              <span className="font-mono text-emerald-800 font-black text-xs">0 Cancellations</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-600">
            Intelligent block scheduling prevents daytime commuter congestion and terminal platform deadlocks.
          </p>
        </div>
      </div>
    </div>
  );
};
