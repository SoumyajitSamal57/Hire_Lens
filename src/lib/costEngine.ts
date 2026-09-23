import {
  AutomationCategory,
  ApproachType,
  RiskLevel,
  HumanInvolvement,
  AutomationOption,
  TaskAutomationAnalysis,
} from "@/types/automation";
import { TaskAnalysis } from "@/types/assessment";
import { AUTOMATION_CATALOG } from "./automationCatalog";

/**
 * Analyzes automation approach, cost ranges, time reduction, risk level, and human involvement for a task
 */
export function analyzeTaskAutomation(task: TaskAnalysis): TaskAutomationAnalysis {
  const { recommendation, characteristics, taskName } = task;
  const lowerTask = taskName.toLowerCase();

  // 1. Determine Approach
  let approach: ApproachType = "AI / Automation";
  if (recommendation === "HUMAN") {
    approach = "Human";
  } else if (recommendation === "HYBRID") {
    approach = "AI + Human";
  } else if (recommendation === "OUTSOURCE") {
    approach = "Outsource";
  }

  // 2. Determine Category
  let category: AutomationCategory = "WORKFLOW_AUTOMATION";

  if (recommendation === "HUMAN") {
    category = "HUMAN_ONLY";
  } else if (recommendation === "OUTSOURCE") {
    category = "OUTSOURCING";
  } else if (/(schedule|social media|buffer|hootsuite|appointment|calendar|book)/i.test(lowerTask)) {
    category = "SCHEDULING";
  } else if (/(crm|data entry|record|spreadsheet|log data|database)/i.test(lowerTask)) {
    category = "DATA_ENTRY_AUTOMATION";
  } else if (/(invoice|receipt|document|pdf|parse|extract)/i.test(lowerTask)) {
    category = "DOCUMENT_PROCESSING";
  } else if (/(email|inbox|ticket|support|inquiry|chat|help desk)/i.test(lowerTask)) {
    category = "CUSTOMER_SUPPORT";
  } else if (/(research|competitor|benchmark|market trend)/i.test(lowerTask)) {
    category = "RESEARCH";
  } else if (/(report|analytics|weekly report|monthly report|dashboard)/i.test(lowerTask)) {
    category = "WORKFLOW_AUTOMATION";
  } else if (/(payroll|bookkeeping|tax|accounting)/i.test(lowerTask)) {
    category = "ACCOUNTING";
  } else if (recommendation === "HYBRID") {
    category = "HYBRID";
  } else {
    category = "AI_ASSISTANT";
  }

  // 3. Determine Risk Level
  let riskLevel: RiskLevel = "LOW";
  const isHighRiskKeyword = /(refund|payroll|negotiate|angry customer|conflict|legal|financial|strategic decision|interview)/i.test(lowerTask);
  const isMedRiskKeyword = /(email|customer inquiry|documentation|moderation|marketing strategy|design|research)/i.test(lowerTask);

  if (
    characteristics.sensitivityRisk >= 65 ||
    characteristics.humanJudgment >= 80 ||
    characteristics.interpersonalInteraction >= 80 ||
    isHighRiskKeyword
  ) {
    riskLevel = "HIGH";
  } else if (
    characteristics.sensitivityRisk >= 40 ||
    characteristics.humanJudgment >= 50 ||
    characteristics.interpersonalInteraction >= 45 ||
    isMedRiskKeyword
  ) {
    riskLevel = "MEDIUM";
  } else {
    riskLevel = "LOW";
  }

  // 4. Determine Time Reduction Ranges
  let estimatedTimeReductionMin = 60;
  let estimatedTimeReductionMax = 90;

  if (approach === "Human") {
    estimatedTimeReductionMin = 0;
    estimatedTimeReductionMax = 15;
  } else if (approach === "AI + Human") {
    estimatedTimeReductionMin = 30;
    estimatedTimeReductionMax = 70;
  } else if (approach === "Outsource") {
    estimatedTimeReductionMin = 50;
    estimatedTimeReductionMax = 85;
  } else {
    // AI / Automation
    estimatedTimeReductionMin = 65;
    estimatedTimeReductionMax = 95;
  }

  // 5. Determine Human Involvement
  let humanInvolvement: HumanInvolvement = "Low";
  if (approach === "Human") {
    humanInvolvement = "High";
  } else if (approach === "AI + Human") {
    humanInvolvement = "Medium";
  } else if (approach === "Outsource") {
    humanInvolvement = "Low";
  } else {
    humanInvolvement = "Low";
  }

  // 6. Find Suggested Options from Catalog
  let suggestedOptions: AutomationOption[] = AUTOMATION_CATALOG.filter(
    (opt) => opt.category === category
  );

  if (suggestedOptions.length === 0) {
    if (approach === "AI / Automation") {
      suggestedOptions = AUTOMATION_CATALOG.filter(
        (opt) => opt.category === "WORKFLOW_AUTOMATION" || opt.category === "DATA_ENTRY_AUTOMATION"
      );
    } else if (approach === "Human") {
      suggestedOptions = AUTOMATION_CATALOG.filter(
        (opt) => opt.category === "HUMAN_ONLY"
      );
    } else if (approach === "Outsource") {
      suggestedOptions = AUTOMATION_CATALOG.filter(
        (opt) => opt.category === "OUTSOURCING"
      );
    } else {
      suggestedOptions = AUTOMATION_CATALOG.filter(
        (opt) => opt.category === "AI_ASSISTANT" || opt.category === "WORKFLOW_AUTOMATION"
      );
    }
  }

  // 7. Calculate Estimated Monthly Cost Ranges
  let estimatedMonthlyCostMin = 1000;
  let estimatedMonthlyCostMax = 3000;

  if (approach === "Human") {
    estimatedMonthlyCostMin = 0;
    estimatedMonthlyCostMax = 0;
  } else if (suggestedOptions.length > 0) {
    estimatedMonthlyCostMin = Math.min(...suggestedOptions.map((o) => o.estimatedMonthlyCostMin));
    estimatedMonthlyCostMax = Math.max(...suggestedOptions.map((o) => o.estimatedMonthlyCostMax));
  } else if (approach === "Outsource") {
    estimatedMonthlyCostMin = 4000;
    estimatedMonthlyCostMax = 12000;
  }

  // 8. Build Rationale & AI/Human Handles
  let rationale = "";
  let aiHandles: string | undefined;
  let humanHandles: string | undefined;

  switch (approach) {
    case "AI / Automation":
      rationale = `Highly standardizable digital workflow. Repetitive rules can be executed with software tools.`;
      break;

    case "Human":
      rationale = `Requires direct human ownership driven by interpersonal engagement, real-time trust, and complex judgment.`;
      break;

    case "AI + Human":
      rationale = `Best structured as a hybrid workflow where AI assists with routine execution while humans handle judgment, escalations, and oversight.`;
      aiHandles = "Routine processing, template drafting, data filtering, and initial triage.";
      humanHandles = "Final approvals, complex exceptions, empathy, and strategic decisions.";
      break;

    case "Outsource":
      rationale = `Specialized, non-core operational deliverable that is more economically handled by an external agency or contractor.`;
      break;
  }

  return {
    approach,
    category,
    suggestedOptions,
    estimatedMonthlyCostMin,
    estimatedMonthlyCostMax,
    estimatedTimeReductionMin,
    estimatedTimeReductionMax,
    humanInvolvement,
    riskLevel,
    rationale,
    aiHandles,
    humanHandles,
  };
}
