import { TaskAnalysis, WorkforceDistribution } from "@/types/assessment";
import { ReportData, ReportSummary } from "@/types/report";

export function buildReportData(
  tasks: TaskAnalysis[] = [],
  role: string = "Assessed Role",
  companyType: string = "General Organization",
  monthlyBudget: string = "N/A"
): ReportData {
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const totalTasks = safeTasks.length;

  let aiTasks = 0;
  let hybridTasks = 0;
  let humanTasks = 0;
  let outsourceTasks = 0;
  let estimatedAutomationOpportunity = 0;
  let highRiskTasks = 0;

  // Track unique tools across all tasks to prevent double counting
  const uniqueToolIds = new Set<string>();
  const uniqueTools: Array<{ id: string; name: string; estimatedCostRange?: string }> = [];

  // Track category cost ranges for conservative estimation
  let minCostSum = 0;
  let maxCostSum = 0;
  let hasValidCost = false;

  safeTasks.forEach((task) => {
    const rec = task?.recommendation;

    if (rec === "AI / AUTOMATE") {
      aiTasks++;
    } else if (rec === "HYBRID") {
      hybridTasks++;
    } else if (rec === "HUMAN") {
      humanTasks++;
    } else if (rec === "OUTSOURCE") {
      outsourceTasks++;
    }

    // Automation opportunity logic
    const hasAutomationPotential =
      rec === "AI / AUTOMATE" ||
      rec === "HYBRID" ||
      rec === "OUTSOURCE" ||
      (rec !== "HUMAN" && (task?.scores?.automationPotential ?? 0) > 40);

    if (hasAutomationPotential) {
      estimatedAutomationOpportunity++;
    }

    // High risk detection
    const isHighRisk =
      task?.automationAnalysis?.riskLevel === "HIGH" ||
      (task?.characteristics?.sensitivityRisk ?? 0) >= 65;

    if (isHighRisk) {
      highRiskTasks++;
    }

    // Collect tools uniquely from automation / hybrid / outsource tasks
    if (rec !== "HUMAN" && Array.isArray(task?.toolRecommendations)) {
      task.toolRecommendations.forEach((tool) => {
        if (tool && tool.id && !uniqueToolIds.has(tool.id)) {
          uniqueToolIds.add(tool.id);
          uniqueTools.push(tool);
        }
      });
    }

    // Calculate task costs safely without double counting
    const autoAnalysis = task?.automationAnalysis;
    if (
      rec !== "HUMAN" &&
      autoAnalysis &&
      typeof autoAnalysis.estimatedMonthlyCostMin === "number" &&
      typeof autoAnalysis.estimatedMonthlyCostMax === "number"
    ) {
      if (autoAnalysis.estimatedMonthlyCostMax > 0) {
        hasValidCost = true;
      }
    }
  });

  // Calculate unique tool-based or automation category cost sum
  // If unique tools exist, sum costs from unique tools or options
  if (uniqueTools.length > 0) {
    uniqueTools.forEach((tool) => {
      // Parse numerical figures if present in tool.estimatedCostRange
      // Standard fallback range if parseable
      const costText = tool.estimatedCostRange || "";
      const matches = costText.match(/₹?\s*([\d,]+)/g);
      if (matches && matches.length > 0) {
        const nums = matches.map((m) => parseInt(m.replace(/[^\d]/g, ""), 10)).filter((n) => !isNaN(n));
        if (nums.length === 1) {
          minCostSum += nums[0];
          maxCostSum += nums[0];
          hasValidCost = true;
        } else if (nums.length >= 2) {
          minCostSum += Math.min(nums[0], nums[1]);
          maxCostSum += Math.max(nums[0], nums[1]);
          hasValidCost = true;
        }
      }
    });
  }

  // If unique tool parsing didn't find specific numbers, aggregate from task automation analysis conservatively
  if (!hasValidCost || maxCostSum === 0) {
    minCostSum = 0;
    maxCostSum = 0;
    // Map categories to avoid double counting same software type across multiple tasks
    const processedCategories = new Set<string>();

    safeTasks.forEach((task) => {
      const autoAnalysis = task?.automationAnalysis;
      if (
        task?.recommendation !== "HUMAN" &&
        autoAnalysis &&
        autoAnalysis.category !== "HUMAN_ONLY"
      ) {
        const cat = autoAnalysis.category || "GENERAL";
        if (!processedCategories.has(cat)) {
          processedCategories.add(cat);
          minCostSum += autoAnalysis.estimatedMonthlyCostMin || 0;
          maxCostSum += autoAnalysis.estimatedMonthlyCostMax || 0;
          if ((autoAnalysis.estimatedMonthlyCostMax || 0) > 0) {
            hasValidCost = true;
          }
        }
      }
    });
  }

  let formattedEstimatedMonthlyCost = "Not available";

  if (hasValidCost && maxCostSum > 0) {
    if (minCostSum === maxCostSum || minCostSum === 0) {
      formattedEstimatedMonthlyCost = `₹${maxCostSum.toLocaleString("en-IN")}/mo (Estimated)`;
    } else {
      formattedEstimatedMonthlyCost = `₹${minCostSum.toLocaleString("en-IN")} - ₹${maxCostSum.toLocaleString("en-IN")}/mo (Estimated)`;
    }
  } else if (totalTasks > 0 && humanTasks === totalTasks) {
    formattedEstimatedMonthlyCost = "₹0 (Human-led role)";
  }

  const aiPercentage = totalTasks > 0 ? Math.round((aiTasks / totalTasks) * 100) : 0;
  const hybridPercentage = totalTasks > 0 ? Math.round((hybridTasks / totalTasks) * 100) : 0;
  const humanPercentage = totalTasks > 0 ? Math.round((humanTasks / totalTasks) * 100) : 0;
  const outsourcePercentage = totalTasks > 0 ? Math.round((outsourceTasks / totalTasks) * 100) : 0;

  const distribution: WorkforceDistribution = {
    aiCount: aiTasks,
    hybridCount: hybridTasks,
    humanCount: humanTasks,
    outsourceCount: outsourceTasks,
    aiPercentage,
    hybridPercentage,
    humanPercentage,
    outsourcePercentage,
  };

  const summary: ReportSummary = {
    totalTasks,
    aiTasks,
    hybridTasks,
    humanTasks,
    outsourceTasks,
    estimatedAutomationOpportunity,
    highRiskTasks,
    toolRecommendationCount: uniqueTools.length,
    estimatedMonthlyCost: formattedEstimatedMonthlyCost,
  };

  const assessmentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const executiveSummaryText =
    totalTasks === 0
      ? "No tasks evaluated in this assessment."
      : `${totalTasks} task${totalTasks === 1 ? "" : "s"} analyzed across the assessed role of ${role}. ${aiTasks + hybridTasks} task${aiTasks + hybridTasks === 1 ? "" : "s"} identified with high automation or AI-assisted potential. Several repetitive digital workflows are suitable for automation, while relationship-driven and high-judgment tasks remain human-led.`;

  return {
    role,
    companyType,
    monthlyBudget,
    assessmentDate,
    summary,
    distribution,
    tasks: safeTasks,
    executiveSummaryText,
  };
}
