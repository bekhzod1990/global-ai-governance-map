import type { WalkthroughStep } from "../types";

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: "step-1-who-builds",
    title: "Who actually builds frontier AI?",
    narrative:
      "Frontier models exist because a small set of companies decide what to train, how to evaluate it, and whether to release it. Their internal safety frameworks — Preparedness Framework, Responsible Scaling Policy, Frontier Safety Framework, and peers — operate before any government can respond. Look for the labs clustered over the U.S. and China.",
    lens: "geography",
    filterPatch: {
      selectedLabIds: [
        "openai",
        "anthropic",
        "google-deepmind",
        "meta",
        "microsoft",
        "amazon",
        "xai",
        "mistral",
        "cohere",
        "deepseek",
        "baidu",
        "alibaba",
        "tencent",
      ],
    },
    highlightNodeIds: [
      "openai",
      "anthropic",
      "google-deepmind",
      "deepseek",
      "alibaba",
    ],
  },
  {
    id: "step-2-who-can-stop",
    title: "Who can actually stop them?",
    narrative:
      "Three hard levers dominate today: the EU AI Act (market access for one of the largest economies), the U.S. BIS export controls (upstream control over the chips frontier training needs), and China's CAC rule stack (mandatory filing, content rules, and labelling for public GenAI services). Filter the map to these three to see why three jurisdictions carry so much weight.",
    lens: "geography",
    filterPatch: {
      selectedInstrumentIds: ["eu-ai-act"],
      selectedBindingStatuses: ["binding_regulation"],
    },
    highlightNodeIds: ["eu-ai-act-regional", "cn-genai-interim-measures", "us-bis-export-controls"],
  },
  {
    id: "step-3-who-coordinates",
    title: "Who coordinates internationally?",
    narrative:
      "OECD AI Principles, G7 Hiroshima Process, the AI Safety Summit chain (Bletchley → Seoul → Paris), the Council of Europe Convention, and the UN's emerging AI panel set the common vocabulary. They rarely override national authority — but they synchronise expectations on testing, reporting, and severe-risk thresholds.",
    lens: "geography",
    filterPatch: {
      selectedInstrumentIds: [
        "bletchley-declaration",
        "seoul-declaration",
        "paris-statement-2025",
        "oecd-ai-principles",
        "coe-ai-convention",
      ],
      instrumentMatchMode: "OR",
    },
  },
  {
    id: "step-4-evaluations",
    title: "How do evaluations and standards shape lab behaviour?",
    narrative:
      "NIST AI RMF, ISO/IEC 42001/23894, and the AI Safety Institutes (UK AISI, U.S. CAISI, Japan AISI, Singapore AISI, Canadian AISI, Korean AISI) plus the International Network for Advanced AI Measurement build the technical language: capability evaluations, severe-risk thresholds, incident reporting, and red-teaming methodology. This layer turns principles into auditable practice.",
    lens: "network",
    filterPatch: {
      selectedOrganizations: ["ISO/IEC", "AI Safety Summit"],
    },
  },
  {
    id: "step-5-compute",
    title: "Why compute, chips, and cloud are governance too",
    narrative:
      "Frontier training requires accelerators (NVIDIA H100/B200, AMD MI300, Google TPU), datacentre power, and hyperscale cloud. Whoever controls fabrication, exports, and capacity allocation governs frontier AI as decisively as any AI-specific statute. The Network lens makes the constraint visible: every lab edge eventually terminates at chips and cloud.",
    lens: "network",
    highlightNodeIds: ["advanced-ai-chips", "hyperscale-cloud", "us-bis-export-controls"],
  },
];
