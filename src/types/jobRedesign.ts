export type HiringVerdict =
  | "DO_NOT_HIRE_FULLTIME"
  | "HIRE_SPECIALIST_OPERATOR"
  | "HIRE_PART_TIME"
  | "HIRE_FULL_TIME_HUMAN";

export interface RetainedHumanTask {
  taskName: string;
  reason: string;
  priority: "High" | "Medium";
}

export interface AutomatedTaskSpec {
  taskName: string;
  primaryTool?: string;
  humanTimeSavedWeeklyHours: number;
}

export interface HybridTaskSpec {
  taskName: string;
  humanRole: string;
  aiRole: string;
}

export interface OutsourcedTaskSpec {
  taskName: string;
  suggestedVendorType: string;
}

export interface RebalancedWorkload {
  retainedHumanTasks: RetainedHumanTask[];
  automatedTasks: AutomatedTaskSpec[];
  hybridTasks: HybridTaskSpec[];
  outsourcedTasks: OutsourcedTaskSpec[];
}

export interface CapacityMetrics {
  originalWeeklyHours: number;
  freedWeeklyHours: number;
  newHumanWeeklyHours: number;
  efficiencyGainPercentage: number;
}

export interface FinancialImpact {
  originalBudgetMonthly: number;
  estimatedMonthlyToolCosts: number;
  suggestedNewMonthlyComp: number;
  estimatedMonthlySavings: number;
  estimatedAnnualSavings: number;
  roiPercentage: number;
}

export interface ModernJobDescription {
  title: string;
  departmentOrType: string;
  summary: string;
  coreResponsibilities: string[];
  toolsAndAiProficiencies: string[];
  humanSuperpowers: string[];
  performanceMetrics: string[];
  formattedMarkdown: string;
}

export interface JobRedesignPlan {
  originalRole: string;
  redesignedTitle: string;
  hiringVerdict: HiringVerdict;
  hiringVerdictLabel: string;
  hiringVerdictReasoning: string;
  workload: RebalancedWorkload;
  capacity: CapacityMetrics;
  financial: FinancialImpact;
  modernJobDescription: ModernJobDescription;
}
