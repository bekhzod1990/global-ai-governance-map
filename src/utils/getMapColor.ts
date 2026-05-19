import type { FilterState, InternationalParticipation } from "../types";
import { PARTICIPATION_BY_COUNTRY } from "../data/participation";
import { getCountryGovernanceSummary } from "./getCountryGovernanceSummary";

export interface MapStyle {
  fill: string;
  outline: string;
  strokeWidth: number;
  strokeDasharray?: string;
  opacity: number;
}

const FILL = {
  empty: "#E5E7EB",
  guidance: "#BFDBFE",
  mixed: "#60A5FA",
  binding: "#1D4ED8",
};

const OUTLINE = {
  base: "#94A3B8",
  match: "#B45309",
  ratified: "#6D28D9",
  signedNotRatified: "#6D28D9",
};

export function getMapStyle(
  iso3: string,
  filters: FilterState,
  matchesFilter: boolean
): MapStyle {
  const summary = getCountryGovernanceSummary(iso3);

  let fill: string;
  if (!summary.hasAnyAIRule) fill = FILL.empty;
  else if (summary.hasBindingNationalLaw) fill = FILL.binding;
  else {
    const hasProposed = summary.nationalRegulations.some(
      (r) => r.bindingStatus === "proposed" || r.bindingStatus === "mixed"
    );
    fill = hasProposed ? FILL.mixed : FILL.guidance;
  }

  let outline = OUTLINE.base;
  let strokeWidth = 0.5;
  let strokeDasharray: string | undefined;

  const participations = PARTICIPATION_BY_COUNTRY[iso3] ?? [];

  // Treaty outline: ratified vs signed-not-ratified
  const treatyRows = participations.filter(
    (p) => p.instrumentId === "coe-ai-convention"
  );
  if (treatyRows.length > 0) {
    const ratified = treatyRows.some(
      (r: InternationalParticipation) =>
        r.participationType === "ratified" ||
        r.participationType === "applicable_via_eu"
    );
    if (ratified) {
      outline = OUTLINE.ratified;
      strokeWidth = 1.25;
    } else {
      outline = OUTLINE.signedNotRatified;
      strokeWidth = 1.25;
      strokeDasharray = "3 2";
    }
  }

  // Filter outline overlay
  let opacity = 1;
  if (filters.selectedInstrumentIds.length > 0) {
    if (matchesFilter) {
      outline = OUTLINE.match;
      strokeWidth = 1.5;
      strokeDasharray = undefined;
    } else {
      opacity = 0.25;
    }
  } else if (!matchesFilter) {
    opacity = 0.25;
  }

  return { fill, outline, strokeWidth, strokeDasharray, opacity };
}
