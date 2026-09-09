import React from 'react';
import { TrainService, RailwayBlock } from '../../types';
import { Train, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface TrainConflictWidgetProps {
  trains: TrainService[];
  blocks: RailwayBlock[];
}

export const TrainConflictWidget: React.FC<TrainConflictWidgetProps> = ({ trains, blocks }) => {
  return (
    <div className="bg-white border border-slate-300 rounded shadow-sm flex flex-col h-full overflow-hidden">
      <div className="px-3.5 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Train className="w-4 h-4 text-[#0B3B60]" />
          <h3 className="text-xs font-mono font-bold uppercase text-slate-800 tracking-wider">
            Corridor Train Path & Conflict Monitor
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500 font-bold">
          Tracking {trains.length} Services
        </span>
      </div>

      <div className="p-3 space-y-3 text-xs overflow-y-auto max-h-[380px]">
        {/* Active Block Train Impact Banner */}
        <div className="bg-emerald-50 p-2.5 rounded border border-emerald-200">
          <div className="flex items-center justify-between mb-1">
            <span className="font-mono text-[11px] font-bold text-emerald-900">
              Joint Block #1042 Corridor Impact
            </span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              0 PASSENGER CONFLICTS
            </span>
          </div>
          <p className="text-[11px] text-emerald-800">
            Passenger EMU and Mail/Express paths protected. Down Freight BTPN-492 regulated 18 mins at Naihati Yard loop line.
          </p>
        </div>

        {/* Live Train Services Status List */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-slate-600 uppercase font-bold">
            Services in Vicinity of Possession Envelopes
          </span>
          {trains.slice(0, 5).map((trn) => (
            <div
              key={trn.id}
              className="p-2 rounded bg-slate-50 border border-slate-200 hover:border-slate-300 flex items-center justify-between text-xs transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold border ${
                    trn.type === 'RAJ' ? 'bg-red-50 text-red-800 border-red-200' :
                    trn.type === 'VB' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                    trn.type === 'FREIGHT' ? 'bg-amber-50 text-amber-800 border-amber-200' :
                    'bg-slate-100 text-slate-800 border-slate-300'
                  }`}
                >
                  {trn.trainNumber}
                </span>
                <div>
                  <div className="font-bold text-slate-800 text-[11px] truncate max-w-[170px] sm:max-w-[210px]">
                    {trn.name}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    KM {trn.currentKm.toFixed(1)} ({trn.direction}) • Next: {trn.nextStation}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <span
                  className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                    trn.status === 'ON_TIME'
                      ? 'text-emerald-800 bg-emerald-50 border-emerald-200'
                      : trn.status === 'REGULATED'
                      ? 'text-purple-800 bg-purple-50 border-purple-200'
                      : 'text-amber-800 bg-amber-50 border-amber-200'
                  }`}
                >
                  {trn.status === 'ON_TIME' ? 'ON TIME' : `${trn.delayMinutes}m DELAY`}
                </span>
                <div className="text-[10px] text-slate-500 font-semibold">{trn.speedKmph} km/h</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
