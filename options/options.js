import { getSettings } from "../src/shared/storage.js";
import { sendMessage } from "../src/shared/api.js";
const rules = document.querySelector("#rules");
const updateCount = () => {
  const count = rules.value.split(/\r?\n/).map(value => value.trim()).filter(Boolean).length;
  document.querySelector("#ruleCount").textContent = `${count} rule${count === 1 ? "" : "s"}`;
};
rules.value = (await getSettings()).customRules.join("\n");
updateCount();
rules.addEventListener("input", updateCount);
document.querySelector("#save").addEventListener("click", async () => {
  const values = rules.value.split(/\r?\n/).map(value => value.trim()).filter(Boolean);
  await sendMessage({ type: "saveCustomRules", rules: values });
  document.querySelector("#status").textContent = "Saved";
  setTimeout(() => { document.querySelector("#status").textContent = ""; }, 2200);
});
