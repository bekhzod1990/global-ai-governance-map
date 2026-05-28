import { describe, expect, it } from "vitest";
import { extractSourceRecordsFromText } from "./audit-sources.mjs";

describe("source audit extraction", () => {
  it("uses nested source metadata without losing the parent id", () => {
    const records = extractSourceRecordsFromText(`
const LAB_SOURCE_METADATA = {
  sourceKind: "official",
  verificationStatus: "likely_correct",
  confidence: "medium",
  lastVerified: "2026-05-20",
} as const;

export const FRONTIER_LABS = [{
  id: "example-lab",
  name: "Example Lab",
  ...LAB_SOURCE_METADATA,
  safetyFramework: {
    name: "Safety Framework",
    maturity: "published",
    ...LAB_SOURCE_METADATA,
    sourceName: "Example source",
    sourceUrl: "https://example.gov/safety",
  },
  sourceName: "Example lab source",
  sourceUrl: "https://example.gov/lab",
}];
`);

    expect(records).toEqual([
      expect.objectContaining({
        id: "example-lab.safetyFramework",
        lastVerified: "2026-05-20",
      }),
      expect.objectContaining({
        id: "example-lab",
        lastVerified: "2026-05-20",
      }),
    ]);
  });

  it("labels generated participation-row sources by instrument and participation type", () => {
    const records = extractSourceRecordsFromText(`
rows.push(
  ...makeRows("prior-instrument", [EU], "member"),
  ...makeRows("coe-ai-convention", COE_SIGNATORIES, "signed", {
    sourceName: "Treaty Office",
    sourceUrl: "https://www.coe.int/example",
    sourceKind: "official",
    verificationStatus: "verified",
    confidence: "high",
    lastVerified: "2026-05-27",
  })
);
`);

    expect(records).toEqual([
      expect.objectContaining({
        id: "coe-ai-convention::generated::signed",
        lastVerified: "2026-05-27",
      }),
    ]);
  });
});
