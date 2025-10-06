# Relay Test App
This simple "game" is used to demonstrate how to integrate with brainCloud's relay server. It is a simple multiplayer game where players can see each other's mouse move on the screen and create little shockwaves by clicking.

The game can be played here:
getbraincloud.com/demos/relaytestapp 

## Getting Started
After creating your app in the brainCloud portal, add your App ID and Secret to the ids.js file.
The relay-test-app.bcconfig file can be imported into your app via the brainCloud portal (Design > Admin Tools > Configuration Data) to add the necessary Global Properties, Scripts, etc.

The mouse movement are sent using unreliable, ordered messages. The shockwaves are sent using reliable, unordered messages.

In Javascript, the implentation uses WebSockets. Therefore, the unreliable messages are guaranteed reliable. But, the application can crossplay with other APIs (C++, Java, etc) which support unreliable UDP protocol.
