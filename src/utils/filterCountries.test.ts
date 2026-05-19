import { describe, expect, it } from "vitest";
import { filterCountries, countActiveFilters } from "./filterCountries";
import { DEFAULT_FILTER_STATE } from "../types";

describe("filterCountries", () => {
  it("returns every non-EU-supranational country when no filters are active", () => {
    const result = filterCountries(DEFAULT_FILTER_STATE);
    expect(result.length).toBeGreaterThan(180);
    expect(result.every((r) => r.matchesFilter)).toBe(true);
    expect(result.find((r) => r.iso3 === "EUU")).toBeUndefined();
  });

  it("limits matches to the 30 Bletchley signatories when that filter is active", () => {
    const result = filterCountries({
      ...DEFAULT_FILTER_STATE,
      selectedInstrumentIds: ["bletchley-declaration"],
    });
    const matched = result.filter((r) => r.matchesFilter);
    // Bletchley had 30 participants (incl. New Zealand joining later) + EU
    // which we exclude from the country grid. So exactly 29 countries match.
    expect(matched.length).toBe(29);
    expect(matched.find((r) => r.iso3 === "USA")).toBeDefined();
    expect(matched.find((r) => r.iso3 === "CHN")).toBeDefined();
  });

  it("AND-combines multiple selected instruments", () => {
    const result = filterCountries({
      ...DEFAULT_FILTER_STATE,
      selectedInstrumentIds: ["bletchley-declaration", "seoul-declaration"],
      instrumentMatchMode: "AND",
    });
    const matched = result.filter((r) => r.matchesFilter);
    // Seoul Declaration is a subset of Bletchley participants (10 states + EU);
    // intersected with Bletchley still gives 10 (EU excluded from grid).
    expect(matched.length).toBe(10);
  });

  it("countActiveFilters counts each non-default filter slot", () => {
    expect(countActiveFilters(DEFAULT_FILTER_STATE)).toBe(0);
    expect(
      countActiveFilters({
        ...DEFAULT_FILTER_STATE,
        selectedInstrumentIds: ["bletchley-declaration"],
        hasBindingNationalLaw: "yes",
      })
    ).toBe(2);
  });
});
