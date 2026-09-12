import { getSettings, hostname } from "../shared/storage.js";
import { sendMessage } from "../shared/api.js";
import { clean } from "./cosmetic.js";
import { observe } from "./observer.js";
import { isYouTube } from "../shared/utils.js";
import { startYouTubeAdapter } from "../sites/youtube.js";

async function start() {
  const settings = await getSettings();
  const site = hostname();
  if (!settings.enabled || settings.whitelist.includes(site) || settings.siteSettings[site] === false) return;
  const state = await sendMessage({ type: "getState", url: location.href });
  if (state && state.enabledForSite === false) return;
  const initialScan = () => {
    const removed = clean(document);
    if (removed) sendMessage({ type: "blocked", amount: removed }).catch(() => {});
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialScan, { once: true });
  else initialScan();
  observe();
  if (isYouTube()) startYouTubeAdapter();
}

start().catch(error => console.error("Super Adblock content error", error));
