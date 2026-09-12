import { extensionApi } from "./api.js";

const defaults = {
  enabled: true,
  whitelist: [],
  customRules: [],
  blockedCount: 0,
  siteSettings: {}
};

export async function getSettings() {
  const stored = await extensionApi.storage.local.get(defaults);
  return {
    ...defaults,
    ...stored,
    whitelist: Array.isArray(stored.whitelist) ? stored.whitelist : [],
    customRules: Array.isArray(stored.customRules) ? stored.customRules : [],
    siteSettings: stored.siteSettings && typeof stored.siteSettings === "object" ? stored.siteSettings : {}
  };
}

export async function updateSettings(changes) {
  await extensionApi.storage.local.set(changes);
  return getSettings();
}

export function hostname(url = location.href) {
  try { return new URL(url).hostname.toLowerCase(); } catch { return ""; }
}

export function siteMatches(host, configuredSite) {
  const site = String(configuredSite || "").trim().toLowerCase().replace(/^\.+|\.+$/g, "");
  return Boolean(site && (host === site || host.endsWith(`.${site}`)));
}
