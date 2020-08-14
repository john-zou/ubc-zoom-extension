import 'emoji-log';
import ContentScriptFunctions, {ContentScriptFunctionsNamespace} from "./content-script-functions";


(window as any)[ContentScriptFunctionsNamespace] = ContentScriptFunctions;

console.emoji('💉','UBC Zoom Extension content script activated. Content script functions injected.');


export {}
