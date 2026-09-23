import { describe, it, expect, vi } from "vitest";
import { validateAIIntelligence, generateFallbackAIIntelligence } from "../aiFallback";
import { analyzeTask } from "../taskAnalyzer";
import { POST } from "../../app/api/ai-enrich-task/route";
import { NextRequest } from "next/server";

describe("Phase 3 - AI Intelligence Layer", () => {
  const sampleTask = analyzeTask("Reply to basic customer emails", 0);

  describe("1. Valid AI Response Validation", () => {
    it("returns true for a fully valid AIIntelligence object", () => {
      const validData = {
        implementationPlan: [
          "Classify incoming emails automatically",
          "Use AI to draft responses for routine questions",
          "Escalate complaints and unusual requests to a human",
        ],
        automateTasks: [
          "FAQ responses",
          "Email categorization",
          "Response drafting",
        ],
        humanResponsibilities: [
          "Complaints",
          "Refund decisions",
          "Sensitive customer issues",
        ],
        workflow: [
          "Incoming email",
          "AI classification",
          "Routine → AI response",
          "Complex → human review",
        ],
        keyRisks: [
          "Incorrect responses",
          "Poor handling of unusual requests",
        ],
        recommendation:
          "Use AI for first-line support while keeping humans responsible for escalations.",
      };

      expect(validateAIIntelligence(validData)).toBe(true);
    });
  });

  describe("2. Invalid AI Response Validation", () => {
    it("returns false for non-object or null input", () => {
      expect(validateAIIntelligence(null)).toBe(false);
      expect(validateAIIntelligence(undefined)).toBe(false);
      expect(validateAIIntelligence("string")).toBe(false);
      expect(validateAIIntelligence(123)).toBe(false);
    });

    it("returns false when array fields contain non-string elements", () => {
      const invalidData = {
        implementationPlan: [123, 456],
        automateTasks: ["FAQ responses"],
        humanResponsibilities: ["Complaints"],
        workflow: ["Incoming email"],
        keyRisks: ["Incorrect responses"],
        recommendation: "Valid recommendation",
      };

      expect(validateAIIntelligence(invalidData)).toBe(false);
    });
  });

  describe("3. Missing Fields Validation", () => {
    it("returns false when any required field is omitted", () => {
      const missingImplementationPlan = {
        automateTasks: ["FAQ responses"],
        humanResponsibilities: ["Complaints"],
        workflow: ["Incoming email"],
        keyRisks: ["Incorrect responses"],
        recommendation: "Valid recommendation",
      };

      expect(validateAIIntelligence(missingImplementationPlan)).toBe(false);

      const missingRecommendation = {
        implementationPlan: ["Step 1"],
        automateTasks: ["FAQ responses"],
        humanResponsibilities: ["Complaints"],
        workflow: ["Incoming email"],
        keyRisks: ["Incorrect responses"],
      };

      expect(validateAIIntelligence(missingRecommendation)).toBe(false);
    });

    it("returns false when array fields are empty", () => {
      const emptyArrayData = {
        implementationPlan: [],
        automateTasks: ["FAQ responses"],
        humanResponsibilities: ["Complaints"],
        workflow: ["Incoming email"],
        keyRisks: ["Incorrect responses"],
        recommendation: "Valid recommendation",
      };

      expect(validateAIIntelligence(emptyArrayData)).toBe(false);
    });
  });

  describe("4. API Failure & Fallback Handling", () => {
    it("returns deterministic fallback when LLM API key is missing or API fails", async () => {
      // Ensure no API keys set
      const origEnv = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;
      delete process.env.OPENAI_API_KEY;
      delete process.env.LLM_API_KEY;

      const req = new NextRequest("http://localhost:3000/api/ai-enrich-task", {
        method: "POST",
        body: JSON.stringify({ task: sampleTask }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(validateAIIntelligence(data)).toBe(true);
      expect(data.recommendation).toBeDefined();

      if (origEnv) process.env.GEMINI_API_KEY = origEnv;
    });

    it("returns status 400 for completely invalid request body without task info", async () => {
      const req = new NextRequest("http://localhost:3000/api/ai-enrich-task", {
        method: "POST",
        body: JSON.stringify({ invalidField: "none" }),
      });

      const res = await POST(req);
      expect(res.status).toBe(400);
    });
  });

  describe("5. Deterministic Fallback Generation", () => {
    it("generates valid fallback for AI / AUTOMATE task recommendation", () => {
      const aiTask = analyzeTask("Data entry", 0);
      const fallback = generateFallbackAIIntelligence(aiTask);

      expect(validateAIIntelligence(fallback)).toBe(true);
      expect(fallback.implementationPlan.length).toBeGreaterThan(0);
      expect(fallback.automateTasks.length).toBeGreaterThan(0);
      expect(fallback.humanResponsibilities.length).toBeGreaterThan(0);
      expect(fallback.workflow.length).toBeGreaterThan(0);
      expect(fallback.keyRisks.length).toBeGreaterThan(0);
      expect(fallback.recommendation).toContain("Data entry");
    });

    it("generates valid fallback for HYBRID task recommendation", () => {
      const hybridTask = analyzeTask("Reply to basic customer emails", 0);
      const fallback = generateFallbackAIIntelligence(hybridTask);

      expect(validateAIIntelligence(fallback)).toBe(true);
      expect(fallback.recommendation).toContain("Reply to basic customer emails");
    });

    it("generates valid fallback for HUMAN task recommendation", () => {
      const humanTask = analyzeTask("Attend client meetings", 0);
      const fallback = generateFallbackAIIntelligence(humanTask);

      expect(validateAIIntelligence(fallback)).toBe(true);
      expect(fallback.recommendation).toContain("Attend client meetings");
    });

    it("generates valid fallback for OUTSOURCE task recommendation", () => {
      const outsourceTask = analyzeTask("Payroll processing", 0);
      const fallback = generateFallbackAIIntelligence(outsourceTask);

      expect(validateAIIntelligence(fallback)).toBe(true);
      expect(fallback.recommendation).toContain("Payroll processing");
    });
  });
});
