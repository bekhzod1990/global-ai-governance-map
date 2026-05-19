import { useEffect, useMemo, useReducer, useState } from "react";
import { DEFAULT_FILTER_STATE, type FilterState } from "./types";
import { WorldMap } from "./components/WorldMap";
import { Filters } from "./components/Filters";
import { CountrySidePanel } from "./components/CountrySidePanel";
import { CountryTooltip } from "./components/CountryTooltip";
import { SearchBox } from "./components/SearchBox";
import { Legend } from "./components/Legend";
import { DataQualityNotice } from "./components/DataQualityNotice";
import { DeploymentBadge } from "./components/DeploymentBadge";
import { runDevValidation } from "./utils/validateData";
import { COUNTRIES } from "./data/countries";
import { INTERNATIONAL_INSTRUMENTS } from "./data/internationalInstruments";
import { NATIONAL_AI_REGULATIONS } from "./data/nationalAIRegulations";

type Action =
  | { type: "set"; filters: FilterState }
  | { type: "reset" }
  | { type: "select-instrument"; id: string };

function filterReducer(state: FilterState, action: Action): FilterState {
  switch (action.type) {
    case "set":
      return action.filters;
    case "reset":
      return { ...DEFAULT_FILTER_STATE };
    case "select-instrument":
      return {
        ...state,
        selectedInstrumentIds: state.selectedInstrumentIds.includes(action.id)
          ? state.selectedInstrumentIds
          : [...state.selectedInstrumentIds, action.id],
      };
    default:
      return state;
  }
}

export default function App() {
  const [filters, dispatch] = useReducer(filterReducer, DEFAULT_FILTER_STATE);
  const [selectedIso3, setSelectedIso3] = useState<string | null>(null);
  const [hover, setHover] = useState<{
    iso3: string;
    name: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    runDevValidation();
  }, []);

  const stats = useMemo(
    () => ({
      countries: COUNTRIES.filter((c) => c.iso3 !== "EUU").length,
      instruments: INTERNATIONAL_INSTRUMENTS.length,
      nationalRegs: NATIONAL_AI_REGULATIONS.length,
    }),
    []
  );

  return (
    <div className="flex h-full min-h-screen flex-col bg-canvas">
      <header className="border-b border-canvas-line bg-canvas-surface">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-3 px-6 pb-3 pt-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-[22px] font-semibold leading-tight tracking-tight text-ink-900">
                Global AI Governance Map
              </h1>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-600">
                AI-specific national regulations and international AI governance instruments
              </p>
            </div>
            <div className="flex w-full max-w-md flex-1 justify-end gap-3">
              <SearchBox
                onSelectCountry={(iso3) => setSelectedIso3(iso3)}
                onSelectInstrument={(id) =>
                  dispatch({ type: "select-instrument", id })
                }
              />
            </div>
          </div>
          <DataQualityNotice />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1480px] flex-1 gap-4 px-6 py-5">
        <section className="relative flex flex-1 flex-col gap-3 min-w-0">
          <div className="relative flex flex-1 min-h-[460px] flex-col">
            <WorldMap
              filters={filters}
              selectedIso3={selectedIso3}
              onSelectCountry={(iso3) => setSelectedIso3(iso3)}
              onHover={(data) => setHover(data)}
            />
            {selectedIso3 && (
              <CountrySidePanel
                iso3={selectedIso3}
                onClose={() => setSelectedIso3(null)}
              />
            )}
          </div>
          <Legend />
          <footer className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-ink-500">
            <p>
              Dataset: {stats.countries} countries · {stats.instruments} international AI
              instruments · {stats.nationalRegs} national AI rules. Sources are official wherever
              possible (EUR-Lex, OECD, UNESCO, Council of Europe, ISO, GOV.UK, NIST, CAC, MSIT,
              IMDA, MeitY, AU, ASEAN, APEC). Status may change — verify before relying on.
            </p>
            <DeploymentBadge />
          </footer>
        </section>

        <div className="w-[340px] shrink-0 rounded-xl border border-canvas-line bg-canvas-surface shadow-panel">
          <Filters
            filters={filters}
            onChange={(next) => dispatch({ type: "set", filters: next })}
            onReset={() => dispatch({ type: "reset" })}
          />
        </div>
      </main>

      {hover && (
        <CountryTooltip
          iso3={hover.iso3}
          countryName={hover.name}
          x={hover.x}
          y={hover.y}
          activeFilterInstrumentIds={filters.selectedInstrumentIds}
        />
      )}
    </div>
  );
}
