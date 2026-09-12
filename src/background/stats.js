import { extensionApi } from "../shared/api.js";

let pending = 0;
let flushPromise = Promise.resolve();

function flush() {
  if (!pending) return flushPromise;
  const amount = pending;
  pending = 0;
  flushPromise = flushPromise.then(async () => {
    const { blockedCount = 0 } = await extensionApi.storage.local.get("blockedCount");
    await extensionApi.storage.local.set({ blockedCount: blockedCount + amount });
  });
  return flushPromise;
}

export function incrementBlocked(amount = 1) {
  pending += Math.max(1, Math.floor(Number(amount) || 1));
  return pending >= 25 ? flush() : Promise.resolve();
}

export async function getStats() {
  await flush();
  return extensionApi.storage.local.get("blockedCount");
}

export function flushStats() {
  return flush();
}
