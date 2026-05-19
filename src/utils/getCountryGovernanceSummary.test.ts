import { describe, expect, it } from "vitest";
import { getCountryGovernanceSummary, resolveNode } from "./getCountryGovernanceSummary";

describe("getCountryGovernanceSummary", () => {
  it("returns Kazakhstan's binding AI Law and 6+ participations", () => {
    const s = getCountryGovernanceSummary("KAZ");
    expect(s.country?.name).toBe("Kazakhstan");
    expect(s.nationalRegulations.length).toBeGreaterThanOrEqual(1);
    expect(s.hasBindingNationalLaw).toBe(true);
    expect(s.participations.length).toBeGreaterThan(0);
  });

  it("USA shows its seven HQ frontier labs", () => {
    const s = getCountryGovernanceSummary("USA");
    expect(s.hqLabs.length).toBeGreaterThanOrEqual(7);
    expect(s.hqLabs.find((l) => l.id === "openai")).toBeDefined();
    expect(s.hasFrontierAIRelevant).toBe(true);
  });

  it("EU member states inherit the EU AI Act", () => {
    const s = getCountryGovernanceSummary("DEU");
    expect(s.nationalRegulations.find((r) => r.id === "eu-ai-act-regional")).toBeDefined();
    expect(s.hasBindingNationalLaw).toBe(true);
  });

  it("returns empty summary for unknown iso3", () => {
    const s = getCountryGovernanceSummary("ZZZ");
    expect(s.country).toBeNull();
    expect(s.nationalRegulations).toEqual([]);
  });
});

describe("resolveNode", () => {
  it("resolves a country", () => {
    expect(resolveNode("DEU")?.kind).toBe("country");
  });
  it("resolves a lab", () => {
    expect(resolveNode("anthropic")?.kind).toBe("lab");
  });
  it("resolves an international instrument", () => {
    expect(resolveNode("bletchley-declaration")?.kind).toBe("instrument");
  });
  it("resolves an infrastructure node", () => {
    expect(resolveNode("advanced-ai-chips")?.kind).toBe("infrastructure");
  });
  it("returns null for unknown ids", () => {
    expect(resolveNode("nonsense")).toBeNull();
  });
});
