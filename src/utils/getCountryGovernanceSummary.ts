import { COUNTRY_BY_ISO3 } from "../data/countries";
import { EU_MEMBER_ISO3 } from "../data/euMembers";
import { INSTRUMENT_BY_ID } from "../data/internationalInstruments";
import { NATIONAL_AI_REGULATIONS } from "../data/nationalAIRegulations";
import { PARTICIPATION_BY_COUNTRY } from "../data/participation";
import type {
  Country,
  InternationalInstrument,
  InternationalParticipation,
  NationalAIRegulation,
} from "../types";

export interface CountryGovernanceSummary {
  country: Country | null;
  nationalRegulations: NationalAIRegulation[];
  participations: Array<{
    participation: InternationalParticipation;
    instrument: InternationalInstrument;
  }>;
  hasBindingNationalLaw: boolean;
  hasAnyAIRule: boolean;
  hasFrontierAIRelevant: boolean;
}

const EMPTY_SUMMARY: CountryGovernanceSummary = {
  country: null,
  nationalRegulations: [],
  participations: [],
  hasBindingNationalLaw: false,
  hasAnyAIRule: false,
  hasFrontierAIRelevant: false,
};

export function getCountryGovernanceSummary(iso3: string): CountryGovernanceSummary {
  const country = COUNTRY_BY_ISO3[iso3];
  if (!country) return { ...EMPTY_SUMMARY };

  const regulations: NationalAIRegulation[] = [];
  for (const reg of NATIONAL_AI_REGULATIONS) {
    if (reg.countryIso3 === iso3) {
      regulations.push(reg);
    }
    if (
      reg.regionalEntity === "EU" &&
      reg.id === "eu-ai-act-regional" &&
      EU_MEMBER_ISO3.includes(iso3)
    ) {
      regulations.push(reg);
    }
  }

  const participations = (PARTICIPATION_BY_COUNTRY[iso3] ?? [])
    .map((p) => ({
      participation: p,
      instrument: INSTRUMENT_BY_ID[p.instrumentId],
    }))
    .filter((p) => Boolean(p.instrument))
    .sort((a, b) => {
      const pa = a.instrument.powerScore ?? 0;
      const pb = b.instrument.powerScore ?? 0;
      if (pb !== pa) return pb - pa;
      return a.instrument.name.localeCompare(b.instrument.name);
    });

  const hasBindingNationalLaw = regulations.some(
    (r) => r.bindingStatus === "binding"
  );
  const hasAnyAIRule = regulations.length > 0;
  const hasFrontierAIRelevant =
    regulations.some((r) => r.frontierAIRelevant) ||
    participations.some(({ instrument }) => instrument.frontierAIRelevant);

  return {
    country,
    nationalRegulations: regulations,
    participations,
    hasBindingNationalLaw,
    hasAnyAIRule,
    hasFrontierAIRelevant,
  };
}
