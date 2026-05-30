import { LAB_BY_ID } from "../data/frontierLabs";
import { EDGES_BY_NODE } from "../data/dependencies";
import type { FrontierLab, GraphEdge, LabRegulatoryExposure } from "../types";
import {
  getLabRegulatoryExposures,
  summarizeLabExposures,
  type LabExposureSummary,
} from "./labExposure";

export interface LabSummary {
  lab: FrontierLab | null;
  regulatoryExposure: LabRegulatoryExposure[];
  exposureSummary: LabExposureSummary;
  edges: { outgoing: GraphEdge[]; incoming: GraphEdge[] };
}

export function getLabSummary(labId: string): LabSummary {
  const lab = LAB_BY_ID[labId];
  if (!lab) {
    return {
      lab: null,
      regulatoryExposure: [],
      exposureSummary: summarizeLabExposures([]),
      edges: { outgoing: [], incoming: [] },
    };
  }

  const exposure = getLabRegulatoryExposures(lab.id);
  const edges = EDGES_BY_NODE[labId] ?? { outgoing: [], incoming: [] };
  return { lab, regulatoryExposure: exposure, exposureSummary: summarizeLabExposures(exposure), edges };
}
