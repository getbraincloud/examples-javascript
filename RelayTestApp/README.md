# Relay Test App
This simple "game" is used to demonstrate how to integrate with brainCloud's relay server. It is a simple multiplayer game where players can see each other's mouse move on the screen and create little shockwaves by clicking.

The game can be played here:
getbraincloud.com/demos/relaytestapp 

The mouse movement are sent using unreliable, ordered messages. The shockwaves are sent using reliable, unordered messages.

In Javascript, the implentation uses WebSockets. Therefore, the unreliable messages are guaranteed reliable. But, the application can crossplay with other APIs (C++, Java, etc) which support unreliable UDP protocol.

## Setup
```
npm install
npx @braincloud/client setup
npm start
```
Setup logs you in to brainCloud, lets you pick your team and app, and writes `src/braincloud.config.js` (gitignored). The app loads it and calls `init()`. Rerun setup to switch apps or servers.
In VS Code, open this folder and run Terminal → Run Task… → **brainCloud: Setup** instead (**brainCloud: Refresh config** re-fetches the config from your saved login without the browser).
