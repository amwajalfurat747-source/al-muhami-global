import test from "node:test";
import assert from "node:assert/strict";
import {
  browseCourtCases,
  compareDecisions,
  findPotentialDivergence,
  getCatalog,
  getFilingTemplate,
  getJurisdictions,
  getLawArticle,
  getLegalSource,
  getProceduralRoutes,
  normalizeArabic,
  searchLegalMaterials,
  traceCase
} from "../lib/legal-engine.js";

test("normalizes Arabic variants for search", () => {
  assert.equal(normalizeArabic("الإرثيّة"), "الارثيه");
  assert.equal(normalizeArabic("إستئناف"), "استيناف");
});

test("catalog exposes the Iraqi laws and transparent corpus counts", () => {
  const catalog = getCatalog();
  assert.ok(catalog.laws.length >= 10);
  assert.ok(catalog.stats.embeddedArticles >= 8);
  assert.ok(catalog.stats.publishedDecisionReferences >= 3);
  assert.ok(catalog.stats.syntheticDemoDecisions >= 9);
});

test("global jurisdiction browser exposes multilingual country filters", () => {
  const result = getJurisdictions({ language: "fr" });
  assert.deepEqual(result.countries.map((country) => country.code), ["IQ", "FR", "EG"]);
  assert.equal(result.countries.find((country) => country.code === "EG").name, "Égypte");
  assert.ok(result.languages.some((language) => language.code === "ar"));
});

test("country catalogs are isolated and expose only verified embedded article numbers", () => {
  const france = getCatalog({ countryCode: "FR", language: "en" });
  assert.ok(france.laws.some((law) => law.id === "fr-civil-code"));
  assert.equal(france.laws.some((law) => law.id.startsWith("irq-")), false);
  assert.deepEqual(france.laws.find((law) => law.id === "fr-civil-code").articles.map((article) => article.number), ["6"]);
});

test("article drill-down links text to related cases and reports corpus gaps", () => {
  const article = getLawArticle({ lawId: "irq-real-estate-registration-43-1971", articleNumber: "189", language: "ar" });
  assert.equal(article.found, true);
  assert.ok(article.relatedDecisions.length >= 1);
  assert.equal(article.article.displayedLanguage, "ar");

  const procedureArticle = getLawArticle({ lawId: "irq-civil-procedure-83-1969", articleNumber: "305", language: "ar" });
  assert.equal(procedureArticle.found, true);
  assert.match(procedureArticle.article.text, /إقامة المتوفى الدائمي/);
  assert.ok(procedureArticle.relatedCases.some((caseItem) => caseItem.id === "case-demo-cross-border-heirship-305"));
  assert.equal(procedureArticle.provenance.verificationStatus, "source-checked");
  assert.equal(procedureArticle.provenance.verificationTier, "official-copy");
  assert.equal(procedureArticle.provenance.consolidationStatus, "amendments-not-fully-consolidated");
  assert.ok(procedureArticle.provenance.primarySources.some((source) => source.id === "src-iraqi-civil-procedure-gov-pdf"));
  assert.ok(procedureArticle.relatedDecisions.some((decision) => decision.id === "dec-cassation-jurisdiction-78-2007"));
  assert.equal(procedureArticle.relatedAuthorities.length, 3);

  const wrongCivilInstrument = getLawArticle({ lawId: "irq-civil-code-40-1951", articleNumber: "305", language: "ar" });
  assert.equal(wrongCivilInstrument.found, false);
  assert.ok(wrongCivilInstrument.availableArticles.includes("22"));

  const missing = getLawArticle({ lawId: "irq-personal-status-188-1959", articleNumber: "305", language: "en" });
  assert.equal(missing.found, false);
  assert.deepEqual(missing.availableArticles, []);
});

test("cross-border heirship demo separates jurisdiction, choice of law, and recognition", () => {
  const result = traceCase("case-demo-cross-border-heirship-305");
  assert.deepEqual(result.timeline.map((item) => item.stageCode), ["foreign-record", "trial", "cassation"]);
  assert.equal(result.currentDecisionId, "demo-heirship-cassation");
  assert.match(result.notice, /الأسماء والأرقام والتواريخ افتراضية أو معدّلة/);
  assert.match(result.case.parties.claimant, /سالم ناصر/);
  assert.ok(result.relatedArticles.some((article) => article.lawId === "irq-civil-procedure-83-1969" && article.articleNumber === "305"));
  assert.ok(result.relatedArticles.some((article) => article.lawId === "irq-civil-code-40-1951" && article.articleNumber === "22"));
  assert.ok(result.relatedArticles.some((article) => article.lawId === "regional-riyadh-agreement-1983" && article.articleNumber === "25"));
  assert.equal(result.timeline.some((item) => item.stageCode === "appeal" || item.stageCode === "correction"), false);
});

test("Riyadh Agreement recognition limits are navigable as separate provisions", () => {
  const recognition = getLawArticle({ lawId: "regional-riyadh-agreement-1983", articleNumber: "25", language: "ar" });
  const refusal = getLawArticle({ lawId: "regional-riyadh-agreement-1983", articleNumber: "30", language: "ar" });
  assert.equal(recognition.found, true);
  assert.match(recognition.article.text, /يعترف كل من الأطراف المتعاقدة/);
  assert.equal(refusal.found, true);
  assert.match(refusal.article.text, /يرفض الاعتراف/);
});

test("court and topic filters expose co-ownership procedural paths", () => {
  const result = browseCourtCases({ countryCode: "IQ", topic: "coownership-dissolution", includeSynthetic: true });
  assert.equal(result.totalMatches, 8);
  assert.ok(result.cases.every((caseItem) => caseItem.timelineStages.some((stage) => stage.stageCode === "cassation")));
  assert.ok(result.cases.some((caseItem) => caseItem.timelineStages.some((stage) => stage.stageCode === "correction")));

  const official = browseCourtCases({
    countryCode: "IQ",
    topic: "coownership-dissolution",
    includeSynthetic: false
  });
  assert.equal(official.totalMatches, 6);
  assert.ok(official.cases.every((caseItem) => caseItem.isSynthetic === false));
  assert.ok(official.cases.every((caseItem) => caseItem.timelineStages.some((stage) => stage.stageCode === "cassation")));
});

test("co-ownership final decisions can be flagged as a potential divergence", () => {
  const result = compareDecisions(["demo-co-a-correction", "demo-co-b-cassation"]);
  assert.equal(result.comparisons[0].classification, "potential-divergence");
  assert.ok(result.comparisons[0].similarity >= 0.72);
});

test("finds article 189 by natural Arabic query", () => {
  const result = searchLegalMaterials({ query: "المادة 189 التسجيل العقاري", limit: 20 });
  assert.ok(result.results.some((item) => item.id === "irq-real-estate-registration-43-1971:189"));
});

test("can exclude synthetic demo decisions from legal search", () => {
  const result = searchLegalMaterials({
    query: "الإرث والتسجيل العقاري",
    includeSynthetic: false,
    limit: 30
  });
  assert.ok(result.results.some((item) => item.id === "dec-qadisiyah-179-2010"));
  assert.equal(result.results.some((item) => item.isSynthetic), false);
});

test("traces a case through trial, appeal, cassation, and correction", () => {
  const result = traceCase("case-demo-unregistered-heir-a");
  assert.equal(result.timeline.length, 4);
  assert.deepEqual(result.timeline.map((item) => item.stage), [
    "بداءة",
    "استئناف",
    "تمييز",
    "تصحيح القرار التمييزي"
  ]);
  assert.equal(result.currentDecisionId, "demo-a-correction");
});

test("flags opposite outcomes on materially similar facts as potential divergence", () => {
  const result = compareDecisions(["demo-a-correction", "demo-b-cassation"]);
  const comparison = result.comparisons[0];
  assert.equal(comparison.classification, "potential-divergence");
  assert.ok(comparison.similarity >= 0.72);
  assert.ok(comparison.reasons.some((reason) => reason.includes("محتمل") || reason.includes("متقاربة")));
});

test("treats a different registration status as a material distinction", () => {
  const result = compareDecisions(["demo-a-correction", "demo-c-appeal"]);
  const comparison = result.comparisons[0];
  assert.equal(comparison.classification, "distinguishable");
  assert.ok(comparison.materialDifferences.some((difference) => difference.label === "حالة التسجيل"));
});

test("does not call a correction relationship an independent conflict", () => {
  const result = compareDecisions(["demo-a-cassation", "demo-a-correction"]);
  assert.equal(result.comparisons[0].classification, "superseded-or-corrected");
});

test("published summaries require full text before a confident conflict finding", () => {
  const result = compareDecisions(["dec-qadisiyah-179-2010", "dec-federal-1386-2006"]);
  assert.equal(result.comparisons[0].classification, "needs-full-text");
});

test("divergence finder returns the featured demo pair", () => {
  const result = findPotentialDivergence({
    query: "الحجز على الحصة الإرثية غير المسجلة",
    includeSynthetic: true,
    limit: 12
  });
  assert.ok(result.pairs.some((pair) => {
    const ids = pair.decisionSummaries.map((item) => item.id);
    return ids.includes("demo-a-correction") && ids.includes("demo-b-cassation");
  }));
});

test("source lookup preserves verification links and demo labels", () => {
  const published = getLegalSource("dec-qadisiyah-179-2010");
  assert.equal(published.type, "decision");
  assert.match(published.item.sourceUrl, /^https:\/\//);
  assert.equal(published.item.isSynthetic, false);

  const demo = getLegalSource("demo-a-trial");
  assert.equal(demo.item.isSynthetic, true);
  assert.equal(demo.item.sourceQuality, "synthetic-demo");

  const procedureArticle = getLegalSource("irq-civil-procedure-83-1969:305", { language: "ar" });
  assert.equal(procedureArticle.item.provenance.verificationStatus, "source-checked");
  assert.ok(procedureArticle.item.provenance.primarySources.some((source) => source.id === "src-iraqi-civil-procedure-gov-pdf"));
});

test("official article 305 materials preserve publication type and original-image status", () => {
  const decision = getLegalSource("dec-cassation-jurisdiction-78-2007");
  assert.equal(decision.type, "decision");
  assert.equal(decision.item.publicationType, "judgment");
  assert.equal(decision.item.verification, "verified-official-text");
  const originalImage = decision.item.documentAssets.find((asset) => asset.isOriginalDecisionImage);
  assert.equal(originalImage.availability, "not-published");
  assert.ok(decision.item.sources.some((source) => source.url === "https://www.sjc.iq/qview.719/"));

  const authority = getLegalSource("authority-sjc-108-2023");
  assert.equal(authority.type, "authority");
  assert.equal(authority.item.publicationType, "judicial-guidance");
  assert.equal(authority.item.verification, "official-guidance");
  assert.ok(authority.item.documentAssets.every((asset) => asset.isOriginalDecisionImage === false));

  const coownershipDecision = getLegalSource("dec-coownership-constructions-18-2026");
  assert.equal(coownershipDecision.type, "decision");
  assert.equal(coownershipDecision.item.isSynthetic, false);
  assert.equal(coownershipDecision.item.verification, "verified-official-text");
  assert.ok(coownershipDecision.item.sources.some((source) => source.url === "https://www.sjc.iq/qview.3837/"));
});

test("search surfaces official judicial guidance separately from judgments", () => {
  const result = searchLegalMaterials({
    query: "التلاعب في القسامات الشرعية",
    countryCode: "IQ",
    limit: 20
  });
  const authority = result.results.find((item) => item.id === "authority-sjc-108-2023");
  assert.ok(authority);
  assert.equal(authority.type, "authority");
  assert.ok(authority.badges.includes("ليس حكماً قضائياً"));
});

test("registers lawyer Faiz Al-Hilli's page as a verified secondary commentary publisher", () => {
  const source = getLegalSource("src-faeez-office-facebook");
  assert.equal(source.type, "source");
  assert.equal(source.item.type, "secondary-legal-commentary-publisher");
  assert.equal(source.item.verificationStatus, "publisher-identity-verified");
  assert.equal(source.item.rightsPolicy, "link-and-cite-only-unless-reuse-permission");
  assert.equal(source.item.url, "https://www.facebook.com/faeezoffice/");
});

test("civil procedural filter exposes the six article 168 remedies and the separate grievance route", () => {
  const result = getProceduralRoutes({ countryCode: "IQ", trackId: "civil", language: "ar" });
  const methods = result.methods.map((method) => method.id);
  for (const method of ["default-objection", "appeal", "retrial", "cassation", "cassation-correction", "third-party-objection", "grievance"]) {
    assert.ok(methods.includes(method));
  }
  const grievance = result.routes.find((route) => route.methodId === "grievance");
  assert.ok(grievance.legalBasis.some((basis) => basis.articles.includes("151–153")));
  assert.match(grievance.deadline.label, /ثلاثة أيام/);
  assert.ok(grievance.exclusions.some((item) => item.includes("ليس تظلماً عاماً")));
});

test("third-party objection requires a non-party whose own right is affected", () => {
  const result = getProceduralRoutes({
    countryCode: "IQ",
    trackId: "civil",
    decisionKindId: "third-party-affected-judgment",
    methodId: "third-party-objection",
    language: "ar"
  });
  assert.deepEqual(result.routes.map((route) => route.id), ["iq-civil-third-party-objection"]);
  assert.ok(result.routes[0].eligibilityChecks.some((item) => item.includes("لم تكن خصماً")));
  assert.equal(result.routes[0].templateId, "tpl-iq-civil-third-party-objection");
});

test("criminal procedural filter does not invent an ordinary appeal route", () => {
  const result = getProceduralRoutes({ countryCode: "IQ", trackId: "criminal", language: "en" });
  assert.equal(result.methods.some((method) => method.id === "appeal"), false);
  assert.deepEqual(result.methods.map((method) => method.id), [
    "default-objection",
    "penal-order-objection",
    "cassation",
    "cassation-correction",
    "retrial"
  ]);
  const invalid = getProceduralRoutes({ countryCode: "IQ", trackId: "criminal", methodId: "appeal", language: "ar" });
  assert.equal(invalid.routes.length, 0);
  assert.match(invalid.notAvailableReason, /لا تُعرض.*استئنافاً/);
});

test("criminal retrial is constrained to final conviction and article 270 cases", () => {
  const result = getProceduralRoutes({
    countryCode: "IQ",
    trackId: "criminal",
    decisionKindId: "criminal-final-conviction",
    methodId: "retrial",
    language: "ar"
  });
  assert.equal(result.routes.length, 1);
  assert.ok(result.routes[0].legalBasis[0].articles.includes("270–279"));
  assert.match(result.routes[0].filingAuthority, /الادعاء العام/);
  assert.ok(result.routes[0].eligibilityChecks.some((item) => item.includes("المادة 270")));
});

test("filing templates provide sections and privacy boundaries without client facts", () => {
  const civil = getFilingTemplate({ templateId: "tpl-iq-civil-statement-of-claim", language: "ar" });
  assert.equal(civil.type, "initial-filing");
  assert.ok(civil.requiredSections.length >= 7);
  assert.match(civil.privacyNotice, /أسماء وبيانات افتراضية/);

  const criminal = getFilingTemplate({ templateId: "tpl-iq-criminal-retrial", language: "en" });
  assert.equal(criminal.route.id, "iq-criminal-retrial");
  assert.ok(criminal.validationQuestions.length >= 5);
  assert.match(criminal.draftPolicy, /does not invent facts/);
});
