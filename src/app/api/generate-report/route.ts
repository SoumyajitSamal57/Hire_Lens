import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { buildReportData } from "../../../lib/reportBuilder";
import ExecutiveReportPdf from "../../../components/pdf/ExecutiveReportPdf";
import { TaskAnalysis } from "../../../types/assessment";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const role = typeof body.role === "string" ? body.role : "Assessed Role";
    const companyType =
      typeof body.companyType === "string"
        ? body.companyType
        : "General Organization";
    const monthlyBudget =
      typeof body.monthlyBudget === "string" || typeof body.monthlyBudget === "number"
        ? String(body.monthlyBudget)
        : "N/A";

    const tasks: TaskAnalysis[] = Array.isArray(body.tasks) ? body.tasks : [];

    // Build deterministic report data
    const reportData = buildReportData(tasks, role, companyType, monthlyBudget);

    // Render PDF buffer
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfBuffer = await renderToBuffer(
      React.createElement(ExecutiveReportPdf, { data: reportData }) as any
    );

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="hirelens-report.pdf"',
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "PDF generation failed";
    console.error("Error generating PDF report:", err);
    return NextResponse.json(
      { error: "Failed to generate report", details: errorMessage },
      { status: 500 }
    );
  }
}
