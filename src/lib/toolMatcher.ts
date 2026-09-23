import { TaskAnalysis } from "@/types/assessment";
import { ToolSolution } from "@/types/tools";
import { TOOL_CATALOG } from "./toolCatalog";

/**
 * Deterministically matches relevant software/tools or external solutions for a given task analysis.
 * Adheres strictly to Human-Only and High-Risk safeguards.
 */
export function matchTools(task: TaskAnalysis): ToolSolution[] {
  if (!task || !task.taskName) {
    return [];
  }

  const rec = task.recommendation;
  const isHumanOnly = rec === "HUMAN";
  const autoCategory = task.automationAnalysis?.category || "";
  const isHighRisk =
    task.automationAnalysis?.riskLevel === "HIGH" ||
    (task.characteristics && task.characteristics.sensitivityRisk > 60);

  const normalizedTaskName = task.taskName.toLowerCase().trim();
  const normalizedKeyFactors = (task.keyFactors || []).map((f) => f.toLowerCase());

  // Filter candidate tools based on safeguards
  const candidates = TOOL_CATALOG.filter((tool) => {
    // Safeguard 1: For HUMAN recommendation, DO NOT recommend tools that replace human execution
    if (isHumanOnly) {
      if (!tool.isHumanSupportOnly) {
        return false;
      }
    }

    // Safeguard 2: For HIGH-risk tasks, DO NOT recommend low-oversight tools
    if (isHighRisk) {
      if (tool.humanOversight === "LOW") {
        return false;
      }
    }

    return true;
  });

  // Calculate score for each candidate tool
  const scored = candidates.map((tool) => {
    let score = 0;

    // 1. Category Matching (+10 points for exact match, +5 for related category)
    if (tool.category === autoCategory) {
      score += 10;
    } else if (
      (autoCategory === "CUSTOMER_SUPPORT" && tool.category === "EMAIL_AUTOMATION") ||
      (autoCategory === "WORKFLOW_AUTOMATION" && tool.category === "PROJECT_MANAGEMENT") ||
      (autoCategory === "DATA_ENTRY_AUTOMATION" && tool.category === "DATA_ENTRY") ||
      (autoCategory === "DOCUMENT_PROCESSING" && (tool.category === "DOCUMENTATION" || tool.category === "INVOICING")) ||
      (autoCategory === "SCHEDULING" && tool.category === "SCHEDULING") ||
      (autoCategory === "ACCOUNTING" && (tool.category === "INVOICING" || tool.category === "PAYROLL")) ||
      (autoCategory === "OUTSOURCING" && tool.category === "OUTSOURCING")
    ) {
      score += 5;
    }

    // 2. Keyword Matching (+3 points per keyword match)
    for (const keyword of tool.keywords) {
      const kw = keyword.toLowerCase();
      if (normalizedTaskName.includes(kw)) {
        score += 3;
      }
      for (const factor of normalizedKeyFactors) {
        if (factor.includes(kw)) {
          score += 1;
        }
      }
    }

    // 3. Recommendation Compatibility
    if (rec === "AI / AUTOMATE" && tool.humanOversight === "LOW") {
      score += 5;
    } else if (rec === "HYBRID" && tool.humanOversight === "MEDIUM") {
      score += 5;
    } else if (rec === "OUTSOURCE" && (tool.category === "OUTSOURCING" || tool.pricingType === "CUSTOM")) {
      score += 8;
    } else if (rec === "HUMAN" && tool.humanOversight === "HIGH") {
      score += 5;
    }

    return { tool, score };
  });

  // Filter out non-matching candidates (score must be > 0)
  const validScored = scored.filter((item) => item.score > 0);

  // Sort by score descending
  validScored.sort((a, b) => b.score - a.score);

  // Deduplicate and limit to top 3
  const seenIds = new Set<string>();
  const results: ToolSolution[] = [];

  for (const item of validScored) {
    if (!seenIds.has(item.tool.id)) {
      seenIds.add(item.tool.id);
      results.push(item.tool);
    }
    if (results.length >= 3) {
      break;
    }
  }

  return results;
}
