# Current Source Audit

Generated from the 2026-05-29 source-trust maintenance pass.

## Summary

| Check | Result |
| --- | ---: |
| Records with `sourceUrl` | 151 |
| Metadata warnings | 0 |
| Link warnings after manual exceptions | 0 |
| Manual link-check exceptions used | 12 |
| Link environment warnings in restricted local runs | 1 |
| Data-review high-priority items | 0 |
| Data-review medium-priority items | 0 |
| Strong legal-effect records needing review | 0 |

## Commands

```bash
npm run audit:sources
npm run audit:source-links
npm run audit:data-review
```

## Manual Link-Check Exceptions

These official or issuer-controlled URLs are retained as source links but are tracked in
`src/data/sourceLinkManualChecks.json` because automated `HEAD`/`GET` checks fail or time out while
manual review supports the source relationship.

| Record ID | Source host | Manual status | Last checked | Reason |
| --- | --- | --- | --- | --- |
| `cen-cenelec-ai-act-standards` | `www.cencenelec.eu` | `manual_ok` | 2026-05-29 | Official page rejects or fails scripted checks. |
| `kr-ai-basic-act` | `www.msit.go.kr` | `manual_ok` | 2026-05-29 | Official page rejects or fails scripted checks. |
| `jp-ai-guidelines-business` | `www.meti.go.jp` | `manual_ok` | 2026-05-29 | Official page intermittently aborts scripted checks. |
| `au-voluntary-standard` | `www.industry.gov.au` | `manual_ok` | 2026-05-29 | Official page intermittently aborts scripted checks. |
| `au-proposed-mandatory-guardrails` | `www.industry.gov.au` | `manual_ok` | 2026-05-29 | Official page intermittently aborts scripted checks. |
| `kz-ai-law-2025` | `adilet.zan.kz` | `manual_ok` | 2026-05-29 | Official legal portal rejects or fails scripted checks. |
| `cr-bill-23919-responsible-ai` | `www.asamblea.go.cr` | `manual_ok` | 2026-05-29 | Official legislative page rejects or fails scripted checks. |
| `mx-federal-ai-law-proposed` | `sil.gobernacion.gob.mx` | `manual_ok` | 2026-05-29 | Official SIL page is session-sensitive. |
| `ke-national-ai-strategy-2025` | `www.ict.go.ke` | `manual_ok` | 2026-05-29 | Official page rejects or fails scripted checks. |
| `om-national-ai-policy-2025` | `www.ita.gov.om` | `manual_ok` | 2026-05-29 | Official PDF rejects or fails scripted checks. |
| `sa-sdaia-ai-strategy` | `sdaia.gov.sa` | `manual_ok` | 2026-05-29 | Official page rejects or fails scripted checks. |
| `gh-national-ai-strategy-2025` | `moc.gov.gh` | `manual_ok` | 2026-05-29 | Official page rejects or fails scripted checks. |

## Maintenance Rule

- Metadata warnings are blocking for CI.
- Link warnings are warning-only unless a maintainer explicitly uses `--fail-on-link-warnings`.
- Manual exceptions should be refreshed when the linked record is reverified or before the next public snapshot release.
- If most external URLs fail at once with network or timeout errors, the script reports a link-environment warning instead of treating every source as broken.
