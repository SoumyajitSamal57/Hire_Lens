"use client";

import React, { useState, useMemo } from "react";
import { AssessmentResult } from "@/types/assessment";
import TaskAnalysisCard from "./TaskAnalysisCard";
import JobRedesignSection from "./JobRedesignSection";
import { generateJobRedesignPlan } from "@/lib/jobRedesign";
import {
  ArrowLeft,
  Bot,
  User,
  Shuffle,
  ExternalLink,
  Download,
  Loader2,
  AlertCircle,
  RotateCcw,
  Printer,
  TrendingDown,
} from "lucide-react";

interface ResultsPageProps {
  result: AssessmentResult;
  onEdit: () => void;
}

export default function ResultsPage({ result, onEdit }: ResultsPageProps) {
  const {
    role,
    companyType,
    monthlyBudget,
    tasks,
    overallRecommendation,
    overallInsight,
    distribution,
  } = result;

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const jobRedesignPlan = useMemo(
    () => generateJobRedesignPlan(result),
    [result]
  );

  const formattedBudget = !isNaN(Number(monthlyBudget))
    ? Number(monthlyBudget).toLocaleString("en-IN")
    : monthlyBudget;

  const handleDownloadPdf = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setPdfError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 20000); // 20s timeout protection

    try {
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(
          errData.details || errData.error || `Server responded with status ${response.status}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `hirelens-${(role || "assessment").toLowerCase().replace(/\s+/g, "-")}-report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: unknown) {
      let msg = "PDF generation failed. Please try again.";
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          msg = "PDF generation timed out after 20 seconds. You can retry or use browser print.";
        } else {
          msg = err.message;
        }
      }
      setPdfError(msg);
    } finally {
      clearTimeout(timeoutId);
      setIsGeneratingPdf(false);
    }
  };

  const handleBrowserPrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const actionableTasksCount =
    distribution.aiCount + distribution.hybridCount + distribution.outsourceCount;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Utility & Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-md transition-colors cursor-pointer min-h-[36px]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Modify Assessment</span>
          </button>

          <div className="h-4 w-px bg-slate-200 hidden md:block" />

          {/* Context Details */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
            <span className="font-semibold text-slate-900">{role}</span>
            <span className="text-slate-300">/</span>
            <span>{companyType}</span>
            <span className="text-slate-300">/</span>
            <span className="font-mono text-slate-700">₹{formattedBudget}/mo budget</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={handleBrowserPrint}
            title="Print assessment page"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 px-3 py-1.5 rounded-md transition-colors cursor-pointer min-h-[36px]"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center justify-center gap-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 active:bg-black disabled:bg-slate-400 border border-slate-900 px-3.5 py-1.5 rounded-md transition-colors cursor-pointer disabled:cursor-not-allowed min-h-[36px]"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* PDF Generation Error Banner with Retry & Print options */}
      {pdfError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-red-800">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block">PDF report generation unsuccessful</span>
              <p className="mt-0.5 text-red-700">{pdfError}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-medium transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Retry</span>
            </button>
            <button
              type="button"
              onClick={handleBrowserPrint}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-red-200 text-red-700 hover:bg-red-50 font-medium transition-colors cursor-pointer"
            >
              <Printer className="w-3 h-3" />
              <span>Print Page</span>
            </button>
            <button
              type="button"
              onClick={() => setPdfError(null)}
              className="text-red-500 hover:text-red-800 font-medium px-1.5 py-0.5 text-xs cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Strategic Synthesis Block (Executive Editorial Presentation) */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-7 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
              Workforce Recommendation
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
            {overallRecommendation}
          </h2>
          <div className="border-l-2 border-slate-300 pl-4 py-0.5 text-sm sm:text-base text-slate-700 italic leading-relaxed">
            &quot;{overallInsight}&quot;
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-900">{actionableTasksCount} of {tasks.length} responsibilities</span>
            <span>can transition away from full-time manual execution through automation, hybrid tools, or fractional outsourcing.</span>
          </div>
        </div>
      </div>

      {/* Unified Executive KPI Data Strip (Table-like, No Floating Cards) */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-xs">
          {/* Total Tasks */}
          <div className="p-4 sm:p-5 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
              Evaluated Tasks
            </span>
            <div className="text-2xl font-bold text-slate-900">
              {tasks.length}
            </div>
            <span className="text-[11px] text-slate-500 block">
              Discrete responsibilities
            </span>
          </div>

          {/* AI / Automation */}
          <div className="p-4 sm:p-5 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block font-mono flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-slate-600" /> AI / Automate
            </span>
            <div className="text-2xl font-bold text-slate-900">
              {distribution.aiPercentage}%
            </div>
            <span className="text-[11px] text-slate-500 block">
              {distribution.aiCount} {distribution.aiCount === 1 ? "task" : "tasks"} automated
            </span>
          </div>

          {/* Human Focus */}
          <div className="p-4 sm:p-5 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block font-mono flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-600" /> Human Focus
            </span>
            <div className="text-2xl font-bold text-emerald-900">
              {distribution.humanPercentage}%
            </div>
            <span className="text-[11px] text-emerald-700 block">
              {distribution.humanCount} {distribution.humanCount === 1 ? "task" : "tasks"} core judgment
            </span>
          </div>

          {/* Hybrid Co-Pilot */}
          <div className="p-4 sm:p-5 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block font-mono flex items-center gap-1.5">
              <Shuffle className="w-3.5 h-3.5 text-amber-600" /> Hybrid Co-Pilot
            </span>
            <div className="text-2xl font-bold text-amber-900">
              {distribution.hybridPercentage}%
            </div>
            <span className="text-[11px] text-amber-700 block">
              {distribution.hybridCount} {distribution.hybridCount === 1 ? "task" : "tasks"} AI-assisted
            </span>
          </div>

          {/* Outsource */}
          <div className="p-4 sm:p-5 space-y-1 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 block font-mono flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-sky-600" /> Outsource
            </span>
            <div className="text-2xl font-bold text-sky-900">
              {distribution.outsourcePercentage}%
            </div>
            <span className="text-[11px] text-sky-700 block">
              {distribution.outsourceCount} {distribution.outsourceCount === 1 ? "task" : "tasks"} contractor
            </span>
          </div>
        </div>
      </div>

      {/* Workforce Allocation Mix Bar & Proportions */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-900">
              Workforce Allocation Mix
            </h3>
            <p className="text-xs text-slate-500">
              Proportional distribution across execution modalities.
            </p>
          </div>
          <span className="font-mono text-xs text-slate-400">
            {tasks.length} total responsibilities
          </span>
        </div>

        {/* Visual Stacked Multi-Segment Bar */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-slate-100 rounded overflow-hidden flex">
            {distribution.aiPercentage > 0 && (
              <div
                style={{ width: `${distribution.aiPercentage}%` }}
                className="bg-slate-800 h-full transition-all"
                title={`AI / Automate: ${distribution.aiPercentage}%`}
              />
            )}
            {distribution.humanPercentage > 0 && (
              <div
                style={{ width: `${distribution.humanPercentage}%` }}
                className="bg-emerald-600 h-full transition-all"
                title={`Human: ${distribution.humanPercentage}%`}
              />
            )}
            {distribution.hybridPercentage > 0 && (
              <div
                style={{ width: `${distribution.hybridPercentage}%` }}
                className="bg-amber-500 h-full transition-all"
                title={`Hybrid: ${distribution.hybridPercentage}%`}
              />
            )}
            {distribution.outsourcePercentage > 0 && (
              <div
                style={{ width: `${distribution.outsourcePercentage}%` }}
                className="bg-sky-500 h-full transition-all"
                title={`Outsource: ${distribution.outsourcePercentage}%`}
              />
            )}
          </div>
        </div>

        {/* Structured Table-like Allocation Legend */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-1 text-xs">
          <div className="p-2.5 rounded border border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="font-medium text-slate-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-slate-800 shrink-0" />
              AI / Automate
            </span>
            <span className="font-mono font-bold text-slate-900">{distribution.aiPercentage}%</span>
          </div>

          <div className="p-2.5 rounded border border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="font-medium text-slate-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600 shrink-0" />
              Human Focus
            </span>
            <span className="font-mono font-bold text-slate-900">{distribution.humanPercentage}%</span>
          </div>

          <div className="p-2.5 rounded border border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="font-medium text-slate-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 shrink-0" />
              Hybrid Co-Pilot
            </span>
            <span className="font-mono font-bold text-slate-900">{distribution.hybridPercentage}%</span>
          </div>

          <div className="p-2.5 rounded border border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="font-medium text-slate-700 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 shrink-0" />
              Outsource
            </span>
            <span className="font-mono font-bold text-slate-900">{distribution.outsourcePercentage}%</span>
          </div>
        </div>
      </div>

      {/* Job Redesign Section (Business Transition Plan) */}
      <JobRedesignSection plan={jobRedesignPlan} />

      {/* Detailed Task Feasibility Breakdown */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 pb-2 border-b border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Task-Level Feasibility Ledger
            </h2>
            <p className="text-xs text-slate-500">
              Detailed assessment of each responsibility against automation archetypes, risk levels, and tooling.
            </p>
          </div>
          <span className="font-mono text-xs text-slate-400">
            {tasks.length} evaluated items
          </span>
        </div>

        <div className="space-y-3">
          {tasks.map((task, idx) => (
            <TaskAnalysisCard key={task.id} task={task} index={idx} />
          ))}
        </div>
      </div>

      {/* Bottom Summary & Strategic Synthesis (2-Column Grid on Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Recommended Workforce Allocation Matrix */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <div className="border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm">
              Workforce Allocation Breakdown
            </h3>
            <p className="text-[11px] text-slate-500">
              Task count mapped by optimal execution modality.
            </p>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-2 rounded border border-slate-200 bg-slate-50">
              <span className="font-medium text-slate-700 flex items-center gap-2">
                <Bot className="w-3.5 h-3.5 text-slate-600" /> AI / Automation
              </span>
              <span className="font-mono font-bold text-slate-900">
                {distribution.aiCount} {distribution.aiCount === 1 ? "task" : "tasks"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded border border-slate-200 bg-slate-50">
              <span className="font-medium text-slate-700 flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-emerald-600" /> Human Focus
              </span>
              <span className="font-mono font-bold text-emerald-900">
                {distribution.humanCount} {distribution.humanCount === 1 ? "task" : "tasks"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded border border-slate-200 bg-slate-50">
              <span className="font-medium text-slate-700 flex items-center gap-2">
                <Shuffle className="w-3.5 h-3.5 text-amber-600" /> Hybrid Co-Pilot
              </span>
              <span className="font-mono font-bold text-amber-900">
                {distribution.hybridCount} {distribution.hybridCount === 1 ? "task" : "tasks"}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded border border-slate-200 bg-slate-50">
              <span className="font-medium text-slate-700 flex items-center gap-2">
                <ExternalLink className="w-3.5 h-3.5 text-sky-600" /> Outsource
              </span>
              <span className="font-mono font-bold text-sky-900">
                {distribution.outsourceCount} {distribution.outsourceCount === 1 ? "task" : "tasks"}
              </span>
            </div>
          </div>
        </div>

        {/* Implementation Strategy & Financial Optimization */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                Strategic Implementation Guidance
              </h3>
              <p className="text-[11px] text-slate-500">
                Recommended approach for position restructuring.
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Transitioning routine responsibilities to automated pipelines enables redesigning the job specification around high-judgment human tasks, reducing operational overhead while raising output consistency.
            </p>

            <div className="border border-slate-200 rounded p-3 bg-slate-50 text-xs text-slate-700 space-y-1">
              <div className="font-semibold text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                  Monthly Budget Allocation
                </span>
                <span className="font-mono font-bold text-slate-900">
                  ₹{formattedBudget}/mo
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Review Job Redesign blueprint above for detailed hours capacity and tooling cost models.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 py-2 rounded-md transition-colors cursor-pointer min-h-[36px]"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Report</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onEdit}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 py-2 rounded-md transition-colors cursor-pointer min-h-[36px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modify Inputs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
