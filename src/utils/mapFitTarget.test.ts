import { describe, expect, it } from "vitest";
import { DEFAULT_FILTER_STATE } from "../types";
import { getMapFitScope } from "./mapFitTarget";

describe("getMapFitScope", () => {
  it("returns the world overview when no fit scope is active", () => {
    const scope = getMapFitScope(DEFAULT_FILTER_STATE, null, null);

    expect(scope.target).toBeNull();
    expect(scope.hasActiveScope).toBe(false);
    expect(scope.isNoMatch).toBe(false);
    expect(scope.summaryLabel).toBe("World overview");
  });

  it("returns a one-country target for direct country selection", () => {
    const scope = getMapFitScope(DEFAULT_FILTER_STATE, "CAN", null);

    expect(scope.target?.label).toBe("Canada");
    expect(scope.target?.countryIso3s).toEqual(["CAN"]);
    expect(scope.target?.countryCount).toBe(1);
    expect(scope.target?.summaryLabel).toBe("1 country");
  });

  it("returns a lab and its HQ country for direct lab selection", () => {
    const scope = getMapFitScope(DEFAULT_FILTER_STATE, null, "openai");

    expect(scope.target?.label).toBe("OpenAI");
    expect(scope.target?.countryIso3s).toEqual(["USA"]);
    expect(scope.target?.labIds).toEqual(["openai"]);
    expect(scope.target?.summaryLabel).toBe("1 country · 1 lab");
  });

  it("returns matching country counts for an instrument filter", () => {
    const scope = getMapFitScope(
      { ...DEFAULT_FILTER_STATE, selectedInstrumentIds: ["bletchley-declaration"] },
      null,
      null
    );

    expect(scope.target?.countryCount).toBe(29);
    expect(scope.target?.summaryLabel).toBe("29 countries");
  });

  it("returns matching countries and labs for search-only scopes", () => {
    const countryScope = getMapFitScope({ ...DEFAULT_FILTER_STATE, searchQuery: "Canada" }, null, null);
    const labScope = getMapFitScope({ ...DEFAULT_FILTER_STATE, searchQuery: "OpenAI" }, null, null);

    expect(countryScope.target?.countryIso3s).toEqual(["CAN"]);
    expect(labScope.target?.labIds).toEqual(["openai"]);
    expect(labScope.target?.summaryLabel).toBe("1 lab");
  });

  it("returns a no-match state when active filters have no map target", () => {
    const scope = getMapFitScope({ ...DEFAULT_FILTER_STATE, searchQuery: "definitely-not-on-the-map" }, null, null);

    expect(scope.target).toBeNull();
    expect(scope.hasActiveScope).toBe(true);
    expect(scope.isNoMatch).toBe(true);
    expect(scope.summaryLabel).toBe("No map matches");
  });
});
