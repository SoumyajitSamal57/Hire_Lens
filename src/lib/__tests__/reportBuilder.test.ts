import { describe, it, expect } from "vitest";
import { buildReportData } from "../reportBuilder";
import { analyzeTask } from "../taskAnalyzer";
import { TaskAnalysis } from "@/types/assessment";

describe("reportBuilder - PDF Executive Report Data Builder", () => {
  it("handles empty task array gracefully", () => {
    const report = buildReportData([], "Marketing Lead", "Agency", "50000");

    expect(report.summary.totalTasks).toBe(0);
    expect(report.summary.aiTasks).toBe(0);
    expect(report.summary.hybridTasks).toBe(0);
    expect(report.summary.humanTasks).toBe(0);
    expect(report.summary.outsourceTasks).toBe(0);
    expect(report.summary.estimatedAutomationOpportunity).toBe(0);
    expect(report.summary.highRiskTasks).toBe(0);
    expect(report.summary.estimatedMonthlyCost).toBe("Not available");
    expect(report.distribution.aiPercentage).toBe(0);
    expect(report.distribution.hybridPercentage).toBe(0);
    expect(report.distribution.humanPercentage).toBe(0);
    expect(report.distribution.outsourcePercentage).toBe(0);
  });

  it("calculates correct task counts and workforce percentages", () => {
    // Create 4 distinct tasks: 1 AI, 1 Hybrid, 1 Human, 1 Outsource
    const aiTask = analyzeTask("Schedule social media posts", 1);
    const hybridTask = analyzeTask("Reply to basic customer emails", 2);
    const humanTask = analyzeTask("Attend client meetings", 3);
    const outsourceTask = analyzeTask("Process payroll", 4);

    const tasks: TaskAnalysis[] = [aiTask, hybridTask, humanTask, outsourceTask];
    const report = buildReportData(tasks, "Operations Specialist", "Startup", "60000");

    expect(report.summary.totalTasks).toBe(4);
    expect(report.summary.aiTasks).toBe(1);
    expect(report.summary.hybridTasks).toBe(1);
    expect(report.summary.humanTasks).toBe(1);
    expect(report.summary.outsourceTasks).toBe(1);

    // Percentages: 1/4 = 25% each
    expect(report.distribution.aiPercentage).toBe(25);
    expect(report.distribution.hybridPercentage).toBe(25);
    expect(report.distribution.humanPercentage).toBe(25);
    expect(report.distribution.outsourcePercentage).toBe(25);
  });

  it("identifies high-risk tasks and automation opportunities correctly", () => {
    const task1 = analyzeTask("Schedule social media posts", 1); // LOW risk, AI
    const task2 = analyzeTask("Negotiate with suppliers", 2); // HIGH risk, HUMAN
    const task3 = analyzeTask("Approve refunds", 3); // HIGH risk, HYBRID

    const tasks = [task1, task2, task3];
    const report = buildReportData(tasks);

    expect(report.summary.totalTasks).toBe(3);
    expect(report.summary.highRiskTasks).toBeGreaterThanOrEqual(2);
    expect(report.summary.estimatedAutomationOpportunity).toBe(2); // task1 (AI) and task3 (HYBRID)
  });

  it("handles missing optional fields without crashing", () => {
    const incompleteTask: Partial<TaskAnalysis> = {
      id: 99,
      taskName: "Minimal Task",
      recommendation: "AI / AUTOMATE",
      confidence: "HIGH",
    };

    const report = buildReportData([incompleteTask as TaskAnalysis]);

    expect(report.summary.totalTasks).toBe(1);
    expect(report.summary.aiTasks).toBe(1);
    expect(report.summary.highRiskTasks).toBe(0);
    expect(report.executiveSummaryText).toBeDefined();
    expect(report.distribution.aiPercentage).toBe(100);
  });

  it("prevents double-counting cost when repeated tool recommendations appear across tasks", () => {
    const repeatedTool = {
      id: "tool-buffer",
      name: "Buffer",
      category: "SCHEDULING" as const,
      description: "Social media scheduler",
      bestFor: "Scheduling posts",
      limitations: "API limits",
      humanOversight: "LOW" as const,
      pricingType: "ESTIMATED" as const,
      estimatedCostRange: "₹1,500 - ₹3,000/mo",
      keywords: ["schedule"],
    };

    const task1: TaskAnalysis = {
      ...analyzeTask("Schedule Twitter posts", 1),
      toolRecommendations: [repeatedTool],
    };

    const task2: TaskAnalysis = {
      ...analyzeTask("Schedule LinkedIn posts", 2),
      toolRecommendations: [repeatedTool],
    };

    const report = buildReportData([task1, task2]);

    expect(report.summary.toolRecommendationCount).toBe(1); // Unique tools = 1
    // Cost for Buffer should only be counted once (1,500 - 3,000) not duplicated (3,000 - 6,000)
    expect(report.summary.estimatedMonthlyCost).toContain("₹1,500 - ₹3,000/mo");
  });

  it("clearly labels estimated monthly cost and maintains benchmark warning", () => {
    const task = analyzeTask("Schedule social media posts", 1);
    const report = buildReportData([task]);

    expect(report.summary.estimatedMonthlyCost).toContain("(Estimated)");
    expect(report.summary.estimatedMonthlyCost).not.toBe("Not available");
  });

  it("returns zero cost label when all tasks are human-led", () => {
    const humanTask1 = analyzeTask("Attend client meetings", 1);
    const humanTask2 = analyzeTask("Negotiate with suppliers", 2);

    const report = buildReportData([humanTask1, humanTask2]);
    expect(report.summary.estimatedMonthlyCost).toBe("₹0 (Human-led role)");
  });
});
