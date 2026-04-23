
export type EvolutionStage = 'I_NOISY_DISCOVERY' | 'II_STRUCTURAL_COMPOUNDING' | 'III_RECURSIVE_CONTINUATION';
export type ViewMode = 'DASHBOARD' | 'KNOWLEDGE_HUB' | 'TRAINING_POD' | 'GRIMOIRE';

export interface SystemMetrics {
  gdi: number; // Goal Drift Index
  car: number; // Capability Alignment Ratio
  compressionRatio: number;
  epistemicStability: number;
  testTimeCompute: number;
}

export interface Skill {
  id: string;
  name: string;
  timestamp: string;
  status: 'PROMOTED' | 'EVALUATING' | 'GATED';
  compressionRatio: number;
}

export interface DialecticEntry {
  id: string;
  timestamp: string;
  cadence: number;
  content: string;
  layer: 'BASE' | 'DIALECTIC';
}

export interface TrajectoryPoint {
  iteration: number;
  tokens: number;
  efficiency: number;
  entropy: number;
}
