import React from "react";

interface ScoreBarProps {
  label: string;
  score: number; // 0 to 100
  color?: "indigo" | "emerald" | "amber" | "sky" | "slate";
  size?: "sm" | "md";
}

export default function ScoreBar({
  label,
  score,
  color = "slate",
  size = "md",
}: ScoreBarProps) {
  const colorMap = {
    indigo: {
      bar: "bg-slate-800",
      bg: "bg-slate-100",
      text: "text-slate-900",
      badge: "text-slate-800 bg-slate-100 border-slate-200",
    },
    emerald: {
      bar: "bg-emerald-600",
      bg: "bg-emerald-50",
      text: "text-emerald-900",
      badge: "text-emerald-800 bg-emerald-50 border-emerald-200",
    },
    amber: {
      bar: "bg-amber-500",
      bg: "bg-amber-50",
      text: "text-amber-900",
      badge: "text-amber-800 bg-amber-50 border-amber-200",
    },
    sky: {
      bar: "bg-sky-600",
      bg: "bg-sky-50",
      text: "text-sky-900",
      badge: "text-sky-800 bg-sky-50 border-sky-200",
    },
    slate: {
      bar: "bg-slate-800",
      bg: "bg-slate-100",
      text: "text-slate-900",
      badge: "text-slate-800 bg-slate-100 border-slate-200",
    },
  };

  const selectedColor = colorMap[color] || colorMap.slate;

  return (
    <div className="space-y-1 w-full">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-700">{label}</span>
        <span
          className={`font-mono font-semibold px-1.5 py-0.5 rounded border text-[11px] ${selectedColor.badge}`}
        >
          {score}%
        </span>
      </div>
      <div
        className={`w-full ${
          size === "sm" ? "h-1.5" : "h-2"
        } rounded-sm bg-slate-100 overflow-hidden border border-slate-200/60`}
      >
        <div
          className={`h-full ${selectedColor.bar} transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
    </div>
  );
}
