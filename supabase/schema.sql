-- ==============================================================================
-- RAILSYNC - Indian Railways Automatic Block Planning & Multi-Dept Coordination
-- Supabase PostgreSQL Schema & Realtime Replication Configuration
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. STATIONS
CREATE TABLE IF NOT EXISTS stations (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    km NUMERIC(6, 2) NOT NULL,
    junction BOOLEAN DEFAULT FALSE,
    platforms INTEGER DEFAULT 2,
    tracks INTEGER DEFAULT 2,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TRACK SECTIONS
CREATE TABLE IF NOT EXISTS track_sections (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    from_station TEXT REFERENCES stations(code),
    to_station TEXT REFERENCES stations(code),
    km_start NUMERIC(6, 2) NOT NULL,
    km_end NUMERIC(6, 2) NOT NULL,
    line_name TEXT NOT NULL,
    speed_limit_kmph INTEGER NOT NULL DEFAULT 110,
    status TEXT NOT NULL DEFAULT 'CLEAR',
    electrification TEXT NOT NULL DEFAULT '25kV AC 50Hz Traction',
    signalling_type TEXT NOT NULL,
    active_block_id TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. RAILWAY ASSETS
CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    km NUMERIC(6, 2) NOT NULL,
    station TEXT,
    criticality TEXT NOT NULL DEFAULT 'NORMAL',
    health_score INTEGER NOT NULL DEFAULT 100,
    status TEXT NOT NULL DEFAULT 'OPERATIONAL',
    last_maintenance DATE,
    next_maintenance_due TEXT,
    failure_risk_percent INTEGER DEFAULT 10,
    specifications JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. FIELD CREWS
CREATE TABLE IF NOT EXISTS crews (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    leader_name TEXT NOT NULL,
    department TEXT NOT NULL,
    phone TEXT NOT NULL,
    radio_channel TEXT NOT NULL,
    member_count INTEGER NOT NULL DEFAULT 6,
    assigned_block_id TEXT,
    current_km NUMERIC(6, 2),
    status TEXT NOT NULL DEFAULT 'ON_DUTY',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. HEAVY EQUIPMENT & TRACK MACHINES
CREATE TABLE IF NOT EXISTS equipment (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    department TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'STANDBY',
    operator_name TEXT NOT NULL,
    current_location TEXT NOT NULL,
    assigned_block_id TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TRAIN SERVICES
CREATE TABLE IF NOT EXISTS trains (
    id TEXT PRIMARY KEY,
    train_number TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    current_km NUMERIC(6, 2) NOT NULL,
    speed_kmph INTEGER NOT NULL DEFAULT 80,
    direction TEXT NOT NULL DEFAULT 'UP',
    status TEXT NOT NULL DEFAULT 'ON_TIME',
    delay_minutes INTEGER DEFAULT 0,
    next_station TEXT NOT NULL,
    conflict_with_block_id TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. RAILWAY POSSESSION BLOCKS
CREATE TABLE IF NOT EXISTS blocks (
    id TEXT PRIMARY KEY,
    block_number TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    is_joint_block BOOLEAN DEFAULT TRUE,
    status TEXT NOT NULL DEFAULT 'PLANNED',
    corridor TEXT NOT NULL,
    km_start NUMERIC(6, 2) NOT NULL,
    km_end NUMERIC(6, 2) NOT NULL,
    line TEXT NOT NULL,
    division TEXT NOT NULL,
    planned_start_time TEXT NOT NULL,
    planned_end_time TEXT NOT NULL,
    actual_start_time TEXT,
    actual_end_time TEXT,
    departments TEXT[] NOT NULL,
    train_conflicts_count INTEGER DEFAULT 0,
    train_impact_details TEXT,
    field_crews_count INTEGER DEFAULT 1,
    crews TEXT[],
    equipment TEXT[],
    downtime_saved_minutes INTEGER DEFAULT 0,
    utilization_percent INTEGER DEFAULT 85,
    recommended_by_ai BOOLEAN DEFAULT FALSE,
    optimization_rationale TEXT[],
    approved_by TEXT,
    approved_at TIMESTAMP WITH TIME ZONE,
    activated_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. MAINTENANCE TASKS
CREATE TABLE IF NOT EXISTS maintenance_tasks (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    department TEXT NOT NULL,
    title TEXT NOT NULL,
    asset_id TEXT REFERENCES assets(id),
    asset_name TEXT NOT NULL,
    location TEXT NOT NULL,
    km_start NUMERIC(6, 2) NOT NULL,
    km_end NUMERIC(6, 2) NOT NULL,
    priority TEXT NOT NULL DEFAULT 'HIGH',
    priority_score INTEGER NOT NULL DEFAULT 75,
    priority_breakdown JSONB NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 60,
    preferred_window_start TEXT NOT NULL,
    preferred_window_end TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',
    block_id TEXT REFERENCES blocks(id),
    assigned_crew_id TEXT REFERENCES crews(id),
    assigned_crew_name TEXT,
    equipment_required TEXT[],
    safety_requirements TEXT[],
    completed_at TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. LIVE ACTIVITY TELEMETRY FEED
CREATE TABLE IF NOT EXISTS activity_events (
    id TEXT PRIMARY KEY DEFAULT 'act_' || substr(md5(random()::text), 1, 8),
    timestamp TEXT NOT NULL,
    iso_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    department TEXT NOT NULL,
    title TEXT NOT NULL,
    detail TEXT NOT NULL,
    location TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'INFO',
    block_id TEXT,
    actor_role TEXT NOT NULL
);

-- ==============================================================================
-- ENABLE SUPABASE REALTIME REPLICATION
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE blocks;
ALTER PUBLICATION supabase_realtime ADD TABLE maintenance_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_events;
ALTER PUBLICATION supabase_realtime ADD TABLE assets;
ALTER PUBLICATION supabase_realtime ADD TABLE trains;
