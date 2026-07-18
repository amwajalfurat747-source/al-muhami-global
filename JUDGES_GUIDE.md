# Al-Muhami Global — Judge Testing Guide

## Submission links

Replace these placeholders before submitting:

- Live ChatGPT App MCP endpoint: `[HTTPS_URL]/mcp`
- Standalone demo: `[HTTPS_URL]/demo`
- Public source repository: `https://github.com/amwajalfurat747-source/al-muhami-global`
- Public YouTube demo with audio: `[YOUTUBE_URL]`
- Primary Codex `/feedback` Session ID: `[CODEX_SESSION_ID]`

## What is working

Al-Muhami Global is a multilingual ChatGPT App and deterministic legal-research prototype. The current release provides eleven read-only MCP tools, a responsive standalone demo, four interface languages, three jurisdiction filters, an Iraqi working corpus, twelve civil/criminal procedural routes, fourteen filing checklists, case-path tracing, and conservative comparison of potentially divergent final decisions.

No account, OpenAI API key, real client data, or paid service is required for local testing.

## Local setup

Requirements: Node.js 20 or newer.

```bash
npm ci
npm run check
npm test
npm start
```

Expected result: twenty-nine tests pass. Open:

- `http://localhost:8787/demo` — interactive standalone demo
- `http://localhost:8787/healthz` — server health
- `http://localhost:8787/privacy` — privacy notice
- `http://localhost:8787/mcp` — MCP endpoint

## Five-minute test path

### 1. Verified article and linked case

Prompt:

```text
In Arabic, select Iraq and open article 305 of Civil Procedure Law No. 83 of 1969. Trace its anonymized cross-border heirship example.
```

Expected behavior:

- The app resolves article 305 within the selected Iraqi Civil Procedure Law, not the Civil Code.
- It preserves the Arabic legal text and shows source/provenance information.
- It labels the case and decisions as synthetic.
- It separates court competence under article 305, choice of law under Civil Code article 22, and conditional recognition under Riyadh Agreement articles 25 and 30.
- It does not invent an appeal or correction stage for this example.

### 2. Decision-specific procedural route

Prompt:

```text
Select Iraq, civil proceedings, and a judgment affecting a non-party. Show the compatible challenge route and its filing checklist.
```

Expected behavior: the app offers third-party objection with eligibility questions, exclusions, filing authority, legal basis, deadline warning, and a structured checklist. It does not insert client facts or calculate a guaranteed deadline.

Then switch to the criminal track. A generic criminal appeal must not appear merely because the user asked for “appeal”; the user must select a supported criminal decision and route.

### 3. Court-first case path

Prompt:

```text
Show Iraqi Court of First Instance cases about dissolution of co-ownership and trace DEMO-CO-A through every stage.
```

Expected behavior: the app displays linked trial, appeal, cassation, and correction stages. Every record remains visibly synthetic and non-citable.

### 4. Conservative divergence analysis

Prompt:

```text
Compare DEMO-CO-A/CORRECTION with DEMO-CO-B/CASSATION. Are the final outcomes potentially divergent on materially similar facts?
```

Expected behavior: the app compares issue, facts, provisions, legal version, stage, and correction relationships. It may flag a *potential* divergence with evidence limits; it must not present a similarity score as binding precedent.

### 5. Global architecture

Prompt:

```text
Switch the interface to French, select France, and open article 6 of the Code civil.
```

Expected behavior: interface labels switch language, while the legal provision remains in verified original French. France is labeled as a catalog pilot, not a complete national corpus.

## Known limitations

- Iraq is the working legal and procedural demonstration; France and Egypt are catalog pilots.
- Synthetic `DEMO` records exist only to demonstrate linking and comparison behavior.
- The app is not legal advice, a deadline calculator, a confidential case-management system, or a court-filing service.
- It does not automatically translate official legal text.
- Professional use requires complete official sources, applicable versions, current amendments, authenticated decisions, and qualified local review.

## Architecture and model boundary

GPT-5.6 in ChatGPT interprets the request and orchestrates the MCP tools. Deterministic application code retrieves stored records, applies filters, links procedural stages, and computes explainable comparison features. The server does not use a model to fabricate authorities.

The entrant defined the product problem, legal workflows, global taxonomy, examples, and safety boundaries. Codex accelerated code, interface, test, and documentation implementation. See the README section **How the entrant collaborated with Codex and GPT-5.6** for the detailed division of work.
