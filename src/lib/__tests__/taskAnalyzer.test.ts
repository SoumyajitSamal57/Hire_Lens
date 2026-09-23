import { describe, it, expect } from "vitest";
import {
  analyzeTask,
  analyzeAssessment,
  calculateScores,
  determineRecommendation,
  calculateConfidence,
  generateExplanation,
} from "../taskAnalyzer";
import { RecommendationType } from "@/types/assessment";

describe("taskAnalyzer - Core Decision Engine", () => {
  describe("Benchmark Task Classification Tests (20 Required Tasks)", () => {
    const benchmarkCases: Array<{
      task: string;
      allowedRecommendations: RecommendationType[];
    }> = [
      {
        task: "Schedule social media posts",
        allowedRecommendations: ["AI / AUTOMATE"],
      },
      {
        task: "Enter CRM records",
        allowedRecommendations: ["AI / AUTOMATE"],
      },
      {
        task: "Process routine invoices",
        allowedRecommendations: ["AI / AUTOMATE"],
      },
      {
        task: "Book customer appointments",
        allowedRecommendations: ["AI / AUTOMATE"],
      },
      {
        task: "Attend client meetings",
        allowedRecommendations: ["HUMAN"],
      },
      {
        task: "Negotiate with suppliers",
        allowedRecommendations: ["HUMAN"],
      },
      {
        task: "Handle angry customers",
        allowedRecommendations: ["HUMAN", "HYBRID"],
      },
      {
        task: "Develop marketing strategy",
        allowedRecommendations: ["HUMAN", "HYBRID"],
      },
      {
        task: "Reply to basic customer emails",
        allowedRecommendations: ["HYBRID"],
      },
      {
        task: "Competitor research",
        allowedRecommendations: ["AI / AUTOMATE", "HYBRID"],
      },
      {
        task: "Payroll processing",
        allowedRecommendations: ["OUTSOURCE", "AI / AUTOMATE"],
      },
      {
        task: "Graphic design for campaign concepts",
        allowedRecommendations: ["HUMAN", "HYBRID"],
      },
      {
        task: "Visit customers onsite",
        allowedRecommendations: ["HUMAN"],
      },
      {
        task: "Data entry",
        allowedRecommendations: ["AI / AUTOMATE"],
      },
      {
        task: "Technical documentation",
        allowedRecommendations: ["HYBRID"],
      },
      {
        task: "Approve refunds",
        allowedRecommendations: ["HUMAN", "HYBRID"],
      },
      {
        task: "Social media comment moderation",
        allowedRecommendations: ["HYBRID"],
      },
      {
        task: "Strategic business decisions",
        allowedRecommendations: ["HUMAN"],
      },
      {
        task: "Basic report generation",
        allowedRecommendations: ["AI / AUTOMATE"],
      },
      {
        task: "Employee interviews",
        allowedRecommendations: ["HUMAN"],
      },
    ];

    benchmarkCases.forEach(({ task, allowedRecommendations }, index) => {
      it(`Task ${index + 1}: "${task}" should evaluate to [${allowedRecommendations.join(", ")}]`, () => {
        const result = analyzeTask(task, index);
        expect(allowedRecommendations).toContain(result.recommendation);
      });
    });
  });

  describe("Confidence Level Determination", () => {
    it("assigns HIGH confidence for clear AI automation tasks", () => {
      const result = analyzeTask("Data entry", 0);
      expect(result.recommendation).toBe("AI / AUTOMATE");
      expect(result.confidence).toBe("HIGH");
    });

    it("assigns HIGH confidence for clear Human tasks with high interpersonal & judgment", () => {
      const result = analyzeTask("Attend client meetings", 0);
      expect(result.recommendation).toBe("HUMAN");
      expect(result.confidence).toBe("HIGH");
    });

    it("assigns valid confidence level (HIGH | MEDIUM | LOW) for all analyzed tasks", () => {
      const result = analyzeTask("Reply to basic customer emails", 0);
      expect(["HIGH", "MEDIUM", "LOW"]).toContain(result.confidence);
    });
  });

  describe("Dynamic Explanation Generation", () => {
    it("generates a meaningful deterministic explanation", () => {
      const result = analyzeTask("Schedule social media posts", 0);
      expect(result.explanation).toContain("Highly suited for software automation");
      expect(result.explanation).toContain("repetitive");
    });

    it("generates explanation reflecting human necessity factors", () => {
      const result = analyzeTask("Negotiate with suppliers", 0);
      expect(result.explanation).toContain("Requires direct human ownership");
    });
  });

  describe("Full Assessment & Workforce Distribution", () => {
    it("correctly calculates workforce percentages across multiple tasks", () => {
      const assessmentResult = analyzeAssessment({
        jobRole: "Operations Coordinator",
        companyType: "Startup",
        monthlyBudget: "50000",
        tasks: [
          "Data entry",
          "Process routine invoices",
          "Attend client meetings",
          "Reply to basic customer emails",
        ],
      });

      expect(assessmentResult.tasks).toHaveLength(4);
      expect(assessmentResult.distribution.aiCount).toBe(2);
      expect(assessmentResult.distribution.humanCount).toBe(1);
      expect(assessmentResult.distribution.hybridCount).toBe(1);
      expect(assessmentResult.distribution.aiPercentage).toBe(50);
      expect(assessmentResult.distribution.humanPercentage).toBe(25);
      expect(assessmentResult.distribution.hybridPercentage).toBe(25);
      expect(assessmentResult.overallRecommendation).toBeDefined();
    });
  });
});
