export interface ProjectDetails {
  projectName: string;
  location: string;
  projectType: string;
  budget: number;
  durationMonths: number;
  description: string;
  areaSqFt: number;
}

export interface CostBreakdown {
  category: string;
  estimatedCost: number;
  details: string;
}

export interface ResourceItem {
  resourceName: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
}

export interface ScheduleEvent {
  phase: string;
  durationWeeks: number;
  milestone: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export interface BlueprintAnalysis {
  identifiedObjects: string[];
  safetyRisks: string[];
  designSuggestions: string[];
  complianceCheck: string;
}

export interface AIAnalysisResult {
  costBreakdown: CostBreakdown[];
  resources: ResourceItem[];
  schedule: ScheduleEvent[];
  optimizationSuggestions: string[];
  totalEstimatedCost: number;
  riskScore: number; // 0-100
}

export enum ViewState {
  HERO = 'HERO',
  PLANNING = 'PLANNING',
  BLUEPRINT = 'BLUEPRINT',
  DASHBOARD = 'DASHBOARD',
}
