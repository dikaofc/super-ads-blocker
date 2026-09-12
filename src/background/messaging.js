import { extensionApi } from "../shared/api.js";
import { getSettings, hostname, siteMatches, updateSettings } from "../shared/storage.js";
import { getStats, incrementBlocked } from "./stats.js";
import { syncCustomRules } from "./rules.js";

export function registerMessaging() {
  extensionApi.runtime.onMessage.addListener(async (message, sender) => {
    if (message.type === "setEnabled") {
      await updateSettings({ enabled: message.enabled });
      await syncCustomRules();
      return { ok: true };
    }
    if (message.type === "blocked") {
      await incrementBlocked(message.amount);
      return { ok: true };
    }
    if (message.type === "getState") {
      const settings = await getSettings();
      const site = hostname(message.url || sender.tab?.url);
      const disabled = Object.entries(settings.siteSettings).some(([configuredSite, enabled]) => enabled === false && siteMatches(site, configuredSite));
      const whitelisted = settings.whitelist.some(configuredSite => siteMatches(site, configuredSite));
      return { ...settings, blockedCount: (await getStats()).blockedCount || 0, site, enabledForSite: !disabled && !whitelisted };
    }
    if (message.type === "setSiteEnabled") {
      const settings = await getSettings();
      await updateSettings({ siteSettings: { ...settings.siteSettings, [message.site]: message.enabled } });
      await syncCustomRules();
      return { ok: true };
    }
    if (message.type === "saveCustomRules") {
      await updateSettings({ customRules: message.rules });
      await syncCustomRules();
      return { ok: true };
    }
    if (message.type === "saveWhitelist") {
      await updateSettings({ whitelist: message.sites });
      await syncCustomRules();
      return { ok: true };
    }
    return undefined;
  });
}
