import { TaskAutomationAnalysis } from "./automation";
import { AIIntelligence } from "./aiIntelligence";
import { ToolSolution } from "./tools";

export interface AssessmentFormData {
  jobRole: string;
  companyType: string;
  monthlyBudget: string;
  tasks: string[];
}

export interface FormErrors {
  jobRole?: string;
  companyType?: string;
  monthlyBudget?: string;
  tasks?: string;
  taskItems?: Record<number, string>;
}

export type RecommendationType =
  | "AI / AUTOMATE"
  | "HUMAN"
  | "HYBRID"
  | "OUTSOURCE";

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LOW";

export interface TaskCharacteristics {
  repetition: number; // 0-100
  predictability: number; // 0-100
  digitalNature: number; // 0-100
  humanJudgment: number; // 0-100
  interpersonalInteraction: number; // 0-100
  creativity: number; // 0-100
  physicalPresence: number; // 0-100
  sensitivityRisk: number; // 0-100
}

export interface TaskScores {
  automationPotential: number; // 0-100
  humanNecessity: number; // 0-100
  outsourcingSuitability: number; // 0-100
}

export interface TaskAnalysis {
  id: number;
  taskName: string;
  recommendation: RecommendationType;
  confidence: ConfidenceLevel;
  characteristics: TaskCharacteristics;
  scores: TaskScores;
  explanation: string;
  keyFactors: string[];
  automationAnalysis?: TaskAutomationAnalysis;
  aiIntelligence?: AIIntelligence;
  toolRecommendations?: ToolSolution[];
}

export interface WorkforceDistribution {
  aiPercentage: number;
  humanPercentage: number;
  hybridPercentage: number;
  outsourcePercentage: number;
  aiCount: number;
  humanCount: number;
  hybridCount: number;
  outsourceCount: number;
}

export interface AssessmentResult {
  role: string;
  companyType: string;
  monthlyBudget: string;
  tasks: TaskAnalysis[];
  overallRecommendation: string;
  overallInsight: string;
  distribution: WorkforceDistribution;
}
