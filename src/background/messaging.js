import { extensionApi } from "../shared/api.js";
import { getSettings, hostname, updateSettings } from "../shared/storage.js";
import { getStats } from "./stats.js";
import { syncCustomRules } from "./rules.js";

export function registerMessaging() {
  extensionApi.runtime.onMessage.addListener(async (message, sender) => {
    if (message.type === "setEnabled") {
      await updateSettings({ enabled: message.enabled });
      await syncCustomRules();
      return { ok: true };
    }
    if (message.type === "blocked") {
      const settings = await getSettings();
      await updateSettings({ blockedCount: (settings.blockedCount || 0) + Math.max(1, message.amount || 1) });
      return { ok: true };
    }
    if (message.type === "getState") {
      const settings = await getSettings();
      const site = hostname(message.url || sender.tab?.url);
      return { ...settings, blockedCount: (await getStats()).blockedCount || 0, site, enabledForSite: settings.siteSettings[site] !== false && !settings.whitelist.includes(site) };
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
    return undefined;
  });
}
