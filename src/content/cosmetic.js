import { isYouTube } from "../shared/utils.js";

const genericSelectors = [
  "[class*=\"ad-\"]", "[id^=\"ad-\"]", "[id*=\"advert\"]", "[class*=\"advert\"]",
  "[class*=\"sponsor\"]", "[aria-label*=\"advertisement\" i]", "iframe[src*=\"doubleclick\"]"
];
const youtubeSelectors = [
  "#masthead-ad", "ytd-display-ad-renderer", "ytd-promoted-sparkles-web-renderer",
  "ytd-ad-slot-renderer", "ytd-in-feed-ad-layout-renderer", ".ytp-ad-overlay-container",
  ".ytp-ad-text", ".ytp-ad-image-overlay"
];

function removeMatches(root, selectors) {
  let removed = 0;
  for (const selector of selectors) {
    try {
      for (const node of root.querySelectorAll(selector)) { node.remove(); removed++; }
    } catch (error) { console.warn("Invalid cosmetic selector", selector, error); }
  }
  return removed;
}

export function clean(root = document) {
  return removeMatches(root, isYouTube() ? [...genericSelectors, ...youtubeSelectors] : genericSelectors);
}
