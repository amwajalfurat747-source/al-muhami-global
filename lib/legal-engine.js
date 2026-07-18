import {
  cases,
  countries,
  decisions,
  languages,
  laws,
  projectMetadata,
  sources
} from "./global-data.js";
import {
  decisionKinds,
  filingTemplates,
  proceduralNotices,
  proceduralRoutes,
  proceduralText,
  proceduralTracks
} from "./procedural-routes.js";

const ARABIC_DIACRITICS = /[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g;

function safeLanguage(language = "en") {
  return languages.some((item) => item.code === language) ? language : "en";
}

function localizedValue(values = {}, language = "en", fallback = "") {
  const selected = safeLanguage(language);
  return values[selected] ?? values.en ?? values.ar ?? values.fr ?? values.es ?? fallback;
}

function countryForCode(countryCode) {
  return countries.find((item) => item.code === countryCode);
}

function codeForCountryName(countryName) {
  if (!countryName) return null;
  const normalized = normalizeArabic(countryName);
  return countries.find((country) =>
    Object.values(country.names).some((name) => normalizeArabic(name) === normalized)
  )?.code ?? null;
}

function localizedLaw(law, language = "en") {
  return {
    ...law,
    title: localizedValue(law.titles, language, law.title),
    titleOriginal: law.title,
    category: localizedValue(law.categories, language, law.category),
    countryName: localizedValue(countryForCode(law.countryCode)?.names, language, law.country)
  };
}

export function normalizeArabic(value = "") {
  return String(value)
    .toLowerCase()
    .replace(ARABIC_DIACRITICS, "")
    .replace(/ـ/g, "")
    .replace(/[إأآٱ]/g, "ا")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^\p{L}\p{N}/-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const queryExpansions = new Map([
  ["حجز", ["الحجز", "تنفيذي", "التنفيذ"]],
  ["الحجز", ["حجز", "تنفيذي", "التنفيذ"]],
  ["ارث", ["ميراث", "وارث", "وريث", "تركة", "ارثيه"]],
  ["ميراث", ["ارث", "وارث", "تركة", "ارثيه"]],
  ["عقار", ["عقاري", "عقاريه", "التسجيل"]],
  ["تمييز", ["تمييزي", "التمييز", "نقض"]],
  ["استيناف", ["الاستيناف", "استينافيه"]],
  ["اجانب", ["الاجنبي", "اقامه", "الاقامه"]],
  ["بداءه", ["البداءه", "محكمه"]],
  ["تناقض", ["تعارض", "اختلاف", "متناقضه"]],
  ["تعارض", ["تناقض", "اختلاف", "متعارضه"]]
]);

export function tokenize(value = "", { expand = false } = {}) {
  const tokens = normalizeArabic(value).split(" ").filter((token) => token.length > 1);
  if (!expand) return [...new Set(tokens)];
  const expanded = new Set(tokens);
  for (const token of tokens) {
    const additions = queryExpansions.get(token) ?? [];
    for (const addition of additions) expanded.add(normalizeArabic(addition));
  }
  return [...expanded];
}

function jaccard(left = [], right = []) {
  const a = new Set(left.map(normalizeArabic));
  const b = new Set(right.map(normalizeArabic));
  if (!a.size && !b.size) return 1;
  const intersection = [...a].filter((item) => b.has(item)).length;
  const union = new Set([...a, ...b]).size;
  return union ? intersection / union : 0;
}

function textScore(query, haystack) {
  const normalizedQuery = normalizeArabic(query);
  const normalizedHaystack = normalizeArabic(haystack);
  if (!normalizedQuery) return 0.2;
  const queryTokens = tokenize(query, { expand: true });
  const haystackTokens = new Set(tokenize(haystack));
  const matches = queryTokens.filter((token) =>
    [...haystackTokens].some((candidate) => candidate.includes(token) || token.includes(candidate))
  ).length;
  const base = queryTokens.length ? matches / queryTokens.length : 0;
  const phraseBonus = normalizedHaystack.includes(normalizedQuery) ? 0.35 : 0;
  return Math.min(1, base + phraseBonus);
}

function sourceFor(ids = []) {
  return ids.map((id) => sources.find((source) => source.id === id)).filter(Boolean);
}

function lawArticleFromRef(reference) {
  const separator = reference.lastIndexOf(":");
  if (separator === -1) return null;
  const lawId = reference.slice(0, separator);
  const articleNumber = reference.slice(separator + 1);
  const law = laws.find((item) => item.id === lawId);
  if (!law) return null;
  const article = law.articles.find((item) => item.number === articleNumber);
  return {
    lawId,
    lawTitle: law.title,
    lawNumber: law.number,
    lawYear: law.year,
    articleNumber,
    text: article?.text ?? "النص غير مضمن في النسخة التجريبية",
    verification: article?.verification ?? "راجع المصدر الرسمي والنسخة النافذة"
  };
}

function decisionSearchText(decision) {
  return [
    decision.displayNumber,
    decision.title,
    decision.court,
    decision.stage,
    decision.issue,
    decision.factSummary,
    decision.reasoningSummary,
    decision.outcome,
    decision.registrationStatus,
    ...decision.issueTags,
    ...decision.factTags,
    ...decision.lawArticles
  ].join(" ");
}

function lawSearchText(law) {
  return [
    law.title,
    ...Object.values(law.titles ?? {}),
    law.number,
    law.year,
    law.category,
    ...Object.values(law.categories ?? {}),
    law.status,
    ...law.articles.flatMap((article) => [article.number, article.text, ...Object.values(article.texts ?? {})])
  ].join(" ");
}

function caseSearchText(caseItem) {
  return [
    caseItem.title,
    caseItem.topic,
    caseItem.topicId,
    caseItem.courtType,
    caseItem.dataQuality,
    caseItem.privacyNotice,
    ...Object.values(caseItem.parties ?? {}),
    ...(caseItem.legalQuestions ?? [])
  ].join(" ");
}

function makeSnippet(value, max = 220) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function getCatalog({ country = "العراق", countryCode, category, language = "en" } = {}) {
  const selectedLanguage = safeLanguage(language);
  const selectedCountryCode = countryCode ?? codeForCountryName(country) ?? "IQ";
  const countryRecord = countryForCode(selectedCountryCode);
  const filteredLaws = laws.filter((law) => {
    if (selectedCountryCode && law.countryCode !== selectedCountryCode) return false;
    if (category) {
      const categories = [law.category, ...Object.values(law.categories ?? {})].map(normalizeArabic);
      if (!categories.includes(normalizeArabic(category))) return false;
    }
    return true;
  });
  return {
    country: localizedValue(countryRecord?.names, selectedLanguage, country),
    countryCode: selectedCountryCode,
    language: selectedLanguage,
    categories: [...new Set(filteredLaws.map((law) => localizedValue(law.categories, selectedLanguage, law.category)))].sort(),
    laws: filteredLaws.map((law) => ({
      id: law.id,
      title: localizedValue(law.titles, selectedLanguage, law.title),
      titleOriginal: law.title,
      number: law.number,
      year: law.year,
      category: localizedValue(law.categories, selectedLanguage, law.category),
      status: law.status,
      articleCount: law.articles.length,
      articles: law.articles.map((article) => ({
        number: article.number,
        originalLanguage: article.originalLanguage ?? law.originalLanguage,
        translationStatus: article.translationStatus ?? "unknown"
      })),
      sources: sourceFor(law.sourceIds)
    })),
    stats: {
      laws: filteredLaws.length,
      embeddedArticles: filteredLaws.reduce((sum, law) => sum + law.articles.length, 0),
      publishedDecisionReferences: decisions.filter((item) => item.countryCode === selectedCountryCode && !item.isSynthetic).length,
      syntheticDemoDecisions: decisions.filter((item) => item.countryCode === selectedCountryCode && item.isSynthetic).length
    }
  };
}

export function getJurisdictions({ language = "en" } = {}) {
  const selectedLanguage = safeLanguage(language);
  return {
    language: selectedLanguage,
    languages,
    countries: countries.map((country) => ({
      code: country.code,
      name: localizedValue(country.names, selectedLanguage, country.code),
      names: country.names,
      flag: country.flag,
      defaultLanguage: country.defaultLanguage,
      status: country.status,
      lawCount: laws.filter((law) => law.countryCode === country.code).length,
      embeddedArticleCount: laws
        .filter((law) => law.countryCode === country.code)
        .reduce((sum, law) => sum + law.articles.length, 0),
      caseCount: cases.filter((caseItem) => caseItem.countryCode === country.code).length,
      courtTypes: country.courtTypes.map((courtType) => ({
        id: courtType.id,
        name: localizedValue(courtType.names, selectedLanguage, courtType.id),
        names: courtType.names
      })),
      caseTopics: country.caseTopics.map((topic) => ({
        id: topic.id,
        name: localizedValue(topic.names, selectedLanguage, topic.id),
        names: topic.names
      }))
    })),
    notice: projectMetadata.corpusNotice
  };
}

export function getLawArticle({ lawId, articleNumber, countryCode, language = "en" } = {}) {
  const selectedLanguage = safeLanguage(language);
  const law = laws.find((item) => item.id === lawId && (!countryCode || item.countryCode === countryCode));
  if (!law) return null;
  const article = law.articles.find((item) => normalizeArabic(item.number) === normalizeArabic(articleNumber));
  if (!article) {
    return {
      found: false,
      law: localizedLaw(law, selectedLanguage),
      articleNumber,
      availableArticles: law.articles.map((item) => item.number),
      relatedCases: [],
      relatedDecisions: [],
      notice: "The requested article is not yet present in this pilot corpus. Connect and verify the official consolidated source before displaying its text."
    };
  }

  const articleRef = `${law.id}:${article.number}`;
  const relatedDecisions = decisions.filter((decision) => decision.lawArticles.includes(articleRef));
  const relatedCaseIds = [...new Set(relatedDecisions.map((decision) => decision.caseId).filter(Boolean))];
  const requestedText = article.texts?.[selectedLanguage];
  return {
    found: true,
    law: localizedLaw(law, selectedLanguage),
    article: {
      ...article,
      text: requestedText ?? article.text,
      displayedLanguage: requestedText ? selectedLanguage : article.originalLanguage ?? law.originalLanguage,
      requestedLanguage: selectedLanguage,
      translationAvailable: Boolean(requestedText),
      availableLanguages: Object.keys(article.texts ?? { [article.originalLanguage ?? law.originalLanguage]: article.text })
    },
    sources: sourceFor(law.sourceIds),
    relatedCases: relatedCaseIds
      .map((id) => cases.find((caseItem) => caseItem.id === id))
      .filter(Boolean)
      .map((caseItem) => ({
        id: caseItem.id,
        title: caseItem.title,
        topic: caseItem.topic,
        courtType: caseItem.courtType,
        isSynthetic: caseItem.isSynthetic,
        dataQuality: caseItem.dataQuality
      })),
    relatedDecisions: relatedDecisions.map((decision) => ({
      id: decision.id,
      caseId: decision.caseId,
      displayNumber: decision.displayNumber,
      court: decision.court,
      stage: decision.stage,
      stageCode: decision.stageCode,
      date: decision.date,
      factSummary: decision.factSummary,
      outcome: decision.outcome,
      isSynthetic: decision.isSynthetic,
      sourceUrl: decision.sourceUrl
    })),
    notice: projectMetadata.legalNotice
  };
}

export function browseCourtCases({
  countryCode = "IQ",
  courtType,
  topic,
  stage,
  lawId,
  articleNumber,
  includeSynthetic = true,
  limit = 20,
  language = "en"
} = {}) {
  const selectedLanguage = safeLanguage(language);
  const articleRef = lawId && articleNumber ? `${lawId}:${articleNumber}` : null;
  const matchingCases = [];

  for (const caseItem of cases) {
    if (caseItem.countryCode !== countryCode) continue;
    if (!includeSynthetic && caseItem.isSynthetic) continue;
    if (topic && caseItem.topicId !== topic && !normalizeArabic(caseItem.topic).includes(normalizeArabic(topic))) continue;

    const timeline = caseItem.decisionIds
      .map((id) => decisions.find((decision) => decision.id === id))
      .filter(Boolean)
      .sort((left, right) => left.stageOrder - right.stageOrder || left.date.localeCompare(right.date));

    const selectedDecisions = timeline.filter((decision) => {
      if (courtType && decision.courtTypeId !== courtType && !normalizeArabic(decision.court).includes(normalizeArabic(courtType))) return false;
      if (stage && decision.stageCode !== stage && normalizeArabic(decision.stage) !== normalizeArabic(stage)) return false;
      if (lawId && !decision.lawArticles.some((reference) => reference.startsWith(`${lawId}:`))) return false;
      if (articleRef && !decision.lawArticles.includes(articleRef)) return false;
      if (articleNumber && !lawId && !decision.lawArticles.some((reference) => reference.endsWith(`:${articleNumber}`))) return false;
      return true;
    });

    const hasDecisionFilters = Boolean(courtType || stage || lawId || articleNumber);
    if (hasDecisionFilters && !selectedDecisions.length) continue;
    matchingCases.push({
      id: caseItem.id,
      title: caseItem.title,
      topic: caseItem.topic,
      topicId: caseItem.topicId,
      courtType: caseItem.courtType,
      isSynthetic: caseItem.isSynthetic,
      dataQuality: caseItem.dataQuality,
      timelineStages: timeline.map((decision) => ({
        id: decision.id,
        stage: decision.stage,
        stageCode: decision.stageCode,
        court: decision.court,
        outcome: decision.outcome,
        isSynthetic: decision.isSynthetic
      })),
      matchedDecisionIds: (hasDecisionFilters ? selectedDecisions : timeline).map((decision) => decision.id)
    });
  }

  const safeLimit = Math.max(1, Math.min(Number(limit) || 20, 50));
  return {
    countryCode,
    country: localizedValue(countryForCode(countryCode)?.names, selectedLanguage, countryCode),
    language: selectedLanguage,
    filters: { courtType: courtType ?? null, topic: topic ?? null, stage: stage ?? null, lawId: lawId ?? null, articleNumber: articleNumber ?? null, includeSynthetic },
    cases: matchingCases.slice(0, safeLimit),
    totalMatches: matchingCases.length,
    notice: matchingCases.some((caseItem) => caseItem.isSynthetic)
      ? "Synthetic case paths are included and clearly labeled. They demonstrate the workflow and are not judicial authority."
      : projectMetadata.legalNotice
  };
}

export function searchLegalMaterials({
  query = "",
  countryCode,
  court,
  courtType,
  stage,
  lawId,
  articleNumber,
  topic,
  yearFrom,
  yearTo,
  includeSynthetic = true,
  limit = 12,
  language = "en"
} = {}) {
  const safeLimit = Math.max(1, Math.min(Number(limit) || 12, 30));
  const selectedLanguage = safeLanguage(language);
  const results = [];

  for (const law of laws) {
    if (countryCode && law.countryCode !== countryCode) continue;
    if (lawId && law.id !== lawId) continue;
    const score = textScore(query, lawSearchText(law));
    if (query && score < 0.18) continue;
    results.push({
      type: "law",
      id: law.id,
      countryCode: law.countryCode,
      title: localizedValue(law.titles, selectedLanguage, law.title),
      subtitle: `${localizedValue(law.categories, selectedLanguage, law.category)}${law.number ? ` — No. ${law.number} (${law.year})` : law.year ? ` — ${law.year}` : ""}`,
      snippet: makeSnippet(law.status),
      score,
      badges: [localizedValue(countryForCode(law.countryCode)?.names, selectedLanguage, law.country), localizedValue(law.categories, selectedLanguage, law.category), `${law.articles.length} embedded articles`],
      sourceUrl: sourceFor(law.sourceIds)[0]?.url ?? "",
      isSynthetic: false
    });
    for (const article of law.articles) {
      if (articleNumber && normalizeArabic(article.number) !== normalizeArabic(articleNumber)) continue;
      const articleScore = textScore(query, `${law.title} ${article.number} ${article.text}`);
      if (query && articleScore < 0.2) continue;
      results.push({
        type: "article",
        id: `${law.id}:${article.number}`,
        countryCode: law.countryCode,
        title: `Article ${article.number} — ${localizedValue(law.titles, selectedLanguage, law.title)}`,
        subtitle: `${localizedValue(law.categories, selectedLanguage, law.category)}${law.number ? ` — No. ${law.number} (${law.year})` : ""}`,
        snippet: makeSnippet(article.text),
        score: Math.min(1, articleScore + 0.08),
        badges: ["Legal text", article.originalLanguage === selectedLanguage ? "Original language" : `Original: ${article.originalLanguage ?? law.originalLanguage}`],
        sourceUrl: article.sourceUrl ?? sourceFor(law.sourceIds)[0]?.url ?? "",
        isSynthetic: false
      });
    }
  }

  for (const decision of decisions) {
    if (countryCode && decision.countryCode !== countryCode) continue;
    if (!includeSynthetic && decision.isSynthetic) continue;
    if (court && !normalizeArabic(decision.court).includes(normalizeArabic(court))) continue;
    if (courtType && decision.courtTypeId !== courtType && !normalizeArabic(decision.court).includes(normalizeArabic(courtType))) continue;
    if (stage && decision.stageCode !== stage && normalizeArabic(decision.stage) !== normalizeArabic(stage)) continue;
    if (lawId && !decision.lawArticles.some((ref) => ref.startsWith(`${lawId}:`))) continue;
    if (articleNumber && !decision.lawArticles.some((ref) => ref.endsWith(`:${articleNumber}`))) continue;
    if (topic) {
      const caseItem = cases.find((item) => item.id === decision.caseId);
      if (caseItem?.topicId !== topic && !normalizeArabic(caseItem?.topic ?? "").includes(normalizeArabic(topic))) continue;
    }
    if (yearFrom && decision.year < Number(yearFrom)) continue;
    if (yearTo && decision.year > Number(yearTo)) continue;
    const score = textScore(query, decisionSearchText(decision));
    if (query && score < 0.18) continue;
    results.push({
      type: "decision",
      id: decision.id,
      caseId: decision.caseId,
      countryCode: decision.countryCode,
      title: decision.title,
      subtitle: `${decision.court} — ${decision.displayNumber} — ${decision.date}`,
      snippet: makeSnippet(`${decision.factSummary} النتيجة: ${decision.outcome}`),
      score: Math.min(1, score + (decision.isSynthetic ? 0 : 0.05)),
      badges: [decision.stage, decision.isSynthetic ? "بيانات تجريبية" : "مرجع منشور", decision.factCompleteness === "low" ? "وقائع غير مكتملة" : "وقائع مكتملة"],
      sourceUrl: decision.sourceUrl,
      isSynthetic: decision.isSynthetic
    });
  }

  for (const caseItem of cases) {
    if (countryCode && caseItem.countryCode !== countryCode) continue;
    if (!includeSynthetic && caseItem.isSynthetic) continue;
    if (topic && caseItem.topicId !== topic && !normalizeArabic(caseItem.topic).includes(normalizeArabic(topic))) continue;
    if (courtType) {
      const matchingCourt = caseItem.decisionIds.some((id) => {
        const decision = decisions.find((item) => item.id === id);
        return decision?.courtTypeId === courtType || normalizeArabic(decision?.court ?? "").includes(normalizeArabic(courtType));
      });
      if (!matchingCourt) continue;
    }
    if (lawId || articleNumber || stage) {
      const matchingDecision = caseItem.decisionIds.some((id) => {
        const decision = decisions.find((item) => item.id === id);
        if (!decision) return false;
        if (lawId && !decision.lawArticles.some((ref) => ref.startsWith(`${lawId}:`))) return false;
        if (articleNumber && !decision.lawArticles.some((ref) => ref.endsWith(`:${articleNumber}`))) return false;
        if (stage && decision.stageCode !== stage && normalizeArabic(decision.stage) !== normalizeArabic(stage)) return false;
        return true;
      });
      if (!matchingDecision) continue;
    }
    const score = textScore(query, caseSearchText(caseItem));
    if (query && score < 0.18) continue;
    results.push({
      type: "case",
      id: caseItem.id,
      countryCode: caseItem.countryCode,
      title: caseItem.title,
      subtitle: `${caseItem.courtType} — ${caseItem.topic}`,
      snippet: makeSnippet(caseItem.dataQuality),
      score,
      badges: [caseItem.country, caseItem.isSynthetic ? "مسار تجريبي" : "مرجع منشور"],
      sourceUrl: "",
      isSynthetic: caseItem.isSynthetic
    });
  }

  results.sort((left, right) => right.score - left.score || left.title.localeCompare(right.title, "ar"));
  return {
    query,
    filters: { countryCode: countryCode ?? null, court: court ?? null, courtType: courtType ?? null, stage: stage ?? null, lawId: lawId ?? null, articleNumber: articleNumber ?? null, topic: topic ?? null, yearFrom: yearFrom ?? null, yearTo: yearTo ?? null, includeSynthetic, language: selectedLanguage },
    results: results.slice(0, safeLimit),
    totalMatches: results.length,
    notice: projectMetadata.legalNotice
  };
}

export function traceCase(caseId) {
  const caseItem = cases.find((item) => item.id === caseId);
  if (!caseItem) return null;
  const timeline = caseItem.decisionIds
    .map((id) => decisions.find((decision) => decision.id === id))
    .filter(Boolean)
    .sort((left, right) => left.stageOrder - right.stageOrder || left.date.localeCompare(right.date));
  const articleRefs = [...new Set(timeline.flatMap((decision) => decision.lawArticles))];
  return {
    case: caseItem,
    timeline: timeline.map((decision) => ({
      ...decision,
      sources: sourceFor(decision.sourceIds),
      articles: decision.lawArticles.map(lawArticleFromRef).filter(Boolean)
    })),
    relatedArticles: articleRefs.map(lawArticleFromRef).filter(Boolean),
    currentDecisionId: timeline.find((item) => item.corrects)?.id ?? timeline.at(-1)?.id ?? null,
    notice: caseItem.isSynthetic
      ? caseItem.privacyNotice ?? "هذا المسار افتراضي وموسوم لأغراض العرض والاختبار؛ لا يمثل أحكاماً قضائية حقيقية."
      : projectMetadata.legalNotice
  };
}

function outcomePolarity(code = "") {
  if (code.startsWith("allow")) return "allow";
  if (code.startsWith("deny") || code.startsWith("restrict")) return "deny";
  return code;
}

function describeDifference(label, left, right) {
  return { label, left: left ?? "غير محدد", right: right ?? "غير محدد" };
}

export function compareDecisionRecords(left, right) {
  if (!left || !right) return null;
  const issueSimilarity = jaccard(left.issueTags, right.issueTags);
  const factSimilarity = jaccard(left.factTags, right.factTags);
  const articleSimilarity = jaccard(left.lawArticles, right.lawArticles);
  const sameLawVersion = left.lawVersion === right.lawVersion ? 1 : 0;
  const sameStage = normalizeArabic(left.stage) === normalizeArabic(right.stage) ? 1 : 0;
  const similarity = Number((
    issueSimilarity * 0.34 +
    factSimilarity * 0.28 +
    articleSimilarity * 0.23 +
    sameLawVersion * 0.1 +
    sameStage * 0.05
  ).toFixed(2));

  const differences = [];
  if (left.registrationStatus !== right.registrationStatus) {
    differences.push(describeDifference("حالة التسجيل", left.registrationStatus, right.registrationStatus));
  }
  if (left.lawVersion !== right.lawVersion) {
    differences.push(describeDifference("نسخة القانون", left.lawVersion, right.lawVersion));
  }
  if (left.stage !== right.stage) {
    differences.push(describeDifference("مرحلة الطعن", left.stage, right.stage));
  }
  if (left.factCompleteness !== right.factCompleteness) {
    differences.push(describeDifference("اكتمال الوقائع", left.factCompleteness, right.factCompleteness));
  }
  if (left.isSynthetic !== right.isSynthetic) {
    differences.push(describeDifference("نوع البيانات", left.isSynthetic ? "تجريبية" : "منشورة", right.isSynthetic ? "تجريبية" : "منشورة"));
  }

  const relatedByCorrection = left.correctedBy === right.id || right.correctedBy === left.id || left.corrects === right.id || right.corrects === left.id;
  const leftPolarity = outcomePolarity(left.outcomeCode);
  const rightPolarity = outcomePolarity(right.outcomeCode);
  const oppositeOutcome = (leftPolarity === "allow" && rightPolarity === "deny") || (leftPolarity === "deny" && rightPolarity === "allow");
  const hasMaterialRegistrationDifference = left.registrationStatus !== right.registrationStatus;
  const lowEvidence = left.factCompleteness === "low" || right.factCompleteness === "low";

  let classification;
  let label;
  let confidence;
  const reasons = [];

  if (relatedByCorrection) {
    classification = "superseded-or-corrected";
    label = "قرار مصحح أو متجاوز إجرائياً";
    confidence = "مرتفعة";
    reasons.push("القراران مرتبطان بعلاقة تصحيح صريحة، فلا يعامل اختلافهما كتعارض مستقل.");
  } else if (lowEvidence && !left.isSynthetic && !right.isSynthetic) {
    classification = "needs-full-text";
    label = "يحتاج النص الكامل قبل تقرير الاختلاف";
    confidence = "منخفضة";
    reasons.push("وقائع أحد القرارين أو كليهما غير مكتملة في المصدر المتاح.");
  } else if (!oppositeOutcome) {
    classification = "consistent";
    label = "اتجاه متقارب أو متسق";
    confidence = similarity >= 0.7 ? "مرتفعة" : "متوسطة";
    reasons.push("النتيجة القانونية العامة متقاربة بين القرارين.");
  } else if (hasMaterialRegistrationDifference || left.lawVersion !== right.lawVersion) {
    classification = "distinguishable";
    label = "اختلاف مبرر بواقعة أو نص مختلف";
    confidence = "مرتفعة";
    if (hasMaterialRegistrationDifference) reasons.push("حالة تسجيل الحق العقاري مختلفة، وهي واقعة جوهرية في تطبيق المادة 189.");
    if (left.lawVersion !== right.lawVersion) reasons.push("القراران لا يطبقان النسخة القانونية نفسها.");
  } else if (similarity >= 0.72) {
    classification = "potential-divergence";
    label = "اختلاف قضائي محتمل";
    confidence = similarity >= 0.85 ? "مرتفعة" : "متوسطة";
    reasons.push("الوقائع والمسألة القانونية والنصوص المستند إليها متقاربة، بينما النتيجة مختلفة.");
    reasons.push("يلزم فحص النص الكامل والدفوع والإجراءات قبل وصفه بالتعارض القطعي.");
  } else {
    classification = "distinguishable";
    label = "قرارات متقاربة مع فروق تحتاج تحليلاً",
    confidence = "متوسطة";
    reasons.push("النتيجة مختلفة، لكن درجة تشابه الوقائع أو المسألة لا تكفي لاعتبارها تعارضاً محتملاً بثقة.");
  }

  return {
    classification,
    label,
    confidence,
    similarity,
    scores: {
      issueSimilarity: Number(issueSimilarity.toFixed(2)),
      factSimilarity: Number(factSimilarity.toFixed(2)),
      articleSimilarity: Number(articleSimilarity.toFixed(2))
    },
    reasons,
    materialDifferences: differences,
    sharedArticles: left.lawArticles.filter((article) => right.lawArticles.includes(article)).map(lawArticleFromRef).filter(Boolean),
    decisionSummaries: [left, right].map((decision) => ({
      id: decision.id,
      displayNumber: decision.displayNumber,
      court: decision.court,
      date: decision.date,
      stage: decision.stage,
      issue: decision.issue,
      factSummary: decision.factSummary,
      reasoningSummary: decision.reasoningSummary,
      outcome: decision.outcome,
      registrationStatus: decision.registrationStatus,
      isSynthetic: decision.isSynthetic,
      sourceUrl: decision.sourceUrl,
      sourceQuality: decision.sourceQuality
    })),
    warning: "هذه مقارنة بحثية مساعدة وليست حكماً قانونياً نهائياً. يجب مراجعة النص الكامل والسياق الإجرائي والنسخة النافذة من القانون."
  };
}

export function compareDecisions(decisionIds = []) {
  const uniqueIds = [...new Set(decisionIds)].slice(0, 4);
  const selected = uniqueIds.map((id) => decisions.find((item) => item.id === id)).filter(Boolean);
  if (selected.length < 2) return null;
  const comparisons = [];
  for (let leftIndex = 0; leftIndex < selected.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < selected.length; rightIndex += 1) {
      comparisons.push(compareDecisionRecords(selected[leftIndex], selected[rightIndex]));
    }
  }
  return {
    requestedIds: uniqueIds,
    found: selected.length,
    comparisons,
    notice: projectMetadata.legalNotice
  };
}

function effectiveDecisions() {
  const selected = [];
  const caseIds = new Set(decisions.map((item) => item.caseId).filter(Boolean));
  for (const caseId of caseIds) {
    const caseDecisions = decisions
      .filter((item) => item.caseId === caseId && !item.correctedBy)
      .sort((left, right) => right.stageOrder - left.stageOrder || right.date.localeCompare(left.date));
    if (caseDecisions[0]) selected.push(caseDecisions[0]);
  }
  selected.push(...decisions.filter((item) => !item.caseId));
  return selected;
}

export function findPotentialDivergence({
  query = "",
  countryCode,
  courtType,
  topic,
  lawId,
  articleNumber,
  includeSynthetic = true,
  limit = 6
} = {}) {
  const candidates = effectiveDecisions().filter((decision) => {
    if (countryCode && decision.countryCode !== countryCode) return false;
    if (!includeSynthetic && decision.isSynthetic) return false;
    if (courtType && decision.courtTypeId !== courtType && !normalizeArabic(decision.court).includes(normalizeArabic(courtType))) return false;
    if (lawId && !decision.lawArticles.some((reference) => reference.startsWith(`${lawId}:`))) return false;
    if (articleNumber && !decision.lawArticles.some((reference) => reference.endsWith(`:${articleNumber}`))) return false;
    if (topic) {
      const caseItem = cases.find((item) => item.id === decision.caseId);
      if (caseItem?.topicId !== topic && !normalizeArabic(caseItem?.topic ?? "").includes(normalizeArabic(topic))) return false;
    }
    return !query || textScore(query, decisionSearchText(decision)) >= 0.18;
  });
  const pairs = [];
  for (let leftIndex = 0; leftIndex < candidates.length; leftIndex += 1) {
    for (let rightIndex = leftIndex + 1; rightIndex < candidates.length; rightIndex += 1) {
      const left = candidates[leftIndex];
      const right = candidates[rightIndex];
      if (left.caseId && left.caseId === right.caseId) continue;
      const comparison = compareDecisionRecords(left, right);
      if (!comparison) continue;
      if (!["potential-divergence", "distinguishable", "needs-full-text"].includes(comparison.classification)) continue;
      if (comparison.similarity < 0.38) continue;
      pairs.push(comparison);
    }
  }
  pairs.sort((left, right) => {
    const priority = { "potential-divergence": 3, "needs-full-text": 2, distinguishable: 1 };
    return (priority[right.classification] - priority[left.classification]) || right.similarity - left.similarity;
  });
  return {
    query,
    filters: { countryCode: countryCode ?? null, courtType: courtType ?? null, topic: topic ?? null, lawId: lawId ?? null, articleNumber: articleNumber ?? null, includeSynthetic },
    pairs: pairs.slice(0, Math.max(1, Math.min(Number(limit) || 6, 12))),
    evaluatedDecisions: candidates.length,
    methodology: [
      "تشابه المسألة القانونية والوقائع والمواد المستند إليها.",
      "التحقق من حالة التسجيل ونسخة القانون والمرحلة الإجرائية.",
      "استبعاد علاقة التصحيح أو التجاوز الإجرائي من وصف التعارض المستقل.",
      "وصف النتيجة بأنها اختلاف محتمل لا تعارض قطعي."
    ],
    notice: projectMetadata.legalNotice
  };
}

export function getLegalSource(id, { language = "en" } = {}) {
  const selectedLanguage = safeLanguage(language);
  const source = sources.find((item) => item.id === id);
  if (source) return { type: "source", item: source };

  const decision = decisions.find((item) => item.id === id);
  if (decision) {
    return {
      type: "decision",
      item: { ...decision, sources: sourceFor(decision.sourceIds), articles: decision.lawArticles.map(lawArticleFromRef).filter(Boolean) }
    };
  }

  const law = laws.find((item) => item.id === id);
  if (law) return { type: "law", item: { ...localizedLaw(law, selectedLanguage), sources: sourceFor(law.sourceIds) } };

  const separator = id.lastIndexOf(":");
  if (separator !== -1) {
    const lawId = id.slice(0, separator);
    const articleNumber = id.slice(separator + 1);
    const lawRecord = laws.find((item) => item.id === lawId);
    const article = lawRecord?.articles.find((item) => item.number === articleNumber);
    if (lawRecord && article) {
      const requestedText = article.texts?.[selectedLanguage];
      return {
        type: "article",
        item: {
          law: localizedLaw(lawRecord, selectedLanguage),
          article: {
            ...article,
            text: requestedText ?? article.text,
            displayedLanguage: requestedText ? selectedLanguage : article.originalLanguage ?? lawRecord.originalLanguage,
            translationAvailable: Boolean(requestedText)
          },
          sources: sourceFor(lawRecord.sourceIds)
        }
      };
    }
  }

  const caseRecord = traceCase(id);
  if (caseRecord) return { type: "case", item: caseRecord };
  return null;
}

function localizeBasis(basis, language) {
  return {
    ...basis,
    instrument: proceduralText(basis.instrument, language),
    rule: proceduralText(basis.rule, language)
  };
}

function localizeProceduralRoute(route, language) {
  return {
    id: route.id,
    countryCode: route.countryCode,
    trackId: route.trackId,
    decisionKindIds: route.decisionKindIds,
    methodId: route.methodId,
    name: proceduralText(route.names, language),
    summary: proceduralText(route.summaries, language),
    filingAuthority: proceduralText(route.filingAuthorities, language),
    legalBasis: route.legalBasis.map((basis) => localizeBasis(basis, language)),
    eligibilityChecks: proceduralText(route.eligibilityChecks, language),
    exclusions: proceduralText(route.exclusions, language),
    deadline: {
      status: route.deadline.status,
      label: proceduralText(route.deadline.labels, language)
    },
    templateId: route.templateId
  };
}

function localizeTemplate(template, language) {
  return {
    id: template.id,
    routeId: template.routeId,
    trackId: template.trackId,
    type: template.type,
    title: proceduralText(template.titles, language),
    purpose: proceduralText(template.purposes, language),
    requiredSections: proceduralText(template.requiredSections, language),
    focusSections: proceduralText(template.focusSections, language),
    requiredAttachments: proceduralText(template.requiredAttachments, language),
    validationQuestions: proceduralText(template.validationQuestions, language)
  };
}

export function getProceduralRoutes({
  countryCode = "IQ",
  trackId,
  decisionKindId,
  methodId,
  language = "en"
} = {}) {
  const selectedLanguage = safeLanguage(language);
  const countryRoutes = proceduralRoutes.filter((route) => route.countryCode === countryCode);
  const trackRoutes = trackId
    ? countryRoutes.filter((route) => route.trackId === trackId)
    : countryRoutes;
  const decisionRoutes = decisionKindId
    ? trackRoutes.filter((route) => route.decisionKindIds.includes(decisionKindId))
    : trackRoutes;
  const matchingRoutes = methodId
    ? decisionRoutes.filter((route) => route.methodId === methodId)
    : decisionRoutes;
  const selectedTrackIds = trackId
    ? [trackId]
    : [...new Set(countryRoutes.map((route) => route.trackId))];
  const availableDecisionKinds = decisionKinds.filter((kind) =>
    kind.trackIds.some((id) => selectedTrackIds.includes(id)) &&
    countryRoutes.some((route) => route.decisionKindIds.includes(kind.id))
  );
  const availableRouteIds = new Set(decisionRoutes.map((route) => route.id));
  const availableTemplates = filingTemplates.filter((template) => {
    if (trackId && template.trackId !== trackId) return false;
    if (!template.routeId) return !trackId || template.trackId === trackId;
    return availableRouteIds.has(template.routeId);
  });
  const criminalAppealWarning = trackId === "criminal" && methodId === "appeal"
    ? proceduralText({
        en: "Ordinary criminal review is not labeled as appeal in this Iraqi pilot. Check criminal cassation or the specific objection route instead.",
        ar: "لا تُعرض المراجعة الجزائية العادية بوصفها استئنافاً في هذا النموذج العراقي؛ افحص التمييز الجزائي أو طريق الاعتراض الخاص.",
        fr: "Le recours pénal ordinaire n’est pas qualifié d’appel dans ce pilote irakien ; vérifiez la cassation pénale ou l’opposition spécifique.",
        es: "La revisión penal ordinaria no se denomina apelación en este piloto iraquí; revise casación penal u oposición específica."
      }, selectedLanguage)
    : null;

  return {
    countryCode,
    language: selectedLanguage,
    available: countryRoutes.length > 0,
    filters: {
      trackId: trackId ?? null,
      decisionKindId: decisionKindId ?? null,
      methodId: methodId ?? null
    },
    tracks: proceduralTracks
      .filter((track) => countryRoutes.some((route) => route.trackId === track.id))
      .map((track) => ({ id: track.id, name: proceduralText(track.names, selectedLanguage) })),
    decisionKinds: availableDecisionKinds.map((kind) => ({
      id: kind.id,
      trackIds: kind.trackIds,
      name: proceduralText(kind.names, selectedLanguage)
    })),
    methods: [...new Map(decisionRoutes.map((route) => [route.methodId, {
      id: route.methodId,
      name: proceduralText(route.names, selectedLanguage),
      routeId: route.id,
      templateId: route.templateId
    }])).values()],
    routes: matchingRoutes.map((route) => localizeProceduralRoute(route, selectedLanguage)),
    filingTemplates: availableTemplates.map((template) => ({
      id: template.id,
      routeId: template.routeId,
      trackId: template.trackId,
      type: template.type,
      title: proceduralText(template.titles, selectedLanguage)
    })),
    notAvailableReason: criminalAppealWarning ?? (!countryRoutes.length
      ? proceduralText({
          en: "Procedural routes for this country are catalog-only and have not yet been legally encoded.",
          ar: "طرق الطعن في هذه الدولة ما زالت فهرسة فقط ولم تُشفّر قانونياً بعد.",
          fr: "Les voies de recours de ce pays sont encore au stade du catalogue.",
          es: "Las vías procesales de este país están todavía solo catalogadas."
        }, selectedLanguage)
      : matchingRoutes.length ? null : proceduralText({
          en: "No encoded route matches this combination. Recheck the case type, decision, and procedural posture.",
          ar: "لا يوجد طريق مشفّر يطابق هذه التركيبة؛ راجع نوع الدعوى والقرار والمرحلة الإجرائية.",
          fr: "Aucune voie encodée ne correspond à cette combinaison ; revérifiez le type d’affaire, la décision et la posture.",
          es: "Ninguna vía codificada coincide con esta combinación; revise tipo de asunto, decisión y etapa."
        }, selectedLanguage)),
    safeguards: [
      proceduralText(proceduralNotices.legal, selectedLanguage),
      proceduralText(proceduralNotices.privacy, selectedLanguage)
    ],
    notice: proceduralText(proceduralNotices.legal, selectedLanguage)
  };
}

export function getFilingTemplate({ templateId, countryCode = "IQ", language = "en" } = {}) {
  const selectedLanguage = safeLanguage(language);
  if (countryCode !== "IQ") return null;
  const template = filingTemplates.find((item) => item.id === templateId);
  if (!template) return null;
  const route = template.routeId
    ? proceduralRoutes.find((item) => item.id === template.routeId)
    : null;
  return {
    ...localizeTemplate(template, selectedLanguage),
    countryCode,
    language: selectedLanguage,
    route: route ? localizeProceduralRoute(route, selectedLanguage) : null,
    privacyNotice: proceduralText(proceduralNotices.privacy, selectedLanguage),
    legalNotice: proceduralText(proceduralNotices.legal, selectedLanguage),
    draftPolicy: proceduralText({
      en: "The template supplies headings and validation questions only. It does not invent facts, evidence, authorities, dates, deadlines, signatures, or filing status.",
      ar: "يوفر النموذج عناوين وأسئلة تحقق فقط؛ ولا يختلق وقائع أو أدلة أو نصوصاً أو تواريخ أو مدداً أو توقيعات أو حالة إيداع.",
      fr: "Le modèle fournit uniquement des rubriques et questions de contrôle ; il n’invente ni faits, preuves, textes, dates, délais, signatures ni statut de dépôt.",
      es: "La plantilla solo aporta secciones y preguntas de control; no inventa hechos, pruebas, normas, fechas, plazos, firmas ni estado de presentación."
    }, selectedLanguage)
  };
}

export function getOverview({ language = "en", countryCode = "IQ" } = {}) {
  const selectedLanguage = safeLanguage(language);
  const catalog = getCatalog({ countryCode, language: selectedLanguage });
  const featuredCase = traceCase("case-demo-cross-border-heirship-305");
  const featuredComparison = compareDecisions(["demo-co-a-correction", "demo-co-b-cassation"]);
  return {
    project: projectMetadata,
    jurisdictions: getJurisdictions({ language: selectedLanguage }),
    catalog,
    proceduralRoutes: getProceduralRoutes({ countryCode, trackId: "civil", language: selectedLanguage }),
    featuredCase,
    featuredComparison,
    samplePrompts: [
      "Open article 305 of Iraqi Civil Procedure Law No. 83 of 1969 and trace the anonymized cross-border heirship example.",
      "Explain separately how Iraqi Civil Code article 22 and Riyadh Agreement articles 25 and 30 interact with the article 305 jurisdiction question.",
      "Show dissolution-of-co-ownership cases from trial through cassation correction.",
      "Compare the final cassation outcomes on similar co-ownership facts.",
      "Choose civil or criminal procedure, identify the decision, and open the compatible challenge route and filing checklist.",
      "اعرض قضية سالم ناصر ضد أولاد أمل فؤاد بوصفها مثالاً مجهّلاً لا مرجعاً قضائياً."
    ]
  };
}

export const corpus = { languages, countries, laws, cases, decisions, sources, proceduralRoutes, filingTemplates, projectMetadata };
