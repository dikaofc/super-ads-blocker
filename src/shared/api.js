export const extensionApi = globalThis.browser ?? globalThis.chrome;

export function sendMessage(message) {
  return extensionApi.runtime.sendMessage(message);
}
