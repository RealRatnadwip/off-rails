import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { Station, TrackSection, RailwayBlock } from '../../types';
import { SectionDetailModal } from '../modals/SectionDetailModal';
import { BlockDetailModal } from '../modals/BlockDetailModal';
import {
  Network,
  Layers,
  Train,
  MapPin,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Radio,
  Zap,
  CheckCircle2,
  Info,
} from 'lucide-react';

export const NetworkView: React.FC = () => {
  const { stations, trackSections, trains, blocks, tasks, assets } = useRailway();

  const [selectedSection, setSelectedSection] = useState<TrackSection | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<RailwayBlock | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const majorStationCodes = ['HWH', 'SRC', 'KOAA', 'DDJ', 'BP', 'NH', 'KYI', 'RHA', 'KNJ'];
  const majorStations = stations.filter((s) => majorStationCodes.includes(s.code));

  // Map KM (0 to 100) to SVG X coordinate
  const kmToX = (km: number) => {
    return 80 + (km / 100.0) * 880;
  };

  const getSectionColor = (sec: TrackSection) => {
    if (sec.status === 'BLOCK_ACTIVE' || sec.id === 'sec-10') {
      return '#DC2626'; // Operational Crimson Red for active possession
    }
    if (sec.status === 'MAINTENANCE_PLANNED') {
      return '#D97706'; // Amber
    }
    if (sec.status === 'CAUTION') {
      return '#CA8A04'; // Yellow Caution
    }
    return '#0284C7'; // Clear section line blue
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-l-[#0B3B60]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#0B3B60] uppercase">
              DIVISION SCHEMATIC TRACK & INTERLOCKING DIAGRAM
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded bg-blue-100 text-blue-900 border border-blue-300 font-mono font-bold">
              100 KM CORRIDOR (SDAH - NH - KNJ)
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans mt-0.5">
            Realtime Track Circuit & Possession Block Diagram
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Interactive divisional track layout. Click any track section to view active possessions, speed limits, and coordinated maintenance packages.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="flex items-center space-x-1.5 bg-red-50 text-red-900 px-2 py-1 rounded border border-red-200">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <span className="font-bold">Active Possession Block</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-sky-50 text-sky-900 px-2 py-1 rounded border border-sky-200">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
            <span>Clear Track Line</span>
          </div>
          <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-900 px-2 py-1 rounded border border-emerald-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Trains Operating</span>
          </div>
        </div>
      </div>

      {/* SVG Container in Crisp Light Mode */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4 relative overflow-hidden">
        {/* Zoom & Reset Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center space-x-1 bg-white border border-slate-300 rounded shadow p-1">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="p-1 text-slate-700 hover:bg-slate-100 rounded"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-[10px] font-mono px-1.5 text-slate-600 font-bold">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.1))}
            className="p-1 text-slate-700 hover:bg-slate-100 rounded"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1 text-slate-700 hover:bg-slate-100 rounded"
            title="Reset Zoom"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Schematic SVG */}
        <div className="overflow-x-auto pb-2 select-none">
          <div style={{ minWidth: '980px', transform: `scale(${zoomLevel})`, transformOrigin: 'top left', transition: 'transform 0.2s ease-out' }}>
            <svg
              viewBox="0 0 1020 380"
              className="w-full h-auto"
              style={{ minHeight: '340px' }}
            >
              <defs>
                <pattern id="lightGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F1F5F9" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Grid Background */}
              <rect width="1020" height="380" fill="url(#lightGrid)" />

              {/* Official Schematic Heading */}
              <text x="30" y="30" fill="#0B3B60" fontSize="12" fontFamily="Inter" fontWeight="bold">
                EASTERN RAILWAY • SEALDAH DIVISION • PERMANENT WAY SCHEMATIC
              </text>
              <text x="30" y="46" fill="#64748B" fontSize="9" fontFamily="JetBrains Mono">
                DOUBLE LINE 25kV AC TRACTION • SOLID STATE & PANEL INTERLOCKING TERRITORY
              </text>

              {/* KM Scale Line at Top */}
              <line x1="80" y1="70" x2="960" y2="70" stroke="#CBD5E1" strokeWidth="2" />
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((km) => {
                const x = kmToX(km);
                return (
                  <g key={`km-${km}`}>
                    <line x1={x} y1="65" x2={x} y2="75" stroke="#94A3B8" strokeWidth="1.5" />
                    <text x={x} y="60" fill="#475569" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
                      KM {km}
                    </text>
                  </g>
                );
              })}

              {/* UP Main Track Line (Y = 180) */}
              <line x1="80" y1="180" x2="960" y2="180" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
              <text x="30" y="184" fill="#0B3B60" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                UP MAIN
              </text>

              {/* DN Main Track Line (Y = 220) */}
              <line x1="80" y1="220" x2="960" y2="220" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
              <text x="30" y="224" fill="#0B3B60" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                DN MAIN
              </text>

              {/* Chord Link (Kolkata Terminal / Chitpur) */}
              <path d="M 80,180 Q 120,130 180,130 L 260,130 Q 300,130 340,180" fill="none" stroke="#64748B" strokeWidth="2.5" strokeDasharray="5,4" />
              <text x="220" y="122" fill="#475569" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
                KOAA CHORD LINK
              </text>

              {/* Track Sections Interactive Overlays on UP Main */}
              {trackSections.map((sec) => {
                const xStart = kmToX(sec.kmStart);
                const xEnd = kmToX(sec.kmEnd);
                const width = Math.max(16, xEnd - xStart);
                const isSelected = selectedSection?.id === sec.id;
                const isBlockActive = sec.status === 'BLOCK_ACTIVE' || sec.id === 'sec-10';

                return (
                  <g
                    key={sec.id}
                    onClick={() => setSelectedSection(sec)}
                    className="cursor-pointer group"
                  >
                    {/* Section Track Segment Highlight */}
                    <line
                      x1={xStart}
                      y1="180"
                      x2={xEnd}
                      y2="180"
                      stroke={getSectionColor(sec)}
                      strokeWidth={isSelected ? "8" : isBlockActive ? "7" : "4"}
                      className="transition-all duration-200"
                    />

                    {/* Active Block Highlight Zone */}
                    {isBlockActive && (
                      <g>
                        <rect
                          x={xStart}
                          y="155"
                          width={width}
                          height="90"
                          fill="rgba(220, 38, 38, 0.12)"
                          stroke="#DC2626"
                          strokeWidth="2"
                          strokeDasharray="4,2"
                          rx="4"
                        />
                        <rect
                          x={xStart + (width / 2) - 50}
                          y="135"
                          width="100"
                          height="18"
                          fill="#991B1B"
                          stroke="#7F1D1D"
                          strokeWidth="1"
                          rx="2"
                        />
                        <text
                          x={xStart + (width / 2)}
                          y="147"
                          fill="#FFFFFF"
                          fontSize="9"
                          fontFamily="JetBrains Mono"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          POSSESSION #1042
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Critical Assets plotted on track */}
              {assets.map((ast) => {
                const x = kmToX(ast.km);
                const isCritical = ast.criticality === 'CRITICAL';
                return (
                  <g key={ast.id} className="cursor-pointer" onClick={() => {
                    const matchedSec = trackSections.find(s => s.kmStart <= ast.km && s.kmEnd >= ast.km);
                    if (matchedSec) setSelectedSection(matchedSec);
                  }}>
                    <circle
                      cx={x}
                      cy="172"
                      r={isCritical ? "4" : "3"}
                      fill={isCritical ? "#DC2626" : "#0284C7"}
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}

              {/* Stations along the corridor */}
              {majorStations.map((stn) => {
                const x = kmToX(stn.km);
                return (
                  <g key={stn.id} className="cursor-pointer">
                    {/* Platform Marker Box */}
                    <rect
                      x={x - 15}
                      y="166"
                      width="30"
                      height="68"
                      fill="#FFFFFF"
                      stroke="#0B3B60"
                      strokeWidth="2"
                      rx="3"
                    />

                    {/* Platform Notch */}
                    <line x1={x - 15} y1="200" x2={x + 15} y2="200" stroke="#CBD5E1" strokeWidth="1" />

                    {/* Station Code Badge */}
                    <text
                      x={x}
                      y="204"
                      fill="#0B3B60"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {stn.code}
                    </text>

                    {/* Station Full Name */}
                    <text
                      x={x}
                      y="252"
                      fill="#0F172A"
                      fontSize="10"
                      fontFamily="Inter"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {stn.name.replace(' Junction', '').replace(' City', '')}
                    </text>

                    {/* KM Label */}
                    <text
                      x={x}
                      y="266"
                      fill="#64748B"
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      textAnchor="middle"
                    >
                      KM {stn.km.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Dynamic Live Trains */}
              {trains.slice(0, 6).map((trn) => {
                const x = kmToX(trn.currentKm);
                const y = trn.direction === 'UP' ? 180 : 220;
                const isDelayed = trn.status === 'DELAYED' || trn.status === 'REGULATED';

                return (
                  <g key={trn.id} className="transition-all duration-700 ease-linear">
                    {/* Engine dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r="6.5"
                      fill={isDelayed ? "#D97706" : "#15803D"}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />

                    {/* Train Tag Label */}
                    <rect
                      x={x - 30}
                      y={trn.direction === 'UP' ? y - 27 : y + 11}
                      width="60"
                      height="16"
                      fill="#FFFFFF"
                      stroke={isDelayed ? "#D97706" : "#15803D"}
                      strokeWidth="1.5"
                      rx="2"
                    />
                    <text
                      x={x}
                      y={trn.direction === 'UP' ? y - 16 : y + 22}
                      fill="#0F172A"
                      fontSize="8"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {trn.trainNumber} {trn.direction}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <span>Click any track segment to open section telemetry, speed restrictions, and active work orders</span>
          <span className="font-bold text-slate-700">Corridor: Sealdah – Krishnanagar (100% 25kV Electrified)</span>
        </div>
      </div>

      {/* Corridor Quick Section Cards Grid in Light Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {trackSections.slice(0, 4).map((sec) => {
          const isBlock = sec.status === 'BLOCK_ACTIVE' || sec.id === 'sec-10';
          return (
            <div
              key={sec.id}
              onClick={() => setSelectedSection(sec)}
              className={`p-3 rounded border cursor-pointer transition-all shadow-sm ${
                isBlock
                  ? 'bg-red-50 border-red-300 hover:border-red-400'
                  : 'bg-white border-slate-300 hover:border-[#0B3B60]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-slate-900 text-xs">{sec.code}</span>
                <span
                  className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase ${
                    isBlock ? 'bg-red-100 text-red-900 border border-red-300' : 'bg-blue-100 text-[#0B3B60]'
                  }`}
                >
                  {isBlock ? 'BLOCK ACTIVE' : 'CLEAR'}
                </span>
              </div>
              <div className="font-bold text-slate-800">{sec.fromStation} ↔ {sec.toStation}</div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">
                KM {sec.kmStart.toFixed(1)} – {sec.kmEnd.toFixed(1)} • Max: {sec.speedLimitKmph} km/h
              </div>
            </div>
          );
        })}
      </div>

      {/* Section Detail Modal */}
      {selectedSection && (
        <SectionDetailModal
          section={selectedSection}
          blocks={blocks}
          tasks={tasks}
          onClose={() => setSelectedSection(null)}
          onOpenBlock={(blk) => setSelectedBlock(blk)}
        />
      )}

      {selectedBlock && (
        <BlockDetailModal block={selectedBlock} onClose={() => setSelectedBlock(null)} />
      )}
    </div>
  );
};
