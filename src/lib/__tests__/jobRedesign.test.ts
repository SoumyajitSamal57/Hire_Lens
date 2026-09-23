import { describe, it, expect } from "vitest";
import { generateJobRedesignPlan } from "../jobRedesign";
import { AssessmentResult } from "@/types/assessment";

describe("jobRedesign engine", () => {
  const mockAssessmentResult: AssessmentResult = {
    role: "Operations Coordinator",
    companyType: "SaaS Startup",
    monthlyBudget: "60000",
    distribution: {
      aiPercentage: 50,
      humanPercentage: 25,
      hybridPercentage: 25,
      outsourcePercentage: 0,
      aiCount: 2,
      humanCount: 1,
      hybridCount: 1,
      outsourceCount: 0,
    },
    overallRecommendation: "Hybrid Workforce Redesign",
    overallInsight: "Significant portion can be automated",
    tasks: [
      {
        id: 1,
        taskName: "Enter CRM records and update deals",
        recommendation: "AI / AUTOMATE",
        confidence: "HIGH",
        characteristics: {
          repetition: 95,
          predictability: 90,
          digitalNature: 100,
          humanJudgment: 10,
          interpersonalInteraction: 5,
          creativity: 5,
          physicalPresence: 0,
          sensitivityRisk: 15,
        },
        scores: {
          automationPotential: 90,
          humanNecessity: 10,
          outsourcingSuitability: 60,
        },
        explanation: "Routine data entry easily automated via CRM integrations.",
        keyFactors: ["Repetitive", "Predictable"],
        automationAnalysis: {
          approach: "AI / Automation",
          category: "DATA_ENTRY_AUTOMATION",
          suggestedOptions: [
            {
              id: "crm-auto",
              name: "Zapier / Make",
              category: "DATA_ENTRY_AUTOMATION",
              description: "Automate CRM updates",
              estimatedMonthlyCostMin: 1500,
              estimatedMonthlyCostMax: 4000,
              typicalTimeReductionMin: 70,
              typicalTimeReductionMax: 90,
              suitableFor: ["CRM"],
              limitations: [],
            },
          ],
          estimatedMonthlyCostMin: 1500,
          estimatedMonthlyCostMax: 4000,
          estimatedTimeReductionMin: 70,
          estimatedTimeReductionMax: 90,
          humanInvolvement: "Low",
          riskLevel: "LOW",
          rationale: "Automate via connectors",
        },
      },
      {
        id: 2,
        taskName: "Schedule team and client meetings",
        recommendation: "AI / AUTOMATE",
        confidence: "HIGH",
        characteristics: {
          repetition: 90,
          predictability: 90,
          digitalNature: 100,
          humanJudgment: 15,
          interpersonalInteraction: 20,
          creativity: 5,
          physicalPresence: 0,
          sensitivityRisk: 10,
        },
        scores: {
          automationPotential: 85,
          humanNecessity: 15,
          outsourcingSuitability: 50,
        },
        explanation: "Automated booking tools eliminate back-and-forth email.",
        keyFactors: ["Scheduling", "Calendar"],
      },
      {
        id: 3,
        taskName: "Draft client proposals and customized agreements",
        recommendation: "HYBRID",
        confidence: "HIGH",
        characteristics: {
          repetition: 40,
          predictability: 50,
          digitalNature: 100,
          humanJudgment: 70,
          interpersonalInteraction: 60,
          creativity: 65,
          physicalPresence: 0,
          sensitivityRisk: 60,
        },
        scores: {
          automationPotential: 50,
          humanNecessity: 70,
          outsourcingSuitability: 30,
        },
        explanation: "AI drafts initial template; human tailors commercial terms.",
        keyFactors: ["Client Facing", "Contextual"],
      },
      {
        id: 4,
        taskName: "Manage client disputes and high-stakes negotiations",
        recommendation: "HUMAN",
        confidence: "HIGH",
        characteristics: {
          repetition: 10,
          predictability: 20,
          digitalNature: 50,
          humanJudgment: 95,
          interpersonalInteraction: 95,
          creativity: 80,
          physicalPresence: 10,
          sensitivityRisk: 90,
        },
        scores: {
          automationPotential: 10,
          humanNecessity: 95,
          outsourcingSuitability: 10,
        },
        explanation: "Requires deep empathy, emotional intelligence, and trust.",
        keyFactors: ["Negotiation", "Human Empathy"],
      },
    ],
  };

  it("generates a complete job redesign plan with workload rebalancing", () => {
    const plan = generateJobRedesignPlan(mockAssessmentResult);

    expect(plan).toBeDefined();
    expect(plan.originalRole).toBe("Operations Coordinator");
    expect(plan.redesignedTitle).toContain("Workflow Specialist");
    expect(plan.workload.automatedTasks.length).toBe(2);
    expect(plan.workload.hybridTasks.length).toBe(1);
    expect(plan.workload.retainedHumanTasks.length).toBe(1);
  });

  it("calculates capacity and freed hours logically", () => {
    const plan = generateJobRedesignPlan(mockAssessmentResult);

    expect(plan.capacity.originalWeeklyHours).toBe(40);
    expect(plan.capacity.freedWeeklyHours).toBeGreaterThan(0);
    expect(plan.capacity.newHumanWeeklyHours).toBeLessThan(40);
    expect(plan.capacity.efficiencyGainPercentage).toBeGreaterThan(0);
  });

  it("produces financial savings and positive ROI", () => {
    const plan = generateJobRedesignPlan(mockAssessmentResult);

    expect(plan.financial.originalBudgetMonthly).toBe(60000);
    expect(plan.financial.estimatedMonthlySavings).toBeGreaterThanOrEqual(0);
    expect(plan.financial.estimatedAnnualSavings).toBe(
      plan.financial.estimatedMonthlySavings * 12
    );
  });

  it("builds a structured, copyable modern job description", () => {
    const plan = generateJobRedesignPlan(mockAssessmentResult);
    const jd = plan.modernJobDescription;

    expect(jd.title).toBe(plan.redesignedTitle);
    expect(jd.coreResponsibilities.length).toBeGreaterThan(0);
    expect(jd.formattedMarkdown).toContain("# " + plan.redesignedTitle);
    expect(jd.formattedMarkdown).toContain("### 🎯 Key Responsibilities");
    expect(jd.formattedMarkdown).toContain("### 🛠️ Tooling & Automation Stack");
  });

  it("recommends DO_NOT_HIRE_FULLTIME when automation potential is overwhelmingly high", () => {
    const automationHeavyResult: AssessmentResult = {
      ...mockAssessmentResult,
      distribution: {
        aiPercentage: 80,
        humanPercentage: 10,
        hybridPercentage: 10,
        outsourcePercentage: 0,
        aiCount: 4,
        humanCount: 0,
        hybridCount: 1,
        outsourceCount: 0,
      },
    };

    const plan = generateJobRedesignPlan(automationHeavyResult);
    expect(plan.hiringVerdict).toBe("DO_NOT_HIRE_FULLTIME");
    expect(plan.hiringVerdictLabel).toContain("Do Not Hire Full-Time");
  });

  it("recommends HIRE_FULL_TIME_HUMAN when human necessity is dominant", () => {
    const humanHeavyResult: AssessmentResult = {
      ...mockAssessmentResult,
      distribution: {
        aiPercentage: 10,
        humanPercentage: 80,
        hybridPercentage: 10,
        outsourcePercentage: 0,
        aiCount: 0,
        humanCount: 4,
        hybridCount: 1,
        outsourceCount: 0,
      },
    };

    const plan = generateJobRedesignPlan(humanHeavyResult);
    expect(plan.hiringVerdict).toBe("HIRE_FULL_TIME_HUMAN");
  });
});
