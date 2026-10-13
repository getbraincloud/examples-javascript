
# JavaScript

This repository contains example JavaScript projects that use the brainCloud client. This is a good place to start learning how the various brainCloud APIs can be used.

Each example reads its app from `braincloud.config.js`, created by the brainCloud setup tool (needs [Node.js](https://nodejs.org) 18+):

- **Terminal:** from the example's project folder, run `npx @braincloud/client setup`. It opens the setup panel in your browser; log in, pick your team and app, and click **Done**.
- **VS Code:** open the example's project folder and run Terminal → Run Task… → **brainCloud: Setup**. **brainCloud: Refresh config** re-fetches the config from your saved login without the browser.

The project folder is the example folder, except FileUploader (`FileUploader/client`) and Warstone (`warstone/client`). See each readme for details.

Examples:
- [Acey Deucey](AceyDeucey/readme.md) - Simple single player card game example
- [BCChat](bcchat/readme.md) - RTT chat system example
- [File Update](FileUploader/readme.md) - Example tool for uploading files to brainCloud
- [Relay Test App](RelayTestApp/README.md) - Example app using relay server
- [Warstone](warstone/readme.md) - RTT multiplayer card game example
- [bcGoogleAuth](bcgoogleauth/readme.md) - Simple integrate Google Sign in example