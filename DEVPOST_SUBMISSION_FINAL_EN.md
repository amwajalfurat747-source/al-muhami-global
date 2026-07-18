# Devpost Submission — Final English Copy

Replace every bracketed placeholder and remove this instruction before submission.

## Project title

Al-Muhami Global — From Jurisdiction to Precedent

## One-line pitch

A multilingual ChatGPT App that connects a legal provision to its case path, compares materially similar final decisions, and guides users to decision-compatible procedural remedies and safe pleading checklists.

## Category

Work & Productivity

## Inspiration

Legal research is fragmented across countries, languages, statutes, and court levels. A lawyer may find a provision in one source, a trial judgment elsewhere, and a cassation or correction decision as an isolated document. Even when two final outcomes appear inconsistent, the difference may come from one material fact, a different version of the law, a different procedural stage, or a later correction decision.

I designed Al-Muhami Global around a simple question: what if a researcher could move from country to code, article, case, and every linked court stage in one explainable path?

## What it does

Al-Muhami Global works inside ChatGPT in English, Arabic, French, and Spanish, including full right-to-left Arabic. A user can choose a country and legal instrument, open an available sourced provision, review cases linked to that article, or begin with a court and legal topic. The app reconstructs linked trial, appeal, cassation, correction, or review stages where the jurisdiction and verified data support them.

Its comparison engine checks legal issue, material facts, cited provisions, governing-law version, procedural stage, and correction relationships. It classifies the result conservatively as consistent, distinguishable, corrected or superseded, requiring the full text, or a potential jurisprudential divergence. It never converts a similarity score into a legal holding.

The procedural assistant starts with the civil or criminal track and the exact decision type. It then shows only compatible challenge routes, standing questions, exclusions, filing authority, legal basis, deadline warnings, and a structured pleading checklist. It never invents facts, evidence, dates, signatures, citations, or filing status.

The MVP exposes Iraq, France, and Egypt. Iraq is the working legal and procedural demonstration; France and Egypt demonstrate the global catalog architecture and are explicitly labeled as pilots rather than complete national databases.

The featured journey opens article 305 of Iraqi Civil Procedure Law No. 83 of 1969 and traces a fully anonymized synthetic cross-border heirship example. It keeps three issues separate: Iraqi court competence under Civil Procedure article 305, inheritance choice of law under Civil Code article 22, and conditional recognition under Riyadh Agreement articles 25 and 30. The app does not fabricate a missing appeal or correction decision.

## How I built it

I defined the product problem, legal workflows, global filters, featured example, procedural-remedy scope, and safety rules. I decided that official text must remain in its original language; missing content must be disclosed rather than generated; demonstration parties and identifiers must be fictional; and each country must have its own legal taxonomy.

I used Codex to translate those decisions into a Node.js ChatGPT App built with the OpenAI Apps SDK and Model Context Protocol. Codex accelerated the MCP schemas, multilingual interface, legal and procedural data models, deterministic comparison engine, automated tests, deployment configuration, and documentation. I reviewed the output, corrected the legal scope, selected the product behavior, tested the workflows, and approve the final result.

GPT-5.6 in ChatGPT is the conversational orchestration layer. It interprets the user's question, selects the relevant read-only MCP tools, and explains their structured output. Deterministic code controls retrieval, filters, procedural links, and safety classifications. The server does not ask a model to generate legal authorities.

## Technical implementation

- Eleven read-only MCP tools for catalogs, article lookup, court/case search, procedural routes, filing checklists, case tracing, decision comparison, divergence research, and provenance.
- A responsive HTML/CSS/JavaScript widget with four interface languages and Arabic RTL support.
- Country-aware legal-instrument, article, court, case, decision, remedy, and template models.
- Deterministic Arabic normalization, cascading filters, case graphs, comparison features, and conservative result labels.
- Node.js 20, Zod validation, OpenAI Apps SDK, and Model Context Protocol.
- Twenty-nine automated tests covering the legal engine, UI structure, HTTP routes, and MCP calls end to end.
- Dockerfile and Render blueprint for repeatable deployment.

## Challenges

The hardest challenge was creating global infrastructure without flattening distinct legal systems. Court names, remedies, amendment histories, publication practices, and the meaning of procedural stages vary by country. A second challenge was preventing multilingual convenience from making an unverified translation appear authoritative. A third was distinguishing genuinely opposite final outcomes from decisions that differ because of a material fact or later correction.

I addressed these challenges with jurisdiction-owned taxonomies, original-language fields, provenance and completeness labels, explicit procedural relationships, and conservative comparison classifications.

## Accomplishments

- A working multilingual ChatGPT App rather than a static mockup.
- Country → law → article → case and court → topic → case-path workflows.
- Twelve Iraqi civil/criminal remedy routes and fourteen filing checklists.
- Compatible-route filtering that deliberately excludes a generic criminal appeal.
- Linked trial, appeal, cassation, and correction stages.
- Explainable potential-divergence detection with evidence limits.
- Clear separation of published sources, catalog-only records, and synthetic demonstrations.
- Twenty-nine passing automated tests and repeatable deployment files.

## Potential impact

Al-Muhami Global can reduce the time needed to orient legal research, make procedural relationships visible, and expose why two outcomes may differ. Its largest impact is not replacing professional judgment; it is giving researchers an auditable path from source to provision, fact, case, and final stage while making gaps explicit. The same architecture can support new countries only after their sources, versions, courts, and validation rules pass a jurisdiction-specific quality gate.

## What I learned

Global legal AI should share infrastructure, not assumptions. Trust comes from preserving the chain between source, article, fact, case, procedural stage, and confidence—and from saying “not in the verified corpus” instead of generating a plausible answer.

## What's next

Next steps are a complete versioned Iraqi corpus, authenticated judicial decisions, Légifrance integration, a verified Egyptian consolidation pipeline, page-level citations, OCR confidence, amendment timelines, redaction controls, human review, and a source-verified deadline engine. Production use would also require authentication, encryption, retention controls, audit logs, and jurisdiction-specific privacy review.

## Testing instructions

Use the live standalone demo or clone the repository. Local setup requires Node.js 20 or newer:

```bash
npm ci
npm run check
npm test
npm start
```

All twenty-nine tests should pass. Open `/demo`, then follow the five test journeys in `JUDGES_GUIDE.md`. No account, API key, paid service, or real legal data is required.

## Build Week development statement

The working MVP and the material functionality described here were built or meaningfully extended during 13–21 July 2026. Evidence includes dated repository commits, the release archive, automated tests, the public demo video, and Codex Session ID `[CODEX_SESSION_ID]`. Any earlier work, if applicable, will be identified separately rather than presented as new Build Week work.

## Links

- Live MCP endpoint: `https://al-muhami-global.onrender.com/mcp`
- Standalone demo: `https://al-muhami-global.onrender.com/demo`
- Privacy and data provenance: `https://al-muhami-global.onrender.com/privacy`
- Source repository: `https://github.com/amwajalfurat747-source/al-muhami-global`
- Public YouTube demo with audio: `[YOUTUBE_URL]`
- Codex `/feedback` Session ID: `[CODEX_SESSION_ID]`

## Entrant, ownership, and licensing

- Entrant: HAITHAM AHMED ALBATTAT
- Team name, if any: `[TEAM NAME OR SOLO]`
- Contact: amwajalfurat747@gmail.com
- Original software: MIT License.
- Third-party legal texts, court publications, databases, translations, names, and trademarks remain subject to their own rights and terms.
- All `DEMO` cases, names, dates, and identifiers are fictional or altered and cannot be cited as authority.

## Final accuracy check

Before submission, confirm that every claim above is true for the submitted build, that the final recorded ChatGPT conversation actually uses GPT-5.6, and that no bracketed placeholder remains.
