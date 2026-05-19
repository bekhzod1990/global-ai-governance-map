import { getCountryGovernanceSummary } from "../utils/getCountryGovernanceSummary";
import { PARTICIPATION_LABELS } from "../utils/getParticipationLabel";

interface Props {
  iso3: string;
  countryName: string;
  x: number;
  y: number;
  activeFilterInstrumentIds: string[];
}

export function CountryTooltip({
  iso3,
  countryName,
  x,
  y,
  activeFilterInstrumentIds,
}: Props) {
  const summary = getCountryGovernanceSummary(iso3);
  const nationalCount = summary.nationalRegulations.length;
  const intlCount = summary.participations.length;

  // Determine offset to avoid clipping
  const style: React.CSSProperties = {
    left: x + 14,
    top: y + 14,
    maxWidth: 360,
  };

  const filterMatches = activeFilterInstrumentIds
    .map((id) =>
      summary.participations.find(({ instrument }) => instrument.id === id)
    )
    .filter(Boolean);

  return (
    <div
      role="tooltip"
      className="pointer-events-none fixed z-50 rounded-xl border border-canvas-line bg-white/95 px-3.5 py-3 text-sm shadow-drawer backdrop-blur"
      style={style}
    >
      <p className="text-sm font-semibold text-ink-900">{countryName}</p>
      <p className="mt-0.5 text-[11px] uppercase tracking-wide text-ink-500">
        {nationalCount} national rule{nationalCount === 1 ? "" : "s"} ·{" "}
        {intlCount} international participation{intlCount === 1 ? "" : "s"}
      </p>

      {summary.nationalRegulations.length > 0 && (
        <div className="mt-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-500">
            National AI rules
          </p>
          <ul className="mt-1 space-y-0.5 text-xs text-ink-700">
            {summary.nationalRegulations.slice(0, 5).map((r) => (
              <li key={r.id} className="leading-snug">
                {r.name}
              </li>
            ))}
            {summary.nationalRegulations.length > 5 && (
              <li className="text-ink-500">
                +{summary.nationalRegulations.length - 5} more
              </li>
            )}
          </ul>
        </div>
      )}

      {summary.participations.length > 0 && (
        <div className="mt-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-500">
            International AI instruments
          </p>
          <ul className="mt-1 space-y-0.5 text-xs text-ink-700">
            {summary.participations.slice(0, 6).map(({ participation, instrument }) => (
              <li key={participation.id} className="leading-snug">
                <span className="font-medium">{instrument.name}</span>
                <span className="ml-1 text-ink-500">
                  · {PARTICIPATION_LABELS[participation.participationType]}
                </span>
              </li>
            ))}
            {summary.participations.length > 6 && (
              <li className="text-ink-500">
                +{summary.participations.length - 6} more
              </li>
            )}
          </ul>
        </div>
      )}

      {activeFilterInstrumentIds.length > 0 && (
        <div className="mt-2.5 rounded-md border border-gold/40 bg-gold-soft/50 px-2 py-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gold">
            Active filter
          </p>
          {filterMatches.length === 0 ? (
            <p className="text-xs text-ink-700">No match for selected instrument.</p>
          ) : (
            <ul className="mt-0.5 space-y-0.5 text-xs text-ink-800">
              {filterMatches.map((m) => (
                <li key={m!.participation.id} className="leading-snug">
                  <span className="font-medium">{m!.instrument.name}</span>
                  <span className="ml-1 text-ink-600">
                    · {PARTICIPATION_LABELS[m!.participation.participationType]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {nationalCount === 0 && intlCount === 0 && (
        <p className="mt-2 text-xs text-ink-500">
          No AI-specific data currently included in this dataset.
        </p>
      )}
    </div>
  );
}
