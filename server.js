import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import {
  registerAppResource,
  registerAppTool,
  RESOURCE_MIME_TYPE
} from "@modelcontextprotocol/ext-apps/server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import {
  browseCourtCases,
  compareDecisions,
  findPotentialDivergence,
  getCatalog,
  getFilingTemplate,
  getJurisdictions,
  getLawArticle,
  getLegalSource,
  getOverview,
  getProceduralRoutes,
  searchLegalMaterials,
  traceCase
} from "./lib/legal-engine.js";
import { projectMetadata } from "./lib/global-data.js";

const widgetHtml = readFileSync(new URL("./public/widget.html", import.meta.url), "utf8");
const privacyHtml = readFileSync(new URL("./public/privacy.html", import.meta.url), "utf8");
const port = Number(process.env.PORT ?? 8787);
const MCP_PATH = "/mcp";
const WIDGET_URI = "ui://widget/al-muhami-global-v3.html";
const configuredBrowserOrigins = new Set(
  (process.env.ALLOWED_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => {
      try {
        const parsed = new URL(origin);
        return ["http:", "https:"].includes(parsed.protocol) ? parsed.origin : null;
      } catch {
        return null;
      }
    })
    .filter(Boolean)
);
const READ_ONLY_ANNOTATIONS = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false
};

const outputSchema = {
  view: z.string(),
  title: z.string(),
  data: z.record(z.string(), z.unknown()),
  notice: z.string()
};

function toolResult(view, title, data, notice = projectMetadata.legalNotice) {
  const structuredContent = { view, title, data, notice };
  return {
    structuredContent,
    content: [{ type: "text", text: JSON.stringify(structuredContent) }]
  };
}

function notFoundResult(view, title, message) {
  return toolResult(view, title, { error: message, results: [] }, projectMetadata.legalNotice);
}

function createAlMuhamiServer() {
  const server = new McpServer(
    { name: "al-muhami-global-legal-intelligence", version: projectMetadata.version },
    {
      instructions:
        "Use Al-Muhami Global for multilingual, multi-jurisdiction legal research. Always select the country before the law and article. Preserve the original language of legal text unless a verified translation exists. Distinguish catalog-only records, published references, and synthetic demo data. Never invent an article, decision number, court, translation, or source. Treat divergence findings as potential only and require verification of the complete official text and procedural record."
    }
  );

  registerAppResource(
    server,
    "al-muhami-widget",
    WIDGET_URI,
    {},
    async () => ({
      contents: [
        {
          uri: WIDGET_URI,
          mimeType: RESOURCE_MIME_TYPE,
          text: widgetHtml,
          _meta: {
            ui: {
              prefersBorder: true,
              csp: { connectDomains: [], resourceDomains: [] }
            }
          }
        }
      ]
    })
  );

  registerAppTool(
    server,
    "browse_jurisdictions",
    {
      title: "Browse countries and court systems",
      description: "Lists supported languages, countries, law counts, court types, and case topics in the global legal research catalog.",
      inputSchema: {
        language: z.enum(["en", "ar", "fr", "es"]).default("en")
      },
      outputSchema,
      annotations: READ_ONLY_ANNOTATIONS,
      _meta: { ui: { resourceUri: WIDGET_URI } }
    },
    async ({ language }) =>
      toolResult("jurisdictions", "Countries and legal systems", getJurisdictions({ language }))
  );

  registerAppTool(
    server,
    "browse_legal_catalog",
    {
      title: "Browse a country's legal codes",
      description: "Browses the laws available for a selected country, including categories, sources, embedded articles, and corpus completeness.",
      inputSchema: {
        countryCode: z.string().default("IQ"),
        category: z.string().optional(),
        language: z.enum(["en", "ar", "fr", "es"]).default("en")
      },
      outputSchema,
      annotations: READ_ONLY_ANNOTATIONS,
      _meta: { ui: { resourceUri: WIDGET_URI } }
    },
    async ({ countryCode, category, language }) =>
      toolResult("catalog", "Legal code catalog", getCatalog({ countryCode, category, language }))
  );

  registerAppTool(
    server,
    "get_law_article",
    {
      title: "Open a law article and related cases",
      description: "Returns the verified text available for a selected article, its language and sources, and every linked case and court decision in the corpus.",
      inputSchema: {
        countryCode: z.string().optional(),
        lawId: z.string().min(1),
        articleNumber: z.string().min(1),
        language: z.enum(["en", "ar", "fr", "es"]).default("en")
      },
      outputSchema,
      annotations: READ_ONLY_ANNOTATIONS,
      _meta: { ui: { resourceUri: WIDGET_URI } }
    },
    async (args) => {
      const data = getLawArticle(args);
      return data
        ? toolResult("article-cases", `Article ${args.articleNumber}`, data, data.notice)
        : notFoundResult("article-cases", "Law article", `Law not found: ${args.lawId}`);
    }
  );

  registerAppTool(
    server,
    "browse_court_cases",
    {
      title: "Browse cases by court and legal topic",
      description: "Filters case paths by country, court type, topic, procedural stage, law, and article, then exposes every linked appeal and cassation step.",
      inputSchema: {
        countryCode: z.string().default("IQ"),
        courtType: z.string().optional(),
        topic: z.string().optional(),
        stage: z.string().optional(),
        lawId: z.string().optional(),
        articleNumber: z.string().optional(),
        includeSynthetic: z.boolean().default(true),
        limit: z.number().int().min(1).max(50).default(20),
        language: z.enum(["en", "ar", "fr", "es"]).default("en")
      },
      outputSchema,
      annotations: READ_ONLY_ANNOTATIONS,
      _meta: { ui: { resourceUri: WIDGET_URI } }
    },
    async (args) =>
      toolResult("court-cases", "Court cases and procedural paths", browseCourtCases(args))
  );

  registerAppTool(
    server,
    "search_legal_materials",
    {
      title: "Search laws, articles, and decisions",
      description: "Multilingual legal search with filters for country, court, stage, law, article, topic, and year.",
      inputSchema: {
        query: z.string().min(1),
        countryCode: z.string().optional(),
        court: z.string().optional(),
        courtType: z.string().optional(),
        stage: z.string().optional(),
        lawId: z.string().optional(),
        articleNumber: z.string().optional(),
        topic: z.string().optional(),
        yearFrom: z.number().int().optional(),
        yearTo: z.number().int().optional(),
        includeSynthetic: z.boolean().default(true),
        limit: z.number().int().min(1).max(30).default(12),
        language: z.enum(["en", "ar", "fr", "es"]).default("en")
      },
      outputSchema,
      annotations: READ_ONLY_ANNOTATIONS,
      _meta: { ui: { resourceUri: WIDGET_URI } }
    },
    async (args) =>
      toolResult("search", `نتائج البحث: ${args.query}`, searchLegalMaterials(args))
  );

  registerAppTool(
    server,
    "trace_case_path",
    {
      title: "Trace a case across court levels",
      description: "Returns every linked step from trial through appeal, cassation, and any correction or review procedure available in that jurisdiction.",
      inputSchema: { caseId: z.string().min(1) },
      outputSchema,
      annotations: READ_ONLY_ANNOTATIONS,
      _meta: { ui: { resourceUri: WIDGET_URI } }
    },
    async ({ caseId }) => {
      const data = traceCase(caseId);
      return data
        ? toolResult("case-trace", data.case.title, data, data.notice)
        : notFoundResult("case-trace", "مسار الدعوى", `لم يُعثر على الدعوى: ${caseId}`);
    }
  );

  registerAppTool(
    server,
    "compare_decisions",
    {
      title: "Compare judicial decisions",
      description: "Compares two to four decisions by facts, provisions, reasoning, posture, and outcome, while separating potential divergence from material distinctions.",
      inputSchema: {
        decisionIds: z.array(z.string()).min(2).max(4)
      },
      outputSchema,
      annotations: READ_ONLY_ANNOTATIONS,
      _meta: { ui: { resourceUri: WIDGET_URI } }
    },
    async ({ decisionIds }) => {
      const data = compareDecisions(decisionIds);
      return data
        ? toolResult("comparison", "مقارنة القرارات القضائية", data)
        : notFoundResult("comparison", "مقارنة القرارات", "يلزم اختيار قرارين موجودين على الأقل.");
    }
  );

  registerAppTool(
    server,
    "find_jurisprudential_divergence",
    {
      title: "Find potential jurisprudential divergence",
      description: "Finds materially similar decisions with different outcomes and explains correction relationships, missing evidence, or factual distinctions.",
      inputSchema: {
        query: z.string().min(1),
        countryCode: z.string().optional(),
        courtType: z.string().optional(),
        topic: z.string().optional(),
        lawId: z.string().optional(),
        articleNumber: z.string().optional(),
        includeSynthetic: z.boolean().default(true),
        limit: z.number().int().min(1).max(12).default(6)
      },
      outputSchema,
      annotations: READ_ONLY_ANNOTATIONS,
      _meta: { ui: { resourceUri: WIDGET_URI } }
    },
    async (args) =>
      toolResult("divergence", `الاتجاهات القضائية: ${args.query}`, findPotentialDivergence(args))
  );

  registerAppTool(
    server,
    "browse_procedural_routes",
    {
      title: "Choose a compatible challenge route",
      description: "Filters Iraqi civil and criminal remedies by case track and decision type, explains eligibility and exclusions, and links each compatible route to a filing checklist. It does not calculate or guarantee deadlines.",
      inputSchema: {
        countryCode: z.string().default("IQ"),
        trackId: z.enum(["civil", "criminal"]).optional(),
        decisionKindId: z.string().optional(),
        methodId: z.string().optional(),
        language: z.enum(["en", "ar", "fr", "es"]).default("en")
      },
      outputSchema,
      annotations: READ_ONLY_ANNOTATIONS,
      _meta: { ui: { resourceUri: WIDGET_URI } }
    },
    async (args) =>
      toolResult("procedural-routes", "Procedural routes and challenge methods", getProceduralRoutes(args))
  );

  registerAppTool(
    server,
    "get_filing_template",
    {
      title: "Open a pleading or challenge checklist",
      description: "Returns a jurisdiction-specific structure, required sections, attachments, and validation questions for an initial civil claim, criminal complaint, or selected challenge route. It never invents client facts or files a pleading.",
      inputSchema: {
        templateId: z.string().min(1),
        countryCode: z.string().default("IQ"),
        language: z.enum(["en", "ar", "fr", "es"]).default("en")
      },
      outputSchema,
      annotations: READ_ONLY_ANNOTATIONS,
      _meta: { ui: { resourceUri: WIDGET_URI } }
    },
    async (args) => {
      const data = getFilingTemplate(args);
      return data
        ? toolResult("filing-template", data.title, data, data.legalNotice)
        : notFoundResult("filing-template", "Filing template", `Template not found: ${args.templateId}`);
    }
  );

  registerAppTool(
    server,
    "get_legal_source",
    {
      title: "Open a legal record or source",
      description: "Returns a law, article, decision, case, or source with provenance and verification links where available.",
      inputSchema: {
        id: z.string().min(1),
        language: z.enum(["en", "ar", "fr", "es"]).default("en")
      },
      outputSchema,
      annotations: READ_ONLY_ANNOTATIONS,
      _meta: { ui: { resourceUri: WIDGET_URI } }
    },
    async ({ id, language }) => {
      const data = getLegalSource(id, { language });
      return data
        ? toolResult("source", "التفاصيل والمصدر", data)
        : notFoundResult("source", "التفاصيل والمصدر", `لم يُعثر على السجل: ${id}`);
    }
  );

  return server;
}

function setCommonHeaders(res, contentType = "application/json; charset=utf-8") {
  res.setHeader("content-type", contentType);
  res.setHeader("x-content-type-options", "nosniff");
  res.setHeader("referrer-policy", "no-referrer");
  res.setHeader("cache-control", "no-store");
  res.setHeader("x-permitted-cross-domain-policies", "none");
}

function firstHeaderValue(value) {
  if (Array.isArray(value)) return value[0] ?? "";
  return String(value ?? "").split(",")[0].trim();
}

function requestBaseOrigin(req) {
  const host = firstHeaderValue(req.headers["x-forwarded-host"] ?? req.headers.host);
  const protocol = firstHeaderValue(
    req.headers["x-forwarded-proto"] ?? (req.socket.encrypted ? "https" : "http")
  );
  return host ? `${protocol}://${host}` : "";
}

function applyBrowserOriginPolicy(req, res) {
  const suppliedOrigin = firstHeaderValue(req.headers.origin);
  if (!suppliedOrigin) return true;

  let normalizedOrigin;
  try {
    normalizedOrigin = new URL(suppliedOrigin).origin;
  } catch {
    return false;
  }

  const allowed = normalizedOrigin === requestBaseOrigin(req)
    || configuredBrowserOrigins.has(normalizedOrigin);
  if (!allowed) return false;

  res.setHeader("access-control-allow-origin", normalizedOrigin);
  res.setHeader("vary", "Origin");
  return true;
}

function sendJson(res, statusCode, payload) {
  setCommonHeaders(res);
  res.writeHead(statusCode);
  res.end(JSON.stringify(payload));
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 1_000_000) throw new Error("Request body too large");
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function handleApi(req, res, url) {
  if (req.method === "GET" && url.pathname === "/api/demo") {
    sendJson(res, 200, getOverview({
      language: url.searchParams.get("language") ?? "en",
      countryCode: url.searchParams.get("countryCode") ?? "IQ"
    }));
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/jurisdictions") {
    sendJson(res, 200, getJurisdictions({ language: url.searchParams.get("language") ?? "en" }));
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/catalog") {
    sendJson(res, 200, getCatalog({
      countryCode: url.searchParams.get("countryCode") ?? "IQ",
      category: url.searchParams.get("category") ?? undefined,
      language: url.searchParams.get("language") ?? "en"
    }));
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/procedural-routes") {
    sendJson(res, 200, getProceduralRoutes({
      countryCode: url.searchParams.get("countryCode") ?? "IQ",
      trackId: url.searchParams.get("trackId") ?? undefined,
      decisionKindId: url.searchParams.get("decisionKindId") ?? undefined,
      methodId: url.searchParams.get("methodId") ?? undefined,
      language: url.searchParams.get("language") ?? "en"
    }));
    return true;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/filing-templates/")) {
    const templateId = decodeURIComponent(url.pathname.slice("/api/filing-templates/".length));
    const data = getFilingTemplate({
      templateId,
      countryCode: url.searchParams.get("countryCode") ?? "IQ",
      language: url.searchParams.get("language") ?? "en"
    });
    sendJson(res, data ? 200 : 404, data ?? { error: "Filing template not found" });
    return true;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/articles/")) {
    const segments = url.pathname.slice("/api/articles/".length).split("/").map(decodeURIComponent);
    const [lawId, articleNumber] = segments;
    const data = getLawArticle({
      lawId,
      articleNumber,
      countryCode: url.searchParams.get("countryCode") ?? undefined,
      language: url.searchParams.get("language") ?? "en"
    });
    sendJson(res, data ? 200 : 404, data ?? { error: "Law not found" });
    return true;
  }

  if (req.method === "GET" && url.pathname === "/api/cases") {
    sendJson(res, 200, browseCourtCases({
      countryCode: url.searchParams.get("countryCode") ?? "IQ",
      courtType: url.searchParams.get("courtType") ?? undefined,
      topic: url.searchParams.get("topic") ?? undefined,
      stage: url.searchParams.get("stage") ?? undefined,
      lawId: url.searchParams.get("lawId") ?? undefined,
      articleNumber: url.searchParams.get("articleNumber") ?? undefined,
      includeSynthetic: url.searchParams.get("includeSynthetic") !== "false",
      limit: Number(url.searchParams.get("limit") ?? 20),
      language: url.searchParams.get("language") ?? "en"
    }));
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/search") {
    const body = await readJson(req);
    sendJson(res, 200, searchLegalMaterials(body));
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/compare") {
    const body = await readJson(req);
    const data = compareDecisions(body.decisionIds ?? []);
    sendJson(res, data ? 200 : 400, data ?? { error: "يلزم اختيار قرارين موجودين على الأقل." });
    return true;
  }

  if (req.method === "POST" && url.pathname === "/api/divergence") {
    const body = await readJson(req);
    sendJson(res, 200, findPotentialDivergence(body));
    return true;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/cases/")) {
    const id = decodeURIComponent(url.pathname.slice("/api/cases/".length));
    const data = traceCase(id);
    sendJson(res, data ? 200 : 404, data ?? { error: "الدعوى غير موجودة" });
    return true;
  }

  if (req.method === "GET" && url.pathname.startsWith("/api/sources/")) {
    const id = decodeURIComponent(url.pathname.slice("/api/sources/".length));
    const data = getLegalSource(id, { language: url.searchParams.get("language") ?? "en" });
    sendJson(res, data ? 200 : 404, data ?? { error: "السجل غير موجود" });
    return true;
  }

  return false;
}

const httpServer = createServer(async (req, res) => {
  try {
    if (!req.url) {
      sendJson(res, 400, { error: "Missing URL" });
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

    if (!applyBrowserOriginPolicy(req, res)) {
      sendJson(res, 403, { error: "Browser origin not allowed" });
      return;
    }

    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "content-type, accept, mcp-protocol-version",
        "Access-Control-Max-Age": "600"
      });
      res.end();
      return;
    }

    if (req.method === "GET" && ["/", "/demo"].includes(url.pathname)) {
      setCommonHeaders(res, "text/html; charset=utf-8");
      res.writeHead(200);
      res.end(widgetHtml);
      return;
    }

    if (req.method === "GET" && url.pathname === "/privacy") {
      setCommonHeaders(res, "text/html; charset=utf-8");
      res.writeHead(200);
      res.end(privacyHtml);
      return;
    }

    if (req.method === "GET" && url.pathname === "/healthz") {
      sendJson(res, 200, { status: "ok", app: projectMetadata.nameEn, version: projectMetadata.version });
      return;
    }

    if (url.pathname.startsWith("/api/")) {
      const handled = await handleApi(req, res, url);
      if (!handled) sendJson(res, 404, { error: "API route not found" });
      return;
    }

    const MCP_METHODS = new Set(["POST", "GET", "DELETE"]);
    if (url.pathname === MCP_PATH && req.method && MCP_METHODS.has(req.method)) {
      const server = createAlMuhamiServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true
      });
      res.on("close", () => {
        transport.close();
        server.close();
      });
      await server.connect(transport);
      await transport.handleRequest(req, res);
      return;
    }

    sendJson(res, 404, { error: "Not found" });
  } catch (error) {
    console.error("Al-Muhami request error:", error);
    if (!res.headersSent) sendJson(res, 500, { error: "Internal server error" });
    else res.end();
  }
});

httpServer.listen(port, "0.0.0.0", () => {
  console.log(`Al-Muhami listening on http://localhost:${port}`);
  console.log(`MCP endpoint: http://localhost:${port}${MCP_PATH}`);
  console.log(`Standalone demo: http://localhost:${port}/demo`);
});
