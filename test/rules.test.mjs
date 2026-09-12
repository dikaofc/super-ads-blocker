import test from "node:test";
import assert from "node:assert/strict";
import { createAllowRule, parseCustomRule } from "../src/background/rules.js";
import { hostname, siteMatches } from "../src/shared/storage.js";

test("parses supported domain filters into blocking rules", () => {
  const rule = parseCustomRule("||tracker.example^$third-party", 100001);
  assert.equal(rule.id, 100001);
  assert.equal(rule.action.type, "block");
  assert.match(rule.condition.urlFilter, /tracker\\.example/);
});

test("rejects malformed and comment custom rules", () => {
  assert.equal(parseCustomRule("", 100001), null);
  assert.equal(parseCustomRule("! comment", 100001), null);
  assert.equal(parseCustomRule("||bad\nrule", 100001), null);
});

test("creates an initiator allow rule for trusted sites", () => {
  const rule = createAllowRule("example.com", 200001);
  assert.deepEqual(rule.condition.initiatorDomains, ["example.com"]);
  assert.equal(rule.action.type, "allowAllRequests");
});

test("normalizes hostnames and matches subdomains", () => {
  assert.equal(hostname("HTTPS://WWW.Example.COM/path"), "www.example.com");
  assert.equal(siteMatches("www.example.com", "example.com"), true);
  assert.equal(siteMatches("example.com.evil.test", "example.com"), false);
});
