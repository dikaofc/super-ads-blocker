import { extensionApi, sendMessage } from "../src/shared/api.js";

const tab = (await extensionApi.tabs.query({ active: true, currentWindow: true }))[0];
const state = await sendMessage({ type: "getState", url: tab?.url });
const engine = document.querySelector("#enabled");
const siteToggle = document.querySelector("#siteToggle");
const enabled = state?.enabled !== false;
const siteEnabled = state?.enabledForSite !== false;

document.querySelector("#site").textContent = state?.site || "Unknown site";
document.querySelector("#count").textContent = String(state?.blockedCount || 0);
engine.classList.toggle("on", enabled);
engine.setAttribute("aria-pressed", String(enabled));
siteToggle.classList.toggle("active", siteEnabled);
siteToggle.setAttribute("aria-label", siteEnabled ? "Disable protection for this site" : "Enable protection for this site");
document.querySelector("#statusDot").style.background = enabled ? "var(--cyan)" : "#64708f";

engine.addEventListener("click", async () => {
  const next = !engine.classList.contains("on");
  engine.classList.toggle("on", next);
  engine.setAttribute("aria-pressed", String(next));
  document.querySelector("#statusDot").style.background = next ? "var(--cyan)" : "#64708f";
  await sendMessage({ type: "setEnabled", enabled: next });
});

siteToggle.addEventListener("click", async () => {
  await sendMessage({ type: "setSiteEnabled", site: state.site, enabled: !siteEnabled });
  window.close();
});
