import { describe, expect, it } from "vitest";
import {
  buildEvidenceDossier,
  evidenceDossierFilename,
  renderEvidenceDossierMarkdown,
} from "./evidenceDossier";
import { DATA_SNAPSHOT_DATE } from "./governanceTaxonomy";

describe("evidence dossiers", () => {
  it("builds a country dossier with status counts, caveats, sources, and snapshot date", () => {
    const dossier = buildEvidenceDossier("country", "USA", "https://example.test/?country=USA");

    expect(dossier).not.toBeNull();
    expect(dossier?.snapshotDate).toBe(DATA_SNAPSHOT_DATE);
    expect(dossier?.metrics.map((metric) => metric.label)).toContain("Confirmed binding AI-specific rules");
    expect(dossier?.sections.some((section) => section.title === "International participation")).toBe(true);
    expect(dossier?.caveats.join(" ")).toContain("research aggregation");
    expect(dossier?.sources.length).toBeGreaterThan(0);
  });

  it("builds a lab dossier with exposure groups and non-binding caveats", () => {
    const dossier = buildEvidenceDossier("lab", "openai", "https://example.test/?lab=openai");
    const markdown = renderEvidenceDossierMarkdown(dossier!);

    expect(dossier).not.toBeNull();
    expect(markdown).toContain("Regulatory exposure");
    expect(markdown).toContain("Voluntary");
    expect(markdown).toContain("Infrastructure constraint");
    expect(markdown).toContain("should not be read as binding public-law duties");
    expect(markdown).toContain("not AI-specific legal obligations");
  });

  it("builds an instrument dossier with participation and legal-effect caveats", () => {
    const dossier = buildEvidenceDossier("instrument", "coe-ai-convention", "https://example.test/?inst=coe-ai-convention");
    const markdown = renderEvidenceDossierMarkdown(dossier!);

    expect(dossier).not.toBeNull();
    expect(markdown).toContain("Legal effect");
    expect(markdown).toContain("Participation pattern");
    expect(markdown).toContain("Signature is not the same as ratification");
    expect(markdown).toContain("Council of Europe");
  });

  it("renders Markdown with source URLs and legal-advice caveat", () => {
    const dossier = buildEvidenceDossier("instrument", "iso-iec-42001-2023", "https://example.test/");
    const markdown = renderEvidenceDossierMarkdown(dossier!);

    expect(markdown).toContain("# ISO/IEC 42001:2023");
    expect(markdown).toContain("not legal advice");
    expect(markdown).toContain("https://www.iso.org/standard/81230.html");
    expect(evidenceDossierFilename(dossier!)).toBe(
      "global-ai-governance-map-instrument-iso-iec-42001-2023-evidence-dossier.md"
    );
  });
});
