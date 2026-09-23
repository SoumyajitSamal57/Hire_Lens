import { describe, it, expect } from "vitest";
import { matchTools } from "../toolMatcher";
import { analyzeTask } from "../taskAnalyzer";

describe("Phase 4 - Tool Matcher Intelligence", () => {
  it("1. 'Schedule social media posts' matches scheduling tools", () => {
    const task = analyzeTask("Schedule social media posts", 0);
    const tools = matchTools(task);

    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some((t) => t.category === "SCHEDULING")).toBe(true);
    expect(tools[0].name).toContain("Scheduling");
  });

  it("2. 'Enter CRM records' matches CRM/data-entry tools", () => {
    const task = analyzeTask("Enter CRM records", 0);
    const tools = matchTools(task);

    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some((t) => t.category === "CRM" || t.category === "DATA_ENTRY")).toBe(true);
  });

  it("3. 'Reply to basic customer emails' matches customer support/email tools", () => {
    const task = analyzeTask("Reply to basic customer emails", 0);
    const tools = matchTools(task);

    expect(tools.length).toBeGreaterThan(0);
    expect(
      tools.some((t) => t.category === "CUSTOMER_SUPPORT" || t.category === "EMAIL_AUTOMATION")
    ).toBe(true);
  });

  it("4. 'Process routine invoices' matches invoicing tools", () => {
    const task = analyzeTask("Process routine invoices", 0);
    const tools = matchTools(task);

    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some((t) => t.category === "INVOICING")).toBe(true);
  });

  it("5. 'Payroll processing' matches payroll or outsourcing solutions", () => {
    const task = analyzeTask("Payroll processing", 0);
    const tools = matchTools(task);

    expect(tools.length).toBeGreaterThan(0);
    expect(tools.some((t) => t.category === "PAYROLL" || t.category === "OUTSOURCING")).toBe(true);
  });

  it("6. 'Attend client meetings' returns NO replacement automation (only human-support tools)", () => {
    const task = analyzeTask("Attend client meetings", 0);
    const tools = matchTools(task);

    // Should either return empty array or only tools marked as human-support
    tools.forEach((t) => {
      expect(t.isHumanSupportOnly).toBe(true);
    });
  });

  it("7. 'Negotiate with suppliers' returns NO inappropriate automation tools", () => {
    const task = analyzeTask("Negotiate with suppliers", 0);
    const tools = matchTools(task);

    tools.forEach((t) => {
      expect(t.isHumanSupportOnly).toBe(true);
    });
  });

  it("8. HIGH-risk tasks preserve human oversight (no LOW oversight tools)", () => {
    const task = analyzeTask("Approve refunds", 0);
    const tools = matchTools(task);

    tools.forEach((t) => {
      expect(t.humanOversight).not.toBe("LOW");
    });
  });

  it("9. Unknown tasks return graceful results", () => {
    const task = analyzeTask("Quantum physics research", 0);
    const tools = matchTools(task);

    expect(Array.isArray(tools)).toBe(true);
    expect(tools.length).toBeLessThanOrEqual(3);
  });

  it("10. Prevents duplicate tool recommendations", () => {
    const task = analyzeTask("Enter CRM records", 0);
    const tools = matchTools(task);

    const ids = tools.map((t) => t.id);
    const uniqueIds = new Set(ids);

    expect(ids.length).toBe(uniqueIds.size);
  });

  it("11. Never returns more than 3 recommendations", () => {
    const task = analyzeTask("Data entry and CRM email post update", 0);
    const tools = matchTools(task);

    expect(tools.length).toBeLessThanOrEqual(3);
  });

  it("12. Determinism - same input produces identical output", () => {
    const task1 = analyzeTask("Schedule social media posts", 0);
    const task2 = analyzeTask("Schedule social media posts", 0);

    const tools1 = matchTools(task1);
    const tools2 = matchTools(task2);

    expect(tools1).toEqual(tools2);
  });
});
