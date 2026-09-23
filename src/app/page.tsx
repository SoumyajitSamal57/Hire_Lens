"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import AssessmentForm from "@/components/AssessmentForm";
import ResultsPage from "@/components/ResultsPage";
import { AssessmentFormData, AssessmentResult } from "@/types/assessment";
import { analyzeAssessment } from "@/lib/taskAnalyzer";

export default function HomePage() {
  const [formData, setFormData] = useState<AssessmentFormData>({
    jobRole: "",
    companyType: "",
    monthlyBudget: "",
    tasks: [],
  });

  const [assessmentResult, setAssessmentResult] =
    useState<AssessmentResult | null>(null);

  const handleAnalyze = (data: AssessmentFormData) => {
    setFormData(data);
    const result = analyzeAssessment(data);
    setAssessmentResult(result);
    // Smooth scroll to top when analysis completes
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleEditInput = () => {
    setAssessmentResult(null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans selection:bg-slate-200 selection:text-slate-900">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className={assessmentResult ? "max-w-7xl mx-auto" : "max-w-5xl mx-auto"}>
          {assessmentResult ? (
            /* Step 2: Analysis Results View */
            <ResultsPage
              result={assessmentResult}
              onEdit={handleEditInput}
            />
          ) : (
            /* Step 1: Input Form View */
            <div className="space-y-6 sm:space-y-7">
              {/* Workspace Header */}
              <div className="border-b border-slate-200 pb-5">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                      Workforce & Task Feasibility Analysis
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                      Deconstruct a planned or existing position into discrete weekly responsibilities to determine whether tasks require dedicated human judgment, can leverage AI co-piloting, should be automated, or are suited for outsourcing.
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 font-mono shrink-0 sm:text-right">
                    Step 1 · Input Definition
                  </div>
                </div>
              </div>

              {/* Form Section */}
              <div>
                <AssessmentForm
                  initialData={formData}
                  onSubmitAssessment={handleAnalyze}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">HireLens</span>
            <span>&bull;</span>
            <span>AI vs Human Workforce Intelligence</span>
          </div>
          <div className="text-slate-400">
            &copy; {new Date().getFullYear()} HireLens. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
