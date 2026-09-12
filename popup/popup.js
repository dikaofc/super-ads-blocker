import { extensionApi } from "../src/shared/api.js";
import { sendMessage } from "../src/shared/api.js";
const tab = (await extensionApi.tabs.query({ active: true, currentWindow: true }))[0];
const state = await sendMessage({ type: "getState", url: tab?.url });
const enabled = document.querySelector("#enabled");
const toggle = document.querySelector("#siteToggle");
document.querySelector("#site").textContent = state?.site || "unknown";
document.querySelector("#count").textContent = String(state?.blockedCount || 0);
enabled.checked = state?.enabled !== false;
toggle.textContent = state?.enabledForSite ? "Disable on this site" : "Enable on this site";
enabled.addEventListener("change", async () => {
  await sendMessage({ type: "setEnabled", enabled: enabled.checked });
});
toggle.addEventListener("click", async () => {
  await sendMessage({ type: "setSiteEnabled", site: state.site, enabled: !state.enabledForSite });
  window.close();
});
