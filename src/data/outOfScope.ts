import type { OutOfScopeItem } from "../types";

export const OUT_OF_SCOPE_ITEMS: OutOfScopeItem[] = [
  {
    id: "gdpr",
    name: "EU General Data Protection Regulation (GDPR)",
    reasonExcluded:
      "GDPR is a general data-protection regulation, not an AI-specific instrument. Its provisions affect AI systems but the law itself is not about AI governance.",
  },
  {
    id: "india-dpdp",
    name: "India Digital Personal Data Protection Act (DPDP)",
    reasonExcluded:
      "DPDP is a general data-protection statute. It is not an AI-specific instrument and is excluded from the main map data.",
  },
  {
    id: "us-bis-export-controls",
    name: "U.S. BIS export controls on advanced AI chips",
    reasonExcluded:
      "Export controls are powerful geopolitical levers but are not AI-governance instruments in the sense used here. They regulate trade in chips, not the development or deployment of AI systems.",
  },
  {
    id: "wassenaar",
    name: "Wassenaar Arrangement",
    reasonExcluded: "Multilateral export-control regime; not AI-specific.",
  },
  {
    id: "jp-nl-us-semiconductor-controls",
    name: "U.S.–Japan–Netherlands semiconductor export controls",
    reasonExcluded:
      "Trilateral arrangement focused on semiconductor manufacturing equipment, not AI governance.",
  },
  {
    id: "generic-cybersecurity-laws",
    name: "Generic national cybersecurity laws",
    reasonExcluded:
      "General cybersecurity statutes affect AI systems but are not AI-specific governance instruments.",
  },
  {
    id: "generic-digital-strategies",
    name: "Generic national digital strategies",
    reasonExcluded:
      "Broad digital strategies are excluded unless they include explicit AI governance provisions.",
  },
];
