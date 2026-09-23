export type ToolCategory =
  | "SCHEDULING"
  | "CRM"
  | "CUSTOMER_SUPPORT"
  | "INVOICING"
  | "PAYROLL"
  | "EMAIL_AUTOMATION"
  | "MEETING"
  | "DOCUMENTATION"
  | "PROJECT_MANAGEMENT"
  | "MARKETING"
  | "DATA_ENTRY"
  | "ANALYTICS"
  | "HR"
  | "DESIGN"
  | "CONTENT"
  | "OUTSOURCING";

export type PricingType =
  | "ESTIMATED"
  | "CUSTOM"
  | "FREE_TIER"
  | "UNKNOWN";

export type HumanOversight = "LOW" | "MEDIUM" | "HIGH";

export interface ToolSolution {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  bestFor: string;
  limitations: string;
  humanOversight: HumanOversight;
  pricingType: PricingType;
  estimatedCostRange: string;
  keywords: string[];
  isHumanSupportOnly?: boolean;
}
