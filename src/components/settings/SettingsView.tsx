import React, { useState } from 'react';
import { useRailway } from '../../context/RailwayContext';
import { saveSupabaseConfig, isSupabaseConfigured } from '../../services/supabaseClient';
import { realtimeSync } from '../../services/realtimeSync';
import {
  Settings,
  Database,
  Cloud,
  RotateCcw,
  CheckCircle2,
  Radio,
  Sliders,
  Terminal,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    activeDivision,
    setActiveDivision,
    resetDemo,
    setIsDemoControlsOpen,
  } = useRailway();

  const [supabaseUrl, setSupabaseUrl] = useState<string>(() => localStorage.getItem('offrails_supabase_url') || localStorage.getItem('railsync_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '');
  const [supabaseKey, setSupabaseKey] = useState<string>(() => localStorage.getItem('offrails_supabase_key') || localStorage.getItem('railsync_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '');
  const [savedMsg, setSavedMsg] = useState<boolean>(false);

  const handleSaveSupabase = (e: React.FormEvent) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl.trim(), supabaseKey.trim());
    realtimeSync.initSupabaseRealtime();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const isConfigured = isSupabaseConfigured();

  return (
    <div className="max-w-4xl space-y-4 text-xs">
      {/* Header */}
      <div className="bg-white border border-slate-300 rounded shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-l-4 border-l-[#0B3B60]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold tracking-wider text-[#0B3B60] uppercase">
              PORTAL CONFIGURATION & CRIS-REALTIME INTEGRATION
            </span>
            <span className="text-[10px] px-2 py-0.2 rounded bg-blue-100 text-blue-900 border border-blue-300 font-mono font-bold">
              SIH 2026 DEPLOYMENT
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans mt-0.5">
            Operations Portal Configuration & Cloud Sync
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Divisional settings, cross-device multi-tab BroadcastChannel, and Supabase cloud event replication.
          </p>
        </div>
      </div>

      {/* Realtime Engine Status */}
      <div className="bg-white border border-slate-300 rounded p-4 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 font-sans uppercase">
                Cross-Device Realtime Synchronization Status
              </h2>
              <div className="text-[11px] text-slate-500">
                Desktop Control Room & Field Mobile synchronization pipeline
              </div>
            </div>
          </div>

          <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono font-bold text-[10px] flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
            <span>DUAL ENGINE ACTIVE</span>
          </span>
        </div>

        {/* Engine Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
          <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5">
            <div className="text-[#0B3B60] font-bold flex items-center space-x-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#0B3B60]" />
              <span>Engine A: BroadcastChannel & LocalStorage</span>
            </div>
            <p className="text-slate-600 font-sans text-xs">
              Instantaneous &lt;5ms local sync across all browser tabs & mobile responsive windows.
            </p>
            <div className="text-emerald-800 text-[10px] font-bold">Status: ONLINE (offrails_events)</div>
          </div>

          <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5">
            <div className="text-purple-800 font-bold flex items-center space-x-1.5">
              <Cloud className="w-3.5 h-3.5 text-purple-700" />
              <span>Engine B: Supabase Realtime WebSocket</span>
            </div>
            <p className="text-slate-600 font-sans text-xs">
              Enables live synchronization over internet between physical mobile phone and projector laptop on Vercel deployment.
            </p>
            <div className={`text-[10px] font-bold ${isConfigured ? 'text-emerald-800' : 'text-amber-800'}`}>
              Status: {isConfigured ? 'CONNECTED & BROADCASTING' : 'STANDBY (Optional keys below)'}
            </div>
          </div>
        </div>

        {/* Supabase Dynamic Configuration Form */}
        <form onSubmit={handleSaveSupabase} className="space-y-3 pt-2">
          <div className="text-xs font-bold text-slate-800 uppercase font-mono">
            Supabase Connection Credentials (Optional for Cross-Network Mobile)
          </div>
          <p className="text-slate-600 text-[11px]">
            Enter your project URL and Anon Key to broadcast actions across different devices over cellular/WiFi.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-mono text-slate-600 uppercase block mb-1 font-bold">
                Supabase Project URL (VITE_SUPABASE_URL)
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono text-xs text-slate-900 focus:outline-none focus:border-[#0B3B60]"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono text-slate-600 uppercase block mb-1 font-bold">
                Supabase Anon Key (VITE_SUPABASE_ANON_KEY)
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded font-mono text-xs text-slate-900 focus:outline-none focus:border-[#0B3B60]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#0B3B60] hover:bg-[#07253d] text-white font-mono font-bold text-xs shadow-sm"
            >
              Save Realtime Credentials
            </button>

            {savedMsg && (
              <span className="text-emerald-800 font-mono text-xs flex items-center space-x-1 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Credentials saved! Realtime channel re-initialized.</span>
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Demo Reset & Data Management */}
      <div className="bg-white border border-slate-300 rounded p-4 space-y-3 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900 font-sans uppercase">
          Demo Presentation Controls & Reset
        </h2>
        <p className="text-slate-600 text-xs">
          Reset all blocks, maintenance tasks, and KPIs to initial SIH 2026 conditions at any point during presentation.
        </p>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={resetDemo}
            className="px-3.5 py-2 rounded bg-red-50 hover:bg-red-100 text-red-900 border border-red-300 font-mono font-bold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo to Initial Planned State</span>
          </button>

          <button
            onClick={() => setIsDemoControlsOpen(true)}
            className="px-3.5 py-2 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold text-xs flex items-center space-x-1.5 transition-colors"
          >
            <Sliders className="w-4 h-4 text-amber-700" />
            <span>Open Demo Control Deck</span>
          </button>
        </div>
      </div>

      {/* Vercel Deployment Instructions */}
      <div className="bg-white border border-slate-300 rounded p-4 space-y-3 shadow-sm text-xs">
        <h2 className="text-sm font-bold text-slate-900 font-sans uppercase flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-[#0B3B60]" />
          <span>Vercel Deployment Guide</span>
        </h2>
        <ol className="list-decimal list-inside space-y-1.5 text-slate-700">
          <li>Push this repository to GitHub.</li>
          <li>Import project in Vercel (<code className="text-[#0B3B60] bg-slate-100 px-1 py-0.5 rounded font-mono">Framework Preset: Vite</code>).</li>
          <li>Deploy. Open the same URL on laptop (Control Room) and smartphone (Field Engineer).</li>
          <li>Tap <strong>START WORK</strong> on mobile → laptop desktop updates live instantaneously!</li>
        </ol>
      </div>
    </div>
  );
};
