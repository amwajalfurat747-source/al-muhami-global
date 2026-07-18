# Global Data Provenance and Integrity Policy

Al-Muhami Global separates catalog metadata, published references, verified legal text, translations, and synthetic demonstration records. A country appearing in a filter does not mean its legal corpus is complete.

## Jurisdiction status

### Iraq — working demonstration

Primary reference:

- Iraqi Legal Database, Iraqi Supreme Judicial Council: <https://iraqld.hjc.iq/>
- Civil Procedure Law No. 83 of 1969, government-hosted PDF: <https://services.gov.krd/sites/default/files/uploaded-laws/%D9%82%D8%A7%D9%86%D9%88%D9%86%20%D8%A7%D9%84%D9%85%D8%B1%D8%A7%D9%81%D8%B9%D8%A7%D8%AA%20%D8%A7%D9%84%D9%85%D8%AF%D9%86%D9%8A%D8%A9.pdf>
- Iraqi Civil Code No. 40 of 1951, government-hosted PDF: <https://tasjeel.mot.gov.iq/newtasjeel/%D9%82%D9%88%D8%A7%D9%86%D9%8A%D9%86%20%D8%A7%D9%84%D9%85%D8%B3%D8%A7%D9%87%D9%85%D8%A9/%D8%A7%D9%84%D9%82%D8%A7%D9%86%D9%88%D9%86%20%D8%A7%D9%84%D9%85%D8%AF%D9%86%D9%8A%2040%20%D9%84%D8%B3%D9%86%D8%A9%201951.pdf>

Published judicial commentary:

- Supreme Judicial Council commentary on 179/ت-ح/2010: <https://www.sjc.iq/view.1126/>
- Supreme Judicial Council discussion of Civil Code article 22: <https://www.sjc.iq/view.69958/>

Accessible text mirrors used as secondary checking aids:

- Real Estate Registration Law No. 43 of 1971: <https://www.iraqilaws.com/2024/04/43-1971.html>
- Iraqi Civil Code No. 40 of 1951: <https://mohamyeh.com/2010/07/04/%D8%A7%D9%84%D9%82%D8%A7%D9%86%D9%88%D9%86-%D8%A7%D9%84%D9%85%D8%AF%D9%86%D9%8A-%D8%A7%D9%84%D8%B9%D8%B1%D8%A7%D9%82%D9%8A-%D8%B1%D9%82%D9%85-40-%D9%84%D8%B3%D9%86%D8%A9-1951/>
- Iraqi Criminal Procedure Law No. 23 of 1971: <https://wiki.dorar-aliraq.net/iraqilaws/law/4895.html>

The MVP embeds Civil Code articles 22 and 1106, Civil Procedure Law article 305, and Real Estate Registration Law articles 3(2), 4, and 189. It indexes three published decision references from official commentary. The cross-border heirship path, the two complete removal-of-co-ownership paths, and the earlier inheritance-registration paths are synthetic demonstrations.

The procedural-route layer uses the government-hosted Civil Procedure PDF for article 168 and the detailed remedy chapters, including articles 153, 177–230. The criminal route taxonomy uses the accessible text of Book Four of Criminal Procedure Law No. 23 of 1971, including articles 243–279, and must be checked against the official Iraqi Legal Database and current amendments before professional use. Route records are concise research summaries, not substitutes for the full provisions.

Deadline labels are warnings, not a calculator. Even where the source states a number of days, the product requires verification of the triggering event, service, amendment history, special statutes, interruption, extension, and current court practice.

Riyadh Agreement references:

- Government treaty publication: <https://www.lloc.gov.bh/Legislation/HTM/L4199>
- Regional judicial institute PDF: <https://www.carjj.org/news/file/3192/%D8%A7%D8%AA%D9%81%D8%A7%D9%82%D9%8A%D8%A9-%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6-%D9%84%D9%84%D8%AA%D8%B9%D8%A7%D9%88%D9%86-%D8%A7%D9%84%D9%82%D8%B6%D8%A7%D8%A6%D9%8A>

The MVP embeds articles 25 and 30 for the recognition workflow. Their presence does not prove that the agreement governs a particular dispute: contracting-party status, ratification, entry into force, reservations, judgment status, jurisdiction, and the relevant date must be verified.

### France — catalog pilot

Official legislation source:

- Légifrance, French Civil Code: <https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006070721/>

Official judicial portal:

- French Court of Cassation: <https://www.courdecassation.fr/>

The MVP embeds a short official-language example from Civil Code article 6 and links to its Légifrance article page. French judicial decisions have not yet been ingested.

### Egypt — catalog pilot

Official government entry point:

- Egyptian Ministry of Justice: <https://moj.gov.eg/>

The MVP lists core Egyptian law families as catalog metadata only. It does not claim to contain complete consolidated texts or case-law paths. Each instrument must be connected to a verified official or authorized source before article display.

## Article-number integrity

An article number must always be resolved using:

```text
country + instrument identifier + version/effective date + article number
```

The same number can mean unrelated provisions in different instruments. If the selected instrument does not contain the requested article in the verified corpus, the app returns `found: false` and lists available embedded articles. It must never generate a plausible-looking substitute.

In this project, the featured article 305 is correctly resolved as Iraqi Civil Procedure Law No. 83 of 1969 article 305. Iraqi Civil Code article 22 and Riyadh Agreement articles 25 and 30 are separate linked authorities. An article number is never inferred without the selected instrument.

## Translation integrity

- Every article stores an original language.
- A translated interface does not translate legal text automatically.
- A translation must have its own language, source, author or publisher, date, and verification status.
- The original and translation must remain separately viewable.
- Machine-generated working translations, if added later, must be labeled non-authoritative.

## Synthetic records

Identifiers or display numbers beginning with `DEMO` are fictional. They exist only to demonstrate procedural linking and comparison behavior. Synthetic courts include words such as “افتراضية” or “Synthetic”. They must never be cited as authority or attributed to a real court.

The removal-of-co-ownership demonstration intentionally omits a specific statutory article instead of fabricating one. It tests:

- trial, appeal, cassation, and correction links;
- separate cases with similar facts and opposite final outcomes; and
- conservative potential-divergence classification.

The cross-border heirship demonstration uses the fictional parties **Salim Nasser**, **Layla Nasser**, **Amal Fouad**, and Amal's fictional children **Noor, Saif, and Ruba**. Every name, case number, and date is fictional or altered. Its foreign record, Personal Status Court decision, and cassation decision are synthetic. The missing appeal and correction stages remain missing; the product does not manufacture them.

## Rules enforced by the product

1. Select jurisdiction before interpreting an article number.
2. Never invent a law, article, decision, court, translation, or source.
3. Preserve original-language legal text.
4. Expose catalog-only, published, incomplete, and synthetic status.
5. Treat a secondary citation as a reference, not a complete judgment.
6. Require the full official text and applicable version for professional use.
7. Do not count a corrected decision as an independent conflicting precedent.
8. Call a result a potential divergence only after checking material facts and procedure.
9. Hide a remedy when the selected case track and decision type are incompatible.
10. Do not relabel Iraqi criminal cassation as a generic appeal.
11. Treat grievance against an order on a petition as a specific article 153 route, not a universal challenge.
12. Never auto-complete a pleading with invented client facts, evidence, dates, signatures, or filing status.

## Production ingestion requirements

Each source document should receive a stable identifier, checksum, retrieval date, publisher, jurisdiction, effective period, rights basis, OCR confidence, page-level alignment, human verification status, and audit trail. Each court decision should also include court, chamber, case number, date, stage, redaction status, cited provisions, prior and subsequent procedural links, and source completeness.
