# Dataset Release Package - May 2026

## Release Identity

- Release label: `2026.05`
- Dataset snapshot date: 2026-05-19
- App release maintenance date: 2026-05-29
- Public app: https://global-ai-governance-map.vercel.app/
- Repository: https://github.com/Bekhzod-Alikhanov/global-ai-governance-map

## Export

Use the in-app Data menu to download the static JSON snapshot:

- File name pattern: `global-ai-governance-map-2026-05-19.json`
- Schema version: `2026.05`
- Schema id: `https://global-ai-governance-map.vercel.app/dataset.schema.json`

The export is a static research snapshot. It is not updated at download time and does not fetch live legal-status changes from external sources.

## Citation

```text
Global AI Governance Map dataset, snapshot 2026-05-19.
Coverage: frontier-AI governance actors, instruments, national AI-specific rules, participation rows, labs, infrastructure, and dependency links.
Use with source verification. This dataset is a research aid and is not legal advice.
Repository: https://github.com/Bekhzod-Alikhanov/global-ai-governance-map
Live app: https://global-ai-governance-map.vercel.app/
```

## Verification Package

- Current source-audit status: `docs/SOURCE_AUDIT_CURRENT.md`
- Strong legal-effect source pass: `docs/SOURCE_VERIFICATION_2026-05-28.md`
- Medium source-verification sprint: `docs/SOURCE_VERIFICATION_2026-05-29.md`
- Data governance and methodology: `docs/DATA_GOVERNANCE.md`
- Editorial workflow: `docs/EDITORIAL_WORKFLOW.md`

## Known Caveats

- This is not legal advice.
- The public snapshot date is 2026-05-19; later legal or treaty changes need a new release or explicit post-snapshot note.
- Proposed laws are not in force.
- Signed treaty status is not ratification.
- EU AI Act applicability is not the same as separate national enactment.
- ISO/IEC and CEN-CENELEC records are standards or standardization infrastructure, not national laws by themselves.
- Company commitments and lab safety frameworks are non-state governance signals, not state law.
- Manual link-check exceptions are documented for official sites that reject scripted checks.

## Release Checklist

- `npm run audit:sources`
- `npm run audit:source-links`
- `npm run audit:data-review`
- `npm run validate:data`
- `npm run validate:export`
- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run test:e2e`

## Change Summary

- Source metadata backlog cleared for high- and medium-priority records.
- Strong legal-effect records require verified official sources.
- Remaining automated source-link failures are tracked as manual exceptions rather than public warnings.
- CI keeps metadata checks blocking and source-link checks warning-only.
