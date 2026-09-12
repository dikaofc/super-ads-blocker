import { extensionApi } from "./api.js";

const defaults = {
  enabled: true,
  whitelist: [],
  customRules: [],
  blockedCount: 0,
  siteSettings: {}
};

export async function getSettings() {
  return { ...defaults, ...(await extensionApi.storage.local.get(defaults)) };
}

export async function updateSettings(changes) {
  await extensionApi.storage.local.set(changes);
  return getSettings();
}

export function hostname(url = location.href) {
  try { return new URL(url).hostname; } catch { return ""; }
}
