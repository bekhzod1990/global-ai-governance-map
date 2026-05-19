import { COUNTRIES, COUNTRY_BY_ISO3 } from "../data/countries";
import { INTERNATIONAL_INSTRUMENTS, INSTRUMENT_BY_ID } from "../data/internationalInstruments";
import { NATIONAL_AI_REGULATIONS, NATIONAL_REG_BY_ID } from "../data/nationalAIRegulations";
import { INTERNATIONAL_PARTICIPATION } from "../data/participation";
import { hasCyrillic } from "./translateSeedDataToEnglish";

interface ValidationReport {
  ok: boolean;
  errors: string[];
  warnings: string[];
}

export function validateData(): ValidationReport {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Countries
  for (const c of COUNTRIES) {
    if (!c.iso3 || c.iso3.length !== 3) errors.push(`Country ${c.name} has invalid iso3`);
    if (!c.name) errors.push(`Country ${c.iso3} has no name`);
    if (!c.region) errors.push(`Country ${c.iso3} has no region`);
  }
  const isoSeen = new Set<string>();
  for (const c of COUNTRIES) {
    if (isoSeen.has(c.iso3)) errors.push(`Duplicate country iso3: ${c.iso3}`);
    isoSeen.add(c.iso3);
  }

  // National regulations
  const natIds = new Set<string>();
  for (const reg of NATIONAL_AI_REGULATIONS) {
    if (!reg.id) errors.push("National regulation missing id");
    if (natIds.has(reg.id)) errors.push(`Duplicate national regulation id: ${reg.id}`);
    natIds.add(reg.id);
    if (reg.aiSpecific !== true) errors.push(`National regulation ${reg.id} is not aiSpecific`);
    if (!reg.sourceUrl) errors.push(`National regulation ${reg.id} missing sourceUrl`);
    if (reg.countryIso3 && !COUNTRY_BY_ISO3[reg.countryIso3]) {
      errors.push(`National regulation ${reg.id} references unknown country ${reg.countryIso3}`);
    }
  }

  // International instruments
  const instIds = new Set<string>();
  for (const inst of INTERNATIONAL_INSTRUMENTS) {
    if (!inst.id) errors.push("International instrument missing id");
    if (instIds.has(inst.id)) errors.push(`Duplicate instrument id: ${inst.id}`);
    instIds.add(inst.id);
    if (inst.aiSpecific !== true) errors.push(`Instrument ${inst.id} is not aiSpecific`);
    if (!inst.sourceUrl) errors.push(`Instrument ${inst.id} missing sourceUrl`);
  }

  // Participation
  const partIds = new Set<string>();
  for (const p of INTERNATIONAL_PARTICIPATION) {
    if (partIds.has(p.id)) errors.push(`Duplicate participation row: ${p.id}`);
    partIds.add(p.id);
    if (!INSTRUMENT_BY_ID[p.instrumentId])
      errors.push(`Participation references unknown instrument: ${p.instrumentId}`);
    if (p.countryIso3 !== "EUU" && !COUNTRY_BY_ISO3[p.countryIso3])
      errors.push(`Participation references unknown country: ${p.countryIso3}`);
    if (!p.sourceUrl) errors.push(`Participation ${p.id} missing sourceUrl`);
  }

  // Cyrillic check across user-visible string fields
  function checkCyrillic(label: string, value: string | undefined) {
    if (value && hasCyrillic(value)) {
      warnings.push(`Cyrillic text detected in ${label}: "${value.slice(0, 80)}"`);
    }
  }
  for (const c of COUNTRIES) {
    checkCyrillic(`country.name ${c.iso3}`, c.name);
    checkCyrillic(`country.notes ${c.iso3}`, c.notes);
  }
  for (const reg of NATIONAL_AI_REGULATIONS) {
    checkCyrillic(`reg.name ${reg.id}`, reg.name);
    checkCyrillic(`reg.summary ${reg.id}`, reg.summary);
    checkCyrillic(`reg.regulatorOrBody ${reg.id}`, reg.regulatorOrBody);
  }
  for (const inst of INTERNATIONAL_INSTRUMENTS) {
    checkCyrillic(`instrument.name ${inst.id}`, inst.name);
    checkCyrillic(`instrument.summary ${inst.id}`, inst.summary);
    checkCyrillic(`instrument.issuer ${inst.id}`, inst.issuer);
  }

  return { ok: errors.length === 0, errors, warnings };
}

export function runDevValidation(): void {
  if (typeof window !== "undefined" && import.meta.env.DEV) {
    const report = validateData();
    if (report.errors.length === 0 && report.warnings.length === 0) {
      // eslint-disable-next-line no-console
      console.info(
        `%c[Data] OK · ${COUNTRIES.length} countries · ${INTERNATIONAL_INSTRUMENTS.length} instruments · ${NATIONAL_AI_REGULATIONS.length} national regs · ${INTERNATIONAL_PARTICIPATION.length} participation rows · ${Object.keys(NATIONAL_REG_BY_ID).length} reg ids indexed`,
        "color:#1E40AF;font-weight:600"
      );
    } else {
      // eslint-disable-next-line no-console
      console.group("[Data] Validation report");
      report.errors.forEach((e) => console.error("[err]", e));
      report.warnings.forEach((w) => console.warn("[warn]", w));
      // eslint-disable-next-line no-console
      console.groupEnd();
    }
  }
}
