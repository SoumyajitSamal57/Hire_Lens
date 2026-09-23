"use client";

import React, { useState } from "react";
import { JobRedesignPlan } from "@/types/jobRedesign";
import {
  Briefcase,
  Bot,
  UserCheck,
  TrendingUp,
  Clock,
  Copy,
  Check,
  Layers,
  ArrowRight,
} from "lucide-react";

interface JobRedesignSectionProps {
  plan: JobRedesignPlan;
}

export default function JobRedesignSection({ plan }: JobRedesignSectionProps) {
  const [activeTab, setActiveTab] = useState<"blueprint" | "capacity" | "jd">("blueprint");
  const [copied, setCopied] = useState(false);

  const handleCopyJd = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(plan.modernJobDescription.formattedMarkdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getVerdictBadgeStyle = (verdict: string) => {
    switch (verdict) {
      case "DO_NOT_HIRE_FULLTIME":
        return "bg-slate-100 text-slate-800 border-slate-300";
      case "HIRE_PART_TIME":
        return "bg-amber-50 text-amber-800 border-amber-300";
      case "HIRE_FULL_TIME_HUMAN":
        return "bg-emerald-50 text-emerald-800 border-emerald-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <section className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {/* Executive Header Banner */}
      <div className="bg-slate-50 p-5 sm:p-6 border-b border-slate-200 space-y-3">
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3">
          <div className="space-y-1.5">
            <span className="font-mono text-[11px] font-semibold uppercase text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
              Strategic Position Redesign
            </span>

            {/* Role Transformation Display */}
            <div className="flex flex-wrap items-baseline gap-2 text-base sm:text-xl font-bold tracking-tight text-slate-900 pt-1">
              <span className="text-slate-500 font-normal">{plan.originalRole}</span>
              <ArrowRight className="w-4 h-4 text-slate-400 shrink-0 self-center" />
              <span className="text-slate-950 font-bold">{plan.redesignedTitle}</span>
            </div>
          </div>

          {/* Hiring Verdict Badge */}
          <div className="self-start md:self-auto shrink-0">
            <div className={`px-3 py-1.5 rounded border text-xs font-semibold flex items-center gap-2 ${getVerdictBadgeStyle(plan.hiringVerdict)}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              <span>{plan.hiringVerdictLabel}</span>
            </div>
          </div>
        </div>

        {/* Strategic Justification */}
        <div className="pt-2 border-t border-slate-200/60 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <strong className="font-semibold text-slate-900">Decision Rationale: </strong>
          {plan.hiringVerdictReasoning}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 bg-white px-4 sm:px-6">
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2">
          <button
            type="button"
            onClick={() => setActiveTab("blueprint")}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer min-h-[34px] ${
              activeTab === "blueprint"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Workload Allocation Matrix</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("capacity")}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer min-h-[34px] ${
              activeTab === "capacity"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Capacity & Financial ROI</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("jd")}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer min-h-[34px] ${
              activeTab === "jd"
                ? "bg-slate-900 text-white font-semibold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Modern Job Description</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Workload Allocation Matrix */}
      {activeTab === "blueprint" && (
        <div className="p-5 sm:p-6">
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            {/* Column 1: Retained Human Responsibilities */}
            <div className="p-4 sm:p-5 space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-xs">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>Elevated Human Focus ({plan.workload.retainedHumanTasks.length})</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  High-judgment, strategic, or empathy-driven responsibilities that remain strictly human.
                </p>
              </div>

              <ul className="space-y-2 pt-1 text-xs">
                {plan.workload.retainedHumanTasks.length > 0 ? (
                  plan.workload.retainedHumanTasks.map((t, idx) => (
                    <li key={idx} className="p-2.5 rounded border border-slate-200 bg-slate-50 space-y-1">
                      <div className="font-semibold text-slate-900">{t.taskName}</div>
                      <div className="text-slate-500 text-[11px] leading-normal">{t.reason}</div>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400 italic">No tasks require exclusive manual human execution.</li>
                )}
              </ul>
            </div>

            {/* Column 2: Hybrid Human + AI Supervision */}
            <div className="p-4 sm:p-5 space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
                  <Layers className="w-4 h-4 text-slate-600" />
                  <span>AI-Supervised Workflows ({plan.workload.hybridTasks.length})</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  AI drafts or executes initial passes; human specialist provides directional guidance and final approval.
                </p>
              </div>

              <ul className="space-y-2 pt-1 text-xs">
                {plan.workload.hybridTasks.length > 0 ? (
                  plan.workload.hybridTasks.map((t, idx) => (
                    <li key={idx} className="p-2.5 rounded border border-slate-200 bg-slate-50 space-y-1.5">
                      <div className="font-semibold text-slate-900">{t.taskName}</div>
                      <div className="text-[11px] text-slate-700 flex items-start gap-1.5">
                        <Bot className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <span><strong>AI:</strong> {t.aiRole}</span>
                      </div>
                      <div className="text-[11px] text-slate-700 flex items-start gap-1.5">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span><strong>Human:</strong> {t.humanRole}</span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400 italic">No hybrid workflows designated.</li>
                )}
              </ul>
            </div>

            {/* Column 3: Automated & Removed Tasks */}
            <div className="p-4 sm:p-5 space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <div className="flex items-center gap-1.5 text-slate-900 font-semibold text-xs">
                  <Bot className="w-4 h-4 text-slate-600" />
                  <span>Automated & Removed ({plan.workload.automatedTasks.length})</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  Routine operations offloaded to software pipelines and removed from headcount requirement.
                </p>
              </div>

              <ul className="space-y-2 pt-1 text-xs">
                {plan.workload.automatedTasks.length > 0 ? (
                  plan.workload.automatedTasks.map((t, idx) => (
                    <li key={idx} className="p-2.5 rounded border border-slate-200 bg-slate-50 space-y-1">
                      <div className="font-semibold text-slate-900">{t.taskName}</div>
                      <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
                        <span className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200">
                          {t.primaryTool || "Automated Pipeline"}
                        </span>
                        <span className="font-mono font-medium text-emerald-700">
                          ~{t.humanTimeSavedWeeklyHours} hrs/wk saved
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400 italic">No tasks fully eliminated through automation.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Capacity & Financial ROI */}
      {activeTab === "capacity" && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Capacity Bar */}
          <div className="border border-slate-200 rounded-lg p-5 bg-slate-50 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  Weekly Capacity Transformation (40 hrs base)
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Comparison of eliminated routine manual hours versus focused human judgment time.
                </p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-mono text-slate-950">
                  {plan.capacity.efficiencyGainPercentage}%
                </span>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Efficiency Gain</span>
              </div>
            </div>

            {/* Dual Progress Bar (No flashy gradients) */}
            <div className="space-y-1.5">
              <div className="h-3 w-full bg-slate-200 rounded overflow-hidden flex">
                <div
                  style={{ width: `${plan.capacity.efficiencyGainPercentage}%` }}
                  className="bg-slate-800 h-full transition-all"
                  title={`Freed: ${plan.capacity.freedWeeklyHours} hrs`}
                />
                <div
                  style={{ width: `${100 - plan.capacity.efficiencyGainPercentage}%` }}
                  className="bg-emerald-600 h-full transition-all"
                  title={`Human Focus: ${plan.capacity.newHumanWeeklyHours} hrs`}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-600 pt-1 font-mono text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-800">
                  <span className="w-2 h-2 rounded-sm bg-slate-800"></span>
                  <span>Freed by Automation: {plan.capacity.freedWeeklyHours} hrs/wk</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-800">
                  <span className="w-2 h-2 rounded-sm bg-emerald-600"></span>
                  <span>Target Human Focus: {plan.capacity.newHumanWeeklyHours} hrs/wk</span>
                </div>
              </div>
            </div>
          </div>

          {/* Financial ROI Metrics (Unified Table Grid, Not Floating Cards) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-xs">
              <div className="p-4 space-y-1">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
                  Original Monthly Budget
                </span>
                <div className="text-lg font-bold font-mono text-slate-900">
                  ₹{plan.financial.originalBudgetMonthly.toLocaleString("en-IN")}
                </div>
                <span className="text-[11px] text-slate-500 block">Baseline full-time comp</span>
              </div>

              <div className="p-4 space-y-1">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
                  Estimated Tooling Stack
                </span>
                <div className="text-lg font-bold font-mono text-slate-900">
                  ₹{plan.financial.estimatedMonthlyToolCosts.toLocaleString("en-IN")}
                </div>
                <span className="text-[11px] text-slate-500 block">SaaS & pipeline costs/mo</span>
              </div>

              <div className="p-4 space-y-1">
                <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block">
                  Estimated Monthly Savings
                </span>
                <div className="text-lg font-bold font-mono text-emerald-800">
                  ₹{plan.financial.estimatedMonthlySavings.toLocaleString("en-IN")}
                </div>
                <span className="text-[11px] text-emerald-700 block">
                  ~{plan.financial.roiPercentage}% cost optimization
                </span>
              </div>

              <div className="p-4 space-y-1">
                <span className="font-mono text-[10px] text-emerald-700 uppercase tracking-wider block">
                  Annual Projected Savings
                </span>
                <div className="text-lg font-bold font-mono text-emerald-900">
                  ₹{plan.financial.estimatedAnnualSavings.toLocaleString("en-IN")}
                </div>
                <span className="text-[11px] text-slate-500 block">Reinvest in specialized talent</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Copyable Modern Job Description */}
      {activeTab === "jd" && (
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded border border-slate-200 bg-slate-50">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Modernized Role Specification
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Formatted in Markdown. Ready for immediate deployment to job boards, ATS, or talent marketplaces.
              </p>
            </div>
            <button
              onClick={handleCopyJd}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer shrink-0 min-h-[34px]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Markdown JD</span>
                </>
              )}
            </button>
          </div>

          {/* JD Preview Card */}
          <div className="border border-slate-200 rounded p-4 text-xs font-mono bg-slate-50 text-slate-800 overflow-x-auto max-h-96 leading-relaxed">
            <pre className="whitespace-pre-wrap font-sans text-xs text-slate-800">
              {plan.modernJobDescription.formattedMarkdown}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}
