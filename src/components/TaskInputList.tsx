"use client";

import React from "react";
import { Plus, Trash2, ListChecks, CornerDownRight } from "lucide-react";

interface TaskInputListProps {
  tasks: string[];
  onChange: (tasks: string[]) => void;
  error?: string;
}

const EXAMPLE_TASKS = [
  "Schedule social media posts",
  "Create weekly reports",
  "Reply to customer emails",
  "Research competitors",
  "Attend client meetings",
];

export default function TaskInputList({
  tasks,
  onChange,
  error,
}: TaskInputListProps) {
  const handleTaskChange = (index: number, value: string) => {
    const updated = [...tasks];
    updated[index] = value;
    onChange(updated);
  };

  const handleAddTask = () => {
    onChange([...tasks, ""]);
  };

  const handleRemoveTask = (index: number) => {
    const updated = tasks.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleAddExample = (example: string) => {
    // Check if task already exists (case-insensitive)
    const exists = tasks.some(
      (t) => t.trim().toLowerCase() === example.trim().toLowerCase()
    );
    if (exists) return;

    // If an empty task input exists, fill that slot; otherwise append
    const emptyIndex = tasks.findIndex((t) => t.trim() === "");
    if (emptyIndex !== -1) {
      const updated = [...tasks];
      updated[emptyIndex] = example;
      onChange(updated);
    } else {
      onChange([...tasks, example]);
    }
  };

  // Only non-empty inputs count as added tasks
  const validTaskCount = tasks.filter((t) => t.trim().length > 0).length;
  const countLabel = `${validTaskCount} ${
    validTaskCount === 1 ? "task" : "tasks"
  } defined`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-900">
            Role Responsibilities Ledger <span className="text-red-500">*</span>
          </label>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Enumerate recurring operational responsibilities performed in this position.
          </p>
        </div>
        <span className="font-mono text-[11px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded shrink-0">
          {countLabel}
        </span>
      </div>

      {/* Task Rows or Empty State */}
      {tasks.length === 0 ? (
        <div className="py-6 px-4 rounded-md border border-dashed border-slate-300 bg-slate-50 text-center">
          <p className="text-xs text-slate-500">
            No responsibilities added yet. Click &quot;+ Add Responsibility&quot; or select common workflows below.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-none flex items-center justify-center w-6 h-6 rounded bg-slate-100 text-slate-600 text-[11px] font-mono select-none border border-slate-200">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="relative flex-1">
                <input
                  type="text"
                  value={task}
                  onChange={(e) => handleTaskChange(index, e.target.value)}
                  placeholder="e.g. Schedule social media posts"
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 transition-colors"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveTask(index)}
                aria-label={`Remove responsibility ${index + 1}`}
                className="flex-none w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                title="Remove responsibility"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs font-medium text-red-600">{error}</p>}

      {/* Add Task Button */}
      <div>
        <button
          type="button"
          onClick={handleAddTask}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors cursor-pointer min-h-[34px]"
        >
          <Plus className="w-3.5 h-3.5 text-slate-500" />
          <span>Add Responsibility</span>
        </button>
      </div>

      {/* Quick-add example suggestions */}
      <div className="pt-3 border-t border-slate-200 space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <ListChecks className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-medium text-slate-600">Sample operational workflows:</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {EXAMPLE_TASKS.map((example, idx) => {
            const isAlreadyAdded = tasks.some(
              (t) => t.trim().toLowerCase() === example.trim().toLowerCase()
            );

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleAddExample(example)}
                disabled={isAlreadyAdded}
                className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border transition-colors text-left cursor-pointer min-h-[30px] ${
                  isAlreadyAdded
                    ? "bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <CornerDownRight
                  className={`w-3 h-3 ${
                    isAlreadyAdded ? "text-slate-300" : "text-slate-400"
                  }`}
                />
                <span>{example}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
