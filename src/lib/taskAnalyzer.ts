import {
  TaskCharacteristics,
  TaskScores,
  RecommendationType,
  ConfidenceLevel,
  TaskAnalysis,
  WorkforceDistribution,
  AssessmentResult,
  AssessmentFormData,
} from "@/types/assessment";
import { analyzeTaskAutomation } from "./costEngine";
import { matchTools } from "./toolMatcher";

interface TaskRulePattern {
  keywords: string[];
  baseCharacteristics: TaskCharacteristics;
  isSpecializedExternal?: boolean;
  keyFactors: string[];
}

const RULE_PATTERNS: TaskRulePattern[] = [
  {
    keywords: [
      "basic report generation",
      "weekly report",
      "monthly report",
      "generate report",
      "analytics report",
      "dashboard report",
      "summary report",
      "report",
    ],
    baseCharacteristics: {
      repetition: 92,
      predictability: 90,
      digitalNature: 100,
      humanJudgment: 15,
      interpersonalInteraction: 10,
      creativity: 10,
      physicalPresence: 0,
      sensitivityRisk: 15,
    },
    keyFactors: [
      "Highly Repetitive",
      "Structured Digital Data",
      "Rule-Based Logic",
      "Low Judgment Need",
    ],
  },
  {
    keywords: [
      "enter crm records",
      "crm",
      "data entry",
      "enter data",
      "record",
      "database update",
      "spreadsheet",
      "log data",
      "form filling",
    ],
    baseCharacteristics: {
      repetition: 95,
      predictability: 95,
      digitalNature: 100,
      humanJudgment: 10,
      interpersonalInteraction: 5,
      creativity: 5,
      physicalPresence: 0,
      sensitivityRisk: 15,
    },
    keyFactors: [
      "High Repetition",
      "Predictable Workflow",
      "Fully Digital",
      "Minimal Judgment Required",
    ],
  },
  {
    keywords: [
      "process routine invoices",
      "invoice processing",
      "invoice entry",
      "invoice",
      "process invoice",
    ],
    baseCharacteristics: {
      repetition: 90,
      predictability: 90,
      digitalNature: 100,
      humanJudgment: 15,
      interpersonalInteraction: 5,
      creativity: 5,
      physicalPresence: 0,
      sensitivityRisk: 25,
    },
    keyFactors: [
      "Standardized Document Rules",
      "High Repetition",
      "Fully Digital",
      "Low Interpersonal Need",
    ],
  },
  {
    keywords: [
      "book customer appointments",
      "appointment booking",
      "book appointment",
      "schedule appointment",
      "calendar booking",
    ],
    baseCharacteristics: {
      repetition: 88,
      predictability: 90,
      digitalNature: 98,
      humanJudgment: 18,
      interpersonalInteraction: 20,
      creativity: 10,
      physicalPresence: 0,
      sensitivityRisk: 15,
    },
    keyFactors: [
      "Calendar API Integration",
      "High Predictability",
      "Automated Scheduling",
      "Low Human Intervention",
    ],
  },
  {
    keywords: [
      "schedule social media posts",
      "social media post",
      "buffer",
      "hootsuite",
      "post content",
      "publish post",
      "queue post",
      "schedule post",
    ],
    baseCharacteristics: {
      repetition: 88,
      predictability: 88,
      digitalNature: 98,
      humanJudgment: 20,
      interpersonalInteraction: 15,
      creativity: 25,
      physicalPresence: 0,
      sensitivityRisk: 15,
    },
    keyFactors: [
      "Calendar-Driven",
      "Automated Scheduling",
      "Digital Delivery",
      "Low Interpersonal Need",
    ],
  },
  {
    keywords: [
      "reply to basic customer emails",
      "basic customer email",
      "customer email",
      "inbox",
      "support ticket",
      "reply to customer",
      "customer inquiry",
      "help desk",
    ],
    baseCharacteristics: {
      repetition: 75,
      predictability: 65,
      digitalNature: 95,
      humanJudgment: 48,
      interpersonalInteraction: 60,
      creativity: 30,
      physicalPresence: 0,
      sensitivityRisk: 40,
    },
    keyFactors: [
      "AI Drafting Triage",
      "Human Empathy Required",
      "Digital Channel",
      "Customer Satisfaction Impact",
    ],
  },
  {
    keywords: [
      "attend client meetings",
      "client meeting",
      "attend client",
      "client call",
      "client presentation",
      "sales call",
      "consultation",
    ],
    baseCharacteristics: {
      repetition: 25,
      predictability: 30,
      digitalNature: 60,
      humanJudgment: 85,
      interpersonalInteraction: 95,
      creativity: 60,
      physicalPresence: 40,
      sensitivityRisk: 70,
    },
    keyFactors: [
      "High Interpersonal Stakes",
      "Real-Time Adaptability",
      "Trust & Empathy",
      "Complex Judgment",
    ],
  },
  {
    keywords: [
      "negotiate with suppliers",
      "supplier negotiation",
      "contract negotiation",
      "vendor negotiation",
      "negotiate",
    ],
    baseCharacteristics: {
      repetition: 20,
      predictability: 30,
      digitalNature: 60,
      humanJudgment: 90,
      interpersonalInteraction: 90,
      creativity: 65,
      physicalPresence: 20,
      sensitivityRisk: 80,
    },
    keyFactors: [
      "Strategic Negotiation",
      "High Financial Stakes",
      "Human Relationship Building",
      "Adaptive Tactics",
    ],
  },
  {
    keywords: [
      "handle angry customers",
      "angry customer",
      "escalated issue",
      "conflict resolution",
      "customer complaint",
    ],
    baseCharacteristics: {
      repetition: 35,
      predictability: 30,
      digitalNature: 80,
      humanJudgment: 85,
      interpersonalInteraction: 90,
      creativity: 55,
      physicalPresence: 10,
      sensitivityRisk: 80,
    },
    keyFactors: [
      "High Emotional Nuance",
      "Conflict Resolution",
      "De-escalation Judgment",
      "Customer Retention Risk",
    ],
  },
  {
    keywords: [
      "develop marketing strategy",
      "marketing strategy",
      "brand strategy",
      "campaign strategy",
      "strategic business decision",
      "business strategy",
      "strategy",
      "vision",
    ],
    baseCharacteristics: {
      repetition: 20,
      predictability: 30,
      digitalNature: 75,
      humanJudgment: 92,
      interpersonalInteraction: 60,
      creativity: 90,
      physicalPresence: 10,
      sensitivityRisk: 85,
    },
    keyFactors: [
      "Nuanced Creativity",
      "High-Stakes Decision",
      "Deep Business Context",
      "Subjective Judgment",
    ],
  },
  {
    keywords: [
      "competitor research",
      "market research",
      "research competitor",
      "gather research",
      "industry trend",
      "benchmark",
    ],
    baseCharacteristics: {
      repetition: 65,
      predictability: 70,
      digitalNature: 95,
      humanJudgment: 55,
      interpersonalInteraction: 15,
      creativity: 40,
      physicalPresence: 0,
      sensitivityRisk: 30,
    },
    keyFactors: [
      "Automated Data Sourcing",
      "Strategic Human Synthesis",
      "Digital Information",
      "Context Interpretation",
    ],
  },
  {
    keywords: [
      "payroll processing",
      "payroll",
      "bookkeeping",
      "tax filing",
      "audit compliance",
    ],
    baseCharacteristics: {
      repetition: 70,
      predictability: 85,
      digitalNature: 95,
      humanJudgment: 45,
      interpersonalInteraction: 15,
      creativity: 15,
      physicalPresence: 0,
      sensitivityRisk: 65,
    },
    isSpecializedExternal: true,
    keyFactors: [
      "Specialized Skillset",
      "Compliance & Regulatory Risk",
      "Modular Deliverables",
      "Outsourcing Suitability",
    ],
  },
  {
    keywords: [
      "graphic design for campaign concepts",
      "graphic design",
      "campaign concept",
      "creative graphic",
      "visual design",
    ],
    baseCharacteristics: {
      repetition: 40,
      predictability: 45,
      digitalNature: 95,
      humanJudgment: 68,
      interpersonalInteraction: 30,
      creativity: 85,
      physicalPresence: 0,
      sensitivityRisk: 30,
    },
    keyFactors: [
      "High Visual Creativity",
      "Brand Expression",
      "Digital Output",
      "Human Subjective Taste",
    ],
  },
  {
    keywords: [
      "visit customers onsite",
      "visit customer",
      "onsite visit",
      "field visit",
      "client onsite",
    ],
    baseCharacteristics: {
      repetition: 30,
      predictability: 40,
      digitalNature: 20,
      humanJudgment: 75,
      interpersonalInteraction: 90,
      creativity: 40,
      physicalPresence: 90,
      sensitivityRisk: 50,
    },
    keyFactors: [
      "Physical Presence Essential",
      "Face-to-Face Engagement",
      "Low Digital Footprint",
      "On-Location Execution",
    ],
  },
  {
    keywords: [
      "technical documentation",
      "technical docs",
      "write documentation",
      "api documentation",
      "system docs",
    ],
    baseCharacteristics: {
      repetition: 55,
      predictability: 65,
      digitalNature: 95,
      humanJudgment: 58,
      interpersonalInteraction: 25,
      creativity: 45,
      physicalPresence: 0,
      sensitivityRisk: 35,
    },
    keyFactors: [
      "Structured Technical Knowledge",
      "AI Drafting Assistance",
      "Precise Human Verification",
      "Digital Output",
    ],
  },
  {
    keywords: [
      "approve refunds",
      "refund approval",
      "approve refund",
      "claim approval",
    ],
    baseCharacteristics: {
      repetition: 75,
      predictability: 75,
      digitalNature: 95,
      humanJudgment: 60,
      interpersonalInteraction: 20,
      creativity: 15,
      physicalPresence: 0,
      sensitivityRisk: 75,
    },
    keyFactors: [
      "Financial Policy Compliance",
      "Fraud Risk Sensitivity",
      "Rule-Based Triage",
      "Human Oversight Need",
    ],
  },
  {
    keywords: [
      "social media comment moderation",
      "comment moderation",
      "social media moderation",
      "community moderation",
    ],
    baseCharacteristics: {
      repetition: 85,
      predictability: 75,
      digitalNature: 98,
      humanJudgment: 55,
      interpersonalInteraction: 35,
      creativity: 20,
      physicalPresence: 0,
      sensitivityRisk: 55,
    },
    keyFactors: [
      "High Volume Digital Filter",
      "Safety & Context Sensitivity",
      "Automated Flagging",
      "Human Escalation",
    ],
  },
  {
    keywords: [
      "employee interviews",
      "job interview",
      "conduct interview",
      "hiring interview",
    ],
    baseCharacteristics: {
      repetition: 30,
      predictability: 35,
      digitalNature: 60,
      humanJudgment: 85,
      interpersonalInteraction: 95,
      creativity: 45,
      physicalPresence: 30,
      sensitivityRisk: 70,
    },
    keyFactors: [
      "Human Talent Evaluation",
      "High Interpersonal Interaction",
      "Culture Fit Judgment",
      "Subtle Behavioral Cues",
    ],
  },
];

/**
 * Heuristically extracts characteristics for any unknown task
 */
function analyzeUnknownTask(task: string): {
  characteristics: TaskCharacteristics;
  isSpecializedExternal: boolean;
  keyFactors: string[];
} {
  const lower = task.toLowerCase();

  let repetition = 50;
  let predictability = 50;
  let digitalNature = 85;
  let humanJudgment = 50;
  let interpersonalInteraction = 30;
  let creativity = 35;
  let physicalPresence = 0;
  let sensitivityRisk = 30;
  let isSpecializedExternal = false;
  const keyFactors: string[] = [];

  if (/(create|generate|write|draft|code|build|make|design)/i.test(lower)) {
    creativity += 25;
    humanJudgment += 15;
    keyFactors.push("Generative Effort");
  }

  if (
    /(send|post|sync|upload|download|backup|copy|extract|track|filter|enter|log|schedule|process)/i.test(
      lower
    )
  ) {
    repetition += 30;
    predictability += 25;
    humanJudgment -= 20;
    digitalNature = 100;
    keyFactors.push("Systematic Execution");
  }

  if (
    /(call|talk|speak|meet|interview|manage|coach|lead|mentor|present|negotiate|attend)/i.test(
      lower
    )
  ) {
    interpersonalInteraction += 45;
    humanJudgment += 25;
    physicalPresence += 20;
    keyFactors.push("Direct Human Interaction");
  }

  if (
    /(inspect|visit|clean|deliver|hardware|onsite|office|store|site)/i.test(
      lower
    )
  ) {
    physicalPresence += 65;
    digitalNature -= 40;
    keyFactors.push("Physical Presence Needed");
  }

  if (
    /(financial|security|legal|contract|confidential|risk|audit|budget|refund|payroll|tax)/i.test(
      lower
    )
  ) {
    sensitivityRisk += 40;
    humanJudgment += 15;
    keyFactors.push("High Risk & Compliance");
  }

  if (/(payroll|tax|bookkeeping|outsourced|contractor|freelance)/i.test(lower)) {
    isSpecializedExternal = true;
  }

  const characteristics: TaskCharacteristics = {
    repetition: Math.min(100, Math.max(0, repetition)),
    predictability: Math.min(100, Math.max(0, predictability)),
    digitalNature: Math.min(100, Math.max(0, digitalNature)),
    humanJudgment: Math.min(100, Math.max(0, humanJudgment)),
    interpersonalInteraction: Math.min(
      100,
      Math.max(0, interpersonalInteraction)
    ),
    creativity: Math.min(100, Math.max(0, creativity)),
    physicalPresence: Math.min(100, Math.max(0, physicalPresence)),
    sensitivityRisk: Math.min(100, Math.max(0, sensitivityRisk)),
  };

  if (keyFactors.length === 0) {
    keyFactors.push("General Operational Task", "Digital Workflow");
  }

  return { characteristics, isSpecializedExternal, keyFactors };
}

/**
 * Calculates weighted scores from task characteristics
 */
export function calculateScores(chars: TaskCharacteristics): TaskScores {
  // Automation Potential (0-100)
  const autoScore =
    0.35 * chars.repetition +
    0.35 * chars.predictability +
    0.20 * chars.digitalNature +
    0.10 * (100 - chars.humanJudgment);

  // Human Necessity (0-100)
  const humanScore =
    0.28 * chars.humanJudgment +
    0.28 * chars.interpersonalInteraction +
    0.18 * chars.creativity +
    0.14 * chars.physicalPresence +
    0.12 * chars.sensitivityRisk;

  // Outsourcing Suitability (0-100)
  const outsourceScore =
    0.30 * chars.digitalNature +
    0.25 * chars.predictability +
    0.20 * (100 - chars.interpersonalInteraction) +
    0.125 * (100 - chars.physicalPresence) +
    0.125 * (100 - chars.sensitivityRisk);

  return {
    automationPotential: Math.min(100, Math.max(0, Math.round(autoScore))),
    humanNecessity: Math.min(100, Math.max(0, Math.round(humanScore))),
    outsourcingSuitability: Math.min(
      100,
      Math.max(0, Math.round(outsourceScore))
    ),
  };
}

/**
 * Determines recommendation category from scores and characteristics
 */
export function determineRecommendation(
  scores: TaskScores,
  chars: TaskCharacteristics,
  isSpecializedExternal = false
): RecommendationType {
  const { automationPotential, humanNecessity, outsourcingSuitability } =
    scores;

  // 1. Dominant Human Necessity or high physical/interpersonal thresholds
  if (
    humanNecessity >= 62 ||
    (humanNecessity >= 52 && humanNecessity > automationPotential) ||
    chars.interpersonalInteraction >= 75 ||
    chars.physicalPresence >= 50
  ) {
    return "HUMAN";
  }

  // 2. High Automation Potential without strong human necessity, risk, or high judgment
  if (
    automationPotential >= 75 &&
    automationPotential > humanNecessity + 20 &&
    humanNecessity < 40 &&
    chars.sensitivityRisk < 60 &&
    chars.humanJudgment < 50
  ) {
    return "AI / AUTOMATE";
  }

  // 3. Outsource suitability high for specialized external deliverables (e.g. payroll, specialized compliance)
  if (
    isSpecializedExternal &&
    outsourcingSuitability >= 70 &&
    chars.interpersonalInteraction < 30 &&
    humanNecessity < 50
  ) {
    return "OUTSOURCE";
  }

  // 4. Fallback to Hybrid when task is a mix of routine/digital execution and human judgment/oversight
  return "HYBRID";
}

/**
 * Generates a deterministic dynamic explanation based on calculated factors
 */
export function generateExplanation(
  recommendation: RecommendationType,
  chars: TaskCharacteristics
): string {
  const factors: string[] = [];

  if (chars.repetition >= 70) factors.push("highly repetitive");
  else if (chars.repetition <= 30) factors.push("varied");

  if (chars.predictability >= 70) factors.push("predictable");

  if (chars.digitalNature >= 85) factors.push("digital");

  if (chars.humanJudgment >= 70) factors.push("nuanced judgment");
  else if (chars.humanJudgment <= 30)
    factors.push("limited need for judgment");

  if (chars.interpersonalInteraction >= 70)
    factors.push("strong interpersonal engagement");

  if (chars.creativity >= 70) factors.push("creative problem-solving");

  if (chars.physicalPresence >= 40)
    factors.push("physical or in-person presence");

  if (chars.sensitivityRisk >= 65)
    factors.push("high compliance or business risk");

  const factorString =
    factors.length > 0 ? factors.join(", ") : "standard operational factors";

  switch (recommendation) {
    case "AI / AUTOMATE":
      return `Highly suited for software automation due to ${factorString} with minimal human overhead required.`;

    case "HUMAN":
      return `Requires direct human ownership driven by ${factorString} that cannot be reliably automated.`;

    case "HYBRID":
      return `Best structured as a hybrid workflow where automation assists execution while humans handle ${
        chars.humanJudgment >= 50 ? "judgment & oversight" : "sensitive exceptions"
      }.`;

    case "OUTSOURCE":
      return `Ideal for specialized external outsourcing given its ${factorString} and modular deliverable structure.`;

    default:
      return `Evaluated based on task complexity, digital footprint, and judgment requirements.`;
  }
}

/**
 * Determines confidence level for the recommendation
 */
export function calculateConfidence(
  recommendation: RecommendationType,
  scores: TaskScores,
  chars: TaskCharacteristics
): ConfidenceLevel {
  const { automationPotential, humanNecessity, outsourcingSuitability } =
    scores;

  if (recommendation === "AI / AUTOMATE") {
    if (automationPotential >= 80 && humanNecessity < 30) return "HIGH";
  }

  if (recommendation === "HUMAN") {
    if (
      humanNecessity >= 70 ||
      chars.interpersonalInteraction >= 80 ||
      chars.physicalPresence >= 60 ||
      (chars.humanJudgment >= 75 && chars.sensitivityRisk >= 75)
    ) {
      return "HIGH";
    }
  }

  if (recommendation === "OUTSOURCE") {
    if (
      outsourcingSuitability >= 75 &&
      chars.interpersonalInteraction < 20 &&
      chars.sensitivityRisk >= 60
    ) {
      return "HIGH";
    }
  }

  // Close/ambiguous scores result in LOW confidence
  const scoreDiff = Math.abs(automationPotential - humanNecessity);
  if (scoreDiff <= 12 && recommendation === "HYBRID") {
    return "LOW";
  }

  if (automationPotential >= 60 && humanNecessity >= 55) {
    return "LOW";
  }

  return "MEDIUM";
}

/**
 * Analyzes a single task string
 */
export function analyzeTask(task: string, index: number): TaskAnalysis {
  const lower = task.toLowerCase().trim();

  // Find matching pattern
  const matchedPattern = RULE_PATTERNS.find((p) =>
    p.keywords.some((kw) => lower.includes(kw.toLowerCase()))
  );

  let characteristics: TaskCharacteristics;
  let isSpecializedExternal = false;
  let keyFactors: string[];

  if (matchedPattern) {
    characteristics = { ...matchedPattern.baseCharacteristics };
    isSpecializedExternal = matchedPattern.isSpecializedExternal ?? false;
    keyFactors = [...matchedPattern.keyFactors];
  } else {
    const fallback = analyzeUnknownTask(task);
    characteristics = fallback.characteristics;
    isSpecializedExternal = fallback.isSpecializedExternal;
    keyFactors = fallback.keyFactors;
  }

  const scores = calculateScores(characteristics);
  const recommendation = determineRecommendation(
    scores,
    characteristics,
    isSpecializedExternal
  );
  const confidence = calculateConfidence(recommendation, scores, characteristics);
  const explanation = generateExplanation(recommendation, characteristics);

  const baseAnalysis: TaskAnalysis = {
    id: index + 1,
    taskName: task,
    recommendation,
    confidence,
    characteristics,
    scores,
    explanation,
    keyFactors,
  };

  const automationAnalysis = analyzeTaskAutomation(baseAnalysis);

  const fullTaskAnalysis: TaskAnalysis = {
    ...baseAnalysis,
    automationAnalysis,
  };

  fullTaskAnalysis.toolRecommendations = matchTools(fullTaskAnalysis);

  return fullTaskAnalysis;
}

/**
 * Runs full assessment on all tasks and computes workforce distribution
 */
export function analyzeAssessment(
  formData: AssessmentFormData
): AssessmentResult {
  const validTasks = formData.tasks.filter((t) => t.trim().length > 0);
  const analyzedTasks = validTasks.map((t, idx) => analyzeTask(t.trim(), idx));

  let aiCount = 0;
  let humanCount = 0;
  let hybridCount = 0;
  let outsourceCount = 0;

  analyzedTasks.forEach((t) => {
    switch (t.recommendation) {
      case "AI / AUTOMATE":
        aiCount++;
        break;
      case "HUMAN":
        humanCount++;
        break;
      case "HYBRID":
        hybridCount++;
        break;
      case "OUTSOURCE":
        outsourceCount++;
        break;
    }
  });

  const total = analyzedTasks.length || 1;
  const aiPercentage = Math.round((aiCount / total) * 100);
  const humanPercentage = Math.round((humanCount / total) * 100);
  const hybridPercentage = Math.round((hybridCount / total) * 100);
  const outsourcePercentage = Math.round((outsourceCount / total) * 100);

  // Overall recommendation & insight determination
  let overallRecommendation = "Hybrid Workforce";
  let overallInsight =
    "Your role can potentially be redesigned instead of hiring for the full workload.";

  if (aiPercentage >= 60) {
    overallRecommendation = "Automation-First Workflow";
    overallInsight =
      "The vast majority of responsibilities can be automated with software and AI tools rather than hiring a full-time employee.";
  } else if (humanPercentage >= 60) {
    overallRecommendation = "Human-Centric Role";
    overallInsight =
      "This role demands substantial interpersonal relationship management, contextual judgment, and human leadership.";
  } else if (outsourcePercentage >= 50) {
    overallRecommendation = "Contractor & Outsourcing Model";
    overallInsight =
      "Tasks in this role are modular and specialized, making fractional outsourcing or specialized agency support more cost-effective.";
  } else {
    overallRecommendation = "Hybrid Workforce Redesign";
    overallInsight =
      "A significant portion of routine execution can be automated or outsourced, allowing you to hire part-time or refocus the role on high-value human tasks.";
  }

  const distribution: WorkforceDistribution = {
    aiPercentage,
    humanPercentage,
    hybridPercentage,
    outsourcePercentage,
    aiCount,
    humanCount,
    hybridCount,
    outsourceCount,
  };

  return {
    role: formData.jobRole,
    companyType: formData.companyType,
    monthlyBudget: formData.monthlyBudget,
    tasks: analyzedTasks,
    overallRecommendation,
    overallInsight,
    distribution,
  };
}
