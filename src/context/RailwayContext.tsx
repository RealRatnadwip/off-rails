import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Department,
  UserRole,
  BlockStatus,
  TaskStatus,
  MaintenanceTask,
  RailwayBlock,
  RailwayAsset,
  Station,
  TrackSection,
  TrainService,
  FieldCrew,
  EquipmentUnit,
  ActivityEvent,
  SafetyChecklistItem,
} from '../types';
import {
  INITIAL_BLOCKS,
  INITIAL_MAINTENANCE_TASKS,
  INITIAL_ASSETS,
  INITIAL_STATIONS,
  INITIAL_TRACK_SECTIONS,
  INITIAL_TRAIN_SERVICES,
  INITIAL_FIELD_CREWS,
  INITIAL_EQUIPMENT,
  INITIAL_ACTIVITY_LOG,
  INITIAL_SAFETY_CHECKLIST,
} from '../data/initialData';
import { realtimeSync, SyncMessage } from '../services/realtimeSync';

interface RailwayContextType {
  // Master Data
  blocks: RailwayBlock[];
  tasks: MaintenanceTask[];
  assets: RailwayAsset[];
  stations: Station[];
  trackSections: TrackSection[];
  trains: TrainService[];
  fieldCrews: FieldCrew[];
  equipment: EquipmentUnit[];
  activityLog: ActivityEvent[];
  
  // App Controls
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeDivision: string;
  setActiveDivision: (div: string) => void;
  currentTimeStr: string;
  isPresentationMode: boolean;
  setIsPresentationMode: (val: boolean) => void;
  isDemoControlsOpen: boolean;
  setIsDemoControlsOpen: (val: boolean) => void;
  
  // KPIs
  kpis: {
    activeBlocks: number;
    pendingRequests: number;
    maintenanceTasks: number;
    assetAvailability: number;
    blockUtilisation: number;
    trainConflicts: number;
    downtimeSavedTotalMinutes: number;
  };

  // State Mutators / Demo Actions
  startTask: (taskId: string) => void;
  pauseTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
  approveBlock: (blockId: string) => void;
  activateBlock: (blockId: string) => void;
  rejectBlock: (blockId: string, reason?: string) => void;
  cancelBlock: (blockId: string) => void;
  toggleSafetyChecklist: (blockId: string, itemId: string) => void;
  reportObstruction: (location: string, details: string) => void;
  reportAssetIssue: (assetId: string, issue: string) => void;
  resetDemo: () => void;
  simulateTrainMovement: () => void;
  advanceSimulatedTime: (minutes?: number) => void;
  simulateDelay: (minutes?: number) => void;
  addNewTask: (task: Partial<MaintenanceTask>) => void;
}

const RailwayContext = createContext<RailwayContextType | undefined>(undefined);

const STORAGE_KEY = 'offrails_state_snapshot_v1';

export const RailwayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Retrieve saved local state or defaults
  const loadInitialState = () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('railsync_state_snapshot_v1');
        if (saved) {
          const parsed = JSON.parse(saved);
          return {
            blocks: parsed.blocks || INITIAL_BLOCKS,
            tasks: parsed.tasks || INITIAL_MAINTENANCE_TASKS,
            assets: parsed.assets || INITIAL_ASSETS,
            trains: parsed.trains || INITIAL_TRAIN_SERVICES,
            activityLog: parsed.activityLog || INITIAL_ACTIVITY_LOG,
          };
        }
      } catch (e) {
        console.warn('Could not read state snapshot', e);
      }
    }
    return {
      blocks: INITIAL_BLOCKS,
      tasks: INITIAL_MAINTENANCE_TASKS,
      assets: INITIAL_ASSETS,
      trains: INITIAL_TRAIN_SERVICES,
      activityLog: INITIAL_ACTIVITY_LOG,
    };
  };

  const initial = loadInitialState();

  const [blocks, setBlocks] = useState<RailwayBlock[]>(initial.blocks);
  const [tasks, setTasks] = useState<MaintenanceTask[]>(initial.tasks);
  const [assets, setAssets] = useState<RailwayAsset[]>(initial.assets);
  const [stations] = useState<Station[]>(INITIAL_STATIONS);
  const [trackSections, setTrackSections] = useState<TrackSection[]>(INITIAL_TRACK_SECTIONS);
  const [trains, setTrains] = useState<TrainService[]>(initial.trains);
  const [fieldCrews, setFieldCrews] = useState<FieldCrew[]>(INITIAL_FIELD_CREWS);
  const [equipment, setEquipment] = useState<EquipmentUnit[]>(INITIAL_EQUIPMENT);
  const [activityLog, setActivityLog] = useState<ActivityEvent[]>(initial.activityLog);

  const [userRole, setUserRole] = useState<UserRole>('OPERATIONS_CONTROLLER');
  const [activeDivision, setActiveDivision] = useState<string>('Eastern Railway / Sealdah Division (SDAH - NH - KNJ)');
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [isDemoControlsOpen, setIsDemoControlsOpen] = useState<boolean>(false);

  // Live real clock & simulated operational time
  const [simulatedDate, setSimulatedDate] = useState<Date>(() => new Date(2026, 8, 9, 22, 17, 0));
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('22:17:00 IST');

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedDate((prev) => {
        const next = new Date(prev.getTime() + 1000);
        const hours = String(next.getHours()).padStart(2, '0');
        const mins = String(next.getMinutes()).padStart(2, '0');
        const secs = String(next.getSeconds()).padStart(2, '0');
        setCurrentTimeStr(`${hours}:${mins}:${secs} IST`);
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Persist state changes locally
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ blocks, tasks, assets, trains, activityLog })
        );
      } catch (e) {
        // ignore storage errors
      }
    }
  }, [blocks, tasks, assets, trains, activityLog]);

  // Handle incoming realtime sync messages from peer tabs / devices
  useEffect(() => {
    const unsubscribe = realtimeSync.subscribe((message: SyncMessage) => {
      switch (message.type) {
        case 'STATE_SYNC_ALL': {
          const payload = message.payload as any;
          if (payload.blocks) setBlocks(payload.blocks);
          if (payload.tasks) setTasks(payload.tasks);
          if (payload.assets) setAssets(payload.assets);
          if (payload.activityLog) setActivityLog(payload.activityLog);
          break;
        }
        case 'TASK_STARTED': {
          const { taskId, timestamp } = message.payload as any;
          applyStartTask(taskId, timestamp, false);
          break;
        }
        case 'TASK_COMPLETED': {
          const { taskId, timestamp } = message.payload as any;
          applyCompleteTask(taskId, timestamp, false);
          break;
        }
        case 'TASK_PAUSED': {
          const { taskId } = message.payload as any;
          applyPauseTask(taskId, false);
          break;
        }
        case 'BLOCK_APPROVED': {
          const { blockId } = message.payload as any;
          applyApproveBlock(blockId, false);
          break;
        }
        case 'BLOCK_ACTIVATED': {
          const { blockId } = message.payload as any;
          applyActivateBlock(blockId, false);
          break;
        }
        case 'SAFETY_CHECK_TOGGLED': {
          const { blockId, itemId } = message.payload as any;
          applyToggleSafetyCheck(blockId, itemId, false);
          break;
        }
        case 'DEMO_RESET': {
          applyResetDemo(false);
          break;
        }
        case 'ACTIVITY_ADDED': {
          const event = message.payload as ActivityEvent;
          setActivityLog((prev) => [event, ...prev.slice(0, 49)]);
          break;
        }
        default:
          break;
      }
    });

    return () => unsubscribe();
  }, []);

  // Helpers for log creation
  const addActivityLog = useCallback(
    (
      department: Department,
      title: string,
      detail: string,
      location: string,
      severity: 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL',
      blockId?: string,
      actorRole: string = 'Field / Operations'
    ) => {
      const nowStr = currentTimeStr.substring(0, 5);
      const newEvent: ActivityEvent = {
        id: 'act-' + Math.random().toString(36).substring(2, 9),
        timestamp: nowStr,
        isoTime: new Date().toISOString(),
        department,
        title,
        detail,
        location,
        severity,
        blockId,
        actorRole,
      };

      setActivityLog((prev) => [newEvent, ...prev.slice(0, 49)]);
      realtimeSync.broadcast('ACTIVITY_ADDED', newEvent);
      return newEvent;
    },
    [currentTimeStr]
  );

  // START TASK LOGIC (Core Step 5 of demo)
  const applyStartTask = useCallback((taskId: string, timeStampStr: string, shouldBroadcast = true) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          return { ...t, status: 'IN_PROGRESS' as TaskStatus };
        }
        return t;
      })
    );

    setBlocks((prevBlocks) =>
      prevBlocks.map((b) => {
        const hasTask = b.tasks.some((t) => t.taskId === taskId);
        if (hasTask) {
          const updatedTasks = b.tasks.map((t) =>
            t.taskId === taskId
              ? { ...t, status: 'IN_PROGRESS' as TaskStatus, startedAt: timeStampStr, progressPercent: 25 }
              : t
          );
          // When a task starts, the joint block becomes ACTIVE!
          return {
            ...b,
            status: 'ACTIVE' as BlockStatus,
            actualStartTime: b.actualStartTime || timeStampStr,
            tasks: updatedTasks,
          };
        }
        return b;
      })
    );

    // Update track section status
    setTrackSections((prevSecs) =>
      prevSecs.map((s) => (s.id === 'sec-10' ? { ...s, status: 'BLOCK_ACTIVE' } : s))
    );

    if (shouldBroadcast) {
      realtimeSync.broadcast('TASK_STARTED', { taskId, timestamp: timeStampStr });
    }
  }, []);

  const startTask = useCallback(
    (taskId: string) => {
      const targetTask = tasks.find((t) => t.id === taskId);
      const timeStr = currentTimeStr.substring(0, 5);

      applyStartTask(taskId, timeStr, true);

      addActivityLog(
        targetTask?.department || 'ENGINEERING',
        `${targetTask?.department === 'ENGINEERING' ? 'Engineering' : targetTask?.department === 'ELECTRICAL' ? 'Electrical' : 'S&T'} Work Commenced`,
        `${targetTask?.assignedCrewName || 'Field crew'} started ${targetTask?.title || 'work'} at ${timeStr} on corridor ${targetTask?.location || 'KM 43.2'}.`,
        targetTask?.location || 'KM 43.2 – 45.1 UP Main',
        'INFO',
        targetTask?.blockId || 'blk-1042',
        'Field Engineer (On-Site)'
      );
    },
    [tasks, currentTimeStr, applyStartTask, addActivityLog]
  );

  // PAUSE TASK LOGIC
  const applyPauseTask = useCallback((taskId: string, shouldBroadcast = true) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: 'PAUSED' as TaskStatus } : t))
    );
    setBlocks((prev) =>
      prev.map((b) => ({
        ...b,
        tasks: b.tasks.map((t) => (t.taskId === taskId ? { ...t, status: 'PAUSED' as TaskStatus } : t)),
      }))
    );
    if (shouldBroadcast) {
      realtimeSync.broadcast('TASK_PAUSED', { taskId });
    }
  }, []);

  const pauseTask = useCallback(
    (taskId: string) => {
      const targetTask = tasks.find((t) => t.id === taskId);
      applyPauseTask(taskId, true);
      addActivityLog(
        targetTask?.department || 'ENGINEERING',
        'Task Temporarily Paused',
        `${targetTask?.title} paused due to site conditions / caution protocol.`,
        targetTask?.location || 'KM 43.2',
        'WARNING',
        targetTask?.blockId,
        'Field Engineer'
      );
    },
    [tasks, applyPauseTask, addActivityLog]
  );

  // COMPLETE TASK LOGIC (Core Step 6 & 7 of demo)
  const applyCompleteTask = useCallback((taskId: string, timeStampStr: string, shouldBroadcast = true) => {
    let completedDept: Department = 'ENGINEERING';

    setTasks((prevTasks) =>
      prevTasks.map((t) => {
        if (t.id === taskId) {
          completedDept = t.department;
          return {
            ...t,
            status: 'COMPLETED' as TaskStatus,
            completedAt: timeStampStr,
          };
        }
        return t;
      })
    );

    setBlocks((prevBlocks) =>
      prevBlocks.map((b) => {
        const hasTask = b.tasks.some((t) => t.taskId === taskId);
        if (hasTask) {
          const updatedTasks = b.tasks.map((t) =>
            t.taskId === taskId
              ? { ...t, status: 'COMPLETED' as TaskStatus, progressPercent: 100, completedAt: timeStampStr }
              : t
          );

          const allCompleted = updatedTasks.every((t) => t.status === 'COMPLETED');
          const completedCount = updatedTasks.filter((t) => t.status === 'COMPLETED').length;
          const avgProgress = Math.round((completedCount / updatedTasks.length) * 100);

          return {
            ...b,
            status: allCompleted ? ('COMPLETED' as BlockStatus) : b.status,
            actualEndTime: allCompleted ? timeStampStr : b.actualEndTime,
            tasks: updatedTasks,
            utilizationPercent: avgProgress > 0 ? avgProgress : b.utilizationPercent,
          };
        }
        return b;
      })
    );

    // Update relevant asset health
    setAssets((prevAssets) =>
      prevAssets.map((a) => {
        if (a.id === 'ast-01' && taskId === 'tsk-01') {
          return {
            ...a,
            healthScore: 98,
            status: 'OPERATIONAL',
            lastMaintenance: '2026-09-09 (Completed)',
            failureRiskPercent: 4,
          };
        }
        if (a.id === 'ast-03' && taskId === 'tsk-02') {
          return {
            ...a,
            healthScore: 95,
            status: 'OPERATIONAL',
            lastMaintenance: '2026-09-09 (Completed)',
            failureRiskPercent: 8,
          };
        }
        if (a.id === 'ast-02' && taskId === 'tsk-03') {
          return {
            ...a,
            healthScore: 96,
            status: 'OPERATIONAL',
            lastMaintenance: '2026-09-09 (Completed)',
            failureRiskPercent: 6,
          };
        }
        return a;
      })
    );

    if (shouldBroadcast) {
      realtimeSync.broadcast('TASK_COMPLETED', { taskId, timestamp: timeStampStr });
    }
  }, []);

  const completeTask = useCallback(
    (taskId: string) => {
      const targetTask = tasks.find((t) => t.id === taskId);
      const timeStr = currentTimeStr.substring(0, 5);

      applyCompleteTask(taskId, timeStr, true);

      addActivityLog(
        targetTask?.department || 'ENGINEERING',
        `${targetTask?.department === 'ENGINEERING' ? 'Engineering' : targetTask?.department === 'ELECTRICAL' ? 'Electrical' : 'S&T'} Task Completed`,
        `${targetTask?.title || 'Maintenance work'} successfully completed at ${timeStr}. Line clearance checklist ready for verification.`,
        targetTask?.location || 'KM 43.2 UP Main',
        'SUCCESS',
        targetTask?.blockId || 'blk-1042',
        'Field Engineer (SSE / Gang Incharge)'
      );
    },
    [tasks, currentTimeStr, applyCompleteTask, addActivityLog]
  );

  // APPROVE BLOCK LOGIC (Step 3)
  const applyApproveBlock = useCallback((blockId: string, shouldBroadcast = true) => {
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id === blockId) {
          return {
            ...b,
            status: 'APPROVED' as BlockStatus,
            approvedBy: 'Operations Controller (SDAH Central)',
            approvedAt: new Date().toLocaleTimeString('en-US', { hour12: false }),
          };
        }
        return b;
      })
    );
    if (shouldBroadcast) {
      realtimeSync.broadcast('BLOCK_APPROVED', { blockId });
    }
  }, []);

  const approveBlock = useCallback(
    (blockId: string) => {
      const blk = blocks.find((b) => b.id === blockId);
      applyApproveBlock(blockId, true);
      addActivityLog(
        'OPERATIONS',
        `Block ${blk?.blockNumber || '#1042'} Formally Approved`,
        `Section Operations Controller granted formal sanction for Joint Block ${blk?.blockNumber || '#1042'} on ${blk?.corridor || 'corridor'}.`,
        blk?.corridor || 'KM 43.2 – 45.1',
        'SUCCESS',
        blockId,
        'Operations Controller (SDAH)'
      );
    },
    [blocks, applyApproveBlock, addActivityLog]
  );

  // ACTIVATE BLOCK LOGIC
  const applyActivateBlock = useCallback((blockId: string, shouldBroadcast = true) => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    setBlocks((prev) =>
      prev.map((b) => {
        if (b.id === blockId) {
          return {
            ...b,
            status: 'ACTIVE' as BlockStatus,
            actualStartTime: timeStr,
            tasks: b.tasks.map((t) => ({ ...t, status: t.status === 'READY' ? 'READY' : t.status })),
          };
        }
        return b;
      })
    );
    setTrackSections((prev) =>
      prev.map((s) => (s.activeBlockId === blockId ? { ...s, status: 'BLOCK_ACTIVE' } : s))
    );
    if (shouldBroadcast) {
      realtimeSync.broadcast('BLOCK_ACTIVATED', { blockId });
    }
  }, []);

  const activateBlock = useCallback(
    (blockId: string) => {
      const blk = blocks.find((b) => b.id === blockId);
      applyActivateBlock(blockId, true);
      addActivityLog(
        'OPERATIONS',
        `Block ${blk?.blockNumber || '#1042'} Activated`,
        `Corridor possession live. Track circuit shunted and 25kV power cut confirmed.`,
        blk?.corridor || 'KM 43.2 – 45.1',
        'INFO',
        blockId,
        'Operations Controller'
      );
    },
    [blocks, applyActivateBlock, addActivityLog]
  );

  // REJECT BLOCK
  const rejectBlock = useCallback(
    (blockId: string, reason = 'Conflicting high-priority freight movement') => {
      setBlocks((prev) =>
        prev.map((b) => (b.id === blockId ? { ...b, status: 'REJECTED' as BlockStatus } : b))
      );
      addActivityLog(
        'OPERATIONS',
        `Block Request Rejected`,
        `Block ${blockId} was declined by Section Control. Reason: ${reason}.`,
        'Division Operations Office',
        'CRITICAL',
        blockId,
        'Operations Controller'
      );
    },
    [addActivityLog]
  );

  // CANCEL BLOCK
  const cancelBlock = useCallback(
    (blockId: string) => {
      setBlocks((prev) =>
        prev.map((b) => (b.id === blockId ? { ...b, status: 'CANCELLED' as BlockStatus } : b))
      );
      addActivityLog(
        'OPERATIONS',
        `Block Possession Cancelled`,
        `Block ${blockId} possession relinquished early. Track restored to normal operation.`,
        'Division Control',
        'WARNING',
        blockId,
        'Operations Controller'
      );
    },
    [addActivityLog]
  );

  // TOGGLE SAFETY CHECKLIST
  const applyToggleSafetyCheck = useCallback(
    (blockId: string, itemId: string, shouldBroadcast = true) => {
      setBlocks((prev) =>
        prev.map((b) => {
          if (b.id === blockId) {
            return {
              ...b,
              safetyChecklist: b.safetyChecklist.map((chk) => {
                if (chk.id === itemId) {
                  const nextVal = !chk.isCompleted;
                  return {
                    ...chk,
                    isCompleted: nextVal,
                    completedBy: nextVal ? 'D. K. Biswas (Safety Marshal)' : undefined,
                    completedAt: nextVal ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : undefined,
                  };
                }
                return chk;
              }),
            };
          }
          return b;
        })
      );
      if (shouldBroadcast) {
        realtimeSync.broadcast('SAFETY_CHECK_TOGGLED', { blockId, itemId });
      }
    },
    []
  );

  const toggleSafetyChecklist = useCallback(
    (blockId: string, itemId: string) => {
      applyToggleSafetyCheck(blockId, itemId, true);
    },
    [applyToggleSafetyCheck]
  );

  // REPORT OBSTRUCTION
  const reportObstruction = useCallback(
    (location: string, details: string) => {
      addActivityLog(
        'ENGINEERING',
        '⚠️ Track Obstruction Reported',
        details,
        location,
        'CRITICAL',
        undefined,
        'Field Engineer (Emergency Report)'
      );
    },
    [addActivityLog]
  );

  // REPORT ASSET ISSUE
  const reportAssetIssue = useCallback(
    (assetId: string, issue: string) => {
      const ast = assets.find((a) => a.id === assetId);
      setAssets((prev) =>
        prev.map((a) =>
          a.id === assetId ? { ...a, status: 'DEGRADED', failureRiskPercent: Math.min(100, a.failureRiskPercent + 30) } : a
        )
      );
      addActivityLog(
        ast?.department || 'S_AND_T',
        `Asset Defect Flagged: ${ast?.code}`,
        `Field staff reported: ${issue}. Maintenance request auto-generated.`,
        ast?.location || 'Track Section',
        'WARNING',
        undefined,
        'Field Engineer'
      );
    },
    [assets, addActivityLog]
  );

  // ADD NEW TASK
  const addNewTask = useCallback(
    (taskPartial: Partial<MaintenanceTask>) => {
      const newTask: MaintenanceTask = {
        id: 'tsk-' + Math.random().toString(36).substring(2, 9),
        code: `${(taskPartial.department || 'ENG').substring(0, 3)}-GEN-${Math.floor(Math.random() * 900 + 100)}`,
        department: taskPartial.department || 'ENGINEERING',
        title: taskPartial.title || 'Track Slewing & Geometry Packing',
        assetId: taskPartial.assetId || 'ast-01',
        assetName: taskPartial.assetName || 'Track Section',
        location: taskPartial.location || 'KM 43.2 UP Main',
        kmStart: taskPartial.kmStart || 43.2,
        kmEnd: taskPartial.kmEnd || 44.0,
        priority: taskPartial.priority || 'HIGH',
        priorityScore: taskPartial.priorityScore || 78,
        priorityBreakdown: taskPartial.priorityBreakdown || {
          assetCriticality: 80,
          safetyRisk: 80,
          overdueFactor: 60,
          operationalImpact: 75,
          failureProbability: 50,
          finalScore: 78,
        },
        durationMinutes: taskPartial.durationMinutes || 90,
        preferredWindowStart: taskPartial.preferredWindowStart || '22:00',
        preferredWindowEnd: taskPartial.preferredWindowEnd || '00:00',
        status: 'PENDING',
        equipmentRequired: taskPartial.equipmentRequired || ['Standard Tools'],
        safetyRequirements: ['Traffic Block'],
      };

      setTasks((prev) => [newTask, ...prev]);
      addActivityLog(
        newTask.department,
        `New Maintenance Request Created: ${newTask.code}`,
        `${newTask.title} submitted by ${newTask.department} for window ${newTask.preferredWindowStart}-${newTask.preferredWindowEnd}.`,
        newTask.location,
        'INFO',
        undefined,
        'Department Maintenance Incharge'
      );
    },
    [addActivityLog]
  );

  // RESET DEMO TO PREDICTABLE SIH STATE
  const applyResetDemo = useCallback((shouldBroadcast = true) => {
    localStorage.removeItem(STORAGE_KEY);
    setBlocks(INITIAL_BLOCKS);
    setTasks(INITIAL_MAINTENANCE_TASKS);
    setAssets(INITIAL_ASSETS);
    setTrackSections(INITIAL_TRACK_SECTIONS);
    setTrains(INITIAL_TRAIN_SERVICES);
    setFieldCrews(INITIAL_FIELD_CREWS);
    setEquipment(INITIAL_EQUIPMENT);
    setActivityLog(INITIAL_ACTIVITY_LOG);

    if (shouldBroadcast) {
      realtimeSync.broadcast('DEMO_RESET', {});
    }
  }, []);

  const resetDemo = useCallback(() => {
    applyResetDemo(true);
    addActivityLog(
      'OPERATIONS',
      '🔄 Demo Environment Reset to Initial State',
      'All synthetic railway data, Block #1042, and KPIs restored to initial demo conditions.',
      'Control Room Desk',
      'INFO',
      undefined,
      'System Admin / Demo Controller'
    );
  }, [applyResetDemo, addActivityLog]);

  // SIMULATE TRAIN MOVEMENT
  const simulateTrainMovement = useCallback(() => {
    setTrains((prev) =>
      prev.map((trn) => {
        let delta = trn.direction === 'UP' ? 1.5 : -1.5;
        let nextKm = +(trn.currentKm + delta).toFixed(1);
        if (nextKm > 100) nextKm = 2.0;
        if (nextKm < 0) nextKm = 98.0;

        return {
          ...trn,
          currentKm: nextKm,
        };
      })
    );
  }, []);

  // ADVANCE SIMULATED TIME
  const advanceSimulatedTime = useCallback(
    (minutes = 5) => {
      setSimulatedDate((prev) => new Date(prev.getTime() + minutes * 60 * 1000));
      // Also advance progress of any active tasks
      setBlocks((prev) =>
        prev.map((b) => {
          if (b.status === 'ACTIVE') {
            return {
              ...b,
              tasks: b.tasks.map((t) => {
                if (t.status === 'IN_PROGRESS') {
                  const nextP = Math.min(95, (t.progressPercent || 0) + 15);
                  return { ...t, progressPercent: nextP };
                }
                return t;
              }),
            };
          }
          return b;
        })
      );
      addActivityLog(
        'OPERATIONS',
        `Simulated Clock Advanced +${minutes} Mins`,
        `Operations timeline progressed to reflect field work execution.`,
        'Corridor Section',
        'INFO'
      );
    },
    [addActivityLog]
  );

  // SIMULATE DELAY
  const simulateDelay = useCallback(
    (minutes = 15) => {
      setTrains((prev) =>
        prev.map((t) => (t.id === 'trn-04' ? { ...t, status: 'DELAYED', delayMinutes: t.delayMinutes + minutes } : t))
      );
      addActivityLog(
        'OPERATIONS',
        `Signal Delay Simulated: Train #31317`,
        `Local EMU #31317 delayed by +${minutes} min at Naihati outer loop due to track inspection.`,
        'KM 36.1 Naihati Outer',
        'WARNING'
      );
    },
    [addActivityLog]
  );

  // DYNAMIC COMPUTED KPIS
  const activeBlocksCount = blocks.filter((b) => b.status === 'ACTIVE').length;
  const pendingRequestsCount = tasks.filter((t) => t.status === 'PENDING').length;
  const maintenanceTasksCount = tasks.filter((t) => t.status === 'IN_PROGRESS' || t.status === 'READY' || t.status === 'PENDING').length;
  
  const operationalAssets = assets.filter((a) => a.status === 'OPERATIONAL').length;
  const assetAvailability = +( (operationalAssets / assets.length) * 100 ).toFixed(1);

  const activeOrApprovedBlocks = blocks.filter((b) => b.status === 'ACTIVE' || b.status === 'APPROVED');
  const avgUtil = activeOrApprovedBlocks.length > 0
    ? Math.round(activeOrApprovedBlocks.reduce((sum, b) => sum + b.utilizationPercent, 0) / activeOrApprovedBlocks.length)
    : 87;

  const totalConflicts = blocks.reduce((sum, b) => sum + (b.status === 'ACTIVE' ? b.trainConflictsCount : 0), 0);
  const totalSavedMinutes = blocks.reduce((sum, b) => sum + (b.status === 'COMPLETED' || b.status === 'ACTIVE' || b.status === 'APPROVED' ? b.downtimeSavedMinutes : 0), 0);

  const kpis = {
    activeBlocks: activeBlocksCount,
    pendingRequests: pendingRequestsCount,
    maintenanceTasks: maintenanceTasksCount,
    assetAvailability: assetAvailability || 94.7,
    blockUtilisation: avgUtil || 87,
    trainConflicts: totalConflicts,
    downtimeSavedTotalMinutes: totalSavedMinutes || 135,
  };

  return (
    <RailwayContext.Provider
      value={{
        blocks,
        tasks,
        assets,
        stations,
        trackSections,
        trains,
        fieldCrews,
        equipment,
        activityLog,
        userRole,
        setUserRole,
        activeDivision,
        setActiveDivision,
        currentTimeStr,
        isPresentationMode,
        setIsPresentationMode,
        isDemoControlsOpen,
        setIsDemoControlsOpen,
        kpis,
        startTask,
        pauseTask,
        completeTask,
        approveBlock,
        activateBlock,
        rejectBlock,
        cancelBlock,
        toggleSafetyChecklist,
        reportObstruction,
        reportAssetIssue,
        resetDemo,
        simulateTrainMovement,
        advanceSimulatedTime,
        simulateDelay,
        addNewTask,
      }}
    >
      {children}
    </RailwayContext.Provider>
  );
};

export const useRailway = () => {
  const context = useContext(RailwayContext);
  if (!context) {
    throw new Error('useRailway must be used within a RailwayProvider');
  }
  return context;
};
