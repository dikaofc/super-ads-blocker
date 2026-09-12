import { extensionApi } from "../shared/api.js";
import { getSettings } from "../shared/storage.js";

export const CUSTOM_RULE_BASE = 100000;
export const SITE_ALLOW_BASE = 200000;
const FILTER_RESOURCE_TYPES = ["script", "image", "xmlhttprequest", "sub_frame"];

export function parseCustomRule(line, id) {
  const value = String(line || "").trim();
  if (!value || value.startsWith("!") || value.startsWith("#")) return null;
  const match = value.match(/^\|\|([^$]+?)(?:\$third-party)?$/);
  if (!match?.[1] || /[\r\n]/.test(match[1])) return null;
  const urlFilter = match[1]
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\\\^/g, ".*");
  return {
    id,
    priority: 1,
    action: { type: "block" },
    condition: { urlFilter, resourceTypes: FILTER_RESOURCE_TYPES }
  };
}

function allowedSites(settings) {
  const disabledSites = Object.entries(settings.siteSettings)
    .filter(([, enabled]) => enabled === false)
    .map(([site]) => site);
  return [...new Set([...settings.whitelist, ...disabledSites])]
    .map(site => String(site).trim().toLowerCase())
    .filter(site => /^[a-z0-9.-]+$/.test(site));
}

export function createAllowRule(site, id) {
  return {
    id,
    priority: 10000,
    action: { type: "allowAllRequests" },
    condition: { initiatorDomains: [site] }
  };
}

export async function syncCustomRules() {
  const settings = await getSettings();
  const existing = await extensionApi.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing
    .filter(rule => rule.id >= CUSTOM_RULE_BASE)
    .map(rule => rule.id);
  const addRules = settings.enabled
    ? settings.customRules
      .map((line, index) => parseCustomRule(line, CUSTOM_RULE_BASE + index))
      .filter(Boolean)
      .concat(allowedSites(settings).map((site, index) => createAllowRule(site, SITE_ALLOW_BASE + index)))
    : [];
  await extensionApi.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules });
  await extensionApi.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: settings.enabled ? ["ads", "trackers", "annoyances"] : [],
    disableRulesetIds: settings.enabled ? [] : ["ads", "trackers", "annoyances"]
  });
}
