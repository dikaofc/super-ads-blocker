import { extensionApi } from "../shared/api.js";

export async function incrementBlocked(amount = 1) {
  const { blockedCount = 0 } = await extensionApi.storage.local.get("blockedCount");
  await extensionApi.storage.local.set({ blockedCount: blockedCount + amount });
}

export async function getStats() {
  return extensionApi.storage.local.get("blockedCount");
}
