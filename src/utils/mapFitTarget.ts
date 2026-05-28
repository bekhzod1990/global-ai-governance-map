import { COUNTRIES, COUNTRY_BY_ISO3 } from "../data/countries";
import { FRONTIER_LABS, LAB_BY_ID } from "../data/frontierLabs";
import { DEFAULT_FILTER_STATE, type FilterState, type MapFitTarget } from "../types";
import { countActiveFilters, filterCountries } from "./filterCountries";

export interface MapFitScope {
  target: MapFitTarget | null;
  hasActiveScope: boolean;
  isNoMatch: boolean;
  summaryLabel: string;
  compactLabel: string;
}

export function getMapFitScope(
  filters: FilterState,
  selectedIso3: string | null,
  selectedLabId: string | null
): MapFitScope {
  const selectedTarget = getSelectedFitTarget(selectedIso3, selectedLabId);
  if (selectedTarget) {
    return {
      target: selectedTarget,
      hasActiveScope: true,
      isNoMatch: false,
      summaryLabel: selectedTarget.summaryLabel,
      compactLabel: selectedTarget.summaryLabel,
    };
  }

  if (countActiveFilters(filters) === 0) {
    return {
      target: null,
      hasActiveScope: false,
      isNoMatch: false,
      summaryLabel: "World overview",
      compactLabel: "World",
    };
  }

  const target = getFilteredFitTarget(filters);
  if (!target) {
    return {
      target: null,
      hasActiveScope: true,
      isNoMatch: true,
      summaryLabel: "No map matches",
      compactLabel: "No matches",
    };
  }

  return {
    target,
    hasActiveScope: true,
    isNoMatch: false,
    summaryLabel: target.summaryLabel,
    compactLabel: target.summaryLabel,
  };
}

function getSelectedFitTarget(selectedIso3: string | null, selectedLabId: string | null) {
  if (selectedLabId && LAB_BY_ID[selectedLabId]) {
    const lab = LAB_BY_ID[selectedLabId];
    return createMapFitTarget(`lab:${selectedLabId}`, lab.name, [lab.hqIso3], [selectedLabId]);
  }

  if (selectedIso3 && selectedIso3 !== "EUU" && COUNTRY_BY_ISO3[selectedIso3]) {
    return createMapFitTarget(
      `country:${selectedIso3}`,
      COUNTRY_BY_ISO3[selectedIso3].name,
      [selectedIso3],
      []
    );
  }

  if (selectedIso3 === "EUU") {
    const euMemberIso3s = COUNTRIES
      .filter((country) => country.isEUMember)
      .map((country) => country.iso3);
    return createMapFitTarget("country:EUU", "EU member states", euMemberIso3s, []);
  }

  return null;
}

function getFilteredFitTarget(filters: FilterState) {
  let countryIso3s = filterCountries(filters)
    .filter((result) => result.matchesFilter)
    .map((result) => result.iso3);
  let labIds = [...filters.selectedLabIds];

  const query = filters.searchQuery.trim().toLowerCase();
  if (query) {
    const queryCountryIso3s = COUNTRIES
      .filter((country) => country.iso3 !== "EUU")
      .filter((country) =>
        `${country.name} ${country.iso3} ${country.region}`.toLowerCase().includes(query)
      )
      .map((country) => country.iso3);
    const queryLabIds = FRONTIER_LABS
      .filter((lab) =>
        `${lab.name} ${lab.hqCountryName} ${lab.hqIso3}`.toLowerCase().includes(query)
      )
      .map((lab) => lab.id);
    const queryCountrySet = new Set(queryCountryIso3s);
    const queryOnly =
      countActiveFilters({ ...DEFAULT_FILTER_STATE, searchQuery: filters.searchQuery }) ===
      countActiveFilters(filters);

    countryIso3s = queryOnly
      ? queryCountryIso3s
      : countryIso3s.filter((iso3) => queryCountrySet.has(iso3));
    labIds = queryOnly ? queryLabIds : unique([...labIds, ...queryLabIds]);
  }

  countryIso3s = unique(countryIso3s);
  labIds = unique(labIds);
  if (countryIso3s.length === 0 && labIds.length === 0) return null;

  const countryLabel =
    countryIso3s.length === 1
      ? COUNTRY_BY_ISO3[countryIso3s[0]]?.name ?? countryIso3s[0]
      : `${countryIso3s.length} countries`;
  const labLabel =
    labIds.length === 1 ? LAB_BY_ID[labIds[0]]?.name ?? labIds[0] : `${labIds.length} labs`;

  return createMapFitTarget(
    `filters:${JSON.stringify(filters)}`,
    countryIso3s.length > 0 && labIds.length > 0
      ? `${countryLabel}, ${labLabel}`
      : countryIso3s.length > 0
        ? countryLabel
        : labLabel,
    countryIso3s,
    labIds
  );
}

function createMapFitTarget(
  id: string,
  label: string,
  countryIso3s: string[],
  labIds: string[]
): MapFitTarget {
  const uniqueCountryIso3s = unique(countryIso3s);
  const uniqueLabIds = unique(labIds);
  const countryCount = uniqueCountryIso3s.length;
  const labCount = uniqueLabIds.length;

  return {
    id,
    label,
    countryIso3s: uniqueCountryIso3s,
    labIds: uniqueLabIds,
    countryCount,
    labCount,
    summaryLabel: formatMapFitCounts(countryCount, labCount),
  };
}

function formatMapFitCounts(countryCount: number, labCount: number) {
  const parts: string[] = [];
  if (countryCount > 0) parts.push(`${countryCount} ${countryCount === 1 ? "country" : "countries"}`);
  if (labCount > 0) parts.push(`${labCount} ${labCount === 1 ? "lab" : "labs"}`);
  return parts.join(" · ");
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}
