import {browser} from "webextension-polyfill-ts";
import {ContentScriptFunctionsNamespace} from "../ContentScript/content-script-functions";

/**
 * @param functionName imported from content-script-types.ts
 */
export async function executeInZoom<T>(functionName: string): Promise<T> {
    return (await browser.tabs.executeScript({
        code: `${ContentScriptFunctionsNamespace}.${functionName}()`
    }))[0];
}