import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { ReportData } from "../../types/report";

// Define professional clean styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    paddingTop: 36,
    paddingBottom: 50,
    paddingHorizontal: 40,
    fontFamily: "Helvetica",
    color: "#1E293B",
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#4338CA",
    paddingBottom: 12,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  brandTitle: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#1E1B4B",
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 10,
    color: "#4338CA",
    fontFamily: "Helvetica-Bold",
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  headerMeta: {
    textAlign: "right",
  },
  headerMetaText: {
    fontSize: 9,
    color: "#64748B",
    marginBottom: 2,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerText: {
    fontSize: 8,
    color: "#94A3B8",
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 9,
    color: "#64748B",
    marginBottom: 12,
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  metricCard: {
    width: "48%",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 6,
    padding: 10,
  },
  metricLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#64748B",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#1E1B4B",
  },
  metricDesc: {
    fontSize: 8,
    color: "#475569",
    marginTop: 2,
  },
  execBox: {
    backgroundColor: "#EEF2FF",
    borderLeftWidth: 4,
    borderLeftColor: "#4338CA",
    padding: 12,
    borderRadius: 4,
    marginBottom: 20,
  },
  execText: {
    fontSize: 10,
    color: "#1E1B4B",
    lineHeight: 1.5,
  },

  // Workforce distribution bar graphics
  distRow: {
    marginBottom: 10,
  },
  distHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  distLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#334155",
  },
  distCount: {
    fontSize: 9,
    color: "#64748B",
  },
  barTrack: {
    height: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
    flexDirection: "row",
  },
  barFillAi: {
    backgroundColor: "#4F46E5",
    height: "100%",
  },
  barFillHybrid: {
    backgroundColor: "#D97706",
    height: "100%",
  },
  barFillHuman: {
    backgroundColor: "#059669",
    height: "100%",
  },
  barFillOutsource: {
    backgroundColor: "#0284C7",
    height: "100%",
  },

  // Task analysis card styles
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 6,
    padding: 12,
    marginBottom: 14,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  taskTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#0F172A",
    width: "70%",
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  badgeAi: {
    backgroundColor: "#EEF2FF",
    color: "#3730A3",
  },
  badgeHybrid: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
  },
  badgeHuman: {
    backgroundColor: "#D1FAE5",
    color: "#065F46",
  },
  badgeOutsource: {
    backgroundColor: "#E0F2FE",
    color: "#075985",
  },

  taskMetaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "column",
    width: "30%",
  },
  metaLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#64748B",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1E293B",
  },

  taskDescription: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.4,
    marginBottom: 8,
  },

  // Tool recommendation boxes inside tasks
  toolsSection: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  toolsHeading: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#475569",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  toolCard: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 4,
    padding: 6,
    marginBottom: 4,
  },
  toolTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  toolName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1E1B4B",
  },
  toolCost: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#059669",
  },
  toolDesc: {
    fontSize: 8,
    color: "#475569",
    marginBottom: 2,
  },
  toolMeta: {
    fontSize: 7,
    color: "#64748B",
  },

  // Implementation plan section
  planSection: {
    backgroundColor: "#F8FAFC",
    borderLeftWidth: 3,
    borderLeftColor: "#4F46E5",
    padding: 8,
    marginTop: 6,
    borderRadius: 4,
  },
  planHeading: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#3730A3",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  bulletList: {
    marginLeft: 4,
  },
  bulletItem: {
    fontSize: 8,
    color: "#334155",
    marginBottom: 2,
    lineHeight: 1.3,
  },

  // Risk section
  riskCard: {
    backgroundColor: "#FFF1F2",
    borderLeftWidth: 3,
    borderLeftColor: "#E11D48",
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  riskTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#9F1239",
    marginBottom: 2,
  },
  riskText: {
    fontSize: 8,
    color: "#881337",
    lineHeight: 1.3,
  },

  disclaimerText: {
    fontSize: 8,
    color: "#64748B",
    fontStyle: "italic",
    marginTop: 4,
    marginBottom: 12,
  },
});

interface ExecutiveReportPdfProps {
  data: ReportData;
}

export default function ExecutiveReportPdf({ data }: ExecutiveReportPdfProps) {
  const {
    role,
    companyType,
    monthlyBudget,
    assessmentDate,
    summary,
    distribution,
    tasks,
    executiveSummaryText,
  } = data;

  const formattedBudget = !isNaN(Number(monthlyBudget))
    ? `₹${Number(monthlyBudget).toLocaleString("en-IN")}`
    : monthlyBudget;

  const getBadgeStyle = (rec: string) => {
    switch (rec) {
      case "AI / AUTOMATE":
        return [styles.badge, styles.badgeAi];
      case "HYBRID":
        return [styles.badge, styles.badgeHybrid];
      case "HUMAN":
        return [styles.badge, styles.badgeHuman];
      case "OUTSOURCE":
        return [styles.badge, styles.badgeOutsource];
      default:
        return [styles.badge, styles.badgeHuman];
    }
  };

  return (
    <Document title={`HireLens Executive Report - ${role}`} author="HireLens">
      {/* ================= PAGE 1: EXECUTIVE SUMMARY & METRICS ================= */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>HIRELENS</Text>
            <Text style={styles.brandSubtitle}>
              Workforce & AI Optimization Report
            </Text>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.headerMetaText}>Date: {assessmentDate}</Text>
            <Text style={styles.headerMetaText}>Role: {role || "N/A"}</Text>
            <Text style={styles.headerMetaText}>Company: {companyType || "N/A"}</Text>
          </View>
        </View>

        {/* Executive Summary Card */}
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <View style={styles.execBox}>
          <Text style={styles.execText}>{executiveSummaryText}</Text>
        </View>

        {/* Key Metrics Grid */}
        <Text style={styles.sectionTitle}>Key Assessment Metrics</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Total Tasks Analyzed</Text>
            <Text style={styles.metricValue}>{summary.totalTasks}</Text>
            <Text style={styles.metricDesc}>Evaluated role responsibilities</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Automation Opportunities</Text>
            <Text style={styles.metricValue}>
              {summary.estimatedAutomationOpportunity} Tasks
            </Text>
            <Text style={styles.metricDesc}>AI, Hybrid or Outsource viable</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Estimated Monthly Tool Cost</Text>
            <Text style={styles.metricValue}>{summary.estimatedMonthlyCost}</Text>
            <Text style={styles.metricDesc}>Benchmark estimate across solutions</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>High-Risk Safeguard Tasks</Text>
            <Text style={styles.metricValue}>{summary.highRiskTasks} Tasks</Text>
            <Text style={styles.metricDesc}>Human oversight recommended</Text>
          </View>
        </View>

        {/* Budget vs Recommendation Note */}
        <View style={[styles.metricCard, { width: "100%", marginBottom: 20 }]}>
          <Text style={styles.metricLabel}>Stated Hiring Budget</Text>
          <Text style={styles.metricValue}>{formattedBudget}</Text>
          <Text style={styles.metricDesc}>
            Target monthly budget provided for this position evaluation.
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            HireLens | Workforce & AI Optimization Report
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* ================= PAGE 2: WORKFORCE DISTRIBUTION & COST/RISK OVERVIEW ================= */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>HIRELENS</Text>
            <Text style={styles.brandSubtitle}>
              Workforce Distribution & Risk Overview
            </Text>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.headerMetaText}>Role: {role || "N/A"}</Text>
          </View>
        </View>

        {/* Workforce Recommendation Visual Bar Distribution */}
        <Text style={styles.sectionTitle}>Workforce Recommendation Breakdown</Text>
        <Text style={styles.sectionSubtitle}>
          Distribution calculated from actual task-level execution requirements.
        </Text>

        <View style={{ marginBottom: 20 }}>
          {/* AI / AUTOMATE */}
          <View style={styles.distRow}>
            <View style={styles.distHeader}>
              <Text style={styles.distLabel}>AI / AUTOMATE</Text>
              <Text style={styles.distCount}>
                {distribution.aiCount} {distribution.aiCount === 1 ? "task" : "tasks"} (
                {distribution.aiPercentage}%)
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFillAi,
                  { width: `${Math.max(distribution.aiPercentage, 2)}%` },
                ]}
              />
            </View>
          </View>

          {/* HYBRID */}
          <View style={styles.distRow}>
            <View style={styles.distHeader}>
              <Text style={styles.distLabel}>HYBRID (AI + Human)</Text>
              <Text style={styles.distCount}>
                {distribution.hybridCount} {distribution.hybridCount === 1 ? "task" : "tasks"} (
                {distribution.hybridPercentage}%)
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFillHybrid,
                  { width: `${Math.max(distribution.hybridPercentage, 2)}%` },
                ]}
              />
            </View>
          </View>

          {/* HUMAN */}
          <View style={styles.distRow}>
            <View style={styles.distHeader}>
              <Text style={styles.distLabel}>HUMAN</Text>
              <Text style={styles.distCount}>
                {distribution.humanCount} {distribution.humanCount === 1 ? "task" : "tasks"} (
                {distribution.humanPercentage}%)
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFillHuman,
                  { width: `${Math.max(distribution.humanPercentage, 2)}%` },
                ]}
              />
            </View>
          </View>

          {/* OUTSOURCE */}
          <View style={styles.distRow}>
            <View style={styles.distHeader}>
              <Text style={styles.distLabel}>OUTSOURCE</Text>
              <Text style={styles.distCount}>
                {distribution.outsourceCount} {distribution.outsourceCount === 1 ? "task" : "tasks"} (
                {distribution.outsourcePercentage}%)
              </Text>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFillOutsource,
                  { width: `${Math.max(distribution.outsourcePercentage, 2)}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Cost & Automation Overview */}
        <Text style={styles.sectionTitle}>Cost & Automation Overview</Text>
        <View style={[styles.metricCard, { width: "100%", marginBottom: 12 }]}>
          <Text style={styles.metricLabel}>Estimated Monthly Cost</Text>
          <Text style={styles.metricValue}>{summary.estimatedMonthlyCost}</Text>
          <Text style={styles.disclaimerText}>
            Costs are benchmark estimates and are not live vendor quotes. Actual pricing depends on usage, plan, and vendor.
          </Text>
        </View>

        {/* Risk & Governance Summary */}
        <Text style={styles.sectionTitle}>Risk & Governance Summary</Text>
        <Text style={styles.sectionSubtitle}>
          Evaluation of sensitivity, human judgment, and oversight necessity across tasks.
        </Text>

        <View style={styles.summaryGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Low Risk Tasks</Text>
            <Text style={styles.metricValue}>
              {tasks.filter((t) => (t.automationAnalysis?.riskLevel || "LOW") === "LOW").length}
            </Text>
            <Text style={styles.metricDesc}>Standard automated execution safe</Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Medium Risk Tasks</Text>
            <Text style={styles.metricValue}>
              {tasks.filter((t) => t.automationAnalysis?.riskLevel === "MEDIUM").length}
            </Text>
            <Text style={styles.metricDesc}>Periodic spot checks advised</Text>
          </View>
        </View>

        {summary.highRiskTasks > 0 && (
          <View style={styles.riskCard}>
            <Text style={styles.riskTitle}>
              HIGH RISK SAFEGUARD ({summary.highRiskTasks} Task{summary.highRiskTasks === 1 ? "" : "s"})
            </Text>
            <Text style={styles.riskText}>
              Human oversight recommended. Tasks with financial, legal, or high interpersonal impact are protected from total automation.
            </Text>
          </View>
        )}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            HireLens | Workforce & AI Optimization Report
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* ================= PAGE 3+: TASK-BY-TASK ANALYSIS & SOLUTIONS ================= */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>HIRELENS</Text>
            <Text style={styles.brandSubtitle}>Task-by-Task Analysis</Text>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.headerMetaText}>Role: {role || "N/A"}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Detailed Responsibilities Assessment</Text>

        {tasks.map((task, idx) => {
          const rec = task.recommendation || "HUMAN";
          const autoAnalysis = task.automationAnalysis;
          const aiIntel = task.aiIntelligence;
          const tools = task.toolRecommendations || [];

          const timeRedMin = autoAnalysis?.estimatedTimeReductionMin ?? 0;
          const timeRedMax = autoAnalysis?.estimatedTimeReductionMax ?? 0;
          const timeRedStr =
            timeRedMax > 0 ? `${timeRedMin}% - ${timeRedMax}%` : "N/A";

          let costStr = "N/A";
          if (
            autoAnalysis &&
            typeof autoAnalysis.estimatedMonthlyCostMin === "number" &&
            typeof autoAnalysis.estimatedMonthlyCostMax === "number" &&
            autoAnalysis.estimatedMonthlyCostMax > 0
          ) {
            costStr =
              autoAnalysis.estimatedMonthlyCostMin === autoAnalysis.estimatedMonthlyCostMax
                ? `₹${autoAnalysis.estimatedMonthlyCostMax.toLocaleString("en-IN")}/mo`
                : `₹${autoAnalysis.estimatedMonthlyCostMin.toLocaleString("en-IN")} - ₹${autoAnalysis.estimatedMonthlyCostMax.toLocaleString("en-IN")}/mo`;
          } else if (rec === "HUMAN") {
            costStr = "N/A (Human-led)";
          }

          return (
            <View key={task.id || idx} style={styles.taskCard} wrap={false}>
              {/* Header */}
              <View style={styles.taskHeader}>
                <Text style={styles.taskTitle}>
                  {idx + 1}. {task.taskName || "Unnamed Task"}
                </Text>
                <Text style={getBadgeStyle(rec)}>{rec}</Text>
              </View>

              {/* Task Metrics Row */}
              <View style={styles.taskMetaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Confidence</Text>
                  <Text style={styles.metaValue}>{task.confidence || "MEDIUM"}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Automation Score</Text>
                  <Text style={styles.metaValue}>
                    {task.scores?.automationPotential ?? 0}%
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Human Necessity</Text>
                  <Text style={styles.metaValue}>
                    {task.scores?.humanNecessity ?? 0}%
                  </Text>
                </View>
              </View>

              <View style={styles.taskMetaRow}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Approach</Text>
                  <Text style={styles.metaValue}>
                    {autoAnalysis?.approach || rec}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Est. Cost</Text>
                  <Text style={styles.metaValue}>{costStr}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaLabel}>Time Reduction</Text>
                  <Text style={styles.metaValue}>{timeRedStr}</Text>
                </View>
              </View>

              {/* Explanation / Rationale */}
              <Text style={styles.taskDescription}>
                {task.explanation || autoAnalysis?.rationale || "No detailed breakdown available."}
              </Text>

              {/* Recommended Tools Section */}
              {tools.length > 0 ? (
                <View style={styles.toolsSection}>
                  <Text style={styles.toolsHeading}>
                    Recommended Software Solutions (Max 3)
                  </Text>
                  {tools.slice(0, 3).map((tool, tIdx) => (
                    <View key={tool.id || tIdx} style={styles.toolCard}>
                      <View style={styles.toolTitleRow}>
                        <Text style={styles.toolName}>{tool.name || "Tool Solution"}</Text>
                        <Text style={styles.toolCost}>
                          Estimated cost: {tool.estimatedCostRange || "Varies"}
                        </Text>
                      </View>
                      <Text style={styles.toolDesc}>
                        {tool.description || "Software tool solution for workflow execution."}
                      </Text>
                      <Text style={styles.toolMeta}>
                        Best for: {tool.bestFor || "N/A"} | Oversight: {tool.humanOversight || "LOW"} | Limitations: {tool.limitations || "None"}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : rec === "HUMAN" ? (
                <View style={styles.toolsSection}>
                  <Text style={styles.toolMeta}>
                    Human-led task — no software replacement recommended.
                  </Text>
                </View>
              ) : null}

              {/* AI Implementation Plan Section */}
              {aiIntel && (
                <View style={styles.planSection}>
                  <Text style={styles.planHeading}>AI Implementation Plan</Text>

                  {Array.isArray(aiIntel.automateTasks) && aiIntel.automateTasks.length > 0 && (
                    <View style={{ marginBottom: 4 }}>
                      <Text style={styles.metaLabel}>AI CAN HANDLE:</Text>
                      <View style={styles.bulletList}>
                        {aiIntel.automateTasks.map((item, i) => (
                          <Text key={i} style={styles.bulletItem}>
                            • {item}
                          </Text>
                        ))}
                      </View>
                    </View>
                  )}

                  {Array.isArray(aiIntel.humanResponsibilities) &&
                    aiIntel.humanResponsibilities.length > 0 && (
                      <View style={{ marginBottom: 4 }}>
                        <Text style={styles.metaLabel}>HUMAN RESPONSIBILITIES:</Text>
                        <View style={styles.bulletList}>
                          {aiIntel.humanResponsibilities.map((item, i) => (
                            <Text key={i} style={styles.bulletItem}>
                              • {item}
                            </Text>
                          ))}
                        </View>
                      </View>
                    )}

                  {Array.isArray(aiIntel.workflow) && aiIntel.workflow.length > 0 && (
                    <View style={{ marginBottom: 4 }}>
                      <Text style={styles.metaLabel}>SUGGESTED WORKFLOW:</Text>
                      <Text style={styles.bulletItem}>
                        {aiIntel.workflow.join(" → ")}
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          );
        })}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            HireLens | Workforce & AI Optimization Report
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>

      {/* ================= FINAL PAGE: FINAL WORKFORCE RECOMMENDATION ================= */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>HIRELENS</Text>
            <Text style={styles.brandSubtitle}>Final Workforce Recommendation</Text>
          </View>
          <View style={styles.headerMeta}>
            <Text style={styles.headerMetaText}>Role: {role || "N/A"}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Strategic Implementation Blueprint</Text>
        <Text style={styles.sectionSubtitle}>
          Executive guidelines for restructuring the role based on task assessment results.
        </Text>

        <View style={{ gap: 10, marginBottom: 20 }}>
          <View style={[styles.taskCard, { borderLeftWidth: 4, borderLeftColor: "#4F46E5" }]}>
            <Text style={[styles.taskTitle, { color: "#3730A3", marginBottom: 4 }]}>
              AUTOMATE ({distribution.aiCount} Tasks)
            </Text>
            <Text style={styles.taskDescription}>
              Routine, repetitive digital workflows. Implement targeted software tools and AI assistants to handle execution automatically with minimal human intervention.
            </Text>
          </View>

          <View style={[styles.taskCard, { borderLeftWidth: 4, borderLeftColor: "#D97706" }]}>
            <Text style={[styles.taskTitle, { color: "#92400E", marginBottom: 4 }]}>
              HYBRID ({distribution.hybridCount} Tasks)
            </Text>
            <Text style={styles.taskDescription}>
              Tasks where AI can accelerate drafting, processing, or data retrieval while humans retain final judgment, review, and authorization.
            </Text>
          </View>

          <View style={[styles.taskCard, { borderLeftWidth: 4, borderLeftColor: "#059669" }]}>
            <Text style={[styles.taskTitle, { color: "#065F46", marginBottom: 4 }]}>
              HUMAN ({distribution.humanCount} Tasks)
            </Text>
            <Text style={styles.taskDescription}>
              Relationship-driven, strategic, physical, or high-judgment work. Keep direct human ownership to maintain trust and accountability.
            </Text>
          </View>

          <View style={[styles.taskCard, { borderLeftWidth: 4, borderLeftColor: "#0284C7" }]}>
            <Text style={[styles.taskTitle, { color: "#075985", marginBottom: 4 }]}>
              OUTSOURCE ({distribution.outsourceCount} Tasks)
            </Text>
            <Text style={styles.taskDescription}>
              Specialized external operational functions better handled by dedicated fractional providers or freelancers rather than a full-time in-house hire.
            </Text>
          </View>

          <View style={styles.riskCard}>
            <Text style={styles.riskTitle}>MANDATORY GOVERNANCE & OVERSIGHT</Text>
            <Text style={styles.riskText}>
              All high-risk tasks requiring sensitive data handling, financial transactions, or major stakeholder communications must retain mandatory human oversight.
            </Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            HireLens | Workforce & AI Optimization Report
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}
