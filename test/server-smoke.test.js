import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const here = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(here, "..");
const smokePort = 8790;
const baseUrl = `http://127.0.0.1:${smokePort}`;

async function waitForServer(child) {
  let stderr = "";
  child.stderr.on("data", (chunk) => { stderr += chunk.toString(); });
  for (let attempt = 0; attempt < 40; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`Server exited early: ${stderr}`);
    try {
      const response = await fetch(`${baseUrl}/healthz`);
      if (response.ok) return;
    } catch {
      // The server may still be starting.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 50));
  }
  throw new Error(`Server did not become healthy: ${stderr}`);
}

test("HTTP demo and MCP tools work end to end", { timeout: 20_000 }, async () => {
  const child = spawn(process.execPath, ["server.js"], {
    cwd: projectRoot,
    env: { ...process.env, PORT: String(smokePort) },
    stdio: ["ignore", "pipe", "pipe"]
  });

  try {
    await waitForServer(child);

    const blockedCrossOrigin = await fetch(`${baseUrl}/api/demo`, {
      headers: { Origin: "https://untrusted.example" }
    });
    assert.equal(blockedCrossOrigin.status, 403);
    assert.equal(blockedCrossOrigin.headers.get("access-control-allow-origin"), null);
    assert.equal(blockedCrossOrigin.headers.get("access-control-expose-headers"), null);

    const sameOrigin = await fetch(`${baseUrl}/api/demo`, {
      headers: { Origin: baseUrl }
    });
    assert.equal(sameOrigin.status, 200);
    assert.equal(sameOrigin.headers.get("access-control-allow-origin"), baseUrl);

    const demoResponse = await fetch(`${baseUrl}/api/demo`);
    assert.equal(demoResponse.status, 200);
    const demo = await demoResponse.json();
    assert.equal(demo.project.nameEn, "Al-Muhami Global");
    assert.ok(demo.catalog.laws.length >= 9);
    assert.equal(demo.jurisdictions.countries.length, 3);

    const franceCatalog = await fetch(`${baseUrl}/api/catalog?countryCode=FR&language=fr`).then((response) => response.json());
    assert.equal(franceCatalog.country, "France");
    assert.ok(franceCatalog.laws.some((law) => law.id === "fr-civil-code"));

    const frenchArticle = await fetch(`${baseUrl}/api/articles/fr-civil-code/6?countryCode=FR&language=fr`).then((response) => response.json());
    assert.equal(frenchArticle.found, true);
    assert.equal(frenchArticle.article.displayedLanguage, "fr");

    const coownershipCases = await fetch(`${baseUrl}/api/cases?countryCode=IQ&topic=coownership-dissolution`).then((response) => response.json());
    assert.equal(coownershipCases.totalMatches, 2);

    const proceduralRoutes = await fetch(`${baseUrl}/api/procedural-routes?countryCode=IQ&trackId=criminal&decisionKindId=criminal-final-conviction&methodId=retrial&language=ar`).then((response) => response.json());
    assert.equal(proceduralRoutes.routes[0].id, "iq-criminal-retrial");

    const filingTemplate = await fetch(`${baseUrl}/api/filing-templates/tpl-iq-civil-statement-of-claim?language=ar`).then((response) => response.json());
    assert.equal(filingTemplate.type, "initial-filing");
    assert.ok(filingTemplate.requiredSections.length >= 7);

    const client = new Client({ name: "al-muhami-smoke-test", version: "1.0.0" });
    const transport = new StreamableHTTPClientTransport(new URL(`${baseUrl}/mcp`));
    await client.connect(transport);

    const listed = await client.listTools();
    const toolNames = listed.tools.map((tool) => tool.name);
    assert.ok(toolNames.includes("search_legal_materials"));
    assert.ok(toolNames.includes("browse_jurisdictions"));
    assert.ok(toolNames.includes("get_law_article"));
    assert.ok(toolNames.includes("browse_court_cases"));
    assert.ok(toolNames.includes("compare_decisions"));
    assert.ok(toolNames.includes("find_jurisprudential_divergence"));
    assert.ok(toolNames.includes("browse_procedural_routes"));
    assert.ok(toolNames.includes("get_filing_template"));

    const called = await client.callTool({
      name: "compare_decisions",
      arguments: { decisionIds: ["demo-a-correction", "demo-b-cassation"] }
    });
    assert.equal(called.structuredContent.view, "comparison");
    assert.equal(called.structuredContent.data.comparisons[0].classification, "potential-divergence");

    const articleCall = await client.callTool({
      name: "get_law_article",
      arguments: { countryCode: "FR", lawId: "fr-civil-code", articleNumber: "6", language: "fr" }
    });
    assert.equal(articleCall.structuredContent.view, "article-cases");
    assert.equal(articleCall.structuredContent.data.found, true);

    const routeCall = await client.callTool({
      name: "browse_procedural_routes",
      arguments: { countryCode: "IQ", trackId: "civil", decisionKindId: "order-on-petition", methodId: "grievance", language: "ar" }
    });
    assert.equal(routeCall.structuredContent.view, "procedural-routes");
    assert.equal(routeCall.structuredContent.data.routes[0].id, "iq-civil-petition-order-grievance");

    await client.close();
  } finally {
    child.kill("SIGTERM");
    await new Promise((resolveWait) => child.once("exit", resolveWait));
  }
});
