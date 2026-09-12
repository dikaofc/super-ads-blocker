import { clean } from "../content/cosmetic.js";
import { debounce } from "../shared/utils.js";

export function startYouTubeAdapter() {
  const scan = debounce(() => clean(document), 250);
  window.addEventListener("yt-navigate-finish", scan, { passive: true });
  window.addEventListener("popstate", scan, { passive: true });
  return scan;
}
