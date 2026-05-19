import { useMemo, useState } from "react";
import clsx from "clsx";
import type {
  FilterState,
  InstrumentBindingStatus,
  OrganizationType,
  ParticipationType,
  Region,
} from "../types";
import { INTERNATIONAL_INSTRUMENTS } from "../data/internationalInstruments";
import {
  INSTRUMENT_BINDING_LABELS,
  PARTICIPATION_LABELS,
} from "../utils/getParticipationLabel";
import { countActiveFilters } from "../utils/filterCountries";

interface Props {
  filters: FilterState;
  onChange: (next: FilterState) => void;
  onReset: () => void;
}

const PARTICIPATION_OPTIONS: ParticipationType[] = [
  "signed",
  "ratified",
  "endorsed",
  "adopted",
  "adherent",
  "member",
  "participant",
  "applicable_via_eu",
  "covered_by_membership",
];

const BINDING_OPTIONS: InstrumentBindingStatus[] = [
  "binding_on_parties",
  "binding_regulation",
  "voluntary",
  "non_binding",
  "standard",
  "political_guidance",
];

const ORG_OPTIONS: OrganizationType[] = [
  "UN",
  "UNESCO",
  "OECD",
  "G20",
  "G7",
  "EU",
  "Council of Europe",
  "ISO/IEC",
  "ASEAN",
  "African Union",
  "APEC",
  "AI Safety Summit",
  "Bilateral",
  "Other",
];

const REGION_OPTIONS: Region[] = [
  "Europe",
  "North America",
  "Latin America & Caribbean",
  "Sub-Saharan Africa",
  "Middle East & North Africa",
  "East Asia",
  "Southeast Asia",
  "South Asia",
  "Central Asia",
  "Oceania",
  "Eurasia",
];

function SectionHeading({
  title,
  count,
  open,
  onToggle,
}: {
  title: string;
  count?: number;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className="flex w-full items-center justify-between border-b border-canvas-line py-2 text-left"
    >
      <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink-700">
        {title}
        {count != null && count > 0 && (
          <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
            {count}
          </span>
        )}
      </span>
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={clsx("text-ink-500 transition-transform", open && "rotate-180")}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: React.ReactNode;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2 rounded-md px-1.5 py-1 text-xs leading-snug text-ink-700 hover:bg-canvas">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-3.5 w-3.5 cursor-pointer rounded border-canvas-line text-accent focus:ring-accent"
      />
      <span>{label}</span>
    </label>
  );
}

function YesNoAny({
  value,
  onChange,
}: {
  value: "any" | "yes" | "no";
  onChange: (v: "any" | "yes" | "no") => void;
}) {
  return (
    <div className="flex gap-1 text-[11px]">
      {(["any", "yes", "no"] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          className={clsx(
            "flex-1 rounded-md border px-2 py-1 font-medium capitalize transition-colors",
            value === v
              ? "border-accent bg-accent text-white"
              : "border-canvas-line text-ink-700 hover:border-ink-400"
          )}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

export function Filters({ filters, onChange, onReset }: Props) {
  const [openSection, setOpenSection] = useState<Record<string, boolean>>({
    instrument: true,
    participation: false,
    binding: false,
    organization: false,
    region: false,
    national: false,
  });

  const activeCount = countActiveFilters(filters);

  const instrumentsByOrg = useMemo(() => {
    const map: Record<string, typeof INTERNATIONAL_INSTRUMENTS> = {};
    for (const inst of INTERNATIONAL_INSTRUMENTS) {
      (map[inst.organizationType] ??= []).push(inst);
    }
    return map;
  }, []);

  function toggleInstrument(id: string) {
    const sel = filters.selectedInstrumentIds;
    const next = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id];
    onChange({ ...filters, selectedInstrumentIds: next });
  }

  function toggleArrayValue<T extends string>(
    key: keyof FilterState,
    value: T
  ) {
    const current = filters[key] as T[];
    const next = current.includes(value)
      ? current.filter((x) => x !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  }

  return (
    <aside
      aria-label="Filters"
      className="flex h-full w-full flex-col gap-3 overflow-hidden bg-canvas-surface"
    >
      <header className="flex items-center justify-between border-b border-canvas-line px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-ink-900">Filters</h2>
          <p className="text-[11px] text-ink-500">
            {activeCount > 0 ? `${activeCount} active` : "None active"}
          </p>
        </div>
        <button
          type="button"
          onClick={onReset}
          disabled={activeCount === 0}
          className="rounded-md border border-canvas-line px-2.5 py-1 text-[11px] font-medium text-ink-700 hover:border-ink-400 disabled:opacity-40"
        >
          Reset
        </button>
      </header>

      <div className="policy-scroll flex-1 overflow-y-auto px-4 pb-6">
        <section>
          <SectionHeading
            title="International instrument"
            count={filters.selectedInstrumentIds.length}
            open={openSection.instrument}
            onToggle={() =>
              setOpenSection((s) => ({ ...s, instrument: !s.instrument }))
            }
          />
          {openSection.instrument && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-[11px] text-ink-700">
                <span>Match mode:</span>
                {(["OR", "AND"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() =>
                      onChange({ ...filters, instrumentMatchMode: m })
                    }
                    className={clsx(
                      "rounded-md border px-2 py-0.5 font-semibold",
                      filters.instrumentMatchMode === m
                        ? "border-accent bg-accent text-white"
                        : "border-canvas-line text-ink-700"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {Object.keys(instrumentsByOrg)
                .sort()
                .map((org) => (
                  <div key={org}>
                    <p className="px-1.5 pt-1 text-[10px] font-semibold uppercase tracking-wide text-ink-500">
                      {org}
                    </p>
                    {instrumentsByOrg[org].map((inst) => (
                      <CheckboxRow
                        key={inst.id}
                        checked={filters.selectedInstrumentIds.includes(inst.id)}
                        onChange={() => toggleInstrument(inst.id)}
                        label={
                          <span className="font-medium leading-snug">
                            {inst.name}
                            {inst.date && (
                              <span className="ml-1 text-[10px] text-ink-500">
                                · {inst.date.slice(0, 4)}
                              </span>
                            )}
                          </span>
                        }
                      />
                    ))}
                  </div>
                ))}
            </div>
          )}
        </section>

        <section className="mt-4">
          <SectionHeading
            title="Participation type"
            count={filters.selectedParticipationTypes.length}
            open={openSection.participation}
            onToggle={() =>
              setOpenSection((s) => ({ ...s, participation: !s.participation }))
            }
          />
          {openSection.participation && (
            <div className="pt-2">
              {PARTICIPATION_OPTIONS.map((p) => (
                <CheckboxRow
                  key={p}
                  checked={filters.selectedParticipationTypes.includes(p)}
                  onChange={() =>
                    toggleArrayValue("selectedParticipationTypes", p)
                  }
                  label={PARTICIPATION_LABELS[p]}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-4">
          <SectionHeading
            title="Binding force"
            count={filters.selectedBindingStatuses.length}
            open={openSection.binding}
            onToggle={() =>
              setOpenSection((s) => ({ ...s, binding: !s.binding }))
            }
          />
          {openSection.binding && (
            <div className="pt-2">
              {BINDING_OPTIONS.map((b) => (
                <CheckboxRow
                  key={b}
                  checked={filters.selectedBindingStatuses.includes(b)}
                  onChange={() =>
                    toggleArrayValue("selectedBindingStatuses", b)
                  }
                  label={INSTRUMENT_BINDING_LABELS[b]}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-4">
          <SectionHeading
            title="Organization"
            count={filters.selectedOrganizations.length}
            open={openSection.organization}
            onToggle={() =>
              setOpenSection((s) => ({ ...s, organization: !s.organization }))
            }
          />
          {openSection.organization && (
            <div className="pt-2">
              {ORG_OPTIONS.map((o) => (
                <CheckboxRow
                  key={o}
                  checked={filters.selectedOrganizations.includes(o)}
                  onChange={() => toggleArrayValue("selectedOrganizations", o)}
                  label={o}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-4">
          <SectionHeading
            title="Region"
            count={filters.selectedRegions.length}
            open={openSection.region}
            onToggle={() => setOpenSection((s) => ({ ...s, region: !s.region }))}
          />
          {openSection.region && (
            <div className="pt-2">
              {REGION_OPTIONS.map((r) => (
                <CheckboxRow
                  key={r}
                  checked={filters.selectedRegions.includes(r)}
                  onChange={() => toggleArrayValue("selectedRegions", r)}
                  label={r}
                />
              ))}
            </div>
          )}
        </section>

        <section className="mt-4">
          <SectionHeading
            title="National AI rules"
            open={openSection.national}
            onToggle={() =>
              setOpenSection((s) => ({ ...s, national: !s.national }))
            }
          />
          {openSection.national && (
            <div className="space-y-3 pt-2">
              <div>
                <p className="mb-1 text-[11px] text-ink-700">
                  Has binding national AI law
                </p>
                <YesNoAny
                  value={filters.hasBindingNationalLaw}
                  onChange={(v) =>
                    onChange({ ...filters, hasBindingNationalLaw: v })
                  }
                />
              </div>
              <div>
                <p className="mb-1 text-[11px] text-ink-700">
                  Has any AI-specific rule
                </p>
                <YesNoAny
                  value={filters.hasAnyAIRule}
                  onChange={(v) => onChange({ ...filters, hasAnyAIRule: v })}
                />
              </div>
              <div>
                <p className="mb-1 text-[11px] text-ink-700">
                  Frontier-AI relevant
                </p>
                <YesNoAny
                  value={filters.frontierAIRelevant}
                  onChange={(v) =>
                    onChange({ ...filters, frontierAIRelevant: v })
                  }
                />
              </div>
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}
