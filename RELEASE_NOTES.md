# Al-Muhami Global 0.4.0 — Build Week Candidate

Release date: 18 July 2026

## Release purpose

This is the OpenAI Build Week submission candidate. It packages the working multilingual ChatGPT App, the Iraqi legal and procedural pilot, automated tests, deployment configuration, and the English/Arabic submission materials.

## Included product capabilities

- Eleven read-only MCP tools.
- Four interface languages: English, Arabic, French, and Spanish.
- Iraq working pilot plus France and Egypt catalog pilots.
- Article-first, court-first, full case-path, and decision-comparison workflows.
- Twelve Iraqi civil/criminal procedural routes and fourteen filing checklists.
- Correct Iraqi Civil Procedure Law article 305 example with fictional parties.
- Conservative potential-divergence analysis that accounts for correction relationships and missing full text.
- Standalone demo, privacy notice, source/provenance rules, Dockerfile, and Render blueprint.
- Exact-origin browser policy: wildcard CORS and cross-origin MCP session-header exposure were removed; untrusted browser origins receive HTTP 403.
- Public Render deployment: `https://al-muhami-global.onrender.com`.

## Verification

The release passed:

```text
npm run check
npm test
29 tests, 29 passed, 0 failed
```

The tests cover legal-engine behavior, article and corpus gaps, route compatibility, pleading safeguards, case tracing, divergence classification, multilingual widget structure, HTTP routes, and MCP calls.

The public deployment was also verified by loading the multilingual catalog, the privacy notice, and the Iraqi Civil Procedure article 305 journey with its clearly labeled synthetic case and decisions.

## Submission artifacts

- `DEVPOST_SUBMISSION_FINAL_EN.md`
- `DEMO_SCRIPT.md`
- `JUDGES_GUIDE.md`
- `BUILD_WEEK_READINESS_AR.md`
- `README.md`
- `DATA_PROVENANCE.md`
- `PRIVACY.md`
- `LICENSE`

## Required before public submission

1. Replace the remaining team, video, and Codex Session ID placeholders.
2. Connect `https://al-muhami-global.onrender.com/mcp` to ChatGPT and verify the final build in GPT-5.6.
3. Record and publish the English demo video under three minutes.
4. Run `/feedback` in the qualifying primary Codex build session and add the Session ID.
5. Submit the complete Devpost entry before the official deadline.
