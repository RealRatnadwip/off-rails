import { MaintenanceTask, PriorityBreakdown } from '../types';

/**
 * AI Priority Score — Demonstration Model
 * Deterministic synthetic composite model representing multi-factor railway risk indices.
 * 
 * Formula:
 * Weighted Composite Score:
 *   Asset Criticality (Weight: 25%)
 *   Safety Risk (Weight: 30%)
 *   Overdue Factor (Weight: 15%)
 *   Operational Impact (Weight: 20%)
 *   Estimated Failure Probability (Weight: 10%)
 */
export function calculatePriorityScore(
  assetCriticality: number,
  safetyRisk: number,
  overdueFactor: number,
  operationalImpact: number,
  failureProbability: number
): PriorityBreakdown {
  const c = Math.min(100, Math.max(0, assetCriticality));
  const s = Math.min(100, Math.max(0, safetyRisk));
  const o = Math.min(100, Math.max(0, overdueFactor));
  const op = Math.min(100, Math.max(0, operationalImpact));
  const f = Math.min(100, Math.max(0, failureProbability));

  const weighted = c * 0.25 + s * 0.30 + o * 0.15 + op * 0.20 + f * 0.10;
  const finalScore = Math.round(weighted);

  return {
    assetCriticality: c,
    safetyRisk: s,
    overdueFactor: o,
    operationalImpact: op,
    failureProbability: f,
    finalScore,
  };
}

export function getPriorityBadgeColor(score: number): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  if (score >= 80) {
    return {
      bg: 'bg-red-950/80',
      text: 'text-red-300',
      border: 'border-red-600/60',
      label: 'CRITICAL',
    };
  }
  if (score >= 65) {
    return {
      bg: 'bg-amber-950/80',
      text: 'text-amber-300',
      border: 'border-amber-600/60',
      label: 'HIGH',
    };
  }
  if (score >= 45) {
    return {
      bg: 'bg-blue-950/80',
      text: 'text-blue-300',
      border: 'border-blue-600/60',
      label: 'MEDIUM',
    };
  }
  return {
    bg: 'bg-slate-800/80',
    text: 'text-slate-300',
    border: 'border-slate-600/60',
    label: 'LOW',
  };
}

export function explainPriorityScore(breakdown: PriorityBreakdown): string[] {
  const points: string[] = [];
  if (breakdown.assetCriticality >= 80) {
    points.push(`High Asset Criticality (${breakdown.assetCriticality}/100): High-speed mainline asset failure will cause cascading section delays.`);
  }
  if (breakdown.safetyRisk >= 85) {
    points.push(`Severe Safety Risk (${breakdown.safetyRisk}/100): Urgent track/traction defect threatens derailment or dewirement envelope.`);
  }
  if (breakdown.overdueFactor >= 65) {
    points.push(`Overdue Factor (${breakdown.overdueFactor}/100): Statutory maintenance window exceeded beyond safe tolerance threshold.`);
  }
  if (breakdown.operationalImpact >= 75) {
    points.push(`Operational Impact (${breakdown.operationalImpact}/100): Direct interference with suburban commuter and Mail/Express corridors.`);
  }
  if (breakdown.failureProbability >= 50) {
    points.push(`Estimated Failure Probability (${breakdown.failureProbability}/100): USFD flaw growth and mechanical wear indices indicate imminent degradation.`);
  }
  return points;
}
