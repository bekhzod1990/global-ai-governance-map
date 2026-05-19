import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";

countries.registerLocale(enLocale);

const NUMERIC_TO_A3: Record<string, string> = {};

const a3Map = countries.getAlpha3Codes() as Record<string, string>;
for (const a3 of Object.keys(a3Map)) {
  const numeric = countries.alpha3ToNumeric(a3);
  if (numeric) NUMERIC_TO_A3[numeric] = a3;
}

// Manual overrides for entities the topojson uses but i18n-iso-countries names differently.
NUMERIC_TO_A3["728"] = "SSD"; // South Sudan
NUMERIC_TO_A3["158"] = "TWN"; // Taiwan

export function numericToAlpha3(code: string | number | undefined | null): string | null {
  if (code == null) return null;
  const padded = String(code).padStart(3, "0");
  return NUMERIC_TO_A3[padded] ?? null;
}

export function alpha3ToName(iso3: string): string | null {
  return countries.getName(iso3, "en") ?? null;
}
