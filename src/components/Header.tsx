import React from "react";

export default function Header() {
  return (
    <header className="w-full border-b border-slate-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-13 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded bg-slate-900 flex items-center justify-center text-white text-xs font-bold tracking-tight select-none shrink-0">
            HL
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-sm sm:text-base tracking-tight text-slate-900">
              HireLens
            </span>
            <span className="hidden sm:inline text-xs text-slate-500 border-l border-slate-200 pl-2">
              Workforce Planning & Feasibility
            </span>
          </div>
        </div>

        {/* System Indicator */}
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Deterministic Analysis Engine</span>
          </div>
        </div>
      </div>
    </header>
  );
}

