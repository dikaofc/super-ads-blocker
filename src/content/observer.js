import { debounce } from "../shared/utils.js";
import { clean } from "./cosmetic.js";
import { sendMessage } from "../shared/api.js";

export function observe() {
  const process = debounce(nodes => {
    let removed = 0;
    for (const node of nodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      removed += clean(node);
      if (node.matches?.("[class*=\"ad-\"], [id*=\"advert\"], [class*=\"advert\"]")) {
        node.remove();
        removed++;
      }
    }
    if (removed) {
      sendMessage({ type: "blocked", amount: removed })
        .catch(error => console.warn("Could not update blocked count", error));
    }
  }, 120);
  const observer = new MutationObserver(records => process(records.flatMap(record => [...record.addedNodes])));
  observer.observe(document.documentElement, { childList: true, subtree: true });
  return observer;
}
