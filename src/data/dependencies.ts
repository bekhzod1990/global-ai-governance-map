import type { GraphEdge, RelationshipKind, GraphNodeType } from "../types";
import { FRONTIER_LABS } from "./frontierLabs";

function e(
  sourceType: GraphNodeType,
  sourceId: string,
  relationship: RelationshipKind,
  targetType: GraphNodeType,
  targetId: string,
  strength: number,
  description: string
): GraphEdge {
  return {
    id: `${sourceId}--${relationship}-->${targetId}`,
    sourceType,
    sourceId,
    relationship,
    targetType,
    targetId,
    strength,
    description,
  };
}

const seeds: GraphEdge[] = [
  // ===== Country ↔ national-rule coordination =====
  e("country", "USA", "coordinates", "infrastructure", "us-bis-export-controls", 5,
    "The United States uses BIS export controls as a central geopolitical lever over advanced AI hardware."),
  e("country", "EUU", "coordinates", "national_rule", "eu-ai-act-regional", 5,
    "The EU implements the AI Act through the AI Office and national supervisory authorities."),
  e("country", "CHN", "coordinates", "national_rule", "cn-genai-interim-measures", 5,
    "China's CAC-led system coordinates the main rules for public generative AI deployment and content labelling."),
  e("country", "GBR", "coordinates", "instrument", "bletchley-declaration", 4,
    "The UK launched the frontier-focused summit process at Bletchley Park."),
  e("country", "KOR", "coordinates", "instrument", "seoul-declaration", 4,
    "South Korea co-hosted the Seoul Summit and advanced the safety-science agenda."),
  e("country", "FRA", "coordinates", "instrument", "paris-statement-2025", 4,
    "France hosted the Paris AI Action Summit and convened the Statement on Inclusive and Sustainable AI."),

  // ===== International instrument ↔ country influence =====
  e("instrument", "oecd-ai-principles", "influences", "country", "JPN", 3,
    "Japan's AI governance documents visibly draw from OECD-type principles."),
  e("instrument", "oecd-ai-principles", "influences", "country", "KOR", 3,
    "Korea's governance approach sits within the OECD-style trustworthy-AI ecosystem."),
  e("instrument", "oecd-ai-principles", "influences", "country", "SGP", 3,
    "Singapore's AI governance framework is built to interoperate with global trustworthy-AI principles."),
  e("instrument", "oecd-ai-principles", "influences", "country", "AUS", 2,
    "Australia's AI safety guidance is aligned with OECD-style human-centred AI principles."),
  e("instrument", "oecd-ai-principles", "influences", "country", "CAN", 2,
    "Canada's voluntary and standards-oriented AI governance fits within OECD-style norms."),
  e("instrument", "oecd-ai-principles", "influences", "instrument", "g20-ai-principles-2019", 3,
    "The G20 AI Principles largely internationalised the OECD approach."),
  e("instrument", "oecd-ai-principles", "influences", "instrument", "g7-hiroshima-statement", 3,
    "The Hiroshima process builds on the broader trustworthy-AI norm ecosystem shaped by the OECD."),
  e("instrument", "oecd-ai-principles", "influences", "instrument", "gpai-declarations", 3,
    "GPAI Council documents sit within the OECD-aligned trustworthy-AI policy coordination ecosystem."),

  // CoE Convention influence
  e("instrument", "coe-ai-convention", "influences", "country", "EUU", 3,
    "The Convention strengthens the human-rights layer around AI governance in Europe."),
  e("instrument", "coe-ai-convention", "influences", "country", "GBR", 2,
    "The Convention matters for the UK's broader European and international legal positioning on AI."),

  // INASI coordinates the launch members
  e("instrument", "intl-network-aisi", "coordinates", "country", "USA", 3,
    "The U.S. is a launch member of the AI safety-institutes network (now the International Network for Advanced AI Measurement, Evaluation and Science)."),
  e("instrument", "intl-network-aisi", "coordinates", "country", "GBR", 3,
    "The UK is a launch member of the network."),
  e("instrument", "intl-network-aisi", "coordinates", "country", "EUU", 3,
    "The European Commission participates in the network."),
  e("instrument", "intl-network-aisi", "coordinates", "country", "CAN", 3,
    "Canada is a launch member of the network."),
  e("instrument", "intl-network-aisi", "coordinates", "country", "JPN", 3,
    "Japan is a launch member of the network."),
  e("instrument", "intl-network-aisi", "coordinates", "country", "KOR", 3,
    "South Korea is a launch member of the network."),
  e("instrument", "intl-network-aisi", "coordinates", "country", "SGP", 3,
    "Singapore is a launch member of the network."),
  e("instrument", "intl-network-aisi", "coordinates", "country", "AUS", 3,
    "Australia is a launch member of the network."),
  e("instrument", "intl-network-aisi", "coordinates", "country", "FRA", 3,
    "France is a launch member of the network."),
  e("instrument", "intl-network-aisi", "coordinates", "country", "KEN", 3,
    "Kenya is a launch member of the network."),

  // ===== Infrastructure constraints =====
  e("infrastructure", "us-bis-export-controls", "constrains", "infrastructure", "advanced-ai-chips", 5,
    "BIS rules directly constrain the international flow of advanced AI chips."),
  e("infrastructure", "advanced-ai-chips", "constrains", "infrastructure", "hyperscale-cloud", 4,
    "Cloud scale for frontier AI depends on access to scarce advanced accelerators."),
];

// ===== Frontier Model Forum membership =====
const FMF_MEMBERS = FRONTIER_LABS.filter((l) => l.isFMFMember);
for (const lab of FMF_MEMBERS) {
  seeds.push(
    e(
      "lab",
      lab.id,
      "participates_in",
      "instrument",
      "frontier-model-forum",
      3,
      `${lab.name} is a member of the Frontier Model Forum.`
    )
  );
}

// ===== Seoul Frontier AI Safety Commitments company signatories represented as labs =====
const SEOUL_COMMITMENT_LAB_IDS = [
  "amazon",
  "anthropic",
  "cohere",
  "google-deepmind",
  "meta",
  "microsoft",
  "mistral",
  "openai",
  "xai",
];
for (const labId of SEOUL_COMMITMENT_LAB_IDS) {
  const lab = FRONTIER_LABS.find((item) => item.id === labId);
  if (!lab) continue;
  seeds.push(
    e(
      "lab",
      lab.id,
      "participates_in",
      "instrument",
      "seoul-frontier-ai-safety-commitments",
      3,
      `${lab.name} is listed on the official GOV.UK Frontier AI Safety Commitments page or represented through the listed parent company.`
    )
  );
}

// ===== EU AI Act regulates frontier labs serving the EU market =====
const EU_FACING_LAB_IDS = ["openai", "anthropic", "google-deepmind", "meta", "microsoft", "amazon", "xai", "mistral", "cohere"];
for (const labId of EU_FACING_LAB_IDS) {
  const strength = labId === "mistral" ? 5 : 4;
  seeds.push(
    e(
      "national_rule",
      "eu-ai-act-regional",
      "regulates",
      "lab",
      labId,
      strength,
      labId === "mistral"
        ? "Mistral is directly exposed to the EU AI Act as a major European model provider."
        : "EU-facing offerings of this lab are subject to the AI Act's GPAI and system rules."
    )
  );
}

// ===== China CAC rules regulate Chinese labs =====
const CN_LAB_IDS = ["deepseek", "baidu", "alibaba", "tencent"];
for (const labId of CN_LAB_IDS) {
  const strength = labId === "deepseek" ? 4 : 5;
  seeds.push(
    e(
      "national_rule",
      "cn-genai-interim-measures",
      "regulates",
      "lab",
      labId,
      strength,
      "Public-facing services of this lab in China are governed by China's GenAI rule stack."
    )
  );
}

// ===== Labs depend on advanced AI chips =====
for (const lab of FRONTIER_LABS) {
  const strength = lab.powerScore >= 5 ? 5 : 4;
  seeds.push(
    e(
      "lab",
      lab.id,
      "depends_on",
      "infrastructure",
      "advanced-ai-chips",
      strength,
      `${lab.name}'s frontier model development depends on access to advanced AI chips.`
    )
  );
}

// ===== Labs depend on hyperscale cloud (most do; vertically integrated ones less) =====
const CLOUD_INTEGRATED = new Set(["microsoft", "amazon", "google-deepmind", "alibaba", "tencent"]);
for (const lab of FRONTIER_LABS) {
  if (CLOUD_INTEGRATED.has(lab.id)) continue;
  seeds.push(
    e(
      "lab",
      lab.id,
      "depends_on",
      "infrastructure",
      "hyperscale-cloud",
      4,
      `${lab.name} depends on third-party hyperscale cloud for training and inference scale.`
    )
  );
}

// ===== AI Safety Institutes coordinate evaluations with labs =====
// (US CAISI, UK AISI, Japan AISI, Singapore AISI, Canadian AISI)
const AISI_RULES = ["us-caisi", "uk-ai-security-institute", "jp-aisi", "sg-ai-verify", "ca-aisi"];
const US_FACING_LABS = ["openai", "anthropic", "google-deepmind", "meta", "microsoft", "amazon", "xai"];
for (const labId of US_FACING_LABS) {
  seeds.push(
    e(
      "national_rule",
      "us-caisi",
      "coordinates",
      "lab",
      labId,
      3,
      "U.S. CAISI conducts pre-deployment and post-deployment safety evaluations of this lab's frontier models."
    )
  );
  seeds.push(
    e(
      "national_rule",
      "uk-ai-security-institute",
      "coordinates",
      "lab",
      labId,
      3,
      "UK AISI conducts independent safety evaluations of this lab's frontier models."
    )
  );
}
// suppress unused-aisi-rules linter
void AISI_RULES;

// ===== ISO/IEC standards influence the EU AI Act compliance environment =====
seeds.push(
  e("instrument", "iso-iec-42001-2023", "influences", "national_rule", "eu-ai-act-regional", 3,
    "ISO/IEC 42001 AI management systems shape the compliance environment around the EU AI Act."),
  e("instrument", "iso-iec-23894-2023", "influences", "national_rule", "eu-ai-act-regional", 3,
    "ISO/IEC 23894 AI risk-management guidance is used as a baseline alongside the EU AI Act."),
  e("instrument", "cen-cenelec-ai-act-standards", "influences", "national_rule", "eu-ai-act-regional", 4,
    "CEN-CENELEC harmonized-standardization work operationalizes conformity paths under the EU AI Act."),
  e("instrument", "iso-iec-42001-2023", "influences", "instrument", "cen-cenelec-ai-act-standards", 3,
    "CEN-CENELEC JTC 21 collaborates with ISO/IEC and adapts international AI standards where appropriate."),
  e("instrument", "iso-iec-23894-2023", "influences", "instrument", "cen-cenelec-ai-act-standards", 3,
    "International AI risk-management standards inform the European harmonized-standardization workstream."),
  e("instrument", "iso-iec-42005-2025", "influences", "instrument", "cen-cenelec-ai-act-standards", 2,
    "AI impact-assessment standards are part of the broader standards ecosystem relevant to AI Act implementation."),
  e("national_rule", "us-nist-ai-rmf", "influences", "country", "USA", 4,
    "NIST AI RMF anchors the U.S. standards-based approach to AI risk management."),
  e("instrument", "nist-genai-profile", "influences", "national_rule", "us-nist-ai-rmf", 4,
    "The NIST Generative AI Profile is a companion resource to AI RMF 1.0 for generative-AI risk management.")
);

// Cleanup: dedupe by id
const seen = new Set<string>();
export const DEPENDENCY_EDGES: GraphEdge[] = seeds.filter((edge) => {
  if (seen.has(edge.id)) return false;
  seen.add(edge.id);
  return true;
});

export const EDGES_BY_NODE: Record<string, { outgoing: GraphEdge[]; incoming: GraphEdge[] }> =
  DEPENDENCY_EDGES.reduce(
    (acc, edge) => {
      const src = (acc[edge.sourceId] ??= { outgoing: [], incoming: [] });
      const tgt = (acc[edge.targetId] ??= { outgoing: [], incoming: [] });
      src.outgoing.push(edge);
      tgt.incoming.push(edge);
      return acc;
    },
    {} as Record<string, { outgoing: GraphEdge[]; incoming: GraphEdge[] }>
  );
