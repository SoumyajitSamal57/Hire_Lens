import { NextRequest, NextResponse } from "next/server";
import { TaskAnalysis } from "../../../types/assessment";
import { AIIntelligence } from "../../../types/aiIntelligence";
import { generateFallbackAIIntelligence, validateAIIntelligence } from "../../../lib/aiFallback";

const SYSTEM_PROMPT = `You are a workforce optimization advisor.

You are given a deterministic task analysis produced by HireLens.

You MUST NOT change the provided recommendation, scores, cost ranges, risk level, or confidence.

Your job is only to explain how the recommendation could be implemented in practice.

The model must:
- explain the practical workflow
- identify what AI/software can do
- identify what humans must do
- identify escalation points
- identify implementation risks
- produce concise actionable recommendations

Do not allow the model to invent exact software pricing.
Do not allow it to override deterministic decisions.

Return strictly a valid JSON object matching this exact TypeScript schema:
{
  "implementationPlan": ["string", "string", "string"],
  "automateTasks": ["string", "string"],
  "humanResponsibilities": ["string", "string"],
  "workflow": ["string", "string", "string", "string"],
  "keyRisks": ["string", "string"],
  "recommendation": "string"
}`;

async function callLLM(task: TaskAnalysis): Promise<AIIntelligence | null> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.LLM_API_KEY;
  if (!apiKey) {
    return null;
  }

  const taskPayload = {
    taskDescription: task.taskName,
    recommendation: task.recommendation,
    confidence: task.confidence,
    scores: task.scores,
    characteristics: task.characteristics,
    automationCategory: task.automationAnalysis?.category,
    estimatedCostRange: task.automationAnalysis
      ? `₹${task.automationAnalysis.estimatedMonthlyCostMin} - ₹${task.automationAnalysis.estimatedMonthlyCostMax}`
      : "N/A",
    estimatedTimeReduction: task.automationAnalysis
      ? `${task.automationAnalysis.estimatedTimeReductionMin}% - ${task.automationAnalysis.estimatedTimeReductionMax}%`
      : "N/A",
    humanInvolvement: task.automationAnalysis?.humanInvolvement,
    riskLevel: task.automationAnalysis?.riskLevel,
    deterministicRationale: task.explanation || task.automationAnalysis?.rationale,
    recommendedSolutions: task.toolRecommendations?.map((t) => ({
      name: t.name,
      category: t.category,
      bestFor: t.bestFor,
      humanOversight: t.humanOversight,
    })),
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    let parsedResult: unknown = null;

    if (process.env.GEMINI_API_KEY || (apiKey.startsWith("AIza") || apiKey.includes("gemini"))) {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      const res = await fetch(geminiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${SYSTEM_PROMPT}\n\nINPUT TASK ANALYSIS:\n${JSON.stringify(taskPayload, null, 2)}`,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      });

      if (!res.ok) return null;
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return null;
      const cleanJson = rawText.replace(/```json\s*|```/g, "").trim();
      parsedResult = JSON.parse(cleanJson);
    } else {
      const openaiUrl = "https://api.openai.com/v1/chat/completions";
      const res = await fetch(openaiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: JSON.stringify(taskPayload) },
          ],
          response_format: { type: "json_object" },
          temperature: 0.2,
        }),
      });

      if (!res.ok) return null;
      const data = await res.json();
      const rawText = data?.choices?.[0]?.message?.content;
      if (!rawText) return null;
      parsedResult = JSON.parse(rawText);
    }

    if (validateAIIntelligence(parsedResult)) {
      return parsedResult;
    }
    return null;
  } catch (err) {
    console.warn("LLM API call failed or timed out:", err);
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(req: NextRequest) {
  let task: TaskAnalysis | undefined;

  try {
    const body = await req.json();
    if (body && typeof body === "object") {
      task = body.task ? body.task : body;
    }
  } catch {
    // Malformed JSON request body
  }

  if (
    !task ||
    typeof task !== "object" ||
    !task.taskName ||
    !task.recommendation ||
    !task.scores ||
    !task.characteristics
  ) {
    if (task && task.taskName) {
      return NextResponse.json(generateFallbackAIIntelligence(task));
    }
    return NextResponse.json(
      { error: "Invalid task analysis object provided." },
      { status: 400 }
    );
  }

  const aiResult = await callLLM(task);

  if (aiResult) {
    return NextResponse.json(aiResult);
  }

  const fallback = generateFallbackAIIntelligence(task);
  return NextResponse.json(fallback);
}
