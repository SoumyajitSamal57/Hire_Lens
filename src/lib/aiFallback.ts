import { TaskAnalysis } from "@/types/assessment";
import { AIIntelligence } from "@/types/aiIntelligence";

/**
 * Type guard to validate whether an unknown object adheres strictly to AIIntelligence structure.
 */
export function validateAIIntelligence(data: unknown): data is AIIntelligence {
  if (!data || typeof data !== "object") return false;
  const obj = data as Record<string, unknown>;

  const isStringArray = (arr: unknown): boolean =>
    Array.isArray(arr) &&
    arr.length > 0 &&
    arr.every((item) => typeof item === "string" && item.trim().length > 0);

  return (
    isStringArray(obj.implementationPlan) &&
    isStringArray(obj.automateTasks) &&
    isStringArray(obj.humanResponsibilities) &&
    isStringArray(obj.workflow) &&
    isStringArray(obj.keyRisks) &&
    typeof obj.recommendation === "string" &&
    obj.recommendation.trim().length > 0
  );
}

/**
 * Generates a deterministic fallback AI intelligence structure from existing task analysis.
 * Used when LLM API fails, times out, rate limits, or returns malformed response.
 */
export function generateFallbackAIIntelligence(task: TaskAnalysis): AIIntelligence {
  const taskName = task.taskName || "this task";
  const rec = task.recommendation;
  const auto = task.automationAnalysis;
  const categoryName = auto?.category
    ? auto.category.replace(/_/g, " ").toLowerCase()
    : "software automation";

  if (rec === "AI / AUTOMATE") {
    return {
      implementationPlan: [
        `Identify input data formats and repetitive execution patterns for ${taskName}`,
        `Deploy specialized ${auto?.suggestedOptions[0]?.name || categoryName} software`,
        `Establish automated exception alerts and periodic human quality audits`
      ],
      automateTasks: [
        `Data entry and initial processing for ${taskName}`,
        `Standard rule-based execution and scheduling`,
        `Automated status logging and notifications`
      ],
      humanResponsibilities: [
        `System setup, configuration, and prompt management`,
        `Periodic sampling of automated outputs for quality assurance`,
        `Handling edge cases and system exceptions`
      ],
      workflow: [
        `Task triggered`,
        `Automated ${categoryName} execution`,
        `System validation`,
        `Completion logged`
      ],
      keyRisks: [
        `Unexpected input formatting variations`,
        `Unnoticed pipeline failure without monitoring`,
        `Over-reliance on automation without regular audits`
      ],
      recommendation: `Automate ${taskName} using ${categoryName} tools to maximize efficiency while setting up automated exception monitoring.`
    };
  }

  if (rec === "HYBRID") {
    return {
      implementationPlan: [
        `Segment ${taskName} into routine execution vs complex decision points`,
        `Deploy AI/software to handle ${auto?.aiHandles || "routine triage and response drafting"}`,
        `Establish human escalation protocols for ${auto?.humanHandles || "sensitive or high-risk exceptions"}`
      ],
      automateTasks: [
        `Task classification and categorization`,
        `Drafting preliminary responses or records`,
        `Workload routing to designated human staff`
      ],
      humanResponsibilities: [
        `Reviewing and approving AI-generated drafts for sensitive items`,
        `Handling escalated edge cases and complex customer scenarios`,
        `Final authority on high-impact decisions`
      ],
      workflow: [
        `Input received`,
        `AI classification & draft`,
        `Routine → AI auto-resolve`,
        `Complex → Human review`
      ],
      keyRisks: [
        `Incorrect AI classification leading to misrouted tasks`,
        `Delayed human response on escalated items`
      ],
      recommendation: `Use AI for first-line processing of ${taskName} while keeping human experts in the loop for complex escalations.`
    };
  }

  if (rec === "OUTSOURCE") {
    return {
      implementationPlan: [
        `Define standard operating procedures, SLAs, and acceptance criteria for ${taskName}`,
        `Engage a qualified external service provider or contractor`,
        `Establish weekly deliverable reviews and QA checkpoints`
      ],
      automateTasks: [
        `Task dispatch and progress tracking via vendor portals`,
        `Automated SLA milestone notifications`,
        `Invoice and deliverable logging`
      ],
      humanResponsibilities: [
        `Vendor selection and contract management`,
        `Evaluating delivered work against defined quality standards`,
        `Strategic oversight and vendor communication`
      ],
      workflow: [
        `Requirements finalized`,
        `Dispatched to external provider`,
        `Provider execution`,
        `Internal human sign-off`
      ],
      keyRisks: [
        `Vendor turnaround delays`,
        `Variability in third-party work quality`,
        `External dependency for core operational tasks`
      ],
      recommendation: `Outsource ${taskName} to a trusted external provider to reduce internal overhead while maintaining strict SLA monitoring.`
    };
  }

  // HUMAN
  return {
    implementationPlan: [
      `Document standard procedures and decision guidelines for ${taskName}`,
      `Assign primary responsibility to qualified in-house staff`,
      `Leverage basic software for administrative support and tracking`
    ],
    automateTasks: [
      `Deadline scheduling and reminder notifications`,
      `Document indexing and template storage`,
      `Basic activity logging`
    ],
    humanResponsibilities: [
      `End-to-end execution of ${taskName}`,
      `Critical judgment, strategy, and emotional intelligence`,
      `Direct stakeholder engagement and quality control`
    ],
    workflow: [
      `Task assigned`,
      `Human evaluation & execution`,
      `Quality verification`,
      `Final delivery`
    ],
    keyRisks: [
      `Capacity bottlenecks during peak volume`,
      `Key-person dependency if SOPs are not documented`
    ],
    recommendation: `Retain ${taskName} under human ownership due to required judgment and interpersonal nuance, supported by software tools.`
  };
}
