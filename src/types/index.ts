export type Department = 'ENGINEERING' | 'ELECTRICAL' | 'S_AND_T' | 'OPERATIONS';

export type UserRole = 
  | 'OPERATIONS_CONTROLLER' 
  | 'ENGINEERING' 
  | 'ELECTRICAL' 
  | 'S_AND_T' 
  | 'FIELD_ENGINEER';

export type BlockStatus = 
  | 'PLANNED' 
  | 'RECOMMENDED' 
  | 'APPROVED' 
  | 'ACTIVE' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'REJECTED';

export type TaskStatus = 
  | 'PENDING' 
  | 'READY' 
  | 'IN_PROGRESS' 
  | 'PAUSED' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface PriorityBreakdown {
  assetCriticality: number;     // 0 - 100
  safetyRisk: number;           // 0 - 100
  overdueFactor: number;        // 0 - 100
  operationalImpact: number;    // 0 - 100
  failureProbability: number;   // 0 - 100
  finalScore: number;           // calculated composite
}

export interface MaintenanceTask {
  id: string;
  code: string;                 // e.g. "ENG-TRK-432"
  department: Department;
  title: string;                // e.g. "Rail Grinding & Profile Rectification"
  assetId: string;
  assetName: string;
  location: string;             // e.g. "KM 43.2 – 43.8 UP Main"
  kmStart: number;
  kmEnd: number;
  priority: PriorityLevel;
  priorityScore: number;        // 0 - 100
  priorityBreakdown: PriorityBreakdown;
  durationMinutes: number;      // e.g. 120
  preferredWindowStart: string; // "22:00"
  preferredWindowEnd: string;   // "00:00"
  status: TaskStatus;
  blockId?: string;             // linked block
  assignedCrewId?: string;
  assignedCrewName?: string;
  equipmentRequired: string[];  // ["RG-12", "Track Gauges"]
  safetyRequirements: string[]; // ["OHE Isolation 25kV", "Track Protection Flags"]
  completedAt?: string;
  notes?: string;
}

export interface SafetyChecklistItem {
  id: string;
  title: string;
  department: Department | 'ALL';
  isMandatory: boolean;
  isCompleted: boolean;
  completedBy?: string;
  completedAt?: string;
}

export interface BlockTaskItem {
  taskId: string;
  department: Department;
  title: string;
  status: TaskStatus;
  durationMinutes: number;
  crewName: string;
  equipment: string[];
  progressPercent: number;
  startedAt?: string;
  completedAt?: string;
}

export interface RailwayBlock {
  id: string;
  blockNumber: string;          // e.g. "#1042"
  title: string;                // "Joint Multi-Dept Possession - Barrackpore-Naihati Corridor"
  isJointBlock: boolean;
  status: BlockStatus;
  corridor: string;             // "KM 43.2 – 45.1"
  kmStart: number;
  kmEnd: number;
  line: string;                 // "UP Main Line"
  division: string;             // "Eastern Railway / Sealdah Division"
  plannedStartTime: string;     // "22:00"
  plannedEndTime: string;       // "00:00"
  actualStartTime?: string;
  actualEndTime?: string;
  departments: Department[];
  tasks: BlockTaskItem[];
  trainConflictsCount: number;
  trainImpactDetails: string;
  safetyChecklist: SafetyChecklistItem[];
  fieldCrewsCount: number;
  crews: string[];
  equipment: string[];
  downtimeSavedMinutes: number; // e.g. 135 mins (2h 15m)
  utilizationPercent: number;   // e.g. 93%
  recommendedByAi: boolean;
  optimizationRationale?: string[];
  approvedBy?: string;
  approvedAt?: string;
  activatedAt?: string;
  completedAt?: string;
}

export interface RailwayAsset {
  id: string;
  code: string;                 // e.g. "PM-432-A"
  name: string;
  category: 'Track Section' | 'Point Machine' | 'Signal' | 'Axle Counter' | 'OHE Mast' | 'Transformer' | 'Isolator' | 'Relay Interlocking' | 'Rail Joint';
  department: Department;
  location: string;             // "KM 43.2 UP Main"
  km: number;
  station: string;              // "Barrackpore"
  criticality: 'CRITICAL' | 'HIGH' | 'NORMAL';
  healthScore: number;          // 0 - 100
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE_REQUIRED' | 'UNDER_MAINTENANCE';
  lastMaintenance: string;
  nextMaintenanceDue: string;
  failureRiskPercent: number;
  specifications: Record<string, string>;
}

export interface Station {
  id: string;
  code: string;                 // "HWH", "DAKE", "SDAH", "DDJ", "BP", "NH", "KYI", "RHA", "KNJ"
  name: string;
  km: number;
  junction: boolean;
  platforms: number;
  tracks: number;
  x: number;                    // SVG schematic coordinate
  y: number;
}

export interface TrackSection {
  id: string;
  code: string;                 // "SEC-HWH-SDAH-01"
  fromStation: string;
  toStation: string;
  kmStart: number;
  kmEnd: number;
  lineName: string;             // "UP Main", "DN Main", "UP Sub", "DN Sub"
  speedLimitKmph: number;       // e.g. 110
  status: 'CLEAR' | 'CAUTION' | 'BLOCK_ACTIVE' | 'MAINTENANCE_PLANNED';
  electrification: string;      // "25kV AC Traction"
  signallingType: string;       // "Automatic Signalling with Axle Counters"
  activeBlockId?: string;
  activeBlockNumber?: string;
}

export interface TrainService {
  id: string;
  trainNumber: string;          // "12301"
  name: string;                 // "Howrah - New Delhi Rajdhani Express"
  type: 'RAJ' | 'VB' | 'EMU_LOCAL' | 'FREIGHT' | 'SUPERFAST';
  currentKm: number;
  speedKmph: number;
  direction: 'UP' | 'DN';
  status: 'ON_TIME' | 'DELAYED' | 'REGULATED' | 'HALTED';
  delayMinutes: number;
  nextStation: string;
  conflictWithBlockId?: string;
}

export interface FieldCrew {
  id: string;
  code: string;                 // "CREW-ENG-04"
  leaderName: string;
  department: Department;
  phone: string;
  radioChannel: string;         // "CH-04 (156.800 MHz)"
  memberCount: number;
  assignedBlockId?: string;
  currentKm: number;
  status: 'ON_DUTY' | 'EN_ROUTE' | 'ON_SITE' | 'STANDBY';
}

export interface EquipmentUnit {
  id: string;
  code: string;                 // "RG-12"
  name: string;                 // "Heavy Duty Rail Grinding Machine"
  department: Department;
  status: 'DEPLOYED' | 'STANDBY' | 'MAINTENANCE';
  operatorName: string;
  currentLocation: string;
  assignedBlockId?: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;            // "22:17"
  isoTime: string;
  department: Department;
  title: string;
  detail: string;
  location: string;
  severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL';
  blockId?: string;
  actorRole: string;
}

export interface OptimizationRecommendation {
  id: string;
  title: string;
  corridor: string;
  kmRange: string;
  window: string;
  suggestedTasks: MaintenanceTask[];
  individualHoursTotal: number;
  jointHoursProposed: number;
  downtimeSavedMinutes: number;
  utilizationPercent: number;
  trainConflicts: number;
  rationale: string[];
}
