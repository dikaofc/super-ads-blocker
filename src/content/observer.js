import { debounce } from "../shared/utils.js";
import { clean } from "./cosmetic.js";
import { sendMessage } from "../shared/api.js";

export function observe() {
  const process = debounce(nodes => {
    let removed = 0;
    for (const node of nodes) if (node.nodeType === Node.ELEMENT_NODE) removed += clean(node);
    if (removed) sendMessage({ type: "blocked", amount: removed }).catch(() => {});
  }, 120);
  const observer = new MutationObserver(records => process(records.flatMap(record => [...record.addedNodes])));
  observer.observe(document.documentElement, { childList: true, subtree: true });
  return observer;
}
