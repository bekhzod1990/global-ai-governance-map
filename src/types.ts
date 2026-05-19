export type Region =
  | "Europe"
  | "North America"
  | "Latin America & Caribbean"
  | "Sub-Saharan Africa"
  | "Middle East & North Africa"
  | "East Asia"
  | "Southeast Asia"
  | "South Asia"
  | "Central Asia"
  | "Oceania"
  | "Eurasia"
  | "Supranational";

export interface Country {
  iso3: string;
  name: string;
  region: Region;
  isEUMember?: boolean;
  nationalAIRegulationIds: string[];
  internationalParticipationIds: string[];
  notes?: string;
}

export type NationalRegulationType =
  | "law"
  | "regulation"
  | "guidance"
  | "code"
  | "strategy"
  | "framework"
  | "standard"
  | "proposed_law"
  | "institutional_framework";

export type NationalBindingStatus =
  | "binding"
  | "non_binding"
  | "voluntary"
  | "proposed"
  | "mixed";

export interface NationalAIRegulation {
  id: string;
  name: string;
  jurisdiction: string;
  countryIso3?: string;
  regionalEntity?: "EU" | "ASEAN" | "African Union" | "APEC" | "Other";
  type: NationalRegulationType;
  bindingStatus: NationalBindingStatus;
  aiSpecific: true;
  status: string;
  dateAdopted?: string;
  dateInForce?: string;
  regulatorOrBody?: string;
  summary: string;
  frontierAIRelevant: boolean;
  sourceName: string;
  sourceUrl: string;
  notes?: string;
}

export type OrganizationType =
  | "UN"
  | "UNESCO"
  | "OECD"
  | "G20"
  | "G7"
  | "EU"
  | "Council of Europe"
  | "ISO/IEC"
  | "ASEAN"
  | "African Union"
  | "APEC"
  | "AI Safety Summit"
  | "Bilateral"
  | "Other";

export type InstrumentType =
  | "treaty"
  | "regulation"
  | "recommendation"
  | "declaration"
  | "code_of_conduct"
  | "principles"
  | "standard"
  | "guidance"
  | "summit_statement"
  | "ministerial_statement"
  | "network"
  | "roadmap"
  | "reporting_framework"
  | "strategy"
  | "compact";

export type InstrumentBindingStatus =
  | "binding_on_parties"
  | "binding_regulation"
  | "non_binding"
  | "voluntary"
  | "standard"
  | "political_guidance";

export interface InternationalInstrument {
  id: string;
  name: string;
  issuer: string;
  organizationType: OrganizationType;
  date: string;
  instrumentType: InstrumentType;
  bindingStatus: InstrumentBindingStatus;
  aiSpecific: true;
  frontierAIRelevant: boolean;
  summary: string;
  sourceName: string;
  sourceUrl: string;
  notes?: string;
  powerScore?: number;
}

export type ParticipationType =
  | "signed"
  | "ratified"
  | "endorsed"
  | "adopted"
  | "adherent"
  | "member"
  | "participant"
  | "applicable_via_eu"
  | "covered_by_membership"
  | "unknown";

export interface InternationalParticipation {
  id: string;
  instrumentId: string;
  countryIso3: string;
  participationType: ParticipationType;
  date?: string;
  notes?: string;
  sourceName: string;
  sourceUrl: string;
}

export interface OutOfScopeItem {
  id: string;
  name: string;
  reasonExcluded: string;
  notes?: string;
}

export interface SourceNote {
  id: string;
  appliesTo: string;
  note: string;
}

export interface FilterState {
  selectedInstrumentIds: string[];
  instrumentMatchMode: "OR" | "AND";
  selectedParticipationTypes: ParticipationType[];
  selectedBindingStatuses: InstrumentBindingStatus[];
  selectedOrganizations: OrganizationType[];
  selectedRegions: Region[];
  hasBindingNationalLaw: "any" | "yes" | "no";
  hasAnyAIRule: "any" | "yes" | "no";
  frontierAIRelevant: "any" | "yes" | "no";
  searchQuery: string;
}

export const DEFAULT_FILTER_STATE: FilterState = {
  selectedInstrumentIds: [],
  instrumentMatchMode: "OR",
  selectedParticipationTypes: [],
  selectedBindingStatuses: [],
  selectedOrganizations: [],
  selectedRegions: [],
  hasBindingNationalLaw: "any",
  hasAnyAIRule: "any",
  frontierAIRelevant: "any",
  searchQuery: "",
};
