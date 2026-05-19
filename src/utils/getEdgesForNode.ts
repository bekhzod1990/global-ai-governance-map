import { EDGES_BY_NODE } from "../data/dependencies";
import { resolveNode } from "./getCountryGovernanceSummary";
import type { GraphEdge, RelationshipKind } from "../types";

export interface GroupedEdges {
  outgoing: Partial<Record<RelationshipKind, Array<{ edge: GraphEdge; otherLabel: string }>>>;
  incoming: Partial<Record<RelationshipKind, Array<{ edge: GraphEdge; otherLabel: string }>>>;
  totalCount: number;
}

export function getEdgesForNode(nodeId: string): GroupedEdges {
  const bucket = EDGES_BY_NODE[nodeId];
  if (!bucket) return { outgoing: {}, incoming: {}, totalCount: 0 };

  const outgoing: GroupedEdges["outgoing"] = {};
  const incoming: GroupedEdges["incoming"] = {};

  for (const edge of bucket.outgoing) {
    const other = resolveNode(edge.targetId);
    (outgoing[edge.relationship] ??= []).push({ edge, otherLabel: other?.name ?? edge.targetId });
  }
  for (const edge of bucket.incoming) {
    const other = resolveNode(edge.sourceId);
    (incoming[edge.relationship] ??= []).push({ edge, otherLabel: other?.name ?? edge.sourceId });
  }

  return { outgoing, incoming, totalCount: bucket.outgoing.length + bucket.incoming.length };
}

export const RELATIONSHIP_LABELS: Record<RelationshipKind, string> = {
  regulates: "Regulates",
  depends_on: "Depends on",
  constrains: "Constrains",
  influences: "Influences",
  coordinates: "Coordinates with",
  participates_in: "Participates in",
};

export const REVERSE_RELATIONSHIP_LABELS: Record<RelationshipKind, string> = {
  regulates: "Regulated by",
  depends_on: "Required by",
  constrains: "Constrained by",
  influences: "Influenced by",
  coordinates: "Coordinated with by",
  participates_in: "Participated in by",
};
