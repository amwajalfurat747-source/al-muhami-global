import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../public/widget.html", import.meta.url), "utf8");

test("global widget exposes the complete cascading legal research path", () => {
  for (const id of [
    "language-select",
    "country-select",
    "law-select",
    "article-input",
    "court-select",
    "topic-select",
    "stage-select",
    "case-track-select",
    "decision-kind-select",
    "challenge-method-select",
    "filing-template-select",
    "open-article",
    "find-cases",
    "find-divergence",
    "show-procedural-route",
    "open-filing-template"
  ]) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
  }
});

test("widget exposes civil and criminal procedural demos and drafting safeguards", () => {
  assert.match(html, /browse_procedural_routes/);
  assert.match(html, /get_filing_template/);
  assert.match(html, /civil-third-party/);
  assert.match(html, /criminal-retrial/);
  assert.match(html, /No deadline is guaranteed automatically/);
});

test("widget ships English, Arabic, French, and Spanish interface dictionaries", () => {
  for (const language of ["en", "ar", "fr", "es"]) {
    assert.match(html, new RegExp(`\\b${language}: \\{`));
  }
});

test("widget exposes the corrected article 305 and anonymized heirship demo", () => {
  assert.match(html, /irq-civil-procedure-83-1969/);
  assert.match(html, /case-demo-cross-border-heirship-305/);
  assert.match(html, /demoHeirship/);
  assert.doesNotMatch(html, /Iraq · Civil Code article 305/);
});

test("widget module has valid JavaScript syntax", () => {
  const match = html.match(/<script type="module">([\s\S]*?)<\/script>/);
  assert.ok(match);
  assert.doesNotThrow(() => new Function(match[1]));
});

test("widget initializes the MCP Apps bridge before calling tools", () => {
  assert.match(html, /rpcRequest\("ui\/initialize"/);
  assert.match(html, /ui\/notifications\/initialized/);
  assert.match(html, /await bridgeReady/);
  assert.match(html, /rpcRequest\("tools\/call"/);
});

test("global search reports progress and moves to the results", () => {
  assert.match(html, /id="search-submit"/);
  assert.match(html, /جارٍ البحث…/);
  assert.match(html, /workspace\.scrollIntoView/);
});
