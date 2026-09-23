import React, { useState, useEffect } from "react";
import { TaskAnalysis } from "@/types/assessment";
import { AIIntelligence } from "@/types/aiIntelligence";
import RecommendationBadge from "./RecommendationBadge";
import ScoreBar from "./ScoreBar";
import {
  Loader2,
  Bot,
  User,
  GitCommit,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { generateFallbackAIIntelligence } from "@/lib/aiFallback";

interface TaskAnalysisCardProps {
  task: TaskAnalysis;
  index: number;
}

export default function TaskAnalysisCard({
  task,
  index,
}: TaskAnalysisCardProps) {
  const formattedIndex = String(index + 1).padStart(2, "0");
  const auto = task.automationAnalysis;
  const tools = task.toolRecommendations || [];

  const [aiData, setAiData] = useState<AIIntelligence | null>(
    task.aiIntelligence || null
  );
  const [isLoading, setIsLoading] = useState<boolean>(!task.aiIntelligence);

  useEffect(() => {
    if (task.aiIntelligence) {
      setAiData(task.aiIntelligence);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);

    fetch("/api/ai-enrich-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API status ${res.status}`);
        }
        return res.json();
      })
      .then((data: AIIntelligence) => {
        if (isMounted) {
          setAiData(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setAiData(generateFallbackAIIntelligence(task));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [task]);

  const [isExpanded, setIsExpanded] = useState<boolean>(index === 0);

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 space-y-4">
      {/* Header: Index, Title, Confidence & Recommendation Verdict */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded shrink-0">
            {formattedIndex}
          </span>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
            {task.taskName}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          {task.confidence && (
            <span className="font-mono text-[11px] text-slate-500 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
              {task.confidence} Confidence
            </span>
          )}
          <RecommendationBadge type={task.recommendation} size="sm" />
        </div>
      </div>

      {/* Analytical Metrics Row (Structured Data Strip, Not Floating Cards) */}
      {auto && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-y border-slate-100 text-xs">
          <div>
            <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider block">
              Automation Score
            </span>
            <span className="font-mono font-bold text-slate-900 text-sm">
              {task.scores.automationPotential}%
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider block">
              Execution Risk
            </span>
            <span
              className={`font-semibold text-xs ${
                auto.riskLevel === "HIGH"
                  ? "text-rose-700"
                  : auto.riskLevel === "MEDIUM"
                  ? "text-amber-700"
                  : "text-emerald-700"
              }`}
            >
              {auto.riskLevel} Risk
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider block">
              Est. Monthly Tooling
            </span>
            <span className="font-mono font-semibold text-slate-900 text-xs truncate block">
              {auto.estimatedMonthlyCostMax > 0
                ? `₹${auto.estimatedMonthlyCostMin.toLocaleString("en-IN")}–${auto.estimatedMonthlyCostMax.toLocaleString("en-IN")}`
                : "₹0 (Zero direct software fee)"}
            </span>
          </div>

          <div>
            <span className="text-[10px] font-mono font-medium text-slate-400 uppercase tracking-wider block">
              Capacity Reduction
            </span>
            <span className="font-mono font-semibold text-slate-900 text-xs">
              {auto.estimatedTimeReductionMin}%–{auto.estimatedTimeReductionMax}% saved
            </span>
          </div>
        </div>
      )}

      {/* Reasoning Text Block */}
      <div className="space-y-2 text-xs">
        <p className="text-slate-700 leading-relaxed">
          <strong className="font-semibold text-slate-900">Analysis: </strong>
          {task.explanation}
        </p>

        {task.keyFactors && task.keyFactors.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400 font-medium">Key indicators:</span>
            {task.keyFactors.map((factor, idx) => (
              <span
                key={idx}
                className="text-[11px] text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded"
              >
                {factor}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        <ScoreBar
          label="Automation Potential"
          score={task.scores.automationPotential}
          color="slate"
          size="sm"
        />
        <ScoreBar
          label="Human Judgment Necessity"
          score={task.scores.humanNecessity}
          color="emerald"
          size="sm"
        />
        <ScoreBar
          label="Outsourcing Suitability"
          score={task.scores.outsourcingSuitability}
          color="sky"
          size="sm"
        />
      </div>

      {/* Special Handles Breakdown for Hybrid Workflows */}
      {auto?.aiHandles && auto?.humanHandles && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
          <div className="border border-slate-200 rounded p-3 bg-slate-50/70 space-y-1">
            <span className="font-semibold text-slate-900 text-[11px] flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-slate-600" /> Automated Pipeline Scope
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {auto.aiHandles}
            </p>
          </div>
          <div className="border border-slate-200 rounded p-3 bg-slate-50/70 space-y-1">
            <span className="font-semibold text-slate-900 text-[11px] flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" /> Human Supervision & Oversight
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              {auto.humanHandles}
            </p>
          </div>
        </div>
      )}

      {/* Implementation Specification Accordion Toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between px-3 py-2 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>Implementation Specification & Tool Match</span>
            {isLoading ? (
              <span className="flex items-center gap-1 text-slate-400 font-normal">
                <Loader2 className="w-3 h-3 animate-spin" />
                loading details...
              </span>
            ) : (
              <span className="text-[11px] text-slate-400 font-mono">
                ({tools.length} software solutions identified)
              </span>
            )}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
          )}
        </button>

        {/* Expandable Implementation Content */}
        {isExpanded && (
          <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
            {/* Column 1: Operational Workflow Plan */}
            <div className="space-y-3">
              <div className="pb-1 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  Execution Workflow
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  Step-by-step
                </span>
              </div>

              {isLoading ? (
                <div className="border border-slate-200 rounded p-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Loader2 className="w-3.5 h-3.5 text-slate-600 animate-spin" />
                  <span>Synthesizing workflow...</span>
                </div>
              ) : aiData ? (
                <div className="border border-slate-200 rounded p-3.5 space-y-3 bg-white">
                  {/* Steps */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                      Implementation Protocol
                    </span>
                    <ol className="space-y-1 pl-4 list-decimal text-slate-700 leading-relaxed text-[11px]">
                      {aiData.implementationPlan.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  {/* Division of Responsibility */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                    <div className="space-y-1">
                      <span className="font-semibold text-slate-900 text-[11px] flex items-center gap-1">
                        <Bot className="w-3 h-3 text-slate-600" /> Automation Tasks
                      </span>
                      <ul className="space-y-0.5 text-slate-600 pl-3.5 list-disc text-[11px]">
                        {aiData.automateTasks.slice(0, 3).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1">
                      <span className="font-semibold text-slate-900 text-[11px] flex items-center gap-1">
                        <User className="w-3 h-3 text-emerald-600" /> Human Checkpoints
                      </span>
                      <ul className="space-y-0.5 text-slate-600 pl-3.5 list-disc text-[11px]">
                        {aiData.humanResponsibilities.slice(0, 3).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Workflow Sequence */}
                  {aiData.workflow && aiData.workflow.length > 0 && (
                    <div className="space-y-1 pt-1 border-t border-slate-100">
                      <span className="font-semibold text-slate-800 text-[10px] uppercase tracking-wider flex items-center gap-1">
                        <GitCommit className="w-3 h-3 text-slate-400" /> Operational Sequence
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {aiData.workflow.map((step, i) => (
                          <React.Fragment key={i}>
                            <span className="text-[10px] font-mono text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                              {step}
                            </span>
                            {i < aiData.workflow.length - 1 && (
                              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            {/* Column 2: Tooling Matches & Evidence */}
            <div className="space-y-3">
              <div className="pb-1 border-b border-slate-100 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-900">
                  Software & Tooling Matches
                </span>
                <span className="font-mono text-[10px] text-slate-400">
                  Catalog match
                </span>
              </div>

              {tools.length > 0 ? (
                <div className="space-y-2">
                  {tools.map((tool) => (
                    <div
                      key={tool.id}
                      className="border border-slate-200 rounded p-3 space-y-1.5 bg-white"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 leading-tight">
                            {tool.name}
                          </h4>
                          <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                            {tool.description}
                          </p>
                        </div>
                        <span
                          className={`font-mono text-[10px] px-1.5 py-0.5 rounded border uppercase shrink-0 ${
                            tool.humanOversight === "HIGH"
                              ? "bg-rose-50 text-rose-800 border-rose-200"
                              : tool.humanOversight === "MEDIUM"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : "bg-emerald-50 text-emerald-800 border-emerald-200"
                          }`}
                        >
                          {tool.humanOversight} Oversight
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100 text-[10px]">
                        <div>
                          <span className="text-slate-400 font-medium block">Best Application</span>
                          <span className="text-slate-800 truncate block">{tool.bestFor}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium block">Estimated Cost</span>
                          <span className="font-mono text-slate-800 truncate block">{tool.estimatedCostRange}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : task.recommendation === "HUMAN" ? (
                <div className="border border-slate-200 rounded p-3.5 flex items-start gap-2.5 text-xs text-slate-600 bg-slate-50">
                  <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-slate-900 block">Core Human Responsibility</strong>
                    <span>No commercial software or AI pipeline is advised to replace direct human execution for this task.</span>
                  </div>
                </div>
              ) : (
                <div className="border border-slate-200 rounded p-3 text-xs text-slate-400 italic bg-slate-50">
                  Custom scripting or internal API pipeline recommended.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
