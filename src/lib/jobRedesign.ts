import { AssessmentResult, TaskAnalysis } from "@/types/assessment";
import {
  JobRedesignPlan,
  HiringVerdict,
  RebalancedWorkload,
  CapacityMetrics,
  FinancialImpact,
  ModernJobDescription,
} from "@/types/jobRedesign";

/**
 * Derives an elevated, modern job title that reflects an AI-augmented workflow.
 */
function deriveModernTitle(originalRole: string, verdict: HiringVerdict): string {
  const clean = originalRole.trim();
  if (!clean) return "Modern Operations Specialist";

  let baseTitle = clean;
  if (/assistant|clerk|data entry|coordinator/i.test(clean)) {
    baseTitle = `${clean.replace(/assistant|clerk|coordinator/i, "").trim() || "Operations"} Workflow Specialist`;
  } else if (/manager/i.test(clean)) {
    baseTitle = `AI-Augmented ${clean}`;
  } else if (/specialist|lead|engineer|analyst/i.test(clean)) {
    baseTitle = `Lead ${clean} (AI-Enabled)`;
  } else {
    baseTitle = `AI-Augmented ${clean}`;
  }

  if (verdict === "DO_NOT_HIRE_FULLTIME") {
    return `${clean} (Automated System / No Hire)`;
  }

  if (verdict === "HIRE_PART_TIME") {
    return `Fractional / Part-Time ${baseTitle}`;
  }

  return baseTitle;
}

/**
 * Formats full Markdown Job Description ready to paste to LinkedIn/ATS
 */
function buildMarkdownJobDescription(
  title: string,
  companyType: string,
  summary: string,
  responsibilities: string[],
  tools: string[],
  humanSkills: string[],
  metrics: string[]
): string {
  return `# ${title}
**Organization Type:** ${companyType || "Growth Company"}  
**Role Structure:** Modern Hybrid / AI-Augmented Workforce

---

### 🌟 About the Role
${summary}

---

### 🎯 Key Responsibilities
${responsibilities.map((r) => `- ${r}`).join("\n")}

---

### 🛠️ Tooling & Automation Stack
Candidates will operate and orchestrate modern tools including:
${tools.map((t) => `- ${t}`).join("\n")}

---

### 🧠 Core Human Capabilities Required
${humanSkills.map((s) => `- ${s}`).join("\n")}

---

### 📈 Key Performance Indicators (KPIs)
${metrics.map((m) => `- ${m}`).join("\n")}
`;
}

/**
 * Pure deterministic engine that synthesizes an AssessmentResult into an actionable Job Redesign Plan.
 */
export function generateJobRedesignPlan(result: AssessmentResult): JobRedesignPlan {
  const { role, companyType, monthlyBudget, tasks, distribution } = result;
  const safeTasks = Array.isArray(tasks) ? tasks : [];
  const taskCount = safeTasks.length || 1;

  // 1. Determine Hours Allocation (Standard 40-hour work week base)
  const baseWeeklyHours = 40;
  const hoursPerTask = baseWeeklyHours / taskCount;

  let totalFreedHours = 0;
  let totalNewHumanHours = 0;

  const retainedHumanTasks: RebalancedWorkload["retainedHumanTasks"] = [];
  const automatedTasks: RebalancedWorkload["automatedTasks"] = [];
  const hybridTasks: RebalancedWorkload["hybridTasks"] = [];
  const outsourcedTasks: RebalancedWorkload["outsourcedTasks"] = [];

  const toolNames = new Set<string>();

  safeTasks.forEach((task: TaskAnalysis) => {
    // Gather tools
    if (task.toolRecommendations) {
      task.toolRecommendations.forEach((tr) => toolNames.add(tr.name));
    }
    if (task.automationAnalysis?.suggestedOptions) {
      task.automationAnalysis.suggestedOptions.forEach((so) => toolNames.add(so.name));
    }

    switch (task.recommendation) {
      case "AI / AUTOMATE": {
        const savedHours = Math.round(hoursPerTask * 0.9 * 10) / 10;
        totalFreedHours += savedHours;
        totalNewHumanHours += Math.round((hoursPerTask - savedHours) * 10) / 10;
        automatedTasks.push({
          taskName: task.taskName,
          primaryTool:
            task.toolRecommendations?.[0]?.name ||
            task.automationAnalysis?.suggestedOptions?.[0]?.name ||
            "Workflow Automation",
          humanTimeSavedWeeklyHours: savedHours,
        });
        break;
      }
      case "HYBRID": {
        const savedHours = Math.round(hoursPerTask * 0.55 * 10) / 10;
        totalFreedHours += savedHours;
        totalNewHumanHours += Math.round((hoursPerTask - savedHours) * 10) / 10;
        hybridTasks.push({
          taskName: task.taskName,
          humanRole: "Supervise, review exceptions, and provide final strategic approval",
          aiRole: "Draft, gather data, run automated execution pipelines",
        });
        break;
      }
      case "OUTSOURCE": {
        const savedHours = Math.round(hoursPerTask * 0.8 * 10) / 10;
        totalFreedHours += savedHours;
        totalNewHumanHours += Math.round((hoursPerTask - savedHours) * 10) / 10;
        outsourcedTasks.push({
          taskName: task.taskName,
          suggestedVendorType: "Specialized external contractor or offshore fractional partner",
        });
        break;
      }
      case "HUMAN":
      default: {
        totalNewHumanHours += Math.round(hoursPerTask * 10) / 10;
        retainedHumanTasks.push({
          taskName: task.taskName,
          reason: task.explanation || "Requires critical thinking, empathy, and strategic discretion",
          priority: (task.scores?.humanNecessity ?? 50) > 70 ? "High" : "Medium",
        });
        break;
      }
    }
  });

  const freedWeeklyHours = Math.min(baseWeeklyHours, Math.round(totalFreedHours * 10) / 10);
  const newHumanWeeklyHours = Math.max(0, Math.round((baseWeeklyHours - freedWeeklyHours) * 10) / 10);
  const efficiencyGainPercentage = Math.min(
    100,
    Math.round((freedWeeklyHours / baseWeeklyHours) * 100)
  );

  // 2. Determine Hiring Verdict
  let hiringVerdict: HiringVerdict = "HIRE_SPECIALIST_OPERATOR";
  let hiringVerdictLabel = "Hire AI-Augmented Specialist";
  let hiringVerdictReasoning =
    "Routine execution has been eliminated. Hire a modern professional who operates automated workflows while delivering high-judgment work.";

  if (distribution.aiPercentage >= 65 && distribution.humanPercentage <= 15) {
    hiringVerdict = "DO_NOT_HIRE_FULLTIME";
    hiringVerdictLabel = "Do Not Hire Full-Time (Deploy Tech Stack)";
    hiringVerdictReasoning =
      "Over 65% of the intended tasks can be automated natively. The remaining items do not justify a dedicated full-time headcount.";
  } else if (distribution.humanPercentage >= 65) {
    hiringVerdict = "HIRE_FULL_TIME_HUMAN";
    hiringVerdictLabel = "Hire Dedicated Full-Time Talent";
    hiringVerdictReasoning =
      "The role centers on human relationship management, creative synthesis, and organizational leadership that software cannot replace.";
  } else if (newHumanWeeklyHours <= 18) {
    hiringVerdict = "HIRE_PART_TIME";
    hiringVerdictLabel = "Hire Fractional / Part-Time Specialist";
    hiringVerdictReasoning = `Automation reduces the required human workload to ~${newHumanWeeklyHours} hrs/week. A part-time hire or contractor is optimal.`;
  }

  const redesignedTitle = deriveModernTitle(role, hiringVerdict);

  // 3. Financial Analysis
  const numericBudget = !isNaN(Number(monthlyBudget)) && Number(monthlyBudget) > 0
    ? Number(monthlyBudget)
    : 50000; // default realistic monthly INR/USD benchmark

  // Tool cost sum across tasks (using conservative estimation)
  let estimatedMonthlyToolCosts = 0;
  safeTasks.forEach((t) => {
    if (t.automationAnalysis?.estimatedMonthlyCostMin) {
      estimatedMonthlyToolCosts += t.automationAnalysis.estimatedMonthlyCostMin;
    }
  });
  // Cap tool costs realistically
  estimatedMonthlyToolCosts = Math.min(
    Math.round(numericBudget * 0.35),
    Math.max(1500, estimatedMonthlyToolCosts)
  );

  let suggestedNewMonthlyComp = numericBudget;
  if (hiringVerdict === "DO_NOT_HIRE_FULLTIME") {
    suggestedNewMonthlyComp = 0;
  } else if (hiringVerdict === "HIRE_PART_TIME") {
    suggestedNewMonthlyComp = Math.round(numericBudget * 0.5);
  } else {
    // Specialist operator: slightly higher base per hour, but fewer required overhead hours
    suggestedNewMonthlyComp = Math.round(numericBudget * 0.85);
  }

  const totalNewMonthlyCost = suggestedNewMonthlyComp + estimatedMonthlyToolCosts;
  const estimatedMonthlySavings = Math.max(0, numericBudget - totalNewMonthlyCost);
  const estimatedAnnualSavings = estimatedMonthlySavings * 12;
  const roiPercentage =
    numericBudget > 0
      ? Math.round((estimatedMonthlySavings / numericBudget) * 100)
      : 0;

  const financial: FinancialImpact = {
    originalBudgetMonthly: numericBudget,
    estimatedMonthlyToolCosts,
    suggestedNewMonthlyComp,
    estimatedMonthlySavings,
    estimatedAnnualSavings,
    roiPercentage,
  };

  const capacity: CapacityMetrics = {
    originalWeeklyHours: baseWeeklyHours,
    freedWeeklyHours,
    newHumanWeeklyHours,
    efficiencyGainPercentage,
  };

  // 4. Build Modern Job Description
  const distinctTools = Array.from(toolNames).slice(0, 8);
  if (distinctTools.length === 0) {
    distinctTools.push("Workflow Automation Systems", "AI Copilots", "Modern Productivity Suite");
  }

  const responsibilities = [
    ...retainedHumanTasks.map((t) => `Lead and execute: ${t.taskName}`),
    ...hybridTasks.map((t) => `Orchestrate and supervise AI workflows for: ${t.taskName}`),
    "Continuously optimize automation triggers and ensure high-integrity outputs",
  ];

  const humanSkills = [
    "High contextual judgment and critical problem-solving",
    "Strong stakeholder communication and emotional intelligence",
    "Familiarity with AI tooling and workflow orchestration",
    "Bias for continuous process improvement and quality assurance",
  ];

  const metrics = [
    "Deliverable quality and stakeholder satisfaction score (>90%)",
    "Workflow throughput and turnaround time reduction",
    "Error rate in automated pipelines (<1%)",
  ];

  const summary = `We are seeking an innovative ${redesignedTitle} to lead our operations. Unlike traditional roles bogged down by repetitive manual tasks, this position leverages modern software and AI pipelines to automate mundane execution, empowering you to focus on high-impact strategy, stakeholder connection, and creative problem-solving.`;

  const formattedMarkdown = buildMarkdownJobDescription(
    redesignedTitle,
    companyType,
    summary,
    responsibilities,
    distinctTools,
    humanSkills,
    metrics
  );

  const modernJobDescription: ModernJobDescription = {
    title: redesignedTitle,
    departmentOrType: companyType || "Operations",
    summary,
    coreResponsibilities: responsibilities,
    toolsAndAiProficiencies: distinctTools,
    humanSuperpowers: humanSkills,
    performanceMetrics: metrics,
    formattedMarkdown,
  };

  const workload: RebalancedWorkload = {
    retainedHumanTasks,
    automatedTasks,
    hybridTasks,
    outsourcedTasks,
  };

  return {
    originalRole: role || "General Role",
    redesignedTitle,
    hiringVerdict,
    hiringVerdictLabel,
    hiringVerdictReasoning,
    workload,
    capacity,
    financial,
    modernJobDescription,
  };
}
