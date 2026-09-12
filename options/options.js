import { getSettings } from "../src/shared/storage.js";
import { sendMessage } from "../src/shared/api.js";
const rules = document.querySelector("#rules");
rules.value = (await getSettings()).customRules.join("\n");
document.querySelector("#save").addEventListener("click", async () => {
  const values = rules.value.split(/\r?\n/).map(value => value.trim()).filter(Boolean);
  await sendMessage({ type: "saveCustomRules", rules: values });
  document.querySelector("#status").textContent = " Saved";
});
