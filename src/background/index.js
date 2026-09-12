import { extensionApi } from "../shared/api.js";
import { registerMessaging } from "./messaging.js";
import { syncCustomRules } from "./rules.js";

registerMessaging();
syncCustomRules().catch(error => console.error("Failed to sync custom rules", error));
extensionApi.runtime.onInstalled.addListener(() => syncCustomRules().catch(error => console.error("Failed to initialize rules", error)));
