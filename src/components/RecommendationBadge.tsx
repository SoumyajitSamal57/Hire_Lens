import React from "react";
import { RecommendationType } from "@/types/assessment";
import { Bot, User, Shuffle, ExternalLink } from "lucide-react";

interface RecommendationBadgeProps {
  type: RecommendationType;
  size?: "sm" | "md" | "lg";
}

export default function RecommendationBadge({
  type,
  size = "md",
}: RecommendationBadgeProps) {
  const configs: Record<
    RecommendationType,
    {
      label: string;
      icon: React.ReactNode;
      containerClass: string;
    }
  > = {
    "AI / AUTOMATE": {
      label: "AI / AUTOMATE",
      icon: <Bot className="w-3 h-3" />,
      containerClass:
        "bg-slate-100 text-slate-800 border-slate-300",
    },
    HUMAN: {
      label: "HUMAN",
      icon: <User className="w-3 h-3 text-emerald-600" />,
      containerClass:
        "bg-emerald-50 text-emerald-800 border-emerald-200",
    },
    HYBRID: {
      label: "HYBRID",
      icon: <Shuffle className="w-3 h-3 text-amber-600" />,
      containerClass:
        "bg-amber-50 text-amber-800 border-amber-200",
    },
    OUTSOURCE: {
      label: "OUTSOURCE",
      icon: <ExternalLink className="w-3 h-3 text-sky-600" />,
      containerClass:
        "bg-sky-50 text-sky-800 border-sky-200",
    },
  };

  const config = configs[type] || configs["HYBRID"];

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px] gap-1",
    md: "px-2 py-0.5 text-[11px] gap-1.5",
    lg: "px-2.5 py-1 text-xs gap-1.5",
  };

  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded border tracking-wider uppercase ${
        config.containerClass
      } ${sizeClasses[size]}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
