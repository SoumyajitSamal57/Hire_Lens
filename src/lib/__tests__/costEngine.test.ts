import { describe, it, expect } from "vitest";
import { analyzeTask } from "../taskAnalyzer";
import { analyzeTaskAutomation } from "../costEngine";

describe("costEngine - Cost & Automation Intelligence", () => {
  describe("Task 1: Schedule social media posts", () => {
    it("evaluates approach, category, cost range, risk, and human involvement", () => {
      const task = analyzeTask("Schedule social media posts", 0);
      const auto = task.automationAnalysis!;

      expect(auto.approach).toBe("AI / Automation");
      expect(auto.category).toBe("SCHEDULING");
      expect(auto.riskLevel).toBe("LOW");
      expect(auto.humanInvolvement).toBe("Low");
      expect(auto.estimatedTimeReductionMin).toBeGreaterThanOrEqual(60);
      expect(auto.estimatedMonthlyCostMin).toBeGreaterThan(0);
    });
  });

  describe("Task 2: Enter CRM records", () => {
    it("identifies DATA_ENTRY_AUTOMATION with LOW risk", () => {
      const task = analyzeTask("Enter CRM records", 0);
      const auto = task.automationAnalysis!;

      expect(auto.approach).toBe("AI / Automation");
      expect(auto.category).toBe("DATA_ENTRY_AUTOMATION");
      expect(auto.riskLevel).toBe("LOW");
    });
  });

  describe("Task 3: Process routine invoices", () => {
    it("identifies DOCUMENT_PROCESSING with high time reduction", () => {
      const task = analyzeTask("Process routine invoices", 0);
      const auto = task.automationAnalysis!;

      expect(auto.approach).toBe("AI / Automation");
      expect(auto.category).toBe("DOCUMENT_PROCESSING");
      expect(auto.estimatedTimeReductionMax).toBeGreaterThanOrEqual(80);
    });
  });

  describe("Task 4: Reply to basic customer emails", () => {
    it("evaluates hybrid approach for CUSTOMER_SUPPORT with MEDIUM risk", () => {
      const task = analyzeTask("Reply to basic customer emails", 0);
      const auto = task.automationAnalysis!;

      expect(auto.approach).toBe("AI + Human");
      expect(auto.category).toBe("CUSTOMER_SUPPORT");
      expect(auto.humanInvolvement).toBe("Medium");
      expect(auto.riskLevel).toBe("MEDIUM");
      expect(auto.aiHandles).toBeDefined();
      expect(auto.humanHandles).toBeDefined();
    });
  });

  describe("Task 5: Attend client meetings", () => {
    it("evaluates Human-only approach with 0-15% time reduction and High human involvement", () => {
      const task = analyzeTask("Attend client meetings", 0);
      const auto = task.automationAnalysis!;

      expect(auto.approach).toBe("Human");
      expect(auto.category).toBe("HUMAN_ONLY");
      expect(auto.humanInvolvement).toBe("High");
      expect(auto.estimatedTimeReductionMax).toBeLessThanOrEqual(15);
      expect(auto.estimatedMonthlyCostMin).toBe(0);
    });
  });

  describe("Task 6: Negotiate with suppliers", () => {
    it("evaluates Human-only approach with HIGH risk", () => {
      const task = analyzeTask("Negotiate with suppliers", 0);
      const auto = task.automationAnalysis!;

      expect(auto.approach).toBe("Human");
      expect(auto.riskLevel).toBe("HIGH");
      expect(auto.humanInvolvement).toBe("High");
    });
  });

  describe("Task 7: Payroll processing", () => {
    it("evaluates Outsource approach with HIGH risk and high time reduction", () => {
      const task = analyzeTask("Payroll processing", 0);
      const auto = task.automationAnalysis!;

      expect(auto.approach).toBe("Outsource");
      expect(auto.category).toBe("OUTSOURCING");
      expect(auto.riskLevel).toBe("HIGH");
      expect(auto.estimatedTimeReductionMin).toBeGreaterThanOrEqual(50);
      expect(auto.estimatedMonthlyCostMin).toBeGreaterThan(0);
    });
  });

  describe("Task 8: Approve refunds", () => {
    it("evaluates Hybrid approach with HIGH risk and Medium human involvement", () => {
      const task = analyzeTask("Approve refunds", 0);
      const auto = task.automationAnalysis!;

      expect(auto.approach).toBe("AI + Human");
      expect(auto.riskLevel).toBe("HIGH");
      expect(auto.humanInvolvement).toBe("Medium");
    });
  });

  describe("Task 9: Visit customers onsite", () => {
    it("evaluates Human-only approach for physical presence", () => {
      const task = analyzeTask("Visit customers onsite", 0);
      const auto = task.automationAnalysis!;

      expect(auto.approach).toBe("Human");
      expect(auto.category).toBe("HUMAN_ONLY");
      expect(auto.humanInvolvement).toBe("High");
    });
  });

  describe("Task 10: Competitor research", () => {
    it("identifies RESEARCH category", () => {
      const task = analyzeTask("Competitor research", 0);
      const auto = task.automationAnalysis!;

      expect(auto.category).toBe("RESEARCH");
      expect(["AI / Automation", "AI + Human"]).toContain(auto.approach);
    });
  });
});
