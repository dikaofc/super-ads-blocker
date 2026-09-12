import { getSettings } from "../src/shared/storage.js";
import { sendMessage } from "../src/shared/api.js";
const rules = document.querySelector("#rules");
const whitelist = document.querySelector("#whitelist");
const updateCount = () => {
  const count = rules.value.split(/\r?\n/).map(value => value.trim()).filter(Boolean).length;
  document.querySelector("#ruleCount").textContent = `${count} rule${count === 1 ? "" : "s"}`;
};
const updateSiteCount = () => {
  const count = whitelist.value.split(/\r?\n/).map(value => value.trim()).filter(Boolean).length;
  document.querySelector("#siteCount").textContent = `${count} site${count === 1 ? "" : "s"}`;
};
const settings = await getSettings();
rules.value = settings.customRules.join("\n");
whitelist.value = settings.whitelist.join("\n");
updateCount();
updateSiteCount();
rules.addEventListener("input", updateCount);
whitelist.addEventListener("input", updateSiteCount);
document.querySelector("#save").addEventListener("click", async () => {
  const values = rules.value.split(/\r?\n/).map(value => value.trim()).filter(Boolean);
  await sendMessage({ type: "saveCustomRules", rules: values });
  document.querySelector("#status").textContent = "Saved";
  setTimeout(() => { document.querySelector("#status").textContent = ""; }, 2200);
});
document.querySelector("#saveWhitelist").addEventListener("click", async () => {
  const sites = whitelist.value.split(/\r?\n/)
    .map(value => value.trim().toLowerCase())
    .filter(value => /^[a-z0-9.-]+$/.test(value));
  await sendMessage({ type: "saveWhitelist", sites });
  whitelist.value = sites.join("\n");
  updateSiteCount();
});
