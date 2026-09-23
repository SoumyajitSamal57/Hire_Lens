import { describe, it, expect } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";
import { analyzeTask } from "../../../../lib/taskAnalyzer";

describe("API - /api/generate-report", () => {
  it("returns 400 when request body is invalid", async () => {
    const req = new NextRequest("http://localhost:3000/api/generate-report", {
      method: "POST",
      body: JSON.stringify(null),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 200 and application/pdf headers for valid assessment payload", async () => {
    const task1 = analyzeTask("Schedule social media posts", 1);
    const task2 = analyzeTask("Attend client meetings", 2);

    const req = new NextRequest("http://localhost:3000/api/generate-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "Marketing Specialist",
        companyType: "SaaS Company",
        monthlyBudget: "50000",
        tasks: [task1, task2],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/pdf");
    expect(res.headers.get("Content-Disposition")).toContain(
      'attachment; filename="hirelens-report.pdf"'
    );

    const arrayBuffer = await res.arrayBuffer();
    expect(arrayBuffer.byteLength).toBeGreaterThan(100);
  });

  it("handles empty task arrays gracefully and still generates a valid PDF", async () => {
    const req = new NextRequest("http://localhost:3000/api/generate-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "General Assistant",
        companyType: "Startup",
        monthlyBudget: "N/A",
        tasks: [],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(res.headers.get("Content-Type")).toBe("application/pdf");
    const arrayBuffer = await res.arrayBuffer();
    expect(arrayBuffer.byteLength).toBeGreaterThan(100);
  });

  it("handles diverse task sets containing AI, Hybrid, Human, and Outsource recommendations", async () => {
    const t1 = analyzeTask("Automate invoice parsing and payments", 1);
    const t2 = analyzeTask("Conduct senior executive client negotiations", 2);
    const t3 = analyzeTask("Draft customer email responses", 3);
    const t4 = analyzeTask("File complex international corporate tax returns", 4);

    const req = new NextRequest("http://localhost:3000/api/generate-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "Operations Manager",
        companyType: "Tech Agency",
        monthlyBudget: "120000",
        tasks: [t1, t2, t3, t4],
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const arrayBuffer = await res.arrayBuffer();
    expect(arrayBuffer.byteLength).toBeGreaterThan(500);
  });
});
