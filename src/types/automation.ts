export type AutomationCategory =
  | "AI_ASSISTANT"
  | "WORKFLOW_AUTOMATION"
  | "DATA_ENTRY_AUTOMATION"
  | "CUSTOMER_SUPPORT"
  | "ACCOUNTING"
  | "SCHEDULING"
  | "DOCUMENT_PROCESSING"
  | "RESEARCH"
  | "HUMAN_ONLY"
  | "OUTSOURCING"
  | "HYBRID";

export type ApproachType =
  | "AI / Automation"
  | "Human"
  | "AI + Human"
  | "Outsource";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type HumanInvolvement = "Low" | "Medium" | "High";

export interface AutomationOption {
  id: string;
  name: string;
  category: AutomationCategory;
  description: string;
  estimatedMonthlyCostMin: number;
  estimatedMonthlyCostMax: number;
  typicalTimeReductionMin: number;
  typicalTimeReductionMax: number;
  suitableFor: string[];
  limitations: string[];
}

export interface TaskAutomationAnalysis {
  approach: ApproachType;
  category: AutomationCategory;
  suggestedOptions: AutomationOption[];
  estimatedMonthlyCostMin: number;
  estimatedMonthlyCostMax: number;
  estimatedTimeReductionMin: number;
  estimatedTimeReductionMax: number;
  humanInvolvement: HumanInvolvement;
  riskLevel: RiskLevel;
  rationale: string;
  aiHandles?: string;
  humanHandles?: string;
}
