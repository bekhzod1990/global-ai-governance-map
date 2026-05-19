import clsx from "clsx";
import { getEdgesForNode, RELATIONSHIP_LABELS, REVERSE_RELATIONSHIP_LABELS } from "../utils/getEdgesForNode";
import { EmptyState } from "./EmptyState";
import type { RelationshipKind } from "../types";

interface Props {
  nodeId: string;
}

const RELATIONSHIP_COLORS: Record<RelationshipKind, string> = {
  regulates: "bg-emerald-50 text-emerald-900 border-emerald-200",
  depends_on: "bg-sky-50 text-sky-900 border-sky-200",
  constrains: "bg-rose-50 text-rose-900 border-rose-200",
  influences: "bg-amber-50 text-amber-900 border-amber-200",
  coordinates: "bg-indigo-50 text-indigo-900 border-indigo-200",
  participates_in: "bg-violet-50 text-violet-900 border-violet-200",
};

export function ConnectionsSection({ nodeId }: Props) {
  const grouped = getEdgesForNode(nodeId);
  if (grouped.totalCount === 0) {
    return <EmptyState message="No dependency edges recorded for this node yet." />;
  }

  return (
    <div className="space-y-3">
      {(Object.entries(grouped.outgoing) as Array<[RelationshipKind, typeof grouped.outgoing[RelationshipKind]]>)
        .filter(([, list]) => list && list.length > 0)
        .map(([rel, list]) => (
          <div key={`out-${rel}`}>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-500">
              {RELATIONSHIP_LABELS[rel]}
            </p>
            <ul className="space-y-1">
              {list!.map(({ edge, otherLabel }) => (
                <li
                  key={edge.id}
                  className={clsx(
                    "rounded-md border px-2.5 py-1.5 text-xs leading-snug",
                    RELATIONSHIP_COLORS[rel]
                  )}
                >
                  <span className="font-semibold">{otherLabel}</span>
                  <span className="ml-2 text-[10px] uppercase tracking-wide opacity-70">
                    strength {edge.strength}/5
                  </span>
                  <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">{edge.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}

      {(Object.entries(grouped.incoming) as Array<[RelationshipKind, typeof grouped.incoming[RelationshipKind]]>)
        .filter(([, list]) => list && list.length > 0)
        .map(([rel, list]) => (
          <div key={`in-${rel}`}>
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-ink-500">
              {REVERSE_RELATIONSHIP_LABELS[rel]}
            </p>
            <ul className="space-y-1">
              {list!.map(({ edge, otherLabel }) => (
                <li
                  key={edge.id}
                  className={clsx(
                    "rounded-md border px-2.5 py-1.5 text-xs leading-snug",
                    RELATIONSHIP_COLORS[rel]
                  )}
                >
                  <span className="font-semibold">{otherLabel}</span>
                  <span className="ml-2 text-[10px] uppercase tracking-wide opacity-70">
                    strength {edge.strength}/5
                  </span>
                  <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">{edge.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}
