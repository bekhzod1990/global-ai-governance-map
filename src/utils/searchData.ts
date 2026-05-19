import { COUNTRIES } from "../data/countries";
import { INTERNATIONAL_INSTRUMENTS } from "../data/internationalInstruments";
import { NATIONAL_AI_REGULATIONS } from "../data/nationalAIRegulations";

export type SearchResultKind = "country" | "instrument" | "regulation";

export interface SearchResult {
  kind: SearchResultKind;
  id: string;
  title: string;
  subtitle: string;
  score: number;
}

function fuzzyScore(haystack: string, needle: string): number {
  if (!needle) return 0;
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase();
  if (h === n) return 100;
  if (h.startsWith(n)) return 80;
  if (h.includes(n)) return 60;
  // Token overlap
  const ht = new Set(h.split(/\W+/).filter(Boolean));
  const nt = n.split(/\W+/).filter(Boolean);
  if (nt.every((t) => ht.has(t))) return 50;
  if (nt.some((t) => ht.has(t))) return 30;
  return 0;
}

export function searchData(query: string, limit = 30): SearchResult[] {
  const q = query.trim();
  if (!q) return [];

  const results: SearchResult[] = [];

  for (const c of COUNTRIES) {
    const score = Math.max(fuzzyScore(c.name, q), fuzzyScore(c.iso3, q));
    if (score > 0) {
      results.push({
        kind: "country",
        id: c.iso3,
        title: c.name,
        subtitle: c.region,
        score,
      });
    }
  }

  for (const inst of INTERNATIONAL_INSTRUMENTS) {
    const score = Math.max(
      fuzzyScore(inst.name, q),
      fuzzyScore(inst.issuer, q),
      fuzzyScore(inst.organizationType, q)
    );
    if (score > 0) {
      results.push({
        kind: "instrument",
        id: inst.id,
        title: inst.name,
        subtitle: `${inst.organizationType} • ${inst.instrumentType}`,
        score,
      });
    }
  }

  for (const reg of NATIONAL_AI_REGULATIONS) {
    const score = Math.max(
      fuzzyScore(reg.name, q),
      fuzzyScore(reg.jurisdiction, q),
      fuzzyScore(reg.regulatorOrBody ?? "", q)
    );
    if (score > 0) {
      results.push({
        kind: "regulation",
        id: reg.id,
        title: reg.name,
        subtitle: `${reg.jurisdiction} • ${reg.type}`,
        score,
      });
    }
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}
