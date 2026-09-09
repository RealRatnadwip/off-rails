# OFF-RAILS | Division Rail Operations Control & Joint Possession Management

> **SIH 2026 Hackathon Prototype**  
> **Automated Corridor Possession Planning & Multi-Department Railway Maintenance Coordination Platform**

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase Realtime](https://img.shields.io/badge/Supabase-Realtime%20Ready-emerald.svg)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)

---

## 🚆 Product Concept

**OFF-RAILS** coordinates critical railway maintenance activities across four operational departments:
1. **Engineering (P-Way)** — Rail grinding, track tamping, weld renewal, sleeper replacement
2. **Electrical / OHE (TRD)** — 25kV traction line inspection, neutral section adjustments, cantilever alignment
3. **Signal & Telecommunications (S&T)** — Point machines, electronic interlocking, axle counters, track circuits
4. **Operations / Control** — Train movement regulation, line clear authorizations, traffic block issuance

### The Core Problem Solved
Historically in heavy rail corridors, departments request track possession independently. This leads to sequential closures where the track remains blocked for 4 to 6 hours over separate nights.

### The OFF-RAILS Solution
OFF-RAILS analyzes overlapping spatial constraints, traction power isolation boundaries, and passenger train paths to synthesize **Joint Possession Blocks**.

```
TRADITIONAL UNCOORDINATED BLOCKS:
Block 1042: Engineering  (22:00 – 00:00) ── 2h 00m
Block 1043: Electrical   (00:15 – 01:15) ── 1h 00m
Block 1044: S&T          (01:30 – 02:15) ── 0h 45m
--------------------------------------------------
Total Corridor Disruption: 4h 15m (3 power shutdowns)

OFF-RAILS COORDINATED JOINT BLOCK #1042:
Corridor: KM 43.2 – 45.1 (Halisahar – Kanchrapara)
Window:   22:00 – 00:00 (120 Minutes Single Possession)
Engineering: Rail Grinding (RG-12)      ✓ IN PROGRESS
Electrical:  OHE 25kV Cantilever Check   ✓ COMPLETED
S&T:         Point Machine PM-434        ✓ READY
--------------------------------------------------
CORRIDOR DOWNTIME SAVED: 2 Hours 15 Minutes (135 min)
TRAIN CONFLICTS: 0 | POSSESSION UTILISATION: 93%
```

---

## 🖥️ System Architecture & Interfaces

- **Desktop Interface**: Division Operations Control Room
  - Dense telemetry, 6 real-time KPIs, interactive schematic track diagram, block approvals desk, train conflict monitor, live activity feed.
- **Mobile Field Interface**: On-Site Field Engineer Application
  - High outdoor contrast, large touch targets, simulated differential GPS (`KM 43.47 ±8m`), interactive 6/6 safety checklists, single-tap **START WORK** / **COMPLETE TASK**.
- **Presentation Wall Display**: Fullscreen projection mode for large command centers with real-time indicators.

---

## ⚡ Live Realtime Synchronization Architecture

OFF-RAILS features a **Dual-Engine Realtime Architecture**:

1. **Engine A (Zero-Setup Local Sync)**:
   - Uses native `BroadcastChannel` (`offrails_events`) + storage events.
   - Any action taken on a mobile viewport (or another browser tab) propagates in `<5ms` to the Desktop Control Room without requiring any cloud server or API key.
2. **Engine B (Supabase Realtime Cloud Sync)**:
   - Broadcasts state actions over Supabase Realtime channels for true cross-device demonstration between a presenter's laptop and an evaluator's mobile phone over cellular/WiFi.
   - Credentials can be configured in `.env` or dynamically entered via the in-app `/settings` dashboard.

---

## 🎬 SIH 2026 Presentation Demonstration Sequence

Follow this step-by-step presentation script:

1. **STEP 1: Open Desktop Control Room (`/dashboard`)**
   - Point out **Active Blocks: 04**, **Pending Requests: 12**, **Asset Availability: 94.7%**, **Block Utilisation: 87%**.
   - Show Joint Block `#1042` currently sitting in **PLANNED** state.

2. **STEP 2: Open Planning Module (`/planning`)**
   - Review independent maintenance requests from Engineering, Electrical, and S&T.
   - Click **AI Priority Score** to display the formula breakdown:
     $$\text{Priority} = \text{Criticality (25\%)} + \text{Safety (30\%)} + \text{Overdue (15\%)} + \text{Impact (20\%)} + \text{Failure Risk (10\%)}$$
   - Click **RUN BLOCK OPTIMISER**.
   - The system synthesizes and recommends **JOINT BLOCK #1042** with a **2h 15m** downtime reduction.
   - Click **Why This Block?** to display the 6 transparent multi-criteria validation checks.

3. **STEP 3: Click APPROVE BLOCK**
   - The Operations Controller grants formal sanction: Status transitions from **RECOMMENDED → APPROVED**.

4. **STEP 4: Open Mobile Device (or switch role to FIELD ENGINEER)**
   - View assigned block `#1042` on `KM 43.2 – 45.1`.
   - Simulated GPS shows `KM 43.47 (Accuracy ±8m)`.
   - Complete the mandatory 6/6 safety checklist (25kV OHE isolation, detonators, banner flags).

5. **STEP 5: Tap START WORK on Mobile**
   - Mobile task status flips to **IN PROGRESS**.
   - **Immediately return to Desktop Control Room**:
     - Block `#1042` automatically flips to **ACTIVE** with pulsing green telemetry!
     - Dashboard **Active Blocks** increments!
     - Live Activity Feed logs:  
       *“Engineering field crew started Rail Grinding at 22:17 on corridor KM 43.2”*

6. **STEP 6: Tap COMPLETE TASK on Mobile**
   - Mobile confirms work cleared.
   - Desktop instantaneously updates Engineering task to **COMPLETED** and asset health score to **98%**.

7. **STEP 7: Complete Joint Block Demonstration**
   - Use the built-in **Demo Control Deck** (`DEMO CONTROL`) to complete remaining S&T and Electrical work.
   - Block reaches **100% COMPLETED**.
   - Climax metric displayed: **DOWNTIME SAVED: 2h 15m | PASSENGER DELAYS: 0m**.

---

## 🛠️ Local Development & Running

### Prerequisites
- Node.js 18+ (tested on Node v24.18)
- npm or yarn

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/RealRatnadwip/off-rails.git
cd off-rails

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```
Visit `http://localhost:5173` in your browser.

---

## 🚀 Deployment to Vercel

The application is built to deploy out-of-the-box on Vercel:

1. Push code to your GitHub repository.
2. In Vercel, click **Add New Project** and select the repository.
3. Keep default settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. (Optional) Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Click **Deploy**.
6. Access the deployed application from any laptop and mobile phone!

---

## 🗄️ Supabase Database Setup (Optional)

To enable cross-network synchronization with your own Supabase project:
1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and execute the provided schema in `supabase/schema.sql`.
3. Under **Project Settings → API**, copy your **Project URL** and **Anon Public Key**.
4. Set them in `.env` or input them directly inside the OFF-RAILS application under the `/settings` module.

---

## 🚂 Railway Division Terminology Reference

- **Possession Block**: Formal authorization by Operations Controller reserving a track section for maintenance.
- **Power Block**: SCADA de-energization and earthing of the 25kV AC overhead traction catenary.
- **P-Way (Permanent Way)**: The track structure comprising rails, sleepers, ballast, and switch turnouts.
- **OHE (Overhead Equipment)**: 25kV traction mast, contact wire, and catenary suspension.
- **S&T (Signal & Telecommunications)**: Point machines, solid-state interlocking (SSI), and digital axle counters (DAC).
- **USFD (Ultrasonic Flaw Detection)**: NDT testing of internal rail metallurgy to prevent fractures.
- **SEJ (Switch Expansion Joint)**: Thermal breathing joint between continuous welded rail lengths.
- **GMT (Gross Million Tonnes)**: Corridor traffic density metric used to schedule rail grinding.

---

## 📜 Hackathon Attribution
Developed for **Smart India Hackathon (SIH 2026)**.  
Designed to demonstrate actionable efficiency gains in railway corridor maintenance planning without disrupting Mail, Express, and Suburban commuter train networks.
