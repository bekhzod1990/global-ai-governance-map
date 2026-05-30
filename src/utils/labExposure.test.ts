import { describe, expect, it } from "vitest";
import { LAB_BY_ID } from "../data/frontierLabs";
import { INFRA_BY_ID } from "../data/infrastructure";
import { INSTRUMENT_BY_ID } from "../data/internationalInstruments";
import { LAB_REGULATORY_EXPOSURES } from "../data/labRegulatoryExposures";
import { NATIONAL_REG_BY_ID } from "../data/nationalAIRegulations";
import {
  getLabExposureGraphEdges,
  getLabRegulatoryExposures,
  isBindingLabExposure,
  summarizeLabExposures,
} from "./labExposure";

describe("lab regulatory exposure", () => {
  it("references valid labs and target records", () => {
    for (const exposure of LAB_REGULATORY_EXPOSURES) {
      expect(LAB_BY_ID[exposure.labId], exposure.id).toBeTruthy();
      const targetExists =
        exposure.targetType === "national_rule"
          ? Boolean(NATIONAL_REG_BY_ID[exposure.targetId])
          : exposure.targetType === "infrastructure"
            ? Boolean(INFRA_BY_ID[exposure.targetId])
            : Boolean(INSTRUMENT_BY_ID[exposure.targetId]);
      expect(targetExists, exposure.id).toBe(true);
    }
  });

  it("requires official high-confidence metadata for binding exposure rows", () => {
    const bindingRows = LAB_REGULATORY_EXPOSURES.filter(isBindingLabExposure);

    expect(bindingRows.length).toBeGreaterThan(0);
    expect(bindingRows.every((row) => row.sourceKind === "official" && row.confidence === "high")).toBe(true);
  });

  it("keeps soft-law, standards, and infrastructure rows out of binding exposure logic", () => {
    const nonBindingRows = LAB_REGULATORY_EXPOSURES.filter((row) => row.legalEffect !== "binding");

    expect(nonBindingRows.length).toBeGreaterThan(0);
    expect(nonBindingRows.every((row) => !isBindingLabExposure(row))).toBe(true);
  });

  it("summarizes exposure categories for a lab drawer", () => {
    const summary = summarizeLabExposures(getLabRegulatoryExposures("openai"));

    expect(summary.binding).toBeGreaterThan(0);
    expect(summary.voluntary).toBeGreaterThan(0);
    expect(summary.standards).toBeGreaterThan(0);
    expect(summary.infrastructure).toBeGreaterThan(0);
    expect(summary.total).toBe(
      summary.binding +
        getLabRegulatoryExposures("openai").filter((row) => row.legalEffect !== "binding").length
    );
  });

  it("generates deduped graph edges from exposure rows", () => {
    const edges = getLabExposureGraphEdges();
    const ids = new Set(edges.map((edge) => edge.id));

    expect(edges).toHaveLength(LAB_REGULATORY_EXPOSURES.length);
    expect(ids.size).toBe(edges.length);
    expect(edges.some((edge) => edge.targetId === "openai" && edge.relationship === "regulates")).toBe(true);
    expect(edges.some((edge) => edge.sourceId === "openai" && edge.relationship === "depends_on")).toBe(true);
  });
});
