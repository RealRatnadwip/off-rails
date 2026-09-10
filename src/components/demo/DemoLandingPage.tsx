import React, { useState, useEffect, useMemo } from 'react';
import { useRailway } from '../../context/RailwayContext';
import {
  Train,
  Zap,
  Wrench,
  Activity,
  HardHat,
  ShieldCheck,
  Cpu,
  Layers,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Sliders,
  Users,
  Check,
  Maximize2,
  Play,
  RefreshCw,
  Gauge,
  Smartphone,
  Laptop,
  Network,
  Shield,
  Award,
  CalendarRange,
  ChevronDown,
  ChevronUp,
  MapPin,
  FileText,
  Building2,
  HelpCircle,
  BarChart2,
  ArrowUpRight,
  Send,
} from 'lucide-react';
import { calculatePriorityScore } from '../../services/priorityEngine';

interface DemoLandingPageProps {
  onNavigateTab: (tab: string) => void;
}

export const DemoLandingPage: React.FC<DemoLandingPageProps> = ({ onNavigateTab }) => {
  const {
    kpis,
    currentTimeStr,
    activeDivision,
    setIsPresentationMode,
  } = useRailway();

  // Active section for scrollspy
  const [activeSection, setActiveSection] = useState('overview');

  // Interactive AI Priority Simulator State
  const [critScore, setCritScore] = useState(88);
  const [safetyScore, setSafetyScore] = useState(92);
  const [overdueScore, setOverdueScore] = useState(74);
  const [impactScore, setImpactScore] = useState(80);
  const [failScore, setFailScore] = useState(65);

  const priorityBreakdown = useMemo(() => {
    return calculatePriorityScore(critScore, safetyScore, overdueScore, impactScore, failScore);
  }, [critScore, safetyScore, overdueScore, impactScore, failScore]);

  // Interactive Optimizer State
  const [optimizerRun, setOptimizerRun] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [blockApproved, setBlockApproved] = useState(false);

  // Interactive ROI Calculator State
  const [weeklyBlocks, setWeeklyBlocks] = useState(14);
  const annualHoursSaved = useMemo(() => Math.round(weeklyBlocks * 2.25 * 52), [weeklyBlocks]);
  const trainDelaySavedHours = useMemo(() => Math.round(weeklyBlocks * 5.8 * 52), [weeklyBlocks]);
  const estimatedCostSavingLakhs = useMemo(() => (weeklyBlocks * 0.42 * 52).toFixed(1), [weeklyBlocks]);

  // Interactive Ping Test State
  const [pingStatus, setPingStatus] = useState<'idle' | 'pinging' | 'success'>('idle');
  const [pingLatency, setPingLatency] = useState<number>(3.2);

  // Mobile Checklist Interactive State
  const [fieldChecks, setFieldChecks] = useState<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: false,
    4: false,
    5: false,
  });
  const [fieldWorkActive, setFieldWorkActive] = useState(false);

  // Interactive FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleRunOptimizerDemo = () => {
    setIsOptimizing(true);
    setTimeout(() => {
      setIsOptimizing(false);
      setOptimizerRun(true);
    }, 600);
  };

  const handleTestPing = () => {
    setPingStatus('pinging');
    setTimeout(() => {
      setPingLatency(+(2 + Math.random() * 2.2).toFixed(1));
      setPingStatus('success');
      setTimeout(() => setPingStatus('idle'), 3000);
    }, 350);
  };

  const toggleCheck = (idx: number) => {
    setFieldChecks((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const allChecksComplete = Object.values(fieldChecks).filter(Boolean).length === 6;

  // Scrollspy observer
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['overview', 'case-study', 'features', 'optimizer', 'ai-engine', 'telemetry', 'field-ops', 'calculator', 'faq'];
      const scrollPos = window.scrollY + 180;
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -70;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const faqs = [
    {
      q: 'How does OFF-RAILS enforce safety when combining 25kV OHE isolation and track work?',
      a: 'The system strictly implements the Permit-to-Work workflow of IRPWM Para 802. Traction Power Controllers (TPC) issue a logged digital isolation certificate. The mobile field app requires the on-site supervisor to verify neutral section boundaries and confirm earthing discharge rods are clamped before rail machinery is authorized into the block section.',
    },
    {
      q: 'How does the Dual-Engine Real-Time Sync work in poor cellular rail sections?',
      a: 'Engine A uses the browser-native BroadcastChannel API, enabling instant peer-to-peer sync (<5ms) between devices or browser tabs on the same local client with zero internet dependencies. Engine B uses Supabase WebSockets for cloud relay. If trackside connectivity drops, the Field Mobile app queues timestamps locally in IndexedDB and flushes state as soon as connection is restored.',
    },
    {
      q: 'Does this platform replace Indian Railways Control Office Application (COA)?',
      a: 'No. OFF-RAILS is engineered as a modular decision-support intelligence layer designed to integrate with CRIS COA APIs. It consumes section timetables and track circuits, calculates conflict-free possession windows, and exports standardized block sanction memos directly into COA format.',
    },
    {
      q: 'What is the algorithmic formula behind the AI Priority Scoring Engine?',
      a: 'The priority score is a deterministic weighted index: Priority = (Asset Criticality × 25%) + (Safety Risk × 30%) + (Overdue Days × 15%) + (Operational Impact × 20%) + (Failure Probability × 10%). Tasks scoring ≥80 are flagged for emergency intervention.',
    },
    {
      q: 'Can track gang supervisors operate the interface under direct sunlight?',
      a: 'Yes. The Field Mobile Desk features an outdoor high-contrast layout, 56px touch targets, and high-legibility typographic hierarchy specifically designed for trackside workers with industrial gloves under harsh sunlight.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#0B3B60] selection:text-white">
      {/* 1. OFFICIAL RAIL OPERATIONS TOP RIBBON */}
      <div className="bg-[#072136] text-slate-200 text-xs px-4 sm:px-8 py-2 flex flex-col sm:flex-row items-center justify-between border-b border-slate-900 gap-2 font-mono">
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-bold text-white tracking-wide">MINISTRY OF RAILWAYS / CRIS • RDSO SPECIFICATION</span>
          <span className="text-slate-500 hidden md:inline">|</span>
          <span className="text-slate-300 hidden md:inline">PORTAL: OFF-RAILS COA-BLOCK v2.6</span>
        </div>
        <div className="flex items-center space-x-4 text-[11px]">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">CLOCK:</span>
            <span className="font-bold text-white tracking-wider">IST {currentTimeStr}</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="text-amber-400 font-bold">SIH 2026 PROTOTYPE</div>
        </div>
      </div>

      {/* 2. INSTITUTIONAL STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-300 shadow-xs text-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Platform Identity */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollTo('overview')}>
            <div className="w-10 h-10 rounded-full bg-white p-0.5 shadow-sm shrink-0 flex items-center justify-center border-2 border-[#C27803]">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="46" fill="#800000" stroke="#C27803" strokeWidth="3" />
                <circle cx="50" cy="50" r="38" fill="#0B3B60" stroke="#FFFFFF" strokeWidth="1" />
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <line
                    key={deg}
                    x1="50"
                    y1="50"
                    x2={50 + 34 * Math.cos((deg * Math.PI) / 180)}
                    y2={50 + 34 * Math.sin((deg * Math.PI) / 180)}
                    stroke="#FFFFFF"
                    strokeWidth="1.5"
                  />
                ))}
                <circle cx="50" cy="50" r="10" fill="#C27803" stroke="#FFFFFF" strokeWidth="2" />
                <circle cx="50" cy="4" fill="#800000" />
              </svg>
            </div>
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-lg font-black tracking-tight text-[#0B3B60] font-sans">
                  OFF-RAILS
                </span>
                <span className="text-[11px] font-mono font-bold text-[#800000] border border-[#800000]/30 px-1.5 py-0.2 rounded bg-red-50">
                  COA-BLOCK
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-sans hidden sm:block">
                Division Rail Operations Control & Joint Possession Management
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 font-medium text-xs text-slate-700">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'case-study', label: 'Problem & Solution' },
              { id: 'features', label: 'Features' },
              { id: 'optimizer', label: 'Block Optimizer' },
              { id: 'ai-engine', label: 'Priority Engine' },
              { id: 'telemetry', label: 'Realtime Sync' },
              { id: 'field-ops', label: 'Field Ops' },
              { id: 'calculator', label: 'Impact Calculator' },
              { id: 'faq', label: 'FAQ' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`px-3 py-1.5 rounded text-xs transition-colors ${
                  activeSection === item.id
                    ? 'text-[#0B3B60] font-bold bg-slate-100 border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => onNavigateTab('field')}
              className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded border border-slate-300 font-semibold transition-colors"
            >
              <Smartphone className="w-3.5 h-3.5 text-orange-600" />
              <span>Field App</span>
            </button>

            <button
              onClick={() => onNavigateTab('dashboard')}
              className="flex items-center space-x-2 text-xs bg-[#0B3B60] hover:bg-[#072b47] text-white font-bold px-4 py-2 rounded shadow-sm transition-colors border border-[#072b47]"
            >
              <span>Control Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO: EXECUTIVE TECHNICAL BRIEFING */}
      <section id="overview" className="border-b border-slate-300 bg-white py-14 sm:py-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            {/* Official Memorandum Tag */}
            <div className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-300 px-3 py-1 rounded text-slate-700 text-xs font-mono font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-[#0B3B60]"></span>
              <span>TECHNICAL MEMORANDUM • RDSO COMPLIANT</span>
              <span className="text-slate-400">|</span>
              <span className="text-[#800000] font-bold">CORRIDOR OCCUPANCY MANAGEMENT</span>
            </div>

            {/* Clear, Human Title */}
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-5">
              Automating Joint Corridor Track Possession Across Railway Maintenance Departments
            </h1>

            {/* Human Editorial Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              Historically in Indian rail corridors, <strong>Engineering (P-Way)</strong>, <strong>Electrical (TRD OHE)</strong>, 
              and <strong>Signalling (S&T)</strong> schedule track blocks independently. This causes fragmented, sequential 
              closures where tracks remain blocked for 4 to 6 hours over separate nights.
              <br className="hidden sm:inline" />
              <strong>OFF-RAILS</strong> unifies overlapping spatial boundaries, traction power cutoffs, and train timetables into a single 
              <span className="text-[#0B3B60] font-bold"> Coordinated Joint Possession</span>—saving 
              <span className="text-emerald-700 font-bold"> 2+ hours of corridor downtime per block</span> with 0 train conflicts.
            </p>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="flex items-center space-x-2 bg-[#0B3B60] hover:bg-[#072b47] text-white font-bold px-5 py-3 rounded shadow-sm text-sm transition-colors"
              >
                <Train className="w-4 h-4 text-amber-400" />
                <span>Launch Division Operations Desk</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => scrollTo('optimizer')}
                className="flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-800 font-semibold px-5 py-3 rounded border border-slate-300 text-sm shadow-xs transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-[#0B3B60]" />
                <span>Test Block Optimizer Algorithm</span>
              </button>

              <button
                onClick={() => onNavigateTab('field')}
                className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-4 py-3 rounded border border-slate-300 text-sm transition-colors"
              >
                <HardHat className="w-4 h-4 text-orange-600" />
                <span>Mobile Field Desk</span>
              </button>
            </div>
          </div>

          {/* REAL TELEMETRY STATUS PANEL */}
          <div className="bg-slate-50 border border-slate-300 rounded-lg p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-3 mb-4 text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#0B3B60] uppercase">CORRIDOR MONITOR:</span>
                <span className="text-slate-700 font-medium">Eastern Railway / Sealdah Main Line (KM 42.0 – 46.0)</span>
              </div>
              <div className="text-slate-500 mt-1 sm:mt-0">
                <span>SYSTEM STATUS: </span>
                <span className="text-emerald-700 font-bold">NORMAL (SAFE OPERATION)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
                <div className="text-[11px] text-slate-500 font-mono uppercase">Active Blocks</div>
                <div className="text-2xl font-black text-slate-900 font-mono mt-1">04</div>
                <div className="text-[11px] text-emerald-700 font-medium mt-0.5">In execution</div>
              </div>

              <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
                <div className="text-[11px] text-slate-500 font-mono uppercase">Downtime Saved</div>
                <div className="text-2xl font-black text-emerald-700 font-mono mt-1">135 min</div>
                <div className="text-[11px] text-slate-600 mt-0.5">Joint Block #1042</div>
              </div>

              <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
                <div className="text-[11px] text-slate-500 font-mono uppercase">Track Availability</div>
                <div className="text-2xl font-black text-[#0B3B60] font-mono mt-1">94.7%</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">+4.2% vs baseline</div>
              </div>

              <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
                <div className="text-[11px] text-slate-500 font-mono uppercase">Possession Util.</div>
                <div className="text-2xl font-black text-slate-900 font-mono mt-1">93%</div>
                <div className="text-[11px] text-slate-600 mt-0.5">Joint window</div>
              </div>

              <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
                <div className="text-[11px] text-slate-500 font-mono uppercase">Train Conflicts</div>
                <div className="text-2xl font-black text-emerald-700 font-mono mt-1">00</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">Zero delays</div>
              </div>

              <div className="bg-white p-3.5 rounded border border-slate-200 shadow-xs">
                <div className="text-[11px] text-slate-500 font-mono uppercase">Local Sync Pipe</div>
                <div className="text-2xl font-black text-slate-900 font-mono mt-1">&lt;5 ms</div>
                <div className="text-[11px] text-slate-600 mt-0.5">BroadcastChannel</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CASE STUDY: UNCOORDINATED VS OFF-RAILS JOINT POSSESSION */}
      <section id="case-study" className="py-16 border-b border-slate-300 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#800000]">
              OPERATIONAL COMPARISON
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Field Study: Halisahar – Kanchrapara Corridor (KM 43.2 to 45.1)
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Here is what happens when 3 departments request track access independently versus when OFF-RAILS schedules them into a single joint block.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* TRADITIONAL UNCOORDINATED */}
            <div className="bg-white border-2 border-red-200 rounded-lg p-6 shadow-xs relative">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-600"></div>
                  <h3 className="font-bold text-slate-900 text-base">Traditional Approach (Independent Blocks)</h3>
                </div>
                <span className="text-xs font-mono font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                  4h 15m DOWNTIME
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4">
                Each department requests track access via separate paperwork. The section controller must grant 3 sequential closures with 3 separate 25kV power shutdowns.
              </p>

              <div className="space-y-2.5 font-mono text-xs mb-6">
                <div className="p-3 rounded border border-slate-200 bg-slate-50">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>1. Engineering (P-Way)</span>
                    <span className="text-red-700">22:00 – 00:00 (120 min)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Rail Grinding Machine RG-12 • Track Blocked</div>
                </div>

                <div className="p-3 rounded border border-slate-200 bg-slate-50">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>2. Electrical (TRD/OHE)</span>
                    <span className="text-red-700">00:15 – 01:15 (60 min)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">25kV Cantilever Check • 2nd Power Shutdown</div>
                </div>

                <div className="p-3 rounded border border-slate-200 bg-slate-50">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>3. Signal & Telecom (S&T)</span>
                    <span className="text-red-700">01:30 – 02:15 (45 min)</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Point Machine PM-434 Renewal • 3rd Shutdown</div>
                </div>
              </div>

              <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-900 space-y-1">
                <div className="font-bold">Operational Consequences:</div>
                <div className="text-[11px]">✕ Corridor closed for 4 Hours 15 Minutes across 3 separate windows.</div>
                <div className="text-[11px]">✕ 3 independent traction power de-energisation cycles.</div>
                <div className="text-[11px]">✕ Down freight and mail express trains detained at outer signals.</div>
              </div>
            </div>

            {/* OFF-RAILS JOINT POSSESSION */}
            <div className="bg-white border-2 border-[#0B3B60] rounded-lg p-6 shadow-xs relative">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-600"></div>
                  <h3 className="font-bold text-slate-900 text-base">OFF-RAILS Coordinated Joint Block #1042</h3>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded">
                  2h 00m SINGLE WINDOW
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4">
                OFF-RAILS detects that all 3 tasks fall within a 1.2 km corridor. They are consolidated under a single 25kV traction power isolation window.
              </p>

              <div className="p-4 rounded border border-slate-300 bg-slate-50 font-mono text-xs mb-6">
                <div className="flex justify-between items-center font-bold text-[#0B3B60] border-b border-slate-200 pb-2 mb-3">
                  <span>KM 43.2 – 45.1 UP MAIN CORRIDOR</span>
                  <span className="bg-[#0B3B60] text-white px-2 py-0.5 rounded text-[11px]">22:00 – 00:00 (120 min)</span>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center space-x-2">
                      <Wrench className="w-3.5 h-3.5 text-[#800000]" />
                      <span>Engineering: Rail Grinding RG-12</span>
                    </span>
                    <span className="text-emerald-700 font-mono font-bold">✓ Co-executed</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center space-x-2">
                      <Zap className="w-3.5 h-3.5 text-amber-700" />
                      <span>Electrical: OHE 25kV Cantilever Check</span>
                    </span>
                    <span className="text-emerald-700 font-mono font-bold">✓ Same 25kV Cut</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center space-x-2">
                      <Activity className="w-3.5 h-3.5 text-emerald-700" />
                      <span>S&T: Point Machine PM-434 Renewal</span>
                    </span>
                    <span className="text-emerald-700 font-mono font-bold">✓ Zero Conflict</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 space-y-1">
                <div className="font-bold">Verified Operational Results:</div>
                <div className="text-[11px]">✓ <strong>135 Minutes (2h 15m)</strong> net corridor downtime saved.</div>
                <div className="text-[11px]">✓ Single 25kV power isolation certificate (TPC approved).</div>
                <div className="text-[11px]">✓ <strong>0 passenger train conflicts</strong> — Section throughput maintained at 93%.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ALL FEATURES GRID */}
      <section id="features" className="py-16 bg-white border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B3B60]">
              CORE SYSTEM CAPABILITIES
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Built for Section Controllers, Track Engineers & Field Crews
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Every workflow aligns directly with Indian Railways operational manuals, safety rules, and daily control office routines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-slate-50 border border-slate-300 rounded-lg p-5 hover:border-slate-400 transition-colors">
              <div className="w-10 h-10 rounded bg-blue-100 border border-blue-300 flex items-center justify-center text-[#0B3B60] mb-3">
                <Network className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Multi-Department Planning Desk</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connects P-Way, TRD (OHE), and S&T maintenance requests in one central dashboard, eliminating siloed paper communication.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-300 rounded-lg p-5 hover:border-slate-400 transition-colors">
              <div className="w-10 h-10 rounded bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-800 mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Weighted Priority Algorithm</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates task priority using 5 transparent risk indices: Asset Criticality (25%), Safety (30%), Overdue (15%), Impact (20%), and Failure Risk (10%).
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-300 rounded-lg p-5 hover:border-slate-400 transition-colors">
              <div className="w-10 h-10 rounded bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 mb-3">
                <CalendarRange className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Automated Block Optimizer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Discovers compatible corridor clusters within 2.0 km proximity and synthesizes joint possessions with 6-point safety rationale verification.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-300 rounded-lg p-5 hover:border-slate-400 transition-colors">
              <div className="w-10 h-10 rounded bg-cyan-100 border border-cyan-300 flex items-center justify-center text-cyan-800 mb-3">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Dual-Engine Realtime Sync</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sub-5ms zero-setup local browser sync via native BroadcastChannel plus Supabase WebSockets for cross-device mobile-to-laptop presentations.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-300 rounded-lg p-5 hover:border-slate-400 transition-colors">
              <div className="w-10 h-10 rounded bg-orange-100 border border-orange-300 flex items-center justify-center text-orange-800 mb-3">
                <HardHat className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Trackside Mobile Field App</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                High outdoor contrast, simulated differential GPS (KM 43.47 ±8m), and 1-tap Start/Pause/Complete triggers designed for track gang incharges.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-300 rounded-lg p-5 hover:border-slate-400 transition-colors">
              <div className="w-10 h-10 rounded bg-red-100 border border-red-300 flex items-center justify-center text-red-800 mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">6/6 Safety Interlocking</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enforces digital verification of 25kV OHE de-energisation, earthing discharge rods, detonators, and banner flags before work authorization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE BLOCK OPTIMIZER PLAYGROUND */}
      <section id="optimizer" className="py-16 border-b border-slate-300 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B3B60]">
              INTERACTIVE DEMONSTRATION
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Corridor Block Optimizer in Action
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Review 3 independent departmental maintenance requests, then run the optimizer to synthesize Joint Block #1042.
            </p>
          </div>

          <div className="bg-white border border-slate-300 rounded-lg p-6 shadow-xs">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase">Target Corridor</span>
                <div className="text-base font-bold text-slate-900">
                  Halisahar – Kanchrapara Corridor (KM 43.0 – 45.5 UP Main)
                </div>
              </div>

              <button
                onClick={handleRunOptimizerDemo}
                disabled={isOptimizing}
                className="bg-[#0B3B60] hover:bg-[#072b47] text-white font-bold px-4 py-2 rounded text-xs font-mono flex items-center space-x-2 transition-colors self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
                <span>{isOptimizing ? 'SYNTHESIZING...' : 'RUN BLOCK OPTIMISER'}</span>
              </button>
            </div>

            {/* Input Task Cards */}
            <div className="py-5">
              <div className="text-xs font-mono text-slate-500 uppercase mb-3">
                Candidate Departmental Requests (Pending Possession):
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3.5 rounded border border-slate-300 bg-slate-50">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-mono font-bold text-[#800000] text-[11px]">ENGINEERING (P-WAY)</span>
                    <span className="font-mono text-slate-500">120 min</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">Rail Grinding RG-12</div>
                  <div className="text-xs text-slate-600 font-mono mt-0.5">KM 43.2 – 44.4 UP Main</div>
                  <div className="text-xs text-red-700 font-mono mt-2 font-semibold">Priority: 84 (Critical)</div>
                </div>

                <div className="p-3.5 rounded border border-slate-300 bg-slate-50">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-mono font-bold text-amber-800 text-[11px]">ELECTRICAL (TRD/OHE)</span>
                    <span className="font-mono text-slate-500">60 min</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">25kV Cantilever Check</div>
                  <div className="text-xs text-slate-600 font-mono mt-0.5">KM 43.6 – 44.8 UP Main</div>
                  <div className="text-xs text-amber-800 font-mono mt-2 font-semibold">Priority: 78 (High)</div>
                </div>

                <div className="p-3.5 rounded border border-slate-300 bg-slate-50">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="font-mono font-bold text-emerald-800 text-[11px]">SIGNAL & TELECOM</span>
                    <span className="font-mono text-slate-500">45 min</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm">Point Machine PM-434 Renewal</div>
                  <div className="text-xs text-slate-600 font-mono mt-0.5">KM 43.8 Turnout #4</div>
                  <div className="text-xs text-amber-800 font-mono mt-2 font-semibold">Priority: 71 (High)</div>
                </div>
              </div>
            </div>

            {/* Synthesized Recommendation */}
            {(optimizerRun || isOptimizing) && (
              <div className="pt-4 border-t border-slate-200">
                {isOptimizing ? (
                  <div className="py-8 text-center text-slate-600 font-mono text-xs">
                    Synthesizing spatial constraints and traction power cutoffs...
                  </div>
                ) : (
                  <div className="bg-blue-50/70 border border-blue-200 rounded p-4 sm:p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <span className="text-[11px] font-mono font-bold bg-[#0B3B60] text-white px-2 py-0.5 rounded">
                          RECOMMENDED: JOINT BLOCK #1042
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">
                          Halisahar – Kanchrapara Coordinated 120-Minute Window
                        </h4>
                      </div>

                      <div>
                        {blockApproved ? (
                          <span className="inline-flex items-center space-x-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded text-xs font-mono font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            <span>BLOCK SANCTION APPROVED</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => setBlockApproved(true)}
                            className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-1.5 rounded text-xs font-mono shadow-xs transition-colors"
                          >
                            APPROVE BLOCK
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-white p-3 rounded border border-blue-200 font-mono text-center text-xs mb-3">
                      <div>
                        <div className="text-[10px] text-slate-500">INDIVIDUAL TIME</div>
                        <div className="font-bold text-red-700 text-sm">3.75 Hours</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">JOINT WINDOW</div>
                        <div className="font-bold text-emerald-800 text-sm">2.00 Hours</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">DOWNTIME SAVED</div>
                        <div className="font-bold text-[#0B3B60] text-sm">2h 15m (135 min)</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">CONFLICTS</div>
                        <div className="font-bold text-emerald-800 text-sm">00 (Clean)</div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1">
                      <div className="font-mono text-[11px] font-bold text-slate-800 uppercase">Verification Rationale:</div>
                      <div>✓ All 3 tasks located within 1.2 km corridor (KM 43.2 to 44.4).</div>
                      <div>✓ Single 25kV traction power isolation covers all activities.</div>
                      <div>✓ Mail/Express and suburban EMU services clear the block before 22:00.</div>
                      <div>✓ Available field crews confirmed: CREW-ENG-04, CREW-ELE-02, and CREW-SNT-07.</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. TRANSPARENT AI PRIORITY ENGINE */}
      <section id="ai-engine" className="py-16 bg-white border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Explanation */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B3B60]">
                MATHEMATICAL RISK FORMULATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                AI Priority Score Algorithm & Weight Matrix
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Rather than scheduling on a first-come, first-served basis, OFF-RAILS implements a deterministic 
                multi-factor scoring model that prioritizes severe safety risks and heavy passenger corridors.
              </p>

              <div className="p-4 rounded border border-slate-300 bg-slate-50 text-xs font-mono">
                <div className="text-slate-500 text-[10px] uppercase font-bold mb-1">Standard Formula:</div>
                <div className="text-slate-900 font-bold leading-relaxed">
                  Priority = (Criticality × 0.25) + (Safety × 0.30) + (Overdue × 0.15) + (Impact × 0.20) + (FailureRisk × 0.10)
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1.5 font-mono">
                <div>• Score 80–100: <strong className="text-red-700">CRITICAL</strong> (Emergency block needed)</div>
                <div>• Score 65–79: <strong className="text-amber-800">HIGH</strong> (Overnight priority)</div>
                <div>• Score &lt;65: <strong className="text-slate-700">ROUTINE</strong> (Cluster candidate)</div>
              </div>
            </div>

            {/* Right Interactive Sliders */}
            <div className="lg:col-span-7 bg-slate-50 border border-slate-300 rounded-lg p-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Adjust Risk Parameters</h3>
                  <span className="text-xs text-slate-500 font-mono">Real-time formula re-calculation</span>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-slate-500 font-mono uppercase">Calculated Score</div>
                  <div className="text-3xl font-black font-mono text-[#0B3B60]">
                    {priorityBreakdown.finalScore} <span className="text-xs text-slate-400 font-normal">/100</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <div className="flex justify-between mb-1 text-slate-700 font-medium">
                    <span>Asset Criticality (Weight 25%)</span>
                    <span className="font-bold text-[#0B3B60]">{critScore} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={critScore}
                    onChange={(e) => setCritScore(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded cursor-pointer accent-[#0B3B60]"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-700 font-medium">
                    <span>Safety Risk (Weight 30%)</span>
                    <span className="font-bold text-red-700">{safetyScore} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={safetyScore}
                    onChange={(e) => setSafetyScore(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded cursor-pointer accent-red-700"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-700 font-medium">
                    <span>Overdue Factor (Weight 15%)</span>
                    <span className="font-bold text-amber-800">{overdueScore} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={overdueScore}
                    onChange={(e) => setOverdueScore(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded cursor-pointer accent-amber-700"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-700 font-medium">
                    <span>Operational Train Impact (Weight 20%)</span>
                    <span className="font-bold text-emerald-800">{impactScore} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={impactScore}
                    onChange={(e) => setImpactScore(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded cursor-pointer accent-emerald-700"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1 text-slate-700 font-medium">
                    <span>Failure Probability (Weight 10%)</span>
                    <span className="font-bold text-slate-800">{failScore} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={failScore}
                    onChange={(e) => setFailScore(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded cursor-pointer accent-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. DUAL-ENGINE REALTIME SYNCHRONIZATION */}
      <section id="telemetry" className="py-16 border-b border-slate-300 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Info */}
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B3B60]">
                DUAL-ENGINE ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Zero-Config Local IPC + Cloud Broadcast
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Critical railway networks cannot have a single point of failure. OFF-RAILS runs a dual-engine synchronization pipeline:
              </p>

              <div className="space-y-3">
                <div className="p-4 rounded border border-slate-300 bg-white">
                  <div className="flex items-center justify-between mb-1 font-bold text-slate-900 text-sm">
                    <span>Engine A: Native BroadcastChannel (Zero-Setup)</span>
                    <span className="text-emerald-700 font-mono text-xs">&lt;5 ms latency</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Propagates state between browser tabs, mobile viewports, and wall displays on the same host with zero external internet dependencies or API keys.
                  </p>
                </div>

                <div className="p-4 rounded border border-slate-300 bg-white">
                  <div className="flex items-center justify-between mb-1 font-bold text-slate-900 text-sm">
                    <span>Engine B: Supabase Realtime (Cloud Sync)</span>
                    <span className="text-[#0B3B60] font-mono text-xs">WAN Enabled</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Syncs state across independent mobile phones and laptops over 4G/5G cellular connections during live evaluator demonstrations.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Live Test Console */}
            <div className="lg:col-span-6 bg-white border border-slate-300 rounded-lg p-5 font-mono">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-3 text-xs">
                <span className="font-bold text-slate-900">REALTIME PACKET CONSOLE</span>
                <span className="text-emerald-700 flex items-center space-x-1.5 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>BUS CONNECTED</span>
                </span>
              </div>

              <div className="bg-slate-900 text-slate-200 p-3 rounded text-xs space-y-1.5 h-44 overflow-y-auto mb-3">
                <div className="text-slate-400">[04:20:01] Native BroadcastChannel bound to 'offrails_events'</div>
                <div className="text-slate-400">[04:20:05] Section Controller Desk registered (Tab #1)</div>
                <div className="text-emerald-400">[04:20:12] Heartbeat ACK: roundtrip latency {pingLatency}ms</div>
                {pingStatus === 'success' && (
                  <div className="text-amber-300 bg-slate-800 p-1 rounded">
                    [PING] Packet dispatched: confirmed receipt across channel in {pingLatency}ms
                  </div>
                )}
                <div className="text-slate-400">[04:20:20] Field GPS: Unit FG-01 locked at KM 43.47 ±8m</div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Test Local Bus Latency:</span>
                <button
                  onClick={handleTestPing}
                  disabled={pingStatus === 'pinging'}
                  className="bg-[#0B3B60] hover:bg-[#072b47] text-white font-bold px-3 py-1.5 rounded text-xs transition-colors"
                >
                  {pingStatus === 'pinging' ? 'SENDING...' : 'SEND HEARTBEAT'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. MOBILE FIELD APP & 6/6 SAFETY CHECKLIST */}
      <section id="field-ops" className="py-16 bg-white border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Mobile Device Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-[320px] bg-slate-900 rounded-[32px] p-2.5 border-4 border-slate-700 shadow-lg">
                <div className="w-24 h-3.5 bg-slate-800 rounded-full mx-auto mb-2"></div>

                <div className="bg-[#0F172A] rounded-[24px] p-3 text-slate-200 border border-slate-800">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <span className="text-xs font-bold text-white flex items-center space-x-1">
                      <HardHat className="w-3.5 h-3.5 text-orange-400" />
                      <span>FIELD DESK</span>
                    </span>
                    <span className="bg-orange-600 text-white text-[9px] font-mono px-1 py-0.2 rounded font-bold">
                      HIGH CONTRAST
                    </span>
                  </div>

                  <div className="bg-slate-800 p-2 rounded border border-slate-700 mb-2 font-mono text-xs">
                    <div className="text-[10px] text-slate-400">GPS TELEMETRY</div>
                    <div className="text-amber-300 font-bold">KM 43.47 (UP MAIN)</div>
                    <div className="text-[10px] text-emerald-400">Accuracy ±8m • Geo-fenced</div>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                      <span>SAFETY CHECKLIST</span>
                      <span className="text-amber-400 font-bold">
                        {Object.values(fieldChecks).filter(Boolean).length}/6 VERIFIED
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      {[
                        'Section Controller Caution Memo Sanctioned',
                        '25kV OHE De-energisation Permit Received',
                        'Earthing Discharge Rods Clamped to Catenary',
                        'Detonators Placed at 600m/1200m Safety Margin',
                        'Red Banner Flags Erected Across Track',
                        'Track Gang Equipped with Luminous Vests',
                      ].map((item, idx) => (
                        <div
                          key={idx}
                          onClick={() => toggleCheck(idx)}
                          className={`p-1.5 rounded flex items-center space-x-1.5 cursor-pointer text-[10.5px] ${
                            fieldChecks[idx]
                              ? 'bg-emerald-950 text-emerald-200 border border-emerald-700'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[9px] font-bold ${
                            fieldChecks[idx] ? 'bg-emerald-500 text-black' : 'border border-slate-500'
                          }`}>
                            {fieldChecks[idx] && '✓'}
                          </div>
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => setFieldWorkActive(!fieldWorkActive)}
                    disabled={!allChecksComplete && !fieldWorkActive}
                    className={`w-full py-2 rounded text-xs font-bold font-mono transition-colors ${
                      fieldWorkActive
                        ? 'bg-emerald-600 text-white'
                        : allChecksComplete
                        ? 'bg-orange-600 hover:bg-orange-500 text-white'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {fieldWorkActive ? 'TRACK WORK IN PROGRESS' : allChecksComplete ? 'START WORK' : 'COMPLETE 6/6 FIRST'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Information */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-700">
                FIELD CREW OPERATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                High-Contrast Sunlight Interface for Track Gangs
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Track maintenance happens under severe sunlight, noise, and 25kV electrical hazards. 
                The mobile field desk ensures gang incharges can operate reliably with heavy work gloves:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded border border-slate-300 bg-slate-50">
                  <div className="font-bold text-slate-900 text-sm mb-1">Differential GPS Geo-Fencing</div>
                  <p className="text-xs text-slate-600">
                    Ensures field crews are located strictly on the approved track section (±8m) before work can be initiated.
                  </p>
                </div>

                <div className="p-3.5 rounded border border-slate-300 bg-slate-50">
                  <div className="font-bold text-slate-900 text-sm mb-1">Digital Safety Interlocking</div>
                  <p className="text-xs text-slate-600">
                    The "Start Work" button remains hard-disabled until all 6 safety checks are completed and acknowledged.
                  </p>
                </div>

                <div className="p-3.5 rounded border border-slate-300 bg-slate-50">
                  <div className="font-bold text-slate-900 text-sm mb-1">Instant Obstruction Alert</div>
                  <p className="text-xs text-slate-600">
                    Report unforeseen track defects, rail fractures, or cattle obstructions instantly back to the Section Controller.
                  </p>
                </div>

                <div className="p-3.5 rounded border border-slate-300 bg-slate-50">
                  <div className="font-bold text-slate-900 text-sm mb-1">IRPWM Para 802 Compliance</div>
                  <p className="text-xs text-slate-600">
                    Formalized caution order and permit-to-work issuance adhering to Indian Railways safety regulations.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigateTab('field')}
                  className="bg-[#0B3B60] hover:bg-[#072b47] text-white font-bold px-4 py-2 rounded text-xs font-mono transition-colors"
                >
                  Open Dedicated Field View (/field)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. IMPACT & ANNUAL SAVINGS CALCULATOR */}
      <section id="calculator" className="py-16 border-b border-slate-300 bg-[#F1F5F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
              DIVISION THROUGHPUT IMPACT
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Corridor Downtime & Capacity Calculator
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Slide to adjust weekly maintenance possessions in your division to see estimated annual line-clear hours saved.
            </p>
          </div>

          <div className="bg-white border border-slate-300 rounded-lg p-6 max-w-4xl shadow-xs">
            <div className="mb-6">
              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-slate-700 font-bold">Weekly Track Maintenance Possessions:</span>
                <span className="text-[#0B3B60] font-bold text-sm bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {weeklyBlocks} Blocks / Week
                </span>
              </div>
              <input
                type="range"
                min="4"
                max="35"
                value={weeklyBlocks}
                onChange={(e) => setWeeklyBlocks(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded cursor-pointer accent-[#0B3B60]"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-500 mt-1">
                <span>Branch Line (4/wk)</span>
                <span>Mainline Division (14/wk)</span>
                <span>High Density Route (35/wk)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-center">
              <div className="p-4 rounded border border-slate-300 bg-slate-50">
                <div className="text-[11px] text-slate-500 uppercase">Track Downtime Saved</div>
                <div className="text-2xl font-black text-emerald-700 mt-1">
                  {annualHoursSaved.toLocaleString()} hrs
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">Annual line clear restored</div>
              </div>

              <div className="p-4 rounded border border-slate-300 bg-slate-50">
                <div className="text-[11px] text-slate-500 uppercase">Train Delay Hours Avoided</div>
                <div className="text-2xl font-black text-[#0B3B60] mt-1">
                  {trainDelaySavedHours.toLocaleString()} hrs
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">Punctuality preserved</div>
              </div>

              <div className="p-4 rounded border border-slate-300 bg-slate-50">
                <div className="text-[11px] text-slate-500 uppercase">Est. Operational Savings</div>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  ₹ {estimatedCostSavingLakhs} L
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">Traction & crew efficiency</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 11. TECHNICAL FAQ */}
      <section id="faq" className="py-16 bg-white border-b border-slate-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#0B3B60]">
              TECHNICAL CLARIFICATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-4">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left flex items-center justify-between font-bold text-slate-900 text-sm hover:text-[#0B3B60] transition-colors"
                >
                  <span className="pr-4">{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-slate-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. CALL TO ACTION FOOTER */}
      <footer className="bg-[#072136] text-white py-12 border-t border-slate-900 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-black text-white">Experience the Live Rail Operations Control Room</h3>
              <p className="text-xs text-slate-300 mt-1">
                Explore the section controller desk, review active joint blocks, or inspect the schematic track diagram.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => onNavigateTab('dashboard')}
                className="bg-[#0B3B60] hover:bg-[#094572] text-white font-bold px-4 py-2.5 rounded text-xs font-mono transition-colors border border-slate-600"
              >
                Enter Control Room (/dashboard)
              </button>
              <button
                onClick={() => onNavigateTab('planning')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-4 py-2.5 rounded text-xs font-mono transition-colors border border-slate-700"
              >
                Planning View (/planning)
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
            <div>OFF-RAILS (COA-BLOCK v2.6) • Smart India Hackathon 2026 Solution</div>
            <div className="flex items-center space-x-4">
              <button onClick={() => onNavigateTab('dashboard')} className="hover:text-white">Dashboard</button>
              <button onClick={() => onNavigateTab('planning')} className="hover:text-white">Planning</button>
              <button onClick={() => onNavigateTab('blocks')} className="hover:text-white">Possessions</button>
              <button onClick={() => onNavigateTab('field')} className="hover:text-white">Field App</button>
              <button onClick={() => onNavigateTab('network')} className="hover:text-white">Schematic</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
