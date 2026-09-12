import { extensionApi } from "../shared/api.js";
import { getSettings } from "../shared/storage.js";

const CUSTOM_RULE_BASE = 100000;
const SITE_ALLOW_BASE = 200000;

function toDnrRule(line, id) {
  const match = line.trim().match(/^(\|\|)?([^$]+?)(?:\$third-party)?$/);
  if (!match || !match[2]) return null;
  const urlFilter = match[2].replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\^/g, ".*");
  return { id, priority: 1, action: { type: "block" }, condition: { urlFilter, resourceTypes: ["script", "image", "xmlhttprequest", "sub_frame"] } };
}

export async function syncCustomRules() {
  const settings = await getSettings();
  const existing = await extensionApi.declarativeNetRequest.getDynamicRules();
  const removeRuleIds = existing.filter(rule => rule.id >= CUSTOM_RULE_BASE).map(rule => rule.id);
  const addRules = settings.customRules.map((line, index) => toDnrRule(line, CUSTOM_RULE_BASE + index)).filter(Boolean);
  const disabledSites = Object.entries(settings.siteSettings)
    .filter(([, enabled]) => enabled === false)
    .map(([site]) => site);
  const allowedSites = [...new Set([...settings.whitelist, ...disabledSites])].filter(Boolean);
  const allowRules = settings.enabled ? allowedSites.map((site, index) => ({
    id: SITE_ALLOW_BASE + index,
    priority: 10000,
    action: { type: "allowAllRequests" },
    condition: { requestDomains: [site], resourceTypes: ["main_frame"] }
  })) : [];
  await extensionApi.declarativeNetRequest.updateDynamicRules({ removeRuleIds, addRules: [...addRules, ...allowRules] });
  await extensionApi.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: settings.enabled ? ["ads", "trackers", "annoyances"] : [],
    disableRulesetIds: settings.enabled ? [] : ["ads", "trackers", "annoyances"]
  });
}
