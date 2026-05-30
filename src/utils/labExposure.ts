import { LAB_REGULATORY_EXPOSURES, LAB_EXPOSURES_BY_LAB } from "../data/labRegulatoryExposures";
import { INSTRUMENT_BY_ID } from "../data/internationalInstruments";
import { NATIONAL_REG_BY_ID } from "../data/nationalAIRegulations";
import { INFRA_BY_ID } from "../data/infrastructure";
import type {
  GraphEdge,
  GraphNodeType,
  LabExposureDirectness,
  LabExposureKind,
  LabExposureLegalEffect,
  LabExposureTargetType,
  LabRegulatoryExposure,
  VerificationMetadata,
} from "../types";

export const LAB_EXPOSURE_KIND_LABELS: Record<LabExposureKind, string> = {
  hq_jurisdiction: "HQ jurisdiction",
  market_access: "Market access",
  eu_applicability: "EU applicability",
  safety_institute_coordination: "Safety-institute coordination",
  company_commitment: "Company commitment",
  standards_influence: "Standards influence",
  compute_dependency: "Compute dependency",
  export_control_dependency: "Export-control dependency",
  policy_influence: "Policy influence",
};

export const LAB_EXPOSURE_EFFECT_LABELS: Record<LabExposureLegalEffect, string> = {
  binding: "Binding",
  voluntary: "Voluntary",
  standard: "Standard",
  guidance: "Guidance",
  infrastructure_constraint: "Infrastructure constraint",
  indirect: "Indirect",
};

export const LAB_EXPOSURE_DIRECTNESS_LABELS: Record<LabExposureDirectness, string> = {
  direct: "Direct",
  conditional: "Conditional",
  indirect: "Indirect",
};

export const LAB_EXPOSURE_TARGET_TYPE_LABELS: Record<LabExposureTargetType, string> = {
  national_rule: "National rule",
  international_instrument: "International instrument",
  infrastructure: "Infrastructure",
  standard: "Standard",
  company_commitment: "Company commitment",
};

export interface LabExposureTarget {
  id: string;
  name: string;
  sourceUrl?: string;
  sourceName?: string;
  metadata?: VerificationMetadata;
}

export interface LabExposureSummary {
  total: number;
  binding: number;
  conditional: number;
  voluntary: number;
  standards: number;
  infrastructure: number;
  indirect: number;
}

interface LabExposureGraphDirection {
  sourceType: GraphNodeType;
  sourceId: string;
  targetType: GraphNodeType;
  targetId: string;
  relationship: GraphEdge["relationship"];
}

export function getLabRegulatoryExposures(labId: string): LabRegulatoryExposure[] {
  return LAB_EXPOSURES_BY_LAB[labId] ?? [];
}

export function summarizeLabExposures(exposures: LabRegulatoryExposure[]): LabExposureSummary {
  return {
    total: exposures.length,
    binding: exposures.filter((item) => item.legalEffect === "binding").length,
    conditional: exposures.filter((item) => item.directness === "conditional").length,
    voluntary: exposures.filter((item) => item.legalEffect === "voluntary").length,
    standards: exposures.filter((item) => item.legalEffect === "standard").length,
    infrastructure: exposures.filter((item) => item.legalEffect === "infrastructure_constraint").length,
    indirect: exposures.filter((item) => item.directness === "indirect").length,
  };
}

export function isBindingLabExposure(exposure: LabRegulatoryExposure): boolean {
  return exposure.legalEffect === "binding";
}

export function getLabExposureTarget(exposure: LabRegulatoryExposure): LabExposureTarget {
  if (exposure.targetType === "national_rule") {
    const target = NATIONAL_REG_BY_ID[exposure.targetId];
    if (target) return toTarget(target);
  }
  if (
    exposure.targetType === "international_instrument" ||
    exposure.targetType === "standard" ||
    exposure.targetType === "company_commitment"
  ) {
    const target = INSTRUMENT_BY_ID[exposure.targetId];
    if (target) return toTarget(target);
  }
  if (exposure.targetType === "infrastructure") {
    const target = INFRA_BY_ID[exposure.targetId];
    if (target) {
      return {
        id: target.id,
        name: target.name,
        sourceName: target.sourceName,
        sourceUrl: target.sourceUrl,
        metadata: target,
      };
    }
  }
  return { id: exposure.targetId, name: exposure.targetId };
}

export function getLabExposureGraphEdge(exposure: LabRegulatoryExposure): GraphEdge {
  const targetType = graphTargetType(exposure.targetType);
  const edge = edgeDirectionForExposure(exposure, targetType);
  return {
    id: `lab-exposure:${exposure.id}`,
    sourceType: edge.sourceType,
    sourceId: edge.sourceId,
    targetType: edge.targetType,
    targetId: edge.targetId,
    relationship: edge.relationship,
    strength: exposure.strength,
    description: exposure.rationale,
  };
}

export function getLabExposureGraphEdges(): GraphEdge[] {
  return LAB_REGULATORY_EXPOSURES.map((exposure) => getLabExposureGraphEdge(exposure));
}

export function exposureMatchesNetworkPreset(exposure: LabRegulatoryExposure, preset: string): boolean {
  if (preset === "compute-chokepoints") {
    return exposure.legalEffect === "infrastructure_constraint";
  }
  if (preset === "standards-layer") {
    return exposure.legalEffect === "standard" || exposure.exposureKind === "standards_influence";
  }
  if (preset === "summit-process") {
    return exposure.targetId.includes("seoul") || exposure.exposureKind === "company_commitment";
  }
  if (preset === "labs-laws") {
    return (
      exposure.legalEffect === "binding" ||
      exposure.exposureKind === "safety_institute_coordination" ||
      exposure.exposureKind === "company_commitment"
    );
  }
  return (
    exposure.legalEffect === "binding" ||
    exposure.exposureKind === "company_commitment" ||
    exposure.exposureKind === "safety_institute_coordination"
  );
}

function toTarget(
  target: { id: string; name: string; sourceName: string; sourceUrl: string } & VerificationMetadata
): LabExposureTarget {
  return {
    id: target.id,
    name: target.name,
    sourceName: target.sourceName,
    sourceUrl: target.sourceUrl,
    metadata: target,
  };
}

function graphTargetType(targetType: LabExposureTargetType): GraphNodeType {
  if (targetType === "national_rule") return "national_rule";
  if (targetType === "infrastructure") return "infrastructure";
  return "instrument";
}

function edgeDirectionForExposure(
  exposure: LabRegulatoryExposure,
  graphType: GraphNodeType
): LabExposureGraphDirection {
  if (exposure.legalEffect === "binding") {
    return {
      sourceType: graphType,
      sourceId: exposure.targetId,
      targetType: "lab" as const,
      targetId: exposure.labId,
      relationship: "regulates" as const,
    };
  }
  if (exposure.legalEffect === "infrastructure_constraint") {
    return exposure.exposureKind === "export_control_dependency"
      ? {
          sourceType: graphType,
          sourceId: exposure.targetId,
          targetType: "lab" as const,
          targetId: exposure.labId,
          relationship: "constrains" as const,
        }
      : {
          sourceType: "lab" as const,
          sourceId: exposure.labId,
          targetType: graphType,
          targetId: exposure.targetId,
          relationship: "depends_on" as const,
        };
  }
  if (exposure.exposureKind === "company_commitment") {
    return {
      sourceType: "lab" as const,
      sourceId: exposure.labId,
      targetType: graphType,
      targetId: exposure.targetId,
      relationship: "participates_in" as const,
    };
  }
  if (exposure.exposureKind === "safety_institute_coordination") {
    return {
      sourceType: graphType,
      sourceId: exposure.targetId,
      targetType: "lab" as const,
      targetId: exposure.labId,
      relationship: "coordinates" as const,
    };
  }
  return {
    sourceType: graphType,
    sourceId: exposure.targetId,
    targetType: "lab" as const,
    targetId: exposure.labId,
    relationship: "influences" as const,
  };
}
