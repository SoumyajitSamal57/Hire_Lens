"use client";

import React, { useState } from "react";
import {
  Briefcase,
  Building2,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import TaskInputList from "./TaskInputList";
import { AssessmentFormData, FormErrors } from "@/types/assessment";

interface AssessmentFormProps {
  initialData?: AssessmentFormData;
  onSubmitAssessment: (data: AssessmentFormData) => void;
}

export default function AssessmentForm({
  initialData,
  onSubmitAssessment,
}: AssessmentFormProps) {
  const [formData, setFormData] = useState<AssessmentFormData>(
    initialData || {
      jobRole: "",
      companyType: "",
      monthlyBudget: "",
      tasks: [],
    }
  );

  const [errors, setErrors] = useState<FormErrors>({});

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.jobRole.trim()) {
      newErrors.jobRole = "Job role is required";
    }

    if (!formData.companyType.trim()) {
      newErrors.companyType = "Company type is required";
    }

    if (!formData.monthlyBudget.trim()) {
      newErrors.monthlyBudget = "Monthly budget is required";
    } else if (
      isNaN(Number(formData.monthlyBudget)) ||
      Number(formData.monthlyBudget) <= 0
    ) {
      newErrors.monthlyBudget = "Monthly budget must be greater than 0";
    }

    const validTasks = formData.tasks.filter((t) => t.trim().length > 0);
    if (validTasks.length === 0) {
      newErrors.tasks = "At least one non-empty task is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      const sanitizedData: AssessmentFormData = {
        jobRole: formData.jobRole.trim(),
        companyType: formData.companyType.trim(),
        monthlyBudget: formData.monthlyBudget.trim(),
        tasks: formData.tasks
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
      };

      console.log("HireLens Assessment Input (Step 2 Triggered):", sanitizedData);
      onSubmitAssessment(sanitizedData);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        {/* Form Header Strip */}
        <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
              Input Ledger
            </span>
            <h2 className="text-sm font-semibold text-slate-900">
              Role Profile & Responsibility Decomposition
            </h2>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Deterministic Archetype Matcher
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-7">
          {/* Top error banner if multiple errors */}
          {Object.keys(errors).length > 1 && (
            <div className="flex items-center gap-2.5 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs font-medium mb-6">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>
                Please complete all required fields below before evaluating.
              </span>
            </div>
          )}

          {/* Desktop Two-Panel Layout (5 cols Context / 7 cols Tasks) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:divide-x lg:divide-slate-200">

            {/* LEFT PANEL: Context Parameters (5 cols) */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">Position Context</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Specify position title, organization structure, and target budget.</p>
              </div>

              {/* Job Role */}
              <div className="space-y-1">
                <label
                  htmlFor="jobRole"
                  className="block text-xs font-medium text-slate-700"
                >
                  Job Title / Target Role <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="jobRole"
                    value={formData.jobRole}
                    onChange={(e) => {
                      setFormData({ ...formData, jobRole: e.target.value });
                      if (errors.jobRole)
                        setErrors({ ...errors, jobRole: undefined });
                    }}
                    placeholder="e.g. Marketing Assistant"
                    className={`w-full rounded-md border pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors ${
                      errors.jobRole
                        ? "border-red-300 focus:border-red-500 bg-red-50/20"
                        : "border-slate-300 bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                    }`}
                  />
                </div>
                {errors.jobRole ? (
                  <p className="text-xs font-medium text-red-600">{errors.jobRole}</p>
                ) : (
                  <p className="text-[11px] text-slate-400">Title of the role being evaluated</p>
                )}
              </div>

              {/* Company Type */}
              <div className="space-y-1">
                <label
                  htmlFor="companyType"
                  className="block text-xs font-medium text-slate-700"
                >
                  Organization / Industry Type <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    id="companyType"
                    value={formData.companyType}
                    onChange={(e) => {
                      setFormData({ ...formData, companyType: e.target.value });
                      if (errors.companyType)
                        setErrors({ ...errors, companyType: undefined });
                    }}
                    placeholder="e.g. B2B SaaS Startup, Digital Agency"
                    className={`w-full rounded-md border pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors ${
                      errors.companyType
                        ? "border-red-300 focus:border-red-500 bg-red-50/20"
                        : "border-slate-300 bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                    }`}
                  />
                </div>
                {errors.companyType ? (
                  <p className="text-xs font-medium text-red-600">{errors.companyType}</p>
                ) : (
                  <p className="text-[11px] text-slate-400">Operating environment and workflow scale</p>
                )}
              </div>

              {/* Monthly Hiring Budget */}
              <div className="space-y-1">
                <label
                  htmlFor="monthlyBudget"
                  className="block text-xs font-medium text-slate-700"
                >
                  Target Monthly Budget (INR) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 font-medium text-sm">
                    ₹
                  </div>
                  <input
                    type="number"
                    id="monthlyBudget"
                    min="0"
                    step="500"
                    value={formData.monthlyBudget}
                    onChange={(e) => {
                      setFormData({ ...formData, monthlyBudget: e.target.value });
                      if (errors.monthlyBudget)
                        setErrors({ ...errors, monthlyBudget: undefined });
                    }}
                    placeholder="35000"
                    className={`w-full rounded-md border pl-8 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-colors ${
                      errors.monthlyBudget
                        ? "border-red-300 focus:border-red-500 bg-red-50/20"
                        : "border-slate-300 bg-white focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                    }`}
                  />
                </div>
                {errors.monthlyBudget ? (
                  <p className="text-xs font-medium text-red-600">{errors.monthlyBudget}</p>
                ) : (
                  <p className="text-[11px] text-slate-400">Full-time compensation allocation for comparison</p>
                )}
              </div>

              {/* Analysis CTA — shown inline in left panel on desktop */}
              <div className="hidden lg:block pt-5 border-t border-slate-200 space-y-3">
                <button
                  type="submit"
                  className="w-full min-h-[42px] flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-medium py-2.5 px-4 rounded-md transition-colors text-sm cursor-pointer shadow-xs"
                >
                  <span>Run Feasibility Assessment</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </button>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Evaluates tasks against automation potentials, estimates cost optimizations, and models role capacity.
                </p>
              </div>
            </div>

            {/* RIGHT PANEL: Weekly Responsibilities Ledger (7 cols) */}
            <div className="lg:col-span-7 space-y-4 lg:pl-8">
              <TaskInputList
                tasks={formData.tasks}
                onChange={(tasks) => {
                  setFormData({ ...formData, tasks });
                  if (errors.tasks) setErrors({ ...errors, tasks: undefined });
                }}
                error={errors.tasks}
              />
            </div>
          </div>

          {/* Mobile-only Submission Action Bar (hidden on lg+) */}
          <div className="pt-6 mt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 lg:hidden">
            <div className="text-xs text-slate-500 hidden sm:block">
              <span className="font-semibold text-slate-700">Immediate Assessment</span>
              <p className="text-[11px] text-slate-400">Deterministic scoring across 100+ task archetypes.</p>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto min-h-[44px] flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:bg-black text-white font-medium py-2.5 px-6 rounded-md transition-colors text-sm cursor-pointer"
            >
              <span>Run Feasibility Assessment</span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
