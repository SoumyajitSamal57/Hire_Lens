import { TaskAnalysis, WorkforceDistribution } from "./assessment";

export interface ReportSummary {
  totalTasks: number;
  aiTasks: number;
  hybridTasks: number;
  humanTasks: number;
  outsourceTasks: number;
  estimatedAutomationOpportunity: number;
  highRiskTasks: number;
  toolRecommendationCount: number;
  estimatedMonthlyCost: string;
}

export interface ReportData {
  role: string;
  companyType: string;
  monthlyBudget: string;
  assessmentDate: string;
  summary: ReportSummary;
  distribution: WorkforceDistribution;
  tasks: TaskAnalysis[];
  executiveSummaryText: string;
}
