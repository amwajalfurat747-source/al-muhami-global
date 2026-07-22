import {
  cases as iraqiCases,
  decisions as iraqiDecisions,
  laws as iraqiLaws,
  projectMetadata as iraqiProjectMetadata,
  sources as iraqiSources
} from "./data.js";

export const languages = [
  { code: "en", name: "English", nativeName: "English", direction: "ltr" },
  { code: "ar", name: "Arabic", nativeName: "العربية", direction: "rtl" },
  { code: "fr", name: "French", nativeName: "Français", direction: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", direction: "ltr" }
];

export const countries = [
  {
    code: "IQ",
    names: { en: "Iraq", ar: "العراق", fr: "Irak", es: "Irak" },
    flag: "🇮🇶",
    defaultLanguage: "ar",
    status: "working-demo",
    courtTypes: [
      { id: "first-instance", names: { en: "Court of First Instance", ar: "محكمة البداءة", fr: "Tribunal de première instance", es: "Tribunal de primera instancia" } },
      { id: "personal-status", names: { en: "Personal Status Court", ar: "محكمة الأحوال الشخصية", fr: "Tribunal du statut personnel", es: "Tribunal de estatuto personal" } },
      { id: "appeal", names: { en: "Court of Appeal", ar: "محكمة الاستئناف", fr: "Cour d’appel", es: "Tribunal de apelación" } },
      { id: "cassation", names: { en: "Federal Court of Cassation", ar: "محكمة التمييز الاتحادية", fr: "Cour fédérale de cassation", es: "Tribunal Federal de Casación" } },
      { id: "correction", names: { en: "Cassation Correction Panel", ar: "هيئة تصحيح القرار التمييزي", fr: "Formation de rectification", es: "Sala de corrección de casación" } },
      { id: "foreign-record", names: { en: "Foreign judicial record", ar: "مستند قضائي أجنبي", fr: "Acte judiciaire étranger", es: "Documento judicial extranjero" } }
    ],
    caseTopics: [
      { id: "coownership-dissolution", names: { en: "Dissolution of co-ownership", ar: "إزالة الشيوع", fr: "Partage de l’indivision", es: "División de copropiedad" } },
      { id: "inheritance-registration", names: { en: "Inheritance and real-estate registration", ar: "الإرث والتسجيل العقاري", fr: "Succession et publicité foncière", es: "Herencia y registro inmobiliario" } },
      { id: "cross-border-heirship", names: { en: "Cross-border heirship certificates", ar: "القسامات الشرعية العابرة للحدود", fr: "Actes successoraux transfrontaliers", es: "Declaraciones sucesorias transfronterizas" } },
      { id: "family-status", names: { en: "Personal status and family", ar: "الأحوال الشخصية والأسرة", fr: "Statut personnel et famille", es: "Estatuto personal y familia" } },
      { id: "criminal", names: { en: "Criminal cases", ar: "الدعاوى الجزائية", fr: "Affaires pénales", es: "Asuntos penales" } }
    ]
  },
  {
    code: "FR",
    names: { en: "France", ar: "فرنسا", fr: "France", es: "Francia" },
    flag: "🇫🇷",
    defaultLanguage: "fr",
    status: "catalog-pilot",
    courtTypes: [
      { id: "trial", names: { en: "Trial courts", ar: "محاكم الدرجة الأولى", fr: "Juridictions du premier degré", es: "Tribunales de primera instancia" } },
      { id: "appeal", names: { en: "Court of Appeal", ar: "محكمة الاستئناف", fr: "Cour d’appel", es: "Tribunal de apelación" } },
      { id: "cassation", names: { en: "Court of Cassation", ar: "محكمة النقض", fr: "Cour de cassation", es: "Tribunal de Casación" } }
    ],
    caseTopics: [
      { id: "contracts", names: { en: "Contracts", ar: "العقود", fr: "Contrats", es: "Contratos" } },
      { id: "privacy", names: { en: "Privacy", ar: "الخصوصية", fr: "Vie privée", es: "Privacidad" } },
      { id: "family", names: { en: "Family", ar: "الأسرة", fr: "Famille", es: "Familia" } },
      { id: "criminal", names: { en: "Criminal cases", ar: "الدعاوى الجزائية", fr: "Affaires pénales", es: "Asuntos penales" } }
    ]
  },
  {
    code: "EG",
    names: { en: "Egypt", ar: "مصر", fr: "Égypte", es: "Egipto" },
    flag: "🇪🇬",
    defaultLanguage: "ar",
    status: "catalog-pilot",
    courtTypes: [
      { id: "first-instance", names: { en: "Court of First Instance", ar: "المحكمة الابتدائية", fr: "Tribunal de première instance", es: "Tribunal de primera instancia" } },
      { id: "appeal", names: { en: "Court of Appeal", ar: "محكمة الاستئناف", fr: "Cour d’appel", es: "Tribunal de apelación" } },
      { id: "cassation", names: { en: "Court of Cassation", ar: "محكمة النقض", fr: "Cour de cassation", es: "Tribunal de Casación" } }
    ],
    caseTopics: [
      { id: "civil", names: { en: "Civil cases", ar: "الدعاوى المدنية", fr: "Affaires civiles", es: "Asuntos civiles" } },
      { id: "family", names: { en: "Family and personal status", ar: "الأسرة والأحوال الشخصية", fr: "Famille et statut personnel", es: "Familia y estatuto personal" } },
      { id: "criminal", names: { en: "Criminal cases", ar: "الدعاوى الجنائية", fr: "Affaires pénales", es: "Asuntos penales" } }
    ]
  }
];

const iraqiLawTitles = {
  "irq-constitution-2005": { en: "Constitution of the Republic of Iraq", fr: "Constitution de la République d’Irak", es: "Constitución de la República de Irak" },
  "irq-civil-code-40-1951": { en: "Iraqi Civil Code", fr: "Code civil irakien", es: "Código Civil iraquí" },
  "irq-penal-code-111-1969": { en: "Iraqi Penal Code", fr: "Code pénal irakien", es: "Código Penal iraquí" },
  "irq-civil-procedure-83-1969": { en: "Civil Procedure Law", fr: "Loi de procédure civile", es: "Ley de Procedimiento Civil" },
  "irq-evidence-107-1979": { en: "Evidence Law", fr: "Loi sur la preuve", es: "Ley de Prueba" },
  "irq-personal-status-188-1959": { en: "Iraqi Personal Status Law", fr: "Loi irakienne sur le statut personnel", es: "Ley iraquí de estatuto personal" },
  "irq-foreigners-residence-76-2017": { en: "Foreigners’ Residence Law", fr: "Loi sur le séjour des étrangers", es: "Ley de residencia de extranjeros" },
  "irq-enforcement-45-1980": { en: "Enforcement Law", fr: "Loi sur l’exécution", es: "Ley de Ejecución" },
  "irq-real-estate-registration-43-1971": { en: "Real Estate Registration Law", fr: "Loi sur l’enregistrement immobilier", es: "Ley de Registro Inmobiliario" }
};

const categoryNames = {
  "دستوري": { en: "Constitutional", fr: "Constitutionnel", es: "Constitucional" },
  "مدني": { en: "Civil", fr: "Civil", es: "Civil" },
  "جزائي": { en: "Criminal", fr: "Pénal", es: "Penal" },
  "مرافعات": { en: "Procedure", fr: "Procédure", es: "Procedimiento" },
  "إثبات": { en: "Evidence", fr: "Preuve", es: "Prueba" },
  "أحوال شخصية": { en: "Personal status", fr: "Statut personnel", es: "Estatuto personal" },
  "إقامة وأجانب": { en: "Immigration", fr: "Immigration", es: "Inmigración" },
  "تنفيذ": { en: "Enforcement", fr: "Exécution", es: "Ejecución" },
  "تسجيل عقاري": { en: "Real estate", fr: "Immobilier", es: "Inmobiliario" }
};

function enrichIraqiLaw(law) {
  return {
    ...law,
    countryCode: "IQ",
    originalLanguage: "ar",
    titles: { ar: law.title, ...iraqiLawTitles[law.id] },
    categories: { ar: law.category, ...(categoryNames[law.category] ?? {}) },
    articles: law.articles.map((article) => ({
      ...article,
      originalLanguage: "ar",
      texts: { ar: article.text },
      translationStatus: "original-only"
    }))
  };
}

const additionalSources = [
  {
    id: "src-iraqi-criminal-procedure-text",
    countryCode: "IQ",
    title: "قانون أصول المحاكمات الجزائية رقم 23 لسنة 1971",
    publisher: "درر العراق — دليل القوانين العراقية",
    type: "accessible-text-mirror",
    url: "https://wiki.dorar-aliraq.net/iraqilaws/law/4895.html",
    accessNote: "نسخة نصية متاحة للوصول إلى أبواب الطعن؛ يجب مطابقتها مع قاعدة التشريعات العراقية الرسمية والتعديلات النافذة قبل الاستعمال المهني."
  },
  {
    id: "src-riyadh-agreement-official-bh",
    countryCode: "IQ",
    title: "اتفاقية الرياض العربية للتعاون القضائي لعام 1983",
    publisher: "هيئة التشريع والرأي القانوني — مملكة البحرين",
    type: "official-treaty-publication",
    url: "https://www.lloc.gov.bh/Legislation/HTM/L4199",
    accessNote: "نشر حكومي لنص الاتفاقية؛ يجب التحقق من صفة الأطراف والتصديقات وتاريخ النفاذ بالنسبة إلى الدول والواقعة محل البحث."
  },
  {
    id: "src-riyadh-agreement-carjj",
    countryCode: "IQ",
    title: "اتفاقية الرياض العربية للتعاون القضائي — نسخة PDF",
    publisher: "المركز العربي للبحوث القانونية والقضائية",
    type: "regional-judicial-institute-pdf",
    url: "https://www.carjj.org/news/file/3192/%D8%A7%D8%AA%D9%81%D8%A7%D9%82%D9%8A%D8%A9-%D8%A7%D9%84%D8%B1%D9%8A%D8%A7%D8%B6-%D9%84%D9%84%D8%AA%D8%B9%D8%A7%D9%88%D9%86-%D8%A7%D9%84%D9%82%D8%B6%D8%A7%D8%A6%D9%8A",
    accessNote: "نسخة إقليمية مساعدة للتحقق من مواد الاعتراف والتنفيذ؛ لا تكفي وحدها لإثبات سريان الاتفاقية على دولة أو واقعة محددة."
  },
  {
    id: "src-fr-legifrance",
    countryCode: "FR",
    title: "Légifrance — Code civil",
    publisher: "Secrétariat général du Gouvernement / DILA",
    type: "official-legislation-portal",
    url: "https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006070721/",
    accessNote: "Official French consolidated legislation portal with version history."
  },
  {
    id: "src-fr-cour-cassation",
    countryCode: "FR",
    title: "Cour de cassation",
    publisher: "Cour de cassation française",
    type: "official-judicial-portal",
    url: "https://www.courdecassation.fr/",
    accessNote: "Official French Court of Cassation portal; decision ingestion is not included in this MVP."
  },
  {
    id: "src-eg-ministry-justice",
    countryCode: "EG",
    title: "Egyptian Ministry of Justice",
    publisher: "Ministry of Justice — Arab Republic of Egypt",
    type: "official-government-portal",
    url: "https://moj.gov.eg/",
    accessNote: "Official ministry portal. The MVP catalogs Egyptian law families but does not claim a complete consolidated corpus."
  }
];

const additionalLaws = [
  {
    id: "irq-criminal-procedure-23-1971",
    countryCode: "IQ",
    country: "العراق",
    originalLanguage: "ar",
    titles: { en: "Iraqi Criminal Procedure Law", ar: "قانون أصول المحاكمات الجزائية العراقي", fr: "Code irakien de procédure pénale", es: "Ley iraquí de Procedimiento Penal" },
    title: "قانون أصول المحاكمات الجزائية العراقي",
    number: 23,
    year: 1971,
    category: "إجراءات جزائية",
    categories: { en: "Criminal procedure", ar: "إجراءات جزائية", fr: "Procédure pénale", es: "Procedimiento penal" },
    status: "Catalog entry with source-linked procedural-route summaries; verify the official consolidated text and amendments before professional use.",
    sourceIds: ["src-iraqi-legal-database", "src-iraqi-criminal-procedure-text"],
    articles: []
  },
  {
    id: "regional-riyadh-agreement-1983",
    countryCode: "IQ",
    country: "العراق / إطار إقليمي",
    originalLanguage: "ar",
    titles: { en: "Riyadh Arab Agreement for Judicial Cooperation", ar: "اتفاقية الرياض العربية للتعاون القضائي", fr: "Convention arabe de Riyad relative à l’entraide judiciaire", es: "Acuerdo Árabe de Riad sobre Cooperación Judicial" },
    title: "اتفاقية الرياض العربية للتعاون القضائي",
    number: null,
    year: 1983,
    category: "اتفاقية دولية",
    categories: { en: "International agreement", ar: "اتفاقية دولية", fr: "Convention internationale", es: "Acuerdo internacional" },
    status: "Regional instrument — verify contracting-party status, ratification, entry into force, reservations, and the relevant date before relying on it.",
    sourceIds: ["src-riyadh-agreement-official-bh", "src-riyadh-agreement-carjj"],
    articles: [
      {
        number: "25",
        originalLanguage: "ar",
        text: "أ- يقصد بالحكم في معرض تطبيق هذا الباب كل قرار أياً كانت تسميته يصدر بناءً على إجراءات قضائية أو ولائية من محاكم أو أية جهة مختصة لدى أحد الأطراف المتعاقدة. ب- مع مراعاة نص المادة (30) من هذه الاتفاقية، يعترف كل من الأطراف المتعاقدة بالأحكام الصادرة عن محاكم أي طرف متعاقد آخر في القضايا المدنية، بما في ذلك الأحكام المتعلقة بالحقوق المدنية الصادرة عن محاكم جزائية، وفي القضايا التجارية والقضايا الإدارية وقضايا الأحوال الشخصية، الحائزة لقوة الأمر المقضي به، وينفذها في إقليمه وفق الإجراءات المتعلقة بتنفيذ الأحكام المنصوص عليها في هذا الباب، وذلك إذا كانت محاكم الطرف المتعاقد التي أصدرت الحكم مختصة طبقاً لقواعد الاختصاص القضائي الدولي المقررة لدى الطرف المتعاقد المطلوب إليه الاعتراف أو التنفيذ أو مختصة بمقتضى أحكام هذا الباب، وكان النظام القانوني للطرف المتعاقد المطلوب إليه الاعتراف أو التنفيذ لا يحتفظ لمحاكمه أو لمحاكم طرف آخر دون غيرها بالاختصاص بإصدار الحكم. ج- لا تسري هذه المادة على الأحكام الصادرة ضد حكومة الطرف المطلوب إليه الاعتراف أو التنفيذ أو أحد موظفيها عن أعمال الوظيفة، ولا الأحكام التي يتنافى الاعتراف بها أو تنفيذها مع المعاهدات والاتفاقات الدولية المعمول بها لديه، ولا الإجراءات الوقتية والتحفظية والأحكام الصادرة في قضايا الإفلاس والضرائب والرسوم.",
        texts: { ar: "أ- يقصد بالحكم في معرض تطبيق هذا الباب كل قرار أياً كانت تسميته يصدر بناءً على إجراءات قضائية أو ولائية من محاكم أو أية جهة مختصة لدى أحد الأطراف المتعاقدة. ب- مع مراعاة نص المادة (30) من هذه الاتفاقية، يعترف كل من الأطراف المتعاقدة بالأحكام الصادرة عن محاكم أي طرف متعاقد آخر في القضايا المدنية، بما في ذلك الأحكام المتعلقة بالحقوق المدنية الصادرة عن محاكم جزائية، وفي القضايا التجارية والقضايا الإدارية وقضايا الأحوال الشخصية، الحائزة لقوة الأمر المقضي به، وينفذها في إقليمه وفق الإجراءات المتعلقة بتنفيذ الأحكام المنصوص عليها في هذا الباب، وذلك إذا كانت محاكم الطرف المتعاقد التي أصدرت الحكم مختصة طبقاً لقواعد الاختصاص القضائي الدولي المقررة لدى الطرف المتعاقد المطلوب إليه الاعتراف أو التنفيذ أو مختصة بمقتضى أحكام هذا الباب، وكان النظام القانوني للطرف المتعاقد المطلوب إليه الاعتراف أو التنفيذ لا يحتفظ لمحاكمه أو لمحاكم طرف آخر دون غيرها بالاختصاص بإصدار الحكم. ج- لا تسري هذه المادة على الأحكام الصادرة ضد حكومة الطرف المطلوب إليه الاعتراف أو التنفيذ أو أحد موظفيها عن أعمال الوظيفة، ولا الأحكام التي يتنافى الاعتراف بها أو تنفيذها مع المعاهدات والاتفاقات الدولية المعمول بها لديه، ولا الإجراءات الوقتية والتحفظية والأحكام الصادرة في قضايا الإفلاس والضرائب والرسوم." },
        verification: "النص العربي مدخل من نسخ منشورة للاتفاقية؛ يلزم التحقق من النسخة الرسمية وحالة النفاذ بين الدول المعنية.",
        translationStatus: "original-only"
      },
      {
        number: "30",
        originalLanguage: "ar",
        text: "يرفض الاعتراف بالحكم في الحالات الآتية: أ- إذا كان مخالفاً لأحكام الشريعة الإسلامية أو أحكام الدستور أو النظام العام أو الآداب في الطرف المتعاقد المطلوب إليه الاعتراف. ب- إذا كان غيابياً ولم يعلن الخصم المحكوم عليه بالدعوى أو الحكم إعلاناً صحيحاً يمكنه من الدفاع عن نفسه. ج- إذا لم تراع قواعد قانون الطرف المتعاقد المطلوب إليه الاعتراف الخاصة بالتمثيل القانوني للأشخاص عديمي الأهلية أو ناقصيها. د- إذا كان النزاع الصادر في شأنه الحكم المطلوب الاعتراف به محلاً لحكم صادر في الموضوع بين الخصوم أنفسهم ويتعلق بذات الحق محلاً وسبباً وحائزاً لقوة الأمر المقضي به لدى الطرف المتعاقد المطلوب إليه الاعتراف أو لدى طرف متعاقد ثالث ومعترفاً به لدى الطرف المتعاقد المطلوب إليه الاعتراف. هـ- إذا كان النزاع الصادر في شأنه الحكم المطلوب الاعتراف به محلاً لدعوى منظورة أمام إحدى محاكم الطرف المتعاقد المطلوب إليه الاعتراف بين الخصوم أنفسهم وتتعلق بذات الحق محلاً وسبباً وكانت الدعوى قد رفعت إلى محاكم هذا الطرف في تاريخ سابق على عرض النزاع على المحكمة التي صدر عنها الحكم.",
        texts: { ar: "يرفض الاعتراف بالحكم في الحالات الآتية: أ- إذا كان مخالفاً لأحكام الشريعة الإسلامية أو أحكام الدستور أو النظام العام أو الآداب في الطرف المتعاقد المطلوب إليه الاعتراف. ب- إذا كان غيابياً ولم يعلن الخصم المحكوم عليه بالدعوى أو الحكم إعلاناً صحيحاً يمكنه من الدفاع عن نفسه. ج- إذا لم تراع قواعد قانون الطرف المتعاقد المطلوب إليه الاعتراف الخاصة بالتمثيل القانوني للأشخاص عديمي الأهلية أو ناقصيها. د- إذا كان النزاع الصادر في شأنه الحكم المطلوب الاعتراف به محلاً لحكم صادر في الموضوع بين الخصوم أنفسهم ويتعلق بذات الحق محلاً وسبباً وحائزاً لقوة الأمر المقضي به لدى الطرف المتعاقد المطلوب إليه الاعتراف أو لدى طرف متعاقد ثالث ومعترفاً به لدى الطرف المتعاقد المطلوب إليه الاعتراف. هـ- إذا كان النزاع الصادر في شأنه الحكم المطلوب الاعتراف به محلاً لدعوى منظورة أمام إحدى محاكم الطرف المتعاقد المطلوب إليه الاعتراف بين الخصوم أنفسهم وتتعلق بذات الحق محلاً وسبباً وكانت الدعوى قد رفعت إلى محاكم هذا الطرف في تاريخ سابق على عرض النزاع على المحكمة التي صدر عنها الحكم." },
        verification: "المادة 30 تضع حالات رفض الاعتراف، لذلك لا تعني المادة 25 اعترافاً آلياً بكل حكم أو مستند أجنبي.",
        translationStatus: "original-only"
      }
    ]
  },
  {
    id: "fr-constitution-1958",
    countryCode: "FR",
    country: "فرنسا",
    originalLanguage: "fr",
    titles: { en: "Constitution of 4 October 1958", ar: "دستور 4 أكتوبر 1958", fr: "Constitution du 4 octobre 1958", es: "Constitución de 4 de octubre de 1958" },
    title: "Constitution du 4 octobre 1958",
    number: null,
    year: 1958,
    category: "Constitutional",
    categories: { en: "Constitutional", ar: "دستوري", fr: "Constitutionnel", es: "Constitucional" },
    status: "Catalog entry — retrieve the current official version from Légifrance.",
    sourceIds: ["src-fr-legifrance"],
    articles: []
  },
  {
    id: "fr-civil-code",
    countryCode: "FR",
    country: "فرنسا",
    originalLanguage: "fr",
    titles: { en: "French Civil Code", ar: "القانون المدني الفرنسي", fr: "Code civil", es: "Código Civil francés" },
    title: "Code civil",
    number: null,
    year: 1804,
    category: "Civil",
    categories: { en: "Civil", ar: "مدني", fr: "Civil", es: "Civil" },
    status: "Consolidated and versioned on Légifrance; verify the version applicable on the relevant date.",
    sourceIds: ["src-fr-legifrance"],
    articles: [
      {
        number: "6",
        originalLanguage: "fr",
        text: "On ne peut déroger, par des conventions particulières, aux lois qui intéressent l’ordre public et les bonnes mœurs.",
        texts: { fr: "On ne peut déroger, par des conventions particulières, aux lois qui intéressent l’ordre public et les bonnes mœurs." },
        verification: "Official text linked to the current Légifrance article page; verify the relevant historical version.",
        sourceUrl: "https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006419285",
        translationStatus: "original-only"
      }
    ]
  },
  {
    id: "fr-penal-code",
    countryCode: "FR",
    country: "فرنسا",
    originalLanguage: "fr",
    titles: { en: "French Penal Code", ar: "قانون العقوبات الفرنسي", fr: "Code pénal", es: "Código Penal francés" },
    title: "Code pénal",
    number: null,
    year: 1992,
    category: "Criminal",
    categories: { en: "Criminal", ar: "جزائي", fr: "Pénal", es: "Penal" },
    status: "Catalog entry — retrieve the current official version from Légifrance.",
    sourceIds: ["src-fr-legifrance"],
    articles: []
  },
  {
    id: "fr-civil-procedure-code",
    countryCode: "FR",
    country: "فرنسا",
    originalLanguage: "fr",
    titles: { en: "French Code of Civil Procedure", ar: "قانون المرافعات المدنية الفرنسي", fr: "Code de procédure civile", es: "Código de Procedimiento Civil francés" },
    title: "Code de procédure civile",
    number: null,
    year: 1975,
    category: "Procedure",
    categories: { en: "Procedure", ar: "مرافعات", fr: "Procédure", es: "Procedimiento" },
    status: "Catalog entry — retrieve the current official version from Légifrance.",
    sourceIds: ["src-fr-legifrance"],
    articles: []
  },
  {
    id: "fr-criminal-procedure-code",
    countryCode: "FR",
    country: "فرنسا",
    originalLanguage: "fr",
    titles: { en: "French Code of Criminal Procedure", ar: "قانون الإجراءات الجزائية الفرنسي", fr: "Code de procédure pénale", es: "Código de Procedimiento Penal francés" },
    title: "Code de procédure pénale",
    number: null,
    year: 1958,
    category: "Criminal procedure",
    categories: { en: "Criminal procedure", ar: "إجراءات جزائية", fr: "Procédure pénale", es: "Procedimiento penal" },
    status: "Catalog entry — retrieve the current official version from Légifrance.",
    sourceIds: ["src-fr-legifrance"],
    articles: []
  },
  {
    id: "eg-constitution-2014",
    countryCode: "EG",
    country: "مصر",
    originalLanguage: "ar",
    titles: { en: "Constitution of Egypt", ar: "دستور جمهورية مصر العربية", fr: "Constitution de l’Égypte", es: "Constitución de Egipto" },
    title: "دستور جمهورية مصر العربية",
    number: null,
    year: 2014,
    category: "دستوري",
    categories: { en: "Constitutional", ar: "دستوري", fr: "Constitutionnel", es: "Constitucional" },
    status: "Catalog entry only — official consolidated text must be connected before professional use.",
    sourceIds: ["src-eg-ministry-justice"],
    articles: []
  },
  {
    id: "eg-civil-code-131-1948",
    countryCode: "EG",
    country: "مصر",
    originalLanguage: "ar",
    titles: { en: "Egyptian Civil Code", ar: "القانون المدني المصري", fr: "Code civil égyptien", es: "Código Civil egipcio" },
    title: "القانون المدني المصري",
    number: 131,
    year: 1948,
    category: "مدني",
    categories: { en: "Civil", ar: "مدني", fr: "Civil", es: "Civil" },
    status: "Catalog entry only — connect and verify an official consolidated source.",
    sourceIds: ["src-eg-ministry-justice"],
    articles: []
  },
  {
    id: "eg-penal-code-58-1937",
    countryCode: "EG",
    country: "مصر",
    originalLanguage: "ar",
    titles: { en: "Egyptian Penal Code", ar: "قانون العقوبات المصري", fr: "Code pénal égyptien", es: "Código Penal egipcio" },
    title: "قانون العقوبات المصري",
    number: 58,
    year: 1937,
    category: "جزائي",
    categories: { en: "Criminal", ar: "جزائي", fr: "Pénal", es: "Penal" },
    status: "Catalog entry only — connect and verify an official consolidated source.",
    sourceIds: ["src-eg-ministry-justice"],
    articles: []
  },
  {
    id: "eg-civil-commercial-procedure-13-1968",
    countryCode: "EG",
    country: "مصر",
    originalLanguage: "ar",
    titles: { en: "Civil and Commercial Procedure Law", ar: "قانون المرافعات المدنية والتجارية المصري", fr: "Loi égyptienne de procédure civile et commerciale", es: "Ley egipcia de procedimiento civil y comercial" },
    title: "قانون المرافعات المدنية والتجارية",
    number: 13,
    year: 1968,
    category: "مرافعات",
    categories: { en: "Procedure", ar: "مرافعات", fr: "Procédure", es: "Procedimiento" },
    status: "Catalog entry only — connect and verify an official consolidated source.",
    sourceIds: ["src-eg-ministry-justice"],
    articles: []
  },
  {
    id: "eg-personal-status-family-laws",
    countryCode: "EG",
    country: "مصر",
    originalLanguage: "ar",
    titles: { en: "Egyptian Personal Status and Family Laws", ar: "تشريعات الأحوال الشخصية والأسرة المصرية", fr: "Lois égyptiennes sur le statut personnel et la famille", es: "Leyes egipcias de estatuto personal y familia" },
    title: "تشريعات الأحوال الشخصية والأسرة المصرية",
    number: null,
    year: null,
    category: "أحوال شخصية",
    categories: { en: "Personal status", ar: "أحوال شخصية", fr: "Statut personnel", es: "Estatuto personal" },
    status: "A law family, not one consolidated code. Each instrument must be indexed separately before article lookup.",
    sourceIds: ["src-eg-ministry-justice"],
    articles: []
  }
];

const coownershipCases = [
  {
    id: "case-demo-coownership-a",
    title: "إزالة الشيوع ببيع العقار — المسار أ / Judicial sale — path A",
    country: "العراق",
    countryCode: "IQ",
    topic: "إزالة الشيوع",
    topicId: "coownership-dissolution",
    courtType: "بداءة/استئناف/تمييز/تصحيح",
    isSynthetic: true,
    dataQuality: "Synthetic multilingual product demonstration; not a real case or judicial authority.",
    decisionIds: ["demo-co-a-trial", "demo-co-a-appeal", "demo-co-a-cassation", "demo-co-a-correction"]
  },
  {
    id: "case-demo-coownership-b",
    title: "إزالة الشيوع ببيع العقار — المسار ب / Judicial sale — path B",
    country: "العراق",
    countryCode: "IQ",
    topic: "إزالة الشيوع",
    topicId: "coownership-dissolution",
    courtType: "بداءة/استئناف/تمييز",
    isSynthetic: true,
    dataQuality: "Synthetic comparison path with similar facts and a different final outcome; not a real case.",
    decisionIds: ["demo-co-b-trial", "demo-co-b-appeal", "demo-co-b-cassation"]
  }
];

const crossBorderHeirshipCases = [
  {
    id: "case-demo-cross-border-heirship-305",
    title: "سالم ناصر ضد أولاد أمل فؤاد — قسام شرعي عابر للحدود (أسماء افتراضية) / Cross-border heirship certificate (fictional names)",
    country: "العراق",
    countryCode: "IQ",
    topic: "القسامات الشرعية العابرة للحدود",
    topicId: "cross-border-heirship",
    courtType: "مستند أجنبي/أحوال شخصية/تمييز",
    isSynthetic: true,
    dataQuality: "Synthetic anonymized training scenario based on a recurring procedural pattern; every personal name, case number, and date is fictional or altered.",
    privacyNotice: "قضية تدريبية مجهّلة بالكامل: جميع الأسماء والأرقام والتواريخ افتراضية أو معدّلة. يعرض النموذج مستنداً أجنبياً ثم حكماً من محكمة الأحوال الشخصية وقراراً تمييزياً بالنقض والإعادة. لا يضيف قرار استئناف أو تصحيح تمييزي لأن وجودهما غير متحقق في مادة المثال.",
    parties: {
      deceased: "ليلى ناصر (اسم افتراضي)",
      claimant: "سالم ناصر (اسم افتراضي)",
      predeceasedDaughter: "أمل فؤاد (اسم افتراضي)",
      respondents: "نور وسيف ورُبى، أولاد أمل فؤاد (أسماء افتراضية)"
    },
    legalQuestions: [
      "أي محكمة عراقية تختص بإصدار القسام وفق المادة 305/1 من قانون المرافعات المدنية؟",
      "ما القانون الموضوعي للميراث الذي تشير إليه المادة 22 من القانون المدني؟",
      "هل يستوفي المستند أو الحكم الأجنبي شروط الاعتراف في المادتين 25 و30 من اتفاقية الرياض؟"
    ],
    decisionIds: ["demo-heirship-foreign-record", "demo-heirship-trial", "demo-heirship-cassation"]
  }
];

function coownershipDecision(overrides) {
  return {
    countryCode: "IQ",
    year: 2026,
    issue: "إزالة شيوع عقار غير قابل للقسمة عيناً بطلب البيع / Dissolution of indivisible co-ownership by judicial sale",
    factSummary: "عقار مملوك على الشيوع، وتقرير خبرة تجريبي يقرر تعذر قسمته عيناً دون ضرر جوهري.",
    reasoningSummary: "تسبيب افتراضي صُمم لشرح ربط الوقائع بالنتيجة، ولا ينسب إلى محكمة أو مادة قانونية حقيقية.",
    issueTags: ["إزالة الشيوع", "عقار", "بيع قضائي", "co-ownership", "judicial sale", "indivisible property"],
    factTags: ["عقار على الشيوع", "تعذر القسمة عيناً", "تقرير خبرة", "co-owned", "indivisible", "expert report"],
    registrationStatus: "عقار مملوك على الشيوع / registered co-ownership",
    lawVersion: "Iraqi law — exact provision intentionally omitted from the synthetic demo",
    lawArticles: [],
    factCompleteness: "high",
    sourceIds: [],
    sourceUrl: "",
    isSynthetic: true,
    sourceQuality: "synthetic-demo",
    ...overrides
  };
}

const coownershipDecisions = [
  coownershipDecision({
    id: "demo-co-a-trial", caseId: "case-demo-coownership-a", displayNumber: "DEMO-CO-A/TRIAL", date: "2026-01-12",
    court: "محكمة بداءة افتراضية / Synthetic Court of First Instance", courtLevel: "بداءة", courtTypeId: "first-instance", stage: "بداءة", stageCode: "trial", stageOrder: 1,
    title: "الحكم بإزالة الشيوع بطريق البيع / Order judicial sale", proceduralPosture: "دعوى إزالة شيوع", outcome: "إزالة الشيوع ببيع العقار", outcomeCode: "allow-judicial-sale"
  }),
  coownershipDecision({
    id: "demo-co-a-appeal", caseId: "case-demo-coownership-a", displayNumber: "DEMO-CO-A/APPEAL", date: "2026-02-21",
    court: "محكمة استئناف افتراضية / Synthetic Court of Appeal", courtLevel: "استئناف", courtTypeId: "appeal", stage: "استئناف", stageCode: "appeal", stageOrder: 2,
    title: "تأييد البيع لثبوت تعذر القسمة / Affirm judicial sale", proceduralPosture: "استئناف حكم إزالة الشيوع", outcome: "تأييد الحكم البدائي", outcomeCode: "allow-judicial-sale"
  }),
  coownershipDecision({
    id: "demo-co-a-cassation", caseId: "case-demo-coownership-a", displayNumber: "DEMO-CO-A/CASSATION", date: "2026-03-30",
    court: "محكمة تمييز افتراضية / Synthetic Court of Cassation", courtLevel: "تمييز", courtTypeId: "cassation", stage: "تمييز", stageCode: "cassation", stageOrder: 3,
    title: "نقض الحكم لافتراض نقص الخبرة / Reverse for alleged expert-report gap", proceduralPosture: "تمييز حكم استئنافي", outcome: "نقض الحكم ورد دعوى إزالة الشيوع", outcomeCode: "deny-judicial-sale", correctedBy: "demo-co-a-correction"
  }),
  coownershipDecision({
    id: "demo-co-a-correction", caseId: "case-demo-coownership-a", displayNumber: "DEMO-CO-A/CORRECTION", date: "2026-04-16",
    court: "هيئة تصحيح افتراضية / Synthetic Correction Panel", courtLevel: "تمييز", courtTypeId: "correction", stage: "تصحيح القرار التمييزي", stageCode: "correction", stageOrder: 4,
    title: "تصحيح القرار وتثبيت البيع / Correct and restore judicial sale", proceduralPosture: "طلب تصحيح قرار تمييزي", outcome: "تصحيح القرار التمييزي وتأييد إزالة الشيوع بالبيع", outcomeCode: "allow-judicial-sale", corrects: "demo-co-a-cassation"
  }),
  coownershipDecision({
    id: "demo-co-b-trial", caseId: "case-demo-coownership-b", displayNumber: "DEMO-CO-B/TRIAL", date: "2026-01-18",
    court: "محكمة بداءة افتراضية أخرى / Synthetic Court of First Instance B", courtLevel: "بداءة", courtTypeId: "first-instance", stage: "بداءة", stageCode: "trial", stageOrder: 1,
    title: "رد طلب البيع رغم تعذر القسمة / Deny judicial sale", proceduralPosture: "دعوى إزالة شيوع", outcome: "رد دعوى إزالة الشيوع", outcomeCode: "deny-judicial-sale"
  }),
  coownershipDecision({
    id: "demo-co-b-appeal", caseId: "case-demo-coownership-b", displayNumber: "DEMO-CO-B/APPEAL", date: "2026-02-25",
    court: "محكمة استئناف افتراضية أخرى / Synthetic Court of Appeal B", courtLevel: "استئناف", courtTypeId: "appeal", stage: "استئناف", stageCode: "appeal", stageOrder: 2,
    title: "تأييد رد طلب البيع / Affirm denial", proceduralPosture: "استئناف حكم إزالة الشيوع", outcome: "تأييد رد الدعوى", outcomeCode: "deny-judicial-sale"
  }),
  coownershipDecision({
    id: "demo-co-b-cassation", caseId: "case-demo-coownership-b", displayNumber: "DEMO-CO-B/CASSATION", date: "2026-04-02",
    court: "محكمة تمييز افتراضية أخرى / Synthetic Court of Cassation B", courtLevel: "تمييز", courtTypeId: "cassation", stage: "تمييز", stageCode: "cassation", stageOrder: 3,
    title: "تأييد رد دعوى إزالة الشيوع / Uphold denial", proceduralPosture: "تمييز حكم استئنافي", outcome: "رد الطعن وتأييد عدم البيع", outcomeCode: "deny-judicial-sale"
  })
];

function crossBorderHeirshipDecision(overrides) {
  return {
    countryCode: "IQ",
    year: 2024,
    issue: "تنازع الاختصاص والقانون والاعتراف في قسام شرعي عابر للحدود",
    issueTags: ["قسام شرعي", "إرث عابر للحدود", "الإقامة الدائمة", "تنازع القوانين", "الاعتراف بحكم أجنبي"],
    factTags: ["مورثة أجنبية", "وفاة خارج العراق", "ابنة متوفاة قبل المورثة", "أحفاد", "قسام أجنبي أسبق", "قسام عراقي لاحق"],
    registrationStatus: "لا يتعلق بحالة تسجيل عقاري في النموذج",
    lawVersion: "قانون المرافعات المدنية 83/1969 م305؛ القانون المدني 40/1951 م22؛ اتفاقية الرياض 1983 م25 وم30 — مع التحقق من النسخ والنفاذ",
    lawArticles: ["irq-civil-procedure-83-1969:305", "irq-civil-code-40-1951:22", "regional-riyadh-agreement-1983:25", "regional-riyadh-agreement-1983:30"],
    factCompleteness: "synthetic-anonymized",
    sourceIds: [],
    sourceUrl: "",
    isSynthetic: true,
    sourceQuality: "synthetic-anonymized-demo",
    ...overrides
  };
}

const crossBorderHeirshipDecisions = [
  crossBorderHeirshipDecision({
    id: "demo-heirship-foreign-record",
    caseId: "case-demo-cross-border-heirship-305",
    displayNumber: "DEMO-FOREIGN-QASAM/2014",
    date: "2014-11-12",
    year: 2014,
    court: "جهة أحوال شخصية أجنبية افتراضية / Synthetic foreign personal-status authority",
    courtLevel: "مستند أجنبي",
    courtTypeId: "foreign-record",
    stage: "مستند وراثة أجنبي — واقعة تمهيدية",
    stageCode: "foreign-record",
    stageOrder: 0,
    title: "إصدار مستند وراثة أجنبي أسبق / Earlier foreign heirship record",
    proceduralPosture: "واقعة تمهيدية وليست درجة طعن عراقية",
    factSummary: "في المثال المجهّل، توفيت ليلى ناصر خارج العراق بعد وفاة ابنتها أمل فؤاد. صدر مستند وراثة أجنبي أسبق عدّ سالم ناصر من الورثة ولم يمنح نور وسيف ورُبى، أولاد أمل، حصة على أساس الوصية الواجبة.",
    reasoningSummary: "يفترض النموذج أن الجهة الأجنبية طبقت قانون جنسية المورثة. إدراج المستند هنا لا يعني الاعتراف به تلقائياً في العراق؛ بل يفتح بحث الاختصاص والقانون الواجب التطبيق وشروط الاعتراف.",
    outcome: "مستند أجنبي أسبق يستبعد الأحفاد في الفرض التدريبي",
    outcomeCode: "foreign-heirship-record",
    lawVersion: "قانون أجنبي مفترض في الوقائع التدريبية؛ لم ينسب التطبيق إلى نص أو حكم حقيقي",
    lawArticles: []
  }),
  crossBorderHeirshipDecision({
    id: "demo-heirship-trial",
    caseId: "case-demo-cross-border-heirship-305",
    displayNumber: "DEMO-PS-IQ/TRIAL-2024",
    date: "2024-12-20",
    court: "محكمة أحوال شخصية عراقية افتراضية / Synthetic Iraqi Personal Status Court",
    courtLevel: "أحوال شخصية",
    courtTypeId: "personal-status",
    stage: "أحوال شخصية — أول درجة",
    stageCode: "trial",
    stageOrder: 1,
    title: "رد دعوى تصحيح القسام العراقي / Deny correction of the Iraqi certificate",
    proceduralPosture: "دعوى سالم ناصر لتصحيح أو إبطال قسام عراقي لاحق",
    factSummary: "صدر بعد المستند الأجنبي قسام عراقي تجريبي أدخل نور وسيف ورُبى في الاستحقاق بوصفهم أولاد أمل المتوفاة قبل أمها. أقام سالم ناصر دعوى لتصحيح القسام العراقي والتمسك بالمستند الأجنبي الأسبق.",
    reasoningSummary: "في الفرض التدريبي، رجحت محكمة أول درجة تطبيق أحكام عراقية متعلقة بالوصية الواجبة وبقاء القسام العراقي. هذا تسبيب افتراضي موضوع للطعن، ولا يمثل اتجاهاً قضائياً موثقاً.",
    outcome: "رد دعوى سالم ناصر والإبقاء على القسام العراقي في مرحلة أول درجة",
    outcomeCode: "deny-correction-of-iraqi-qassam"
  }),
  crossBorderHeirshipDecision({
    id: "demo-heirship-cassation",
    caseId: "case-demo-cross-border-heirship-305",
    displayNumber: "DEMO-FCC/CASSATION-2025",
    date: "2025-02-18",
    year: 2025,
    court: "محكمة تمييز اتحادية افتراضية / Synthetic Federal Court of Cassation",
    courtLevel: "تمييز اتحادي",
    courtTypeId: "cassation",
    stage: "تمييز",
    stageCode: "cassation",
    stageOrder: 3,
    title: "النقض والإعادة لاستكمال بحث الاختصاص والقانون والاعتراف / Reverse and remand",
    proceduralPosture: "طعن تمييزي في حكم محكمة الأحوال الشخصية",
    factSummary: "طعن سالم ناصر في رد دعواه، محتجاً بأن محل الإقامة الدائم للمورثة والمستند الأجنبي الأسبق والقانون الواجب التطبيق لم تبحث على نحو مستقل وكافٍ.",
    reasoningSummary: "ينقض القرار التجريبي الحكم لاستكمال التحقيق في محل الإقامة الدائم وفق المادة 305/1، وسبب صدور قسام عراقي لاحق. ثم يفصل بين ثلاث مسائل: المادة 305 للاختصاص بإصدار القسام العراقي، والمادة 22 لتعيين قانون الميراث الموضوعي، والمادتان 25 و30 من اتفاقية الرياض لبحث الاعتراف المشروط بالمستند أو الحكم الأجنبي. لا تُعامل أي منها بديلاً آلياً عن الأخرى.",
    outcome: "نقض الحكم وإعادة الدعوى؛ لا نتيجة نهائية في الموضوع ولا قرار تصحيح تمييزي مدخل في هذا المثال",
    outcomeCode: "allow-remand-for-three-layer-analysis"
  })
];

function stageCode(stage) {
  if (stage === "بداءة") return "trial";
  if (stage === "استئناف") return "appeal";
  if (stage === "تمييز") return "cassation";
  if (stage.includes("تصحيح")) return "correction";
  return "other";
}

export const sources = [
  ...iraqiSources.map((source) => ({ ...source, countryCode: "IQ" })),
  ...additionalSources
];

export const laws = [...iraqiLaws.map(enrichIraqiLaw), ...additionalLaws];

export const cases = [
  ...iraqiCases.map((caseItem) => ({
    ...caseItem,
    countryCode: "IQ",
    topicId: caseItem.topic.includes("التسجيل") ? "inheritance-registration" : "civil"
  })),
  ...coownershipCases,
  ...crossBorderHeirshipCases
];

export const decisions = [
  ...iraqiDecisions.map((decision) => ({
    ...decision,
    countryCode: "IQ",
    courtTypeId: stageCode(decision.stage) === "trial" ? "first-instance" : stageCode(decision.stage),
    stageCode: stageCode(decision.stage)
  })),
  ...coownershipDecisions,
  ...crossBorderHeirshipDecisions
];

export const projectMetadata = {
  ...iraqiProjectMetadata,
  nameAr: "المحامي العالمي",
  nameEn: "Al-Muhami Global",
  taglineAr: "من الدولة إلى القانون والمادة والدعوى والقرار",
  taglineEn: "From jurisdiction to code, article, case, and precedent",
  version: "0.4.4",
  jurisdiction: "Multi-jurisdiction pilot",
  supportedLanguages: languages.map((language) => language.code),
  corpusNotice: "Global architecture pilot: Iraq includes source-linked civil and criminal procedural-route filters, filing checklists, an article 305 workflow, and a fully anonymized cross-border heirship demonstration; France and Egypt remain catalog pilots.",
  legalNotice: "Research assistant only — not legal advice. Verify the complete official text, applicable version, jurisdiction, facts, and procedural record before professional use. / مساعد بحثي وليس استشارة قانونية؛ يجب التحقق من النص الرسمي الكامل والنسخة النافذة."
};
