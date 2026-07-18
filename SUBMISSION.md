# OpenAI Build Week — Detailed Submission Reference

The canonical field-ready version is [DEVPOST_SUBMISSION_FINAL_EN.md](DEVPOST_SUBMISSION_FINAL_EN.md). This longer draft is retained as reference. Verify the current competition rules and replace every bracketed placeholder before submission.

## Project title

Al-Muhami Global — From jurisdiction to precedent

## One-line description

A multilingual ChatGPT App that connects law to cases and precedents, then guides users from a civil or criminal decision to a compatible remedy and safe pleading checklist.

## Track

Work & Productivity

## Inspiration

Legal research is fragmented by country, language, source, and procedural stage. A lawyer may find a statute in one database, a trial judgment elsewhere, and an appellate or cassation decision as an isolated document. It is difficult to know which decisions belong to the same case and whether two opposite outcomes truly conflict or turn on a different fact, legal version, or correction decision.

Al-Muhami Global was inspired by a simple research question: what if a lawyer could move from country to code, from article to case, and from case to every court decision in one explainable path?

## What it does

The app works inside ChatGPT in English, Arabic, French, and Spanish. A user first selects a country, then a legal code and article, or a court and case topic. Al-Muhami returns the verified article text available in the corpus, preserves its original language, links every related case, and reconstructs the path from trial through appeal and cassation to any correction or review stage recognized by that jurisdiction.

The comparison engine then finds materially similar final decisions with different outcomes. It checks legal issue, key facts, cited provisions, law version, procedural stage, and correction relationships. It labels the result as consistent, distinguishable, corrected or superseded, requiring the full text, or a potential jurisprudential divergence. It never declares an automatic binding conflict.

The MVP includes country filters for Iraq, France, and Egypt. Iraq has the working case-path demonstration. France and Egypt demonstrate the jurisdiction and catalog architecture while complete official corpora remain a roadmap item.

The new procedural assistant asks for the civil or criminal track and exact judgment or decision before showing a route. The Iraqi civil pilot covers default objection, appeal, retrial, cassation, cassation correction, third-party objection, and the specific grievance against an order on a petition. The criminal pilot covers default objection, penal-order objection, cassation, correction, and retrial, while deliberately excluding a generic criminal appeal label. Every route explains standing, exclusions, filing authority, legal basis, deadline risk, and opens a structured pleading checklist.

The featured Iraqi journey opens article 305 of Civil Procedure Law No. 83 of 1969 and follows a fully anonymized synthetic cross-border heirship dispute. It keeps court competence under article 305, the inheritance choice-of-law rule in Civil Code article 22, and conditional recognition under Riyadh Agreement articles 25 and 30 as separate research layers. No unverified appeal or correction stage is invented.

## How we built it

We used Codex to build and test a Node.js ChatGPT App with the OpenAI Apps SDK and Model Context Protocol. Eleven read-only MCP tools power a responsive multilingual widget with right-to-left Arabic support.

GPT-5.6 in ChatGPT acts as the conversational orchestration layer: it interprets a request, chooses the correct country-aware tool, and explains structured results. Deterministic application code controls Arabic normalization, country and court filters, article retrieval, procedural graphs, similarity features, and conservative safety labels. The server does not ask a language model to generate legal citations.

The data layer separates three statuses: catalog-only legal instruments, published source references, and synthetic demonstration paths. Legal text is never silently translated. Missing article text produces a disclosed corpus gap rather than a hallucinated provision.

## Challenges

- Every jurisdiction has different court names, appeal structures, publication practices, and amendment histories.
- Legal article numbers are meaningless without the selected country, instrument, and effective version.
- Opposite outcomes may be explained by one material fact or a later correction decision.
- Multilingual interfaces must not imply that an unverified machine translation is official legal text.
- Complete court-path data is rarely published as one machine-readable chain.

We addressed these problems with jurisdiction-specific taxonomies, original-language text fields, provenance and completeness flags, explicit procedural relationships, and conservative comparison classifications.

## Accomplishments

- A working multilingual ChatGPT App with English, Arabic, French, and Spanish UI.
- Cascading filters for country, law, article, court, topic, and procedural stage.
- Civil/criminal remedy filters that hide incompatible challenge routes.
- Initial civil-claim and criminal-complaint checklists plus a route-specific template for every encoded remedy.
- Article-to-case and case-to-decision links.
- Trial, appeal, cassation, and correction timelines.
- Explainable potential-divergence detection.
- Three country pilots without pretending that every catalog is complete.
- End-to-end automated tests across the UI structure, HTTP routes, legal engine, and MCP calls.

## What we learned

Global legal AI should share infrastructure, not flatten legal systems. Each country needs its own sources, version rules, court hierarchy, terminology, and validation gate. Trust comes from preserving the chain between source, article, fact, case, procedural stage, and confidence—not from generating the longest answer.

## What's next

We will complete the official Iraqi corpus, connect versioned French legislation and case-law sources, and establish a verified consolidation pipeline for Egypt. Production work will add a source-verified deadline engine, filing-authority and fee rules, document versioning, page-level citations, OCR confidence, amendment timelines, redaction, human review, and auditable procedural links. New countries will be added only through jurisdiction-specific quality gates.

## Technologies

- OpenAI Apps SDK
- Model Context Protocol
- GPT-5.6 in ChatGPT
- Codex
- Node.js
- Zod
- HTML, CSS, and JavaScript

## Links to add

- ChatGPT App MCP endpoint: `[HTTPS_URL]/mcp`
- Standalone global demo: `[HTTPS_URL]/demo`
- Source repository: `https://github.com/amwajalfurat747-source/al-muhami-global`
- Public YouTube demo with audio: `[YOUTUBE_URL]`

## Final checklist

- [ ] Deploy to a stable public HTTPS endpoint.
- [ ] Connect `/mcp` in ChatGPT Developer mode.
- [ ] Run the final demo in a new GPT-5.6 conversation.
- [ ] Show the language and country filters in the recording.
- [ ] Show one verified article, one disclosed corpus gap, and one full case path.
- [ ] Keep synthetic labels visible when demonstrating removal of co-ownership.
- [ ] Record a public YouTube video with audio under the current time limit.
- [ ] Make the repository public or share it with the judging accounts in the current rules.
- [ ] Type `/feedback` in the primary Codex build thread and include the Session ID.
- [ ] Submit before the current Devpost deadline.
