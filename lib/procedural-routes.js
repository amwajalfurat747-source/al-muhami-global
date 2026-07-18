const CIVIL_PROCEDURE_SOURCE =
  "https://services.gov.krd/sites/default/files/uploaded-laws/%D9%82%D8%A7%D9%86%D9%88%D9%86%20%D8%A7%D9%84%D9%85%D8%B1%D8%A7%D9%81%D8%B9%D8%A7%D8%AA%20%D8%A7%D9%84%D9%85%D8%AF%D9%86%D9%8A%D8%A9.pdf";
const CRIMINAL_PROCEDURE_SOURCE = "https://wiki.dorar-aliraq.net/iraqilaws/law/4895.html";

const text = (en, ar, fr, es) => ({ en, ar, fr, es });

export function proceduralText(values = {}, language = "en") {
  return values[language] ?? values.en ?? values.ar ?? "";
}

export const proceduralTracks = [
  {
    id: "civil",
    names: text("Civil proceedings", "الدعوى المدنية", "Procédure civile", "Procedimiento civil")
  },
  {
    id: "criminal",
    names: text("Criminal proceedings", "الدعوى الجزائية", "Procédure pénale", "Procedimiento penal")
  }
];

export const decisionKinds = [
  {
    id: "civil-default-judgment",
    trackIds: ["civil"],
    names: text("Civil default judgment", "حكم مدني غيابي", "Jugement civil par défaut", "Sentencia civil en rebeldía")
  },
  {
    id: "civil-first-instance-judgment",
    trackIds: ["civil"],
    names: text("Civil first-instance judgment", "حكم مدني بدرجة أولى", "Jugement civil de première instance", "Sentencia civil de primera instancia")
  },
  {
    id: "civil-final-judgment",
    trackIds: ["civil"],
    names: text("Civil judgment at a final degree", "حكم مدني صادر بدرجة أخيرة", "Jugement civil rendu en dernier ressort", "Sentencia civil en última instancia")
  },
  {
    id: "civil-cassation-decision",
    trackIds: ["civil"],
    names: text("Civil cassation decision", "قرار تمييزي مدني", "Décision civile de cassation", "Decisión civil de casación")
  },
  {
    id: "third-party-affected-judgment",
    trackIds: ["civil"],
    names: text("Judgment affecting a non-party", "حكم يمس حق شخص لم يكن خصماً", "Jugement affectant un tiers", "Sentencia que afecta a un tercero")
  },
  {
    id: "order-on-petition",
    trackIds: ["civil"],
    names: text("Order on a petition", "أمر على عريضة", "Ordonnance sur requête", "Orden sobre petición")
  },
  {
    id: "criminal-default-judgment",
    trackIds: ["criminal"],
    names: text("Criminal default judgment", "حكم جزائي غيابي", "Jugement pénal par défaut", "Sentencia penal en rebeldía")
  },
  {
    id: "penal-order",
    trackIds: ["criminal"],
    names: text("Penal order", "أمر جزائي", "Ordonnance pénale", "Orden penal")
  },
  {
    id: "criminal-judgment-or-decision",
    trackIds: ["criminal"],
    names: text("Criminal judgment or challengeable decision", "حكم أو قرار جزائي قابل للطعن", "Jugement ou décision pénale susceptible de recours", "Sentencia o decisión penal recurrible")
  },
  {
    id: "criminal-cassation-decision",
    trackIds: ["criminal"],
    names: text("Criminal cassation decision", "قرار تمييزي جزائي", "Décision pénale de cassation", "Decisión penal de casación")
  },
  {
    id: "criminal-final-conviction",
    trackIds: ["criminal"],
    names: text("Final conviction in a felony or misdemeanor", "حكم نهائي بالإدانة في جناية أو جنحة", "Condamnation définitive pour crime ou délit", "Condena firme por delito grave o menos grave")
  },
  {
    id: "investigative-decision",
    trackIds: ["criminal"],
    names: text("Investigative, arrest, detention, or bail decision", "قرار تحقيق أو قبض أو توقيف أو إطلاق سراح", "Décision d’instruction, d’arrestation, de détention ou de mise en liberté", "Decisión de investigación, arresto, detención o libertad")
  }
];

const civilBasis = (articles, rule) => ({
  instrumentId: "irq-civil-procedure-83-1969",
  instrument: text("Iraqi Civil Procedure Law No. 83 of 1969", "قانون المرافعات المدنية العراقي رقم 83 لسنة 1969", "Loi irakienne de procédure civile n° 83 de 1969", "Ley iraquí de Procedimiento Civil n.º 83 de 1969"),
  articles,
  rule,
  sourceUrl: CIVIL_PROCEDURE_SOURCE,
  sourceType: "official-government-pdf"
});

const criminalBasis = (articles, rule) => ({
  instrumentId: "irq-criminal-procedure-23-1971",
  instrument: text("Iraqi Criminal Procedure Law No. 23 of 1971", "قانون أصول المحاكمات الجزائية العراقي رقم 23 لسنة 1971", "Code irakien de procédure pénale n° 23 de 1971", "Ley iraquí de Procedimiento Penal n.º 23 de 1971"),
  articles,
  rule,
  sourceUrl: CRIMINAL_PROCEDURE_SOURCE,
  sourceType: "accessible-text-mirror"
});

const verifyDeadline = text(
  "Do not rely on an automatic deadline. Verify service, the applicable amendment, any special statute, and interruption or extension rules.",
  "لا تعتمد على حساب آلي للمدة؛ تحقّق من التبليغ والتعديل النافذ والقانون الخاص وأسباب الوقف أو الامتداد.",
  "Ne vous fiez pas à un délai automatique : vérifiez la signification, la version applicable, la loi spéciale et les causes de suspension ou de prorogation.",
  "No confíe en un plazo automático: verifique la notificación, la reforma aplicable, la ley especial y las causas de suspensión o ampliación."
);

export const proceduralRoutes = [
  {
    id: "iq-civil-default-objection",
    countryCode: "IQ",
    trackId: "civil",
    decisionKindIds: ["civil-default-judgment"],
    methodId: "default-objection",
    names: text("Objection to a civil default judgment", "الاعتراض على الحكم الغيابي المدني", "Opposition au jugement civil par défaut", "Oposición a sentencia civil en rebeldía"),
    summaries: text("A route for the party against whom a qualifying civil judgment was issued in default.", "طريق للمحكوم عليه غيابياً في حكم مدني تتوافر فيه شروط القانون.", "Voie ouverte à la partie contre laquelle un jugement civil admissible a été rendu par défaut.", "Vía para la parte contra la que se dictó en rebeldía una sentencia civil admisible."),
    filingAuthorities: text("The court that issued the default judgment", "المحكمة التي أصدرت الحكم الغيابي", "La juridiction qui a rendu le jugement par défaut", "El tribunal que dictó la sentencia en rebeldía"),
    legalBasis: [civilBasis(["168(1)", "177–184"], text("Article 168 lists the objection; articles 177–184 regulate it.", "تدرج المادة 168 الاعتراض ضمن طرق الطعن، وتنظم المواد 177–184 أحكامه.", "L’article 168 énumère l’opposition et les articles 177 à 184 la régissent.", "El artículo 168 enumera la oposición y los artículos 177 a 184 la regulan."))],
    eligibilityChecks: text(["Was the judgment actually issued in default?", "Are you the party against whom it was issued?", "When and how was the judgment served?"], ["هل صدر الحكم غيابياً فعلاً؟", "هل أنت المحكوم عليه بهذا الحكم؟", "متى وكيف تم تبليغ الحكم؟"], ["Le jugement a-t-il réellement été rendu par défaut ?", "Êtes-vous la partie condamnée ?", "Quand et comment le jugement a-t-il été signifié ?"], ["¿La sentencia se dictó realmente en rebeldía?", "¿Es usted la parte condenada?", "¿Cuándo y cómo se notificó?"]),
    exclusions: text(["Not for an in-person judgment", "Not a substitute for appeal or cassation"], ["لا يصلح للحكم الحضوري", "ليس بديلاً عن الاستئناف أو التمييز"], ["Ne vise pas un jugement contradictoire", "Ne remplace ni l’appel ni la cassation"], ["No procede contra una sentencia presencial", "No sustituye a la apelación ni a la casación"]),
    deadline: { status: "verify", labels: verifyDeadline },
    templateId: "tpl-iq-civil-default-objection"
  },
  {
    id: "iq-civil-appeal",
    countryCode: "IQ",
    trackId: "civil",
    decisionKindIds: ["civil-first-instance-judgment"],
    methodId: "appeal",
    names: text("Civil appeal", "الاستئناف المدني", "Appel civil", "Apelación civil"),
    summaries: text("Review of qualifying first-degree judgments of a Court of First Instance; appealability depends on the judgment and any special law.", "مراجعة أحكام محكمة البداءة الصادرة بدرجة أولى متى كانت قابلة للاستئناف؛ وتبقى القابلية مرتبطة بنوع الحكم والقانون الخاص.", "Réexamen des jugements de première instance admissibles ; la recevabilité dépend du jugement et des lois spéciales.", "Revisión de sentencias admisibles de primera instancia; la procedencia depende de la sentencia y de leyes especiales."),
    filingAuthorities: text("The competent Court of Appeal, following the statutory filing procedure", "محكمة الاستئناف المختصة وفق طريق الإيداع القانوني", "La cour d’appel compétente selon la procédure légale", "El tribunal de apelación competente conforme al procedimiento legal"),
    legalBasis: [civilBasis(["168(2)", "185–195"], text("Article 185 identifies appealable first-degree judgments; the following provisions regulate the appeal.", "تحدد المادة 185 الأحكام القابلة للاستئناف وتنظم المواد اللاحقة إجراءاته.", "L’article 185 identifie les jugements susceptibles d’appel et les articles suivants régissent la procédure.", "El artículo 185 identifica las sentencias apelables y los siguientes regulan el procedimiento."))],
    eligibilityChecks: text(["Was the judgment issued at first degree?", "Is it appealable under article 185 or a special statute?", "What is the service date?"], ["هل صدر الحكم بدرجة أولى؟", "هل يقبل الاستئناف وفق المادة 185 أو قانون خاص؟", "ما تاريخ التبليغ؟"], ["Le jugement a-t-il été rendu en premier ressort ?", "Est-il susceptible d’appel selon l’article 185 ou une loi spéciale ?", "Quelle est la date de signification ?"], ["¿Se dictó en primera instancia?", "¿Es apelable conforme al artículo 185 o una ley especial?", "¿Cuál es la fecha de notificación?"]),
    exclusions: text(["The label ‘first instance’ alone does not prove appealability", "Do not use for a criminal matter in this Iraqi pilot"], ["وصف الحكم بأنه أول درجة لا يثبت وحده قابليته للاستئناف", "لا يُستخدم للدعوى الجزائية في هذا النموذج العراقي"], ["La mention « première instance » ne suffit pas à établir la recevabilité", "Ne pas utiliser pour une affaire pénale dans ce pilote irakien"], ["La expresión «primera instancia» no basta para acreditar la procedencia", "No usar para un asunto penal en este piloto iraquí"]),
    deadline: { status: "verify", labels: verifyDeadline },
    templateId: "tpl-iq-civil-appeal"
  },
  {
    id: "iq-civil-retrial",
    countryCode: "IQ",
    trackId: "civil",
    decisionKindIds: ["civil-final-judgment"],
    methodId: "retrial",
    names: text("Civil retrial", "إعادة المحاكمة المدنية", "Révision civile", "Revisión civil"),
    summaries: text("An exceptional route limited to the statutory grounds, such as influential fraud, established forgery, perjury, or a decisive document withheld by the opponent.", "طريق استثنائي محصور بالأسباب القانونية، مثل الغش المؤثر أو ثبوت التزوير أو شهادة الزور أو ظهور ورقة منتجة حجبها الخصم.", "Voie exceptionnelle limitée aux causes légales, notamment fraude déterminante, faux établi, faux témoignage ou pièce décisive dissimulée.", "Vía excepcional limitada a causas legales, como fraude determinante, falsedad acreditada, falso testimonio o documento decisivo ocultado."),
    filingAuthorities: text("The court that issued the challenged judgment", "المحكمة التي أصدرت الحكم المطعون فيه", "La juridiction qui a rendu le jugement attaqué", "El tribunal que dictó la sentencia impugnada"),
    legalBasis: [civilBasis(["168(3)", "196–202"], text("Articles 196–202 restrict retrial to specified judgments, grounds, content, and procedure.", "تحصر المواد 196–202 إعادة المحاكمة بأحكام وأسباب وبيانات وإجراءات محددة.", "Les articles 196 à 202 limitent la révision à des jugements, causes et formalités déterminés.", "Los artículos 196 a 202 limitan la revisión a sentencias, causas y formalidades determinadas."))],
    eligibilityChecks: text(["Is the judgment of a kind listed in article 196?", "Which exact statutory ground applies?", "When did that ground become known or established?"], ["هل الحكم من الأنواع المذكورة في المادة 196؟", "ما السبب القانوني المحدد الذي ينطبق؟", "متى ظهر السبب أو ثبت؟"], ["Le jugement relève-t-il de l’article 196 ?", "Quel motif légal précis s’applique ?", "Quand ce motif a-t-il été découvert ou établi ?"], ["¿La sentencia está comprendida en el artículo 196?", "¿Qué causa legal concreta se aplica?", "¿Cuándo se descubrió o acreditó?"]),
    exclusions: text(["Not a second appeal on the same arguments", "Article 197 excludes a first-degree judgment while appeal remains available"], ["ليست استئنافاً ثانياً للأسباب نفسها", "تستبعد المادة 197 حكم البداءة بدرجة أولى ما دام الاستئناف جائزاً"], ["Ce n’est pas un second appel", "L’article 197 exclut le jugement de premier ressort tant que l’appel est ouvert"], ["No es una segunda apelación", "El artículo 197 excluye la sentencia de primera instancia mientras proceda apelación"]),
    deadline: { status: "verify", labels: text("Article 198 states a 15-day period tied to discovery or establishment of the listed ground. Verify calculation and current amendments.", "تنص المادة 198 على خمسة عشر يوماً مرتبطة بظهور السبب أو ثبوته؛ يجب التحقق من الحساب والتعديلات النافذة.", "L’article 198 prévoit quinze jours liés à la découverte ou à l’établissement du motif ; vérifiez le calcul et les modifications.", "El artículo 198 prevé quince días vinculados al descubrimiento o acreditación de la causa; verifique el cálculo y las reformas.") },
    templateId: "tpl-iq-civil-retrial"
  },
  {
    id: "iq-civil-cassation",
    countryCode: "IQ",
    trackId: "civil",
    decisionKindIds: ["civil-first-instance-judgment", "civil-final-judgment"],
    methodId: "cassation",
    names: text("Civil cassation", "التمييز المدني", "Cassation civile", "Casación civil"),
    summaries: text("Review for statutory legal, jurisdictional, procedural, contradiction, or fundamental errors; availability depends on the challenged judgment.", "رقابة على المخالفة القانونية أو الاختصاص أو الخطأ الإجرائي أو التناقض أو الخطأ الجوهري وفق شروط الحكم المطعون فيه.", "Contrôle des erreurs de droit, de compétence, de procédure, de contradiction ou des erreurs essentielles prévues par la loi.", "Control de errores legales, de competencia, procesales, de contradicción o esenciales previstos por la ley."),
    filingAuthorities: text("The competent Court of Cassation through the legally permitted filing channel", "محكمة التمييز المختصة عبر طريق الإيداع الذي يجيزه القانون", "La cour de cassation compétente par la voie de dépôt prévue par la loi", "El tribunal de casación competente por el canal de presentación legal"),
    legalBasis: [civilBasis(["168(4)", "203–218"], text("Article 203 lists cassation grounds; article 216 covers certain independently challengeable decisions.", "تحدد المادة 203 أسباب التمييز، وتتناول المادة 216 قرارات معينة تقبل التمييز استقلالاً.", "L’article 203 énumère les moyens de cassation et l’article 216 certaines décisions attaquables séparément.", "El artículo 203 enumera los motivos de casación y el 216 determinadas decisiones recurribles separadamente."))],
    eligibilityChecks: text(["What judgment or decision is challenged?", "Which ground in article 203 or special provision applies?", "Is a prior grievance required, as with an order on a petition?"], ["ما الحكم أو القرار المطعون فيه تحديداً؟", "أي سبب من المادة 203 أو نص خاص ينطبق؟", "هل يلزم تظلم سابق كما في الأمر على عريضة؟"], ["Quel jugement ou décision est attaqué ?", "Quel moyen de l’article 203 ou d’un texte spécial s’applique ?", "Un recours préalable est-il requis ?"], ["¿Qué sentencia o decisión se impugna?", "¿Qué motivo del artículo 203 o norma especial se aplica?", "¿Se exige una reclamación previa?"]),
    exclusions: text(["Not every interlocutory decision is independently challengeable", "Do not bypass a required grievance"], ["ليس كل قرار أثناء السير قابلاً للتمييز استقلالاً", "لا تتجاوز التظلم السابق إذا كان واجباً"], ["Toute décision avant dire droit n’est pas attaquable séparément", "Ne contournez pas un recours préalable obligatoire"], ["No toda decisión interlocutoria es recurrible separadamente", "No omita una reclamación previa obligatoria"]),
    deadline: { status: "verify", labels: verifyDeadline },
    templateId: "tpl-iq-civil-cassation"
  },
  {
    id: "iq-civil-cassation-correction",
    countryCode: "IQ",
    trackId: "civil",
    decisionKindIds: ["civil-cassation-decision"],
    methodId: "cassation-correction",
    names: text("Correction of a civil cassation decision", "تصحيح القرار التمييزي المدني", "Rectification d’une décision civile de cassation", "Corrección de decisión civil de casación"),
    summaries: text("A narrow challenge to eligible cassation decisions on the statutory grounds; it is not a general rehearing.", "طعن ضيق في قرارات تمييزية محددة ولأسباب محصورة، وليس إعادة نظر عامة في الدعوى.", "Recours étroit contre certaines décisions de cassation et pour des motifs limités ; ce n’est pas un nouvel examen général.", "Recurso limitado contra determinadas decisiones de casación y por causas tasadas; no es un nuevo examen general."),
    filingAuthorities: text("The competent correction panel of the Court of Cassation", "هيئة التصحيح المختصة في محكمة التمييز", "La formation de rectification compétente de la Cour de cassation", "La sala de corrección competente del Tribunal de Casación"),
    legalBasis: [civilBasis(["168(5)", "219–223"], text("Articles 219–223 define eligible decisions, grounds, exclusions, and procedure.", "تحدد المواد 219–223 القرارات المقبولة والأسباب والموانع والإجراءات.", "Les articles 219 à 223 définissent décisions admissibles, motifs, exclusions et procédure.", "Los artículos 219 a 223 definen decisiones admisibles, causas, exclusiones y procedimiento."))],
    eligibilityChecks: text(["Is the cassation decision one that article 219 permits correcting?", "Was a pleaded decisive legal ground omitted, an express text violated, or the decision internally/in-case contradictory?", "Was the decision issued by the General Panel?"], ["هل القرار التمييزي من القرارات التي تجيز المادة 219 تصحيحها؟", "هل أُغفل سبب قانوني منتج أو خولف نص صريح أو وقع تناقض بالمعنى القانوني؟", "هل صدر القرار من الهيئة العامة؟"], ["La décision est-elle rectifiable selon l’article 219 ?", "Un moyen décisif a-t-il été omis, un texte exprès violé ou une contradiction légale constatée ?", "La décision émane-t-elle de l’assemblée plénière ?"], ["¿La decisión es corregible conforme al artículo 219?", "¿Se omitió un motivo decisivo, se infringió un texto expreso o existe contradicción legal?", "¿La dictó el pleno?"]),
    exclusions: text(["Article 220 excludes decisions of the General Panel", "Do not relitigate grounds outside the correction petition"], ["تستبعد المادة 220 قرارات الهيئة العامة", "لا تُعد مناقشة أسباب خارج عريضة التصحيح"], ["L’article 220 exclut les décisions de l’assemblée plénière", "Ne soulevez pas de motifs hors de la requête"], ["El artículo 220 excluye decisiones del pleno", "No replantee motivos fuera de la solicitud"]),
    deadline: { status: "verify", labels: verifyDeadline },
    templateId: "tpl-iq-civil-cassation-correction"
  },
  {
    id: "iq-civil-third-party-objection",
    countryCode: "IQ",
    trackId: "civil",
    decisionKindIds: ["third-party-affected-judgment"],
    methodId: "third-party-objection",
    names: text("Third-party objection", "اعتراض الغير", "Tierce opposition", "Oposición de tercero"),
    summaries: text("For a person who was not a party, representative, or third person in the case when the judgment extends to or prejudices that person’s rights.", "لمن لم يكن خصماً ولا ممثلاً ولا شخصاً ثالثاً في الدعوى وكان الحكم متعدياً إليه أو ماساً بحقوقه.", "Pour la personne qui n’était ni partie, ni représentée, ni tiers intervenant et dont les droits sont atteints par le jugement.", "Para quien no fue parte, representante ni tercero interviniente y cuyos derechos resultan afectados por la sentencia."),
    filingAuthorities: text("Original objection: the court that issued the judgment; incidental objection follows article 225", "الاعتراض الأصلي أمام المحكمة التي أصدرت الحكم، والطارئ وفق المادة 225", "Opposition principale devant la juridiction ayant rendu le jugement ; opposition incidente selon l’article 225", "Oposición principal ante el tribunal que dictó la sentencia; incidental conforme al artículo 225"),
    legalBasis: [civilBasis(["168(6)", "224–230"], text("Article 224 defines standing; article 225 distinguishes original and incidental objection.", "تحدد المادة 224 صفة المعترض، وتميز المادة 225 بين الاعتراض الأصلي والطارئ.", "L’article 224 définit la qualité et l’article 225 distingue opposition principale et incidente.", "El artículo 224 define la legitimación y el 225 distingue oposición principal e incidental."))],
    eligibilityChecks: text(["Were you absent from the original case in every relevant capacity?", "Does the judgment extend to or prejudice your own right?", "Is an original or incidental objection procedurally appropriate?"], ["هل لم تكن خصماً أو ممثلاً أو شخصاً ثالثاً في الدعوى الأصلية؟", "هل الحكم متعدٍ إليك أو ماس بحقك الشخصي؟", "هل الاعتراض الأصلي أم الطارئ هو المناسب إجرائياً؟"], ["Étiez-vous absent de l’instance dans toutes les qualités pertinentes ?", "Le jugement porte-t-il atteinte à votre droit propre ?", "L’opposition principale ou incidente convient-elle ?"], ["¿Estuvo ausente del proceso en toda calidad relevante?", "¿La sentencia perjudica un derecho propio?", "¿Procede oposición principal o incidental?"]),
    exclusions: text(["Not for an original party who can use another remedy", "Not merely because the reasoning is unfavorable"], ["لا يصلح للخصم الأصلي الذي يملك طريق طعن آخر", "لا يكفي مجرد عدم الموافقة على التسبيب"], ["Ne vise pas une partie initiale disposant d’un autre recours", "Un simple désaccord avec les motifs ne suffit pas"], ["No procede para una parte original con otro recurso", "No basta discrepar del razonamiento"]),
    deadline: { status: "verify", labels: text("Article 230 ties availability to execution against the affected person and, in other circumstances, limitation rules. Verify the record before filing.", "تربط المادة 230 الحق بالتنفيذ على المعترض وبقواعد التقادم في حالات أخرى؛ يجب تدقيق الإضبارة قبل الإيداع.", "L’article 230 lie la recevabilité à l’exécution contre le tiers et, selon le cas, à la prescription ; vérifiez le dossier.", "El artículo 230 vincula la procedencia a la ejecución contra el tercero y, según el caso, a la prescripción; verifique el expediente.") },
    templateId: "tpl-iq-civil-third-party-objection"
  },
  {
    id: "iq-civil-petition-order-grievance",
    countryCode: "IQ",
    trackId: "civil",
    decisionKindIds: ["order-on-petition"],
    methodId: "grievance",
    names: text("Grievance against an order on a petition", "التظلم من الأمر على عريضة", "Recours contre une ordonnance sur requête", "Reclamación contra una orden sobre petición"),
    summaries: text("A specific grievance before the issuing court for the person against whom the order was issued, or the applicant whose request was refused.", "تظلم خاص أمام المحكمة مصدرة الأمر لمن صدر الأمر ضده أو للطالب عند رفض طلبه.", "Recours spécifique devant la juridiction qui a rendu l’ordonnance, ouvert à la personne visée ou au demandeur débouté.", "Reclamación específica ante el tribunal emisor para la persona afectada o el solicitante rechazado."),
    filingAuthorities: text("The court that issued or refused the order", "المحكمة التي أصدرت الأمر أو رفضت الطلب", "La juridiction qui a rendu ou refusé l’ordonnance", "El tribunal que dictó o rechazó la orden"),
    legalBasis: [civilBasis(["151–153", "216"], text("Article 153 regulates the grievance; article 216 requires it before cassation of an order on a petition.", "تنظم المادة 153 التظلم، وتشترط المادة 216 وقوعه قبل تمييز الأمر على عريضة.", "L’article 153 régit le recours et l’article 216 l’exige avant la cassation de l’ordonnance.", "El artículo 153 regula la reclamación y el 216 la exige antes de la casación de la orden."))],
    eligibilityChecks: text(["Is the challenged act truly an order on a petition?", "Are you the affected person or the refused applicant?", "What is the issuance or service date?"], ["هل القرار أمر على عريضة فعلاً؟", "هل أنت من صدر الأمر ضده أو الطالب المرفوض طلبه؟", "ما تاريخ الإصدار أو التبليغ؟"], ["L’acte est-il réellement une ordonnance sur requête ?", "Êtes-vous la personne visée ou le demandeur débouté ?", "Quelle est la date de l’ordonnance ou de sa signification ?"], ["¿Es realmente una orden sobre petición?", "¿Es la persona afectada o el solicitante rechazado?", "¿Cuál es la fecha de emisión o notificación?"]),
    exclusions: text(["This is not a general grievance against every judicial or administrative decision", "Cassation normally follows the grievance, not the unchallenged order itself"], ["ليس تظلماً عاماً من كل قرار قضائي أو إداري", "تمييز الأمر يكون بعد التظلم لا بتجاوز هذه المرحلة"], ["Ce n’est pas un recours général contre toute décision judiciaire ou administrative", "La cassation intervient normalement après ce recours"], ["No es una reclamación general contra toda decisión judicial o administrativa", "La casación normalmente sigue a la reclamación"]),
    deadline: { status: "statutory-check", labels: text("Article 153 states three days from issuance or service, depending on the party. Verify the applicable text and calculation immediately.", "تنص المادة 153 على ثلاثة أيام من إصدار الأمر أو تبليغه بحسب صفة المتظلم؛ يجب التحقق فوراً من النص النافذ وطريقة الحساب.", "L’article 153 prévoit trois jours à compter du prononcé ou de la signification selon la partie ; vérifiez immédiatement le texte applicable et le calcul.", "El artículo 153 prevé tres días desde la emisión o notificación según la parte; verifique de inmediato el texto aplicable y el cómputo.") },
    templateId: "tpl-iq-civil-order-grievance"
  },
  {
    id: "iq-criminal-default-objection",
    countryCode: "IQ",
    trackId: "criminal",
    decisionKindIds: ["criminal-default-judgment"],
    methodId: "default-objection",
    names: text("Objection to a criminal default judgment", "الاعتراض على الحكم الغيابي الجزائي", "Opposition au jugement pénal par défaut", "Oposición a sentencia penal en rebeldía"),
    summaries: text("The criminal-law objection route for an eligible default judgment; conditions depend on the accused’s status and the judgment.", "طريق الاعتراض الجزائي على الحكم الغيابي المقبول قانوناً، وتختلف شروطه بحسب صفة المتهم والحكم.", "Voie pénale contre un jugement par défaut admissible ; les conditions dépendent du statut du prévenu et du jugement.", "Vía penal contra una sentencia en rebeldía admisible; las condiciones dependen del acusado y la sentencia."),
    filingAuthorities: text("The criminal court that issued the default judgment, under the statutory procedure", "المحكمة الجزائية التي أصدرت الحكم الغيابي وفق الإجراء القانوني", "La juridiction pénale ayant rendu le jugement par défaut", "El tribunal penal que dictó la sentencia en rebeldía"),
    legalBasis: [criminalBasis(["243–248"], text("Chapter One of Book Four regulates objection to default judgments.", "ينظم الفصل الأول من الكتاب الرابع الاعتراض على الأحكام الغيابية.", "Le chapitre I du livre IV régit l’opposition aux jugements par défaut.", "El capítulo I del libro IV regula la oposición a sentencias en rebeldía."))],
    eligibilityChecks: text(["Was the criminal judgment issued in default?", "Does the statutory objection remain available for this accused and judgment?", "When was arrest, surrender, or service?"], ["هل صدر الحكم الجزائي غيابياً؟", "هل ما زال الاعتراض جائزاً لهذا المتهم وهذا الحكم؟", "متى حصل القبض أو التسليم أو التبليغ؟"], ["Le jugement pénal a-t-il été rendu par défaut ?", "L’opposition reste-t-elle ouverte pour ce prévenu et ce jugement ?", "Quand ont eu lieu arrestation, comparution ou signification ?"], ["¿La sentencia penal se dictó en rebeldía?", "¿Sigue disponible la oposición para este acusado y sentencia?", "¿Cuándo hubo arresto, entrega o notificación?"]),
    exclusions: text(["Not for an in-person criminal judgment", "Do not copy civil deadlines into a criminal case"], ["لا يصلح للحكم الجزائي الحضوري", "لا تُنقل مدد المرافعات المدنية إلى الدعوى الجزائية"], ["Ne vise pas un jugement pénal contradictoire", "Ne transposez pas les délais civils au pénal"], ["No procede contra sentencia penal presencial", "No traslade plazos civiles al proceso penal"]),
    deadline: { status: "verify", labels: verifyDeadline },
    templateId: "tpl-iq-criminal-default-objection"
  },
  {
    id: "iq-criminal-penal-order-objection",
    countryCode: "IQ",
    trackId: "criminal",
    decisionKindIds: ["penal-order"],
    methodId: "penal-order-objection",
    names: text("Objection to a penal order", "الاعتراض على الأمر الجزائي", "Opposition à l’ordonnance pénale", "Oposición a la orden penal"),
    summaries: text("A specific objection to a penal order; it should not be confused with objection to a default judgment.", "اعتراض خاص على الأمر الجزائي، ولا يخلط مع الاعتراض على الحكم الغيابي.", "Opposition spécifique à une ordonnance pénale, distincte de l’opposition à un jugement par défaut.", "Oposición específica a una orden penal, distinta de la oposición a sentencia en rebeldía."),
    filingAuthorities: text("The court that issued the penal order", "المحكمة التي أصدرت الأمر الجزائي", "La juridiction ayant rendu l’ordonnance pénale", "El tribunal que dictó la orden penal"),
    legalBasis: [criminalBasis(["207"], text("Article 207 permits the accused to object to the penal order under its stated conditions.", "تجيز المادة 207 للمتهم الاعتراض على الأمر الجزائي وفق شروطها.", "L’article 207 permet au prévenu de former opposition dans les conditions qu’il fixe.", "El artículo 207 permite al acusado oponerse en las condiciones que establece."))],
    eligibilityChecks: text(["Is the instrument a penal order under article 205 et seq.?", "Are you the accused entitled to object?", "When was it pronounced or served?"], ["هل السند أمر جزائي وفق المواد 205 وما بعدها؟", "هل أنت المتهم صاحب حق الاعتراض؟", "متى صدر أو بُلّغ؟"], ["S’agit-il d’une ordonnance pénale au sens des articles 205 et suivants ?", "Êtes-vous le prévenu habilité ?", "Quand a-t-elle été prononcée ou signifiée ?"], ["¿Es una orden penal de los artículos 205 y siguientes?", "¿Es usted el acusado legitimado?", "¿Cuándo se dictó o notificó?"]),
    exclusions: text(["Not a generic objection to any criminal decision", "Not the civil objection route"], ["ليس اعتراضاً عاماً على أي قرار جزائي", "ليس طريق الاعتراض المدني"], ["Ce n’est pas une opposition générale à toute décision pénale", "Ce n’est pas la voie civile"], ["No es una oposición general a toda decisión penal", "No es la vía civil"]),
    deadline: { status: "statutory-check", labels: text("Article 207 states seven days, tied to pronouncement in presence or service. Verify the exact trigger and current text.", "تنص المادة 207 على سبعة أيام مرتبطة بالتفهيم حضورياً أو التبليغ؛ يجب التحقق من نقطة البدء والنص النافذ.", "L’article 207 prévoit sept jours, liés au prononcé en présence ou à la signification ; vérifiez le point de départ.", "El artículo 207 prevé siete días, vinculados al pronunciamiento presencial o notificación; verifique el inicio.") },
    templateId: "tpl-iq-criminal-penal-order-objection"
  },
  {
    id: "iq-criminal-cassation",
    countryCode: "IQ",
    trackId: "criminal",
    decisionKindIds: ["criminal-judgment-or-decision", "investigative-decision"],
    methodId: "cassation",
    names: text("Criminal cassation", "التمييز الجزائي", "Cassation pénale", "Casación penal"),
    summaries: text("The principal Iraqi criminal review route for qualifying judgments, decisions, and measures on the statutory grounds.", "طريق المراجعة الجزائية الرئيس للأحكام والقرارات والتدابير التي يجيز القانون تمييزها وللأسباب المحددة.", "Principale voie irakienne de contrôle des jugements, décisions et mesures pénales admissibles.", "Principal vía iraquí de revisión de sentencias, decisiones y medidas penales admisibles."),
    filingAuthorities: text("The competent criminal cassation court or panel under the governing jurisdiction rules", "محكمة أو هيئة التمييز الجزائية المختصة وفق قواعد الاختصاص", "La juridiction ou formation pénale de cassation compétente", "El tribunal o sala penal de casación competente"),
    legalBasis: [criminalBasis(["249–265"], text("Article 249 identifies eligible challengers and grounds; the chapter regulates cassation and separately challengeable decisions.", "تحدد المادة 249 أصحاب الحق وأسباب الطعن، وينظم الفصل التمييز والقرارات التي يجوز الطعن فيها استقلالاً.", "L’article 249 définit les personnes habilitées et les moyens ; le chapitre régit la cassation et certaines décisions séparément attaquables.", "El artículo 249 define legitimados y motivos; el capítulo regula la casación y determinadas decisiones recurribles separadamente."))],
    eligibilityChecks: text(["Who is challenging and do they have standing under article 249?", "Is the judgment, decision, or measure independently challengeable?", "Which legal, procedural, evidentiary, or sentencing ground applies?"], ["من هو الطاعن وهل يملك الصفة وفق المادة 249؟", "هل الحكم أو القرار أو التدبير يقبل الطعن استقلالاً؟", "ما سبب الطعن القانوني أو الإجرائي أو الإثباتي أو المتعلق بالعقوبة؟"], ["Qui forme le pourvoi et a-t-il qualité selon l’article 249 ?", "La décision ou mesure est-elle séparément attaquable ?", "Quel moyen juridique, procédural, probatoire ou relatif à la peine s’applique ?"], ["¿Quién recurre y tiene legitimación según el artículo 249?", "¿La decisión o medida es recurrible separadamente?", "¿Qué motivo legal, procesal, probatorio o de pena se aplica?"]),
    exclusions: text(["This pilot does not label ordinary criminal review as ‘appeal’", "Most interlocutory decisions are not independently challengeable unless the law permits it"], ["لا يسمي هذا النموذج المراجعة الجزائية العادية «استئنافاً»", "غالب القرارات أثناء السير لا تطعن استقلالاً إلا بنص"], ["Ce pilote ne qualifie pas le recours pénal ordinaire d’« appel »", "La plupart des décisions interlocutoires ne sont pas séparément attaquables sans texte"], ["Este piloto no denomina «apelación» a la revisión penal ordinaria", "La mayoría de decisiones interlocutorias no son recurribles separadamente sin norma"]),
    deadline: { status: "verify", labels: verifyDeadline },
    templateId: "tpl-iq-criminal-cassation"
  },
  {
    id: "iq-criminal-cassation-correction",
    countryCode: "IQ",
    trackId: "criminal",
    decisionKindIds: ["criminal-cassation-decision"],
    methodId: "cassation-correction",
    names: text("Correction of a criminal cassation decision", "تصحيح القرار التمييزي الجزائي", "Rectification d’une décision pénale de cassation", "Corrección de decisión penal de casación"),
    summaries: text("A limited request to correct an eligible criminal cassation decision, subject to statutory exclusions.", "طلب محدود لتصحيح قرار تمييزي جزائي يقبل التصحيح، مع مراعاة الاستثناءات القانونية.", "Demande limitée de rectification d’une décision pénale de cassation admissible, sous réserve des exclusions légales.", "Solicitud limitada de corrección de una decisión penal de casación admisible, sujeta a exclusiones legales."),
    filingAuthorities: text("The competent correction authority within the criminal cassation system", "جهة التصحيح المختصة ضمن القضاء التمييزي الجزائي", "L’autorité de rectification compétente au sein de la cassation pénale", "La autoridad de corrección competente en la casación penal"),
    legalBasis: [criminalBasis(["266–269"], text("Articles 266–269 regulate the request and exclude categories such as reversal/remand decisions described by article 267.", "تنظم المواد 266–269 الطلب، وتستبعد المادة 267 فئات منها قرارات النقض والإعادة المبينة فيها.", "Les articles 266 à 269 régissent la demande et l’article 267 exclut notamment certaines décisions de cassation avec renvoi.", "Los artículos 266 a 269 regulan la solicitud y el 267 excluye, entre otras, ciertas decisiones de anulación y reenvío."))],
    eligibilityChecks: text(["Is this a cassation decision eligible for correction?", "Does article 267 exclude it?", "What precise correction ground is relied on?"], ["هل القرار التمييزي يقبل التصحيح؟", "هل تستبعده المادة 267؟", "ما سبب التصحيح المحدد؟"], ["La décision est-elle rectifiable ?", "L’article 267 l’exclut-il ?", "Quel motif précis est invoqué ?"], ["¿La decisión es corregible?", "¿La excluye el artículo 267?", "¿Qué motivo concreto se invoca?"]),
    exclusions: text(["Not a general second cassation", "Reversal/remand categories identified in article 267 are excluded"], ["ليس تمييزاً ثانياً عاماً", "تستبعد فئات النقض والإعادة المحددة في المادة 267"], ["Ce n’est pas un second pourvoi général", "Les catégories de cassation avec renvoi visées à l’article 267 sont exclues"], ["No es una segunda casación general", "Se excluyen las categorías de anulación y reenvío del artículo 267"]),
    deadline: { status: "statutory-check", labels: text("Article 266 states thirty days for the correction request. Verify the trigger, eligibility, and current text.", "تنص المادة 266 على ثلاثين يوماً لطلب التصحيح؛ يجب التحقق من نقطة البدء والقابلية والنص النافذ.", "L’article 266 prévoit trente jours ; vérifiez le point de départ, la recevabilité et le texte applicable.", "El artículo 266 prevé treinta días; verifique el inicio, la procedencia y el texto aplicable.") },
    templateId: "tpl-iq-criminal-cassation-correction"
  },
  {
    id: "iq-criminal-retrial",
    countryCode: "IQ",
    trackId: "criminal",
    decisionKindIds: ["criminal-final-conviction"],
    methodId: "retrial",
    names: text("Criminal retrial", "إعادة المحاكمة الجزائية", "Révision pénale", "Revisión penal"),
    summaries: text("An extraordinary route limited to final convictions or measures in a felony or misdemeanor and the cases enumerated in article 270.", "طريق استثنائي محصور بالحكم النهائي بالإدانة أو التدبير في جناية أو جنحة وبالحالات المعددة في المادة 270.", "Voie extraordinaire limitée aux condamnations ou mesures définitives pour crime ou délit et aux cas de l’article 270.", "Vía extraordinaria limitada a condenas o medidas firmes por delito y a los casos del artículo 270."),
    filingAuthorities: text("Request submitted to the Public Prosecution under article 271 for the statutory review path", "يقدم الطلب إلى الادعاء العام وفق المادة 271 لسلوك طريق المراجعة القانوني", "Demande présentée au ministère public selon l’article 271", "Solicitud presentada al Ministerio Público conforme al artículo 271"),
    legalBasis: [criminalBasis(["270–279"], text("Article 270 enumerates the cases; article 271 identifies who may apply and requires submission to the Public Prosecution.", "تعدد المادة 270 الحالات، وتحدد المادة 271 من يطلب وتوجب تقديمه إلى الادعاء العام.", "L’article 270 énumère les cas et l’article 271 identifie les demandeurs et impose la saisine du ministère public.", "El artículo 270 enumera los casos y el 271 identifica solicitantes y exige presentación al Ministerio Público."))],
    eligibilityChecks: text(["Is there a final conviction or measure in a felony or misdemeanor?", "Which exact case in article 270 applies?", "Who is entitled to submit under article 271?"], ["هل يوجد حكم نهائي بالإدانة أو تدبير في جناية أو جنحة؟", "أي حالة محددة من المادة 270 تنطبق؟", "من يملك تقديم الطلب وفق المادة 271؟"], ["Existe-t-il une condamnation ou mesure définitive pour crime ou délit ?", "Quel cas précis de l’article 270 s’applique ?", "Qui peut présenter la demande selon l’article 271 ?"], ["¿Existe condena o medida firme por delito?", "¿Qué caso concreto del artículo 270 se aplica?", "¿Quién puede presentar según el artículo 271?"]),
    exclusions: text(["Not available merely because the convicted person disputes the evidence", "Not for an acquittal or a non-final judgment under the article 270 formulation"], ["لا يكفي مجرد منازعة المحكوم عليه في تقدير الأدلة", "لا يُبنى على البراءة أو الحكم غير النهائي وفق صياغة المادة 270"], ["Un simple désaccord sur l’appréciation des preuves ne suffit pas", "La formulation de l’article 270 ne vise pas un acquittement ou un jugement non définitif"], ["No basta discrepar de la valoración de la prueba", "La formulación del artículo 270 no cubre absolución o sentencia no firme"]),
    deadline: { status: "verify", labels: verifyDeadline },
    templateId: "tpl-iq-criminal-retrial"
  }
];

const challengeSections = text(
  ["Competent court or authority", "Parties, capacities, and addresses", "Challenged judgment or decision: court, number, date, and service", "Admissibility and timeliness", "Concise procedural history and facts", "Numbered legal grounds", "Requested relief", "Attachments, copies, signature, and date"],
  ["المحكمة أو الجهة المختصة", "أسماء الأطراف وصفاتهم وعناوينهم", "الحكم أو القرار المطعون فيه: المحكمة والعدد والتاريخ والتبليغ", "القابلية والمدة القانونية", "الوقائع والمسار الإجرائي بإيجاز", "أسباب الطعن مرقمة", "الطلبات", "المرفقات والنسخ والتوقيع والتاريخ"],
  ["Juridiction ou autorité compétente", "Parties, qualités et adresses", "Décision attaquée : juridiction, numéro, date et signification", "Recevabilité et délai", "Faits et historique procédural concis", "Moyens numérotés", "Demandes", "Pièces, copies, signature et date"],
  ["Tribunal o autoridad competente", "Partes, calidades y domicilios", "Decisión impugnada: tribunal, número, fecha y notificación", "Procedencia y plazo", "Hechos e historial procesal concisos", "Motivos numerados", "Peticiones", "Anexos, copias, firma y fecha"]
);

const challengeAttachments = text(
  ["Certified or legally acceptable copy of the challenged decision", "Proof of service or the event starting the period", "Power of attorney or proof of capacity where required", "Documents supporting each pleaded ground", "Required copies, fees, and security—after current-law verification"],
  ["نسخة مصدقة أو مقبولة قانوناً من القرار المطعون فيه", "دليل التبليغ أو الواقعة التي تبدأ منها المدة", "الوكالة أو ما يثبت الصفة عند اللزوم", "المستندات المؤيدة لكل سبب", "النسخ والرسم والتأمينات المطلوبة بعد التحقق من النص النافذ"],
  ["Copie certifiée ou légalement admissible de la décision", "Preuve de signification ou du fait déclenchant le délai", "Mandat ou preuve de qualité si nécessaire", "Pièces à l’appui de chaque moyen", "Copies, frais et consignation après vérification du droit actuel"],
  ["Copia certificada o legalmente admisible de la decisión", "Prueba de notificación o hecho inicial del plazo", "Poder o prueba de representación si procede", "Documentos que apoyan cada motivo", "Copias, tasas y garantía tras verificar la ley vigente"]
);

const challengeQuestions = text(
  ["What exact decision is being challenged?", "Who has standing to challenge it?", "What event starts the deadline?", "Which statutory ground matches each requested remedy?", "Is another route mandatory before this one?"],
  ["ما القرار المطعون فيه تحديداً؟", "من يملك صفة الطعن؟", "ما الواقعة التي تبدأ منها المدة؟", "أي سبب قانوني يطابق كل طلب؟", "هل يوجد طريق واجب قبل هذا الطريق؟"],
  ["Quelle décision précise est attaquée ?", "Qui a qualité pour agir ?", "Quel fait déclenche le délai ?", "Quel fondement légal correspond à chaque demande ?", "Un recours préalable est-il obligatoire ?"],
  ["¿Qué decisión exacta se impugna?", "¿Quién tiene legitimación?", "¿Qué hecho inicia el plazo?", "¿Qué fundamento legal corresponde a cada petición?", "¿Existe una vía previa obligatoria?"]
);

const routeTemplate = (id, routeId, trackId, titles, focus) => ({
  id,
  routeId,
  trackId,
  type: "challenge",
  titles,
  purposes: text("Structured drafting checklist; not an auto-filed pleading.", "قائمة صياغة منظمة وليست عريضة مودعة تلقائياً.", "Liste structurée de rédaction, non déposée automatiquement.", "Lista estructurada de redacción; no se presenta automáticamente."),
  requiredSections: challengeSections,
  focusSections: focus,
  requiredAttachments: challengeAttachments,
  validationQuestions: challengeQuestions
});

export const filingTemplates = [
  {
    id: "tpl-iq-civil-statement-of-claim",
    routeId: null,
    trackId: "civil",
    type: "initial-filing",
    titles: text("Civil statement of claim", "عريضة دعوى مدنية", "Assignation ou requête civile", "Demanda civil"),
    purposes: text("Start a civil case using a structured, fact-led checklist.", "بدء دعوى مدنية بقائمة منظمة تقودها الوقائع والاختصاص.", "Introduire une affaire civile avec une liste structurée centrée sur les faits.", "Iniciar un asunto civil con una lista estructurada basada en hechos."),
    requiredSections: text(["Competent court and basis of jurisdiction", "Claimant and defendant details and capacities", "Subject and value of the claim", "Chronology of material facts", "Legal basis without invented authorities", "Evidence and witnesses", "Specific relief requested", "Copies, fees, signature, and date"], ["المحكمة المختصة وسند الاختصاص", "بيانات المدعي والمدعى عليه وصفاتهما", "موضوع الدعوى وقيمتها", "تسلسل الوقائع الجوهرية", "السند القانوني دون اختلاق نصوص", "الأدلة والشهود", "الطلبات المحددة", "النسخ والرسم والتوقيع والتاريخ"], ["Juridiction compétente et fondement", "Identité et qualité des parties", "Objet et valeur de la demande", "Chronologie des faits essentiels", "Fondement juridique sans autorité inventée", "Preuves et témoins", "Demandes précises", "Copies, frais, signature et date"], ["Tribunal competente y fundamento", "Datos y calidades de las partes", "Objeto y cuantía", "Cronología de hechos esenciales", "Fundamento jurídico sin autoridades inventadas", "Pruebas y testigos", "Peticiones concretas", "Copias, tasas, firma y fecha"]),
    focusSections: text(["Separate facts from legal conclusions", "Explain territorial, subject-matter, and value jurisdiction"], ["افصل الوقائع عن التكييف القانوني", "بيّن الاختصاص المكاني والنوعي والقيمي"], ["Séparer les faits des conclusions juridiques", "Expliquer les compétences territoriale, matérielle et selon la valeur"], ["Separar hechos de conclusiones jurídicas", "Explicar competencia territorial, material y por cuantía"]),
    requiredAttachments: text(["Identity and capacity documents", "Documents establishing the claim", "Jurisdiction documents", "Power of attorney where required", "Copies and fees after verification"], ["مستندات الهوية والصفة", "المستندات المثبتة للحق", "مستندات الاختصاص", "الوكالة عند اللزوم", "النسخ والرسم بعد التحقق"], ["Identité et qualité", "Pièces établissant la demande", "Pièces de compétence", "Mandat si nécessaire", "Copies et frais après vérification"], ["Identidad y representación", "Documentos del derecho", "Documentos de competencia", "Poder si procede", "Copias y tasas tras verificación"]),
    validationQuestions: text(["What right was violated?", "Against whom?", "What facts can be proved?", "Why is this court competent?", "What exact order should the court make?"], ["ما الحق المعتدى عليه؟", "في مواجهة من؟", "ما الوقائع القابلة للإثبات؟", "لماذا تختص هذه المحكمة؟", "ما الحكم المحدد المطلوب؟"], ["Quel droit est violé ?", "Contre qui ?", "Quels faits peuvent être prouvés ?", "Pourquoi cette juridiction est-elle compétente ?", "Quelle décision précise est demandée ?"], ["¿Qué derecho fue vulnerado?", "¿Contra quién?", "¿Qué hechos pueden probarse?", "¿Por qué es competente este tribunal?", "¿Qué decisión concreta se solicita?"])
  },
  {
    id: "tpl-iq-criminal-complaint",
    routeId: null,
    trackId: "criminal",
    type: "initial-filing",
    titles: text("Criminal complaint", "شكوى جزائية", "Plainte pénale", "Denuncia penal"),
    purposes: text("Record a criminal allegation without fabricating facts, evidence, or a definitive charge.", "تنظيم الإخبار أو الشكوى الجزائية دون اختلاق الوقائع أو الأدلة أو الجزم بالوصف الجرمي.", "Structurer une plainte sans inventer les faits, les preuves ni une qualification définitive.", "Estructurar una denuncia sin inventar hechos, pruebas ni calificación definitiva."),
    requiredSections: text(["Competent investigative or judicial authority", "Complainant and capacity", "Reported person if known", "Time, place, and chronological facts", "Harm and immediate risks", "Available evidence and preservation requests", "Witnesses and contact route", "Requested lawful action", "Signature and date"], ["جهة التحقيق أو القضاء المختصة", "بيانات المشتكي وصفته", "المشكو منه إن كان معلوماً", "زمان ومكان وتسلسل الوقائع", "الضرر والمخاطر العاجلة", "الأدلة المتاحة وطلبات حفظها", "الشهود وطريقة التواصل", "الإجراء القانوني المطلوب", "التوقيع والتاريخ"], ["Autorité d’enquête ou judiciaire compétente", "Plaignant et qualité", "Personne mise en cause si connue", "Temps, lieu et chronologie", "Préjudice et risques immédiats", "Preuves et demandes de conservation", "Témoins", "Mesure légale demandée", "Signature et date"], ["Autoridad investigadora o judicial competente", "Denunciante y calidad", "Persona denunciada si se conoce", "Tiempo, lugar y cronología", "Daño y riesgos inmediatos", "Pruebas y solicitudes de conservación", "Testigos", "Actuación legal solicitada", "Firma y fecha"]),
    focusSections: text(["Use observable facts and identify uncertainty", "Request preservation of volatile evidence where lawful"], ["اكتب الوقائع المشاهدة وبيّن مواضع عدم اليقين", "اطلب حفظ الدليل القابل للزوال عند جوازه"], ["Décrire les faits observables et signaler l’incertitude", "Demander la conservation des preuves volatiles si légal"], ["Describir hechos observables e indicar incertidumbre", "Pedir conservación de pruebas volátiles cuando proceda"]),
    requiredAttachments: text(["Identity and capacity documents", "Original or preserved evidence inventory", "Medical or damage records if relevant", "Witness list", "Power of attorney where required"], ["مستندات الهوية والصفة", "جرد الأدلة الأصلية أو المحفوظة", "التقارير الطبية أو أضرار ذات صلة", "قائمة الشهود", "الوكالة عند اللزوم"], ["Identité et qualité", "Inventaire des preuves originales ou conservées", "Pièces médicales ou de dommage", "Liste des témoins", "Mandat si nécessaire"], ["Identidad y representación", "Inventario de pruebas originales o preservadas", "Informes médicos o de daños", "Lista de testigos", "Poder si procede"]),
    validationQuestions: text(["What did the complainant personally observe?", "What is hearsay or inference?", "Where is each original item of evidence?", "Is anyone at immediate risk?", "Has the same matter already been reported?"], ["ما الذي شاهده المشتكي بنفسه؟", "ما المنقول أو المستنتج؟", "أين أصل كل دليل؟", "هل يوجد خطر عاجل على أحد؟", "هل سبق الإخبار عن الواقعة؟"], ["Qu’a personnellement constaté le plaignant ?", "Qu’est-ce qui relève du ouï-dire ou de l’inférence ?", "Où se trouve chaque preuve originale ?", "Existe-t-il un danger immédiat ?", "L’affaire a-t-elle déjà été signalée ?"], ["¿Qué observó personalmente el denunciante?", "¿Qué es referencia o inferencia?", "¿Dónde está cada prueba original?", "¿Existe riesgo inmediato?", "¿Ya se denunció el asunto?"])
  },
  routeTemplate("tpl-iq-civil-default-objection", "iq-civil-default-objection", "civil", text("Civil default-objection petition", "عريضة اعتراض على حكم غيابي مدني", "Requête d’opposition civile", "Escrito de oposición civil"), text(["State why the judgment is legally in default", "Set out the defense to the original claim"], ["بيّن سبب اعتبار الحكم غيابياً", "اعرض الدفاع في أصل الدعوى"], ["Expliquer le caractère par défaut", "Présenter la défense au fond"], ["Explicar el carácter de rebeldía", "Exponer la defensa de fondo"])),
  routeTemplate("tpl-iq-civil-appeal", "iq-civil-appeal", "civil", text("Civil appeal petition", "عريضة استئناف مدني", "Déclaration et moyens d’appel civil", "Escrito de apelación civil"), text(["Identify appealability", "Separate factual and legal errors", "State requested confirmation, amendment, or reversal"], ["بيّن قابلية الحكم للاستئناف", "افصل أخطاء الوقائع عن أخطاء القانون", "حدد طلب التأييد أو التعديل أو الفسخ"], ["Établir la recevabilité", "Séparer erreurs de fait et de droit", "Préciser confirmation, réformation ou infirmation"], ["Acreditar procedencia", "Separar errores de hecho y derecho", "Precisar confirmación, modificación o revocación"])),
  routeTemplate("tpl-iq-civil-retrial", "iq-civil-retrial", "civil", text("Civil retrial petition", "عريضة إعادة المحاكمة المدنية", "Requête en révision civile", "Solicitud de revisión civil"), text(["Name one or more exact article 196 grounds", "Prove when the ground arose or was established", "Limit the request to the pleaded ground"], ["حدد سبباً أو أكثر من المادة 196 بدقة", "أثبت تاريخ ظهور السبب أو ثبوته", "احصر الطلب بالسبب الوارد في العريضة"], ["Identifier le motif exact de l’article 196", "Prouver sa date de découverte ou d’établissement", "Limiter la demande au motif invoqué"], ["Identificar la causa exacta del artículo 196", "Probar cuándo surgió o se acreditó", "Limitar la solicitud a la causa invocada"])),
  routeTemplate("tpl-iq-civil-cassation", "iq-civil-cassation", "civil", text("Civil cassation petition", "اللائحة التمييزية المدنية", "Mémoire de cassation civile", "Escrito de casación civil"), text(["Map each ground to article 203 or a special provision", "Explain material effect of each error", "Identify any required prior grievance"], ["اربط كل سبب بالمادة 203 أو بنص خاص", "بيّن أثر الخطأ في النتيجة", "حدد أي تظلم سابق واجب"], ["Rattacher chaque moyen à l’article 203 ou à un texte spécial", "Expliquer l’incidence de l’erreur", "Identifier tout recours préalable"], ["Vincular cada motivo al artículo 203 o norma especial", "Explicar el efecto del error", "Identificar reclamación previa"])),
  routeTemplate("tpl-iq-civil-cassation-correction", "iq-civil-cassation-correction", "civil", text("Civil cassation-correction request", "طلب تصحيح القرار التمييزي المدني", "Demande de rectification en cassation civile", "Solicitud de corrección de casación civil"), text(["Establish that the decision is eligible", "Use only the statutory correction grounds", "Quote the omitted ground, express text, or contradiction precisely"], ["أثبت أن القرار يقبل التصحيح", "التزم بأسباب التصحيح القانونية", "حدد السبب المغفل أو النص الصريح أو التناقض بدقة"], ["Établir l’admissibilité de la décision", "S’en tenir aux motifs légaux", "Identifier précisément le moyen omis, le texte ou la contradiction"], ["Acreditar que la decisión es corregible", "Limitarse a causas legales", "Precisar motivo omitido, texto o contradicción"])),
  routeTemplate("tpl-iq-civil-third-party-objection", "iq-civil-third-party-objection", "civil", text("Third-party objection petition", "عريضة اعتراض الغير", "Requête en tierce opposition", "Escrito de oposición de tercero"), text(["Prove non-participation in the original case", "Identify the personal right affected", "Choose original or incidental form"], ["أثبت عدم المشاركة في الدعوى الأصلية", "حدد حقك الشخصي الذي مسه الحكم", "اختر الاعتراض الأصلي أو الطارئ"], ["Prouver l’absence de participation", "Identifier le droit propre atteint", "Choisir la forme principale ou incidente"], ["Probar no participación", "Identificar el derecho propio afectado", "Elegir forma principal o incidental"])),
  routeTemplate("tpl-iq-civil-order-grievance", "iq-civil-petition-order-grievance", "civil", text("Grievance against an order on a petition", "عريضة تظلم من أمر على عريضة", "Recours contre une ordonnance sur requête", "Reclamación contra orden sobre petición"), text(["Attach the order or refusal", "Explain why issuance, refusal, or terms should be cancelled or amended", "Address the article 153 trigger immediately"], ["أرفق الأمر أو قرار الرفض", "بيّن سبب إلغاء الأمر أو تعديله أو إجابة الطلب", "عالج نقطة بدء مدة المادة 153 فوراً"], ["Joindre l’ordonnance ou le refus", "Expliquer pourquoi annuler ou modifier", "Traiter immédiatement le point de départ de l’article 153"], ["Adjuntar orden o rechazo", "Explicar por qué anular o modificar", "Atender de inmediato el inicio del artículo 153"])),
  routeTemplate("tpl-iq-criminal-default-objection", "iq-criminal-default-objection", "criminal", text("Criminal default-objection petition", "عريضة اعتراض على حكم غيابي جزائي", "Requête d’opposition pénale", "Escrito de oposición penal"), text(["Establish the default status and right to object", "Record arrest, surrender, or service events accurately", "Present defenses without fabricating evidence"], ["أثبت غيابية الحكم وحق الاعتراض", "دوّن واقعة القبض أو التسليم أو التبليغ بدقة", "اعرض الدفاع دون اختلاق دليل"], ["Établir le défaut et le droit d’opposition", "Consigner précisément arrestation, comparution ou signification", "Présenter la défense sans inventer de preuve"], ["Acreditar rebeldía y derecho a oponerse", "Registrar con precisión arresto, entrega o notificación", "Exponer defensa sin inventar prueba"])),
  routeTemplate("tpl-iq-criminal-penal-order-objection", "iq-criminal-penal-order-objection", "criminal", text("Penal-order objection", "اعتراض على الأمر الجزائي", "Opposition à l’ordonnance pénale", "Oposición a orden penal"), text(["Identify the penal order and article 207 trigger", "State the objection clearly", "Preserve proof of timely filing"], ["حدد الأمر الجزائي ونقطة بدء المادة 207", "اثبت الاعتراض بوضوح", "احفظ ما يثبت الإيداع في المدة"], ["Identifier l’ordonnance et le point de départ de l’article 207", "Formuler clairement l’opposition", "Conserver la preuve du dépôt"], ["Identificar orden e inicio del artículo 207", "Formular claramente oposición", "Conservar prueba de presentación"])),
  routeTemplate("tpl-iq-criminal-cassation", "iq-criminal-cassation", "criminal", text("Criminal cassation petition", "اللائحة التمييزية الجزائية", "Mémoire de cassation pénale", "Escrito de casación penal"), text(["Establish standing under article 249", "Identify independent challengeability", "Separate legal, procedural, evidentiary, and sentencing grounds"], ["أثبت الصفة وفق المادة 249", "بيّن قابلية القرار للطعن استقلالاً", "افصل الأسباب القانونية والإجرائية والإثباتية والمتعلقة بالعقوبة"], ["Établir la qualité selon l’article 249", "Établir l’autonomie du recours", "Séparer moyens juridiques, procéduraux, probatoires et relatifs à la peine"], ["Acreditar legitimación del artículo 249", "Acreditar recurribilidad independiente", "Separar motivos legales, procesales, probatorios y de pena"])),
  routeTemplate("tpl-iq-criminal-cassation-correction", "iq-criminal-cassation-correction", "criminal", text("Criminal cassation-correction request", "طلب تصحيح القرار التمييزي الجزائي", "Demande de rectification en cassation pénale", "Solicitud de corrección de casación penal"), text(["Check article 267 exclusions first", "State the exact correction ground", "Preserve the date and proof relevant to article 266"], ["افحص موانع المادة 267 أولاً", "حدد سبب التصحيح بدقة", "احفظ التاريخ والدليل المتعلقين بالمادة 266"], ["Vérifier d’abord les exclusions de l’article 267", "Préciser le motif de rectification", "Conserver date et preuve relatives à l’article 266"], ["Verificar primero exclusiones del artículo 267", "Precisar motivo de corrección", "Conservar fecha y prueba del artículo 266"])),
  routeTemplate("tpl-iq-criminal-retrial", "iq-criminal-retrial", "criminal", text("Criminal retrial request", "طلب إعادة المحاكمة الجزائية", "Demande de révision pénale", "Solicitud de revisión penal"), text(["Prove a final conviction or measure", "Identify the exact article 270 case and supporting evidence", "Address applicant status and submission to Public Prosecution under article 271"], ["أثبت الحكم النهائي بالإدانة أو التدبير", "حدد حالة المادة 270 ودليلها", "بيّن صفة مقدم الطلب وتقديمه إلى الادعاء العام وفق المادة 271"], ["Prouver la condamnation ou mesure définitive", "Identifier le cas de l’article 270 et ses preuves", "Traiter la qualité et la saisine du ministère public selon l’article 271"], ["Probar condena o medida firme", "Identificar caso del artículo 270 y prueba", "Tratar legitimación y presentación al Ministerio Público según artículo 271"]))
];

export const proceduralNotices = {
  legal: text(
    "Procedural triage and drafting support only—not legal advice or a filing service. A licensed lawyer must verify jurisdiction, eligibility, deadlines, service, fees, attachments, amendments, and the complete record.",
    "هذه أداة فرز إجرائي ومساعدة في الصياغة، وليست استشارة قانونية أو خدمة إيداع. يجب على محامٍ مختص التحقق من الاختصاص والقابلية والمدد والتبليغ والرسم والمرفقات والتعديلات والإضبارة كاملة.",
    "Outil de tri procédural et d’aide à la rédaction uniquement, sans conseil juridique ni dépôt. Un avocat doit vérifier compétence, recevabilité, délais, signification, frais, pièces, modifications et dossier complet.",
    "Solo clasificación procesal y ayuda de redacción; no es asesoría ni servicio de presentación. Un abogado debe verificar competencia, procedencia, plazos, notificación, tasas, anexos, reformas y expediente."
  ),
  privacy: text(
    "Use fictional placeholders in this prototype. Do not enter real client names, national IDs, addresses, case numbers, evidence, or privileged communications.",
    "استخدم أسماء وبيانات افتراضية في هذا النموذج. لا تدخل أسماء موكلين حقيقيين أو أرقاماً وطنية أو عناوين أو أعداد دعاوى أو أدلة أو مراسلات سرية.",
    "Utilisez des données fictives dans ce prototype. N’entrez aucun nom réel, identifiant, adresse, numéro d’affaire, preuve ou communication couverte par le secret.",
    "Use datos ficticios en este prototipo. No introduzca nombres reales, identificaciones, direcciones, números de caso, pruebas ni comunicaciones confidenciales."
  )
};

export const proceduralSources = {
  civil: CIVIL_PROCEDURE_SOURCE,
  criminal: CRIMINAL_PROCEDURE_SOURCE
};
