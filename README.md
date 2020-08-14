# UBC Zoom Web Extension

This Zoom Web Extension, when used in conjunction with the Zoom Web Client, allows for the automation of key breakout rooms management functions.

## Functionality:

### 1. Assign users by their current username ✅

- Usernames starting with `(TA)` or `(Prof)` will be assigned to the Instructors room, if it exists. Examples:
  - `(Prof) Ada Lovelace`
  - `(TA) Edsger Dijkstra`
- Otherwise, users will be assigned to breakout rooms based on the presence of matching numbers in thier username and the room name. Typical examples:
  - `(00) Robert Tarjan` will be assigned to the `Lone Wolves` room, if it exists
  - `(5) Grace Hopper` will be assigned to a `Breakout Room 5`
- Otherwise, users will remain unassigned.

### 2. Distribute remaining users into breakout rooms based on a user-defined target room occupancy ⌛

- E.g. If `5` users per room is the "target", then rooms with fewer than `5` (and at least `1`) user will receive remaining users first

### 3. Assign users based on preferences retrieved from server ⌛

### 4. Redistribute users (in reaction to fluctuating number during lecture) ⌛

---

## Development:

This is a TypeScript project and uses React for an extension popup UI. Instead of injecting pure code from the popup using the [tabs.executeScript()](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/executeScript), all of the code is loaded as function definitions in the content script, and only the function invocation is injected, making for a better developer experience compared to injecting code as raw strings.

Background information:

- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions
- https://developer.chrome.com/extensions/getstarted

Main commands:

- `yarn install`
- `yarn dev:chrome`

See `package.json` for all commands

---

Starter template: https://github.com/abhijithvijayan/web-extension-starter

Inspiration: https://github.com/davidshumway/zoomie
