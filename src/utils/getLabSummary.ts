import { LAB_BY_ID } from "../data/frontierLabs";
import { EDGES_BY_NODE } from "../data/dependencies";
import { INSTRUMENT_BY_ID } from "../data/internationalInstruments";
import { NATIONAL_REG_BY_ID } from "../data/nationalAIRegulations";
import type { FrontierLab, GraphEdge } from "../types";

export interface LabSummary {
  lab: FrontierLab | null;
  regulatoryExposure: Array<{ id: string; name: string; sourceUrl?: string }>;
  edges: { outgoing: GraphEdge[]; incoming: GraphEdge[] };
}

export function getLabSummary(labId: string): LabSummary {
  const lab = LAB_BY_ID[labId];
  if (!lab) return { lab: null, regulatoryExposure: [], edges: { outgoing: [], incoming: [] } };

  const exposure = lab.regulatoryExposureIds.map((rid) => {
    const inst = INSTRUMENT_BY_ID[rid];
    if (inst) return { id: rid, name: inst.name, sourceUrl: inst.sourceUrl };
    const reg = NATIONAL_REG_BY_ID[rid];
    if (reg) return { id: rid, name: reg.name, sourceUrl: reg.sourceUrl };
    return { id: rid, name: rid };
  });

  const edges = EDGES_BY_NODE[labId] ?? { outgoing: [], incoming: [] };
  return { lab, regulatoryExposure: exposure, edges };
}
