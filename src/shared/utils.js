export function debounce(callback, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
}

export function isYouTube(host = location.hostname) {
  return host === "youtube.com" || host.endsWith(".youtube.com");
}
