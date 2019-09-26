# JavaScript

This repository contains example JavaScript projects that use the brainCloud client. This is a good place to start learning how the various brainCloud APIs can be used.

Examples:
- Warstone - RTT multiplayer card game example
- bcChat - RTT chat system example
- Acey Deucey - Simple single player card game example
- File Update - Example tool for uploading files to brainCloud


## Warstone
Turned Based card game, built as an example for brainCloud real-time Room Server Manager (RSM) and real-time Matchmaking

![](screenshots/warstone.png)

### Play the game
To play the game now, follow this link:
http://ec2-18-219-26-183.us-east-2.compute.amazonaws.com:3001/


> Play against yourself to get into a game fast: Run two browser tabs of the game with separate logins (username/pw). Matchmaking will most likely place you together in the same game.

### How to run your instance
You might want to modify this example, for your individual needs and debugging purposes. 

To further familiarize yourself with the system, it is a good idea to try to run your own Warstone project.

#### Portal setup
We first need to create the application in the brainCloud portal, then upload configuration that defines the settings and rules of the game.
1. Create a new app, call it `Warstone` or your chosen project name.

2. In the **Design / Core App Info / Admin Tools** section of the portal, then **Import Configuration Data** from `warstone/portal-configs/configuration-data.bcconfig`.
3. In the **Design / Cloud Code / Web Services** section of the portal, edit the **Base URL** of the **RSM** service. By default, it points to the example RSM instance.
4. Now in the portal, go in the section **Monitoring / Global Entities** and **Bulk Actions / Import from Raw JSON Object file** from `warstone/portal-configs/global-entities_raw.json`

#### Prerequisites
If you don't have it already, install NodeJS https://nodejs.org/.

[optional] We recommend to install Visual Studio Code https://code.visualstudio.com/.

#### Run the server
1. Clone this repository: 
    ```
    git clone https://github.com/getbraincloud/examples-javascript.git
    ```
2. In the `rsm/Scripts` folder, create a ids.js file. See `rsm/Scripts/ids-example.js` for a reference.

3. In the new file `rsm/Scripts/ids.js`, fill in the following information:
   ```
   let appId = "...";  // Fill in your appId
   let appSecret = "...";   // Fill in your appSecret

    // Choose your ports
    let tcp = 0;
    let http = 0;
    let ws = 0;
   ```
   Your App Id and Secret is found in **Design / Core App Info / Application IDs**

4. Make sure your router allows for TCP ports for your chosen ports, in `rsm/Scripts/ids.js`.

   Don't forget to update the URL for the RSM in the portal.

5. In the `rsm/Scripts/RoomServerManager.js`, fill in the following information:

```
    switch (room.appId)
        {
            case "...": // Fill in the appId
                roomServer = new TurnBasedRoomServer(room, "WarStone");
                break;
            default:
                return null;
    }
```
  AppId in **Design / Core App Info / Application IDs**

5. It's a nodejs project. It can be started by calling the following via the cmdline:
   ```
   cd rsm/
   npm install
   node Scripts/main.js
   ```

#### Run the client
1. Clone this repository

2. In the `warstone/src` folder, create a ids.js file. See `warstone/src/ids-example.js` for a reference.

3. In the new file `warstone/src/ids.js`, fill in the following information:
   ```
   let appId = "...";  // Fill in your appId
   let appSecret = "...";   // Fill in your appSecret
   ```
   Found in **Design / Core App Info / Application IDs**
4. In the `warstone` folder, install npm modules: 
    ```
    npm install
    ```
5. Then in the same folder, run the project:
    ```
    npm start
    ```



----------



## BCChat
Test chat app built in ReactJS that exercise the brainCloud Real-time Tech Tech (RTT)

![](screenshots/Capture.PNG)

### How to test this app yourself

#### Prerequisites
If you don't have it already, install NodeJS https://nodejs.org/.

[optional] We recommend to install Visual Studio Code https://code.visualstudio.com/.

#### App setup
1. Create a new app in the portal if you don't already have one here: https://portal.braincloudservers.com
2. In **Advanced Settings** of the portal, check "**Real-time Tech (RTT) Enabled**"
3. In **Messaging - Chat** section of the portal, enable "**Chat Service Enabled**", then click save.
4. In **Messaging - Chat Channels** Channels section of the portal, create some new global chat channels to be visible in the app.

#### Running locally
1. Clone this repository
2. In the `bcchat/src` folder, create a ids.js file. See `bcchat/src/ids-example.js` for a reference.
`brainCloudServerURL`:
    ```
    appId = "...", // Fill in your appId
    appSecret = "...", // Fill in your appSecret
    
    ```
    That information can be found in **Core App Info - Application IDs** section of the portal.
3. Open Terminal into the repository and type:
   ```
   npm install
   ```
4. Then type:
   ```
   npm start
   ```

The terminal should launch BCChat into a tab in your browser, and it should just work! Enjoy.


----------


## AceyDeucy

Card game example.

Additional information can be found here: https://getbraincloud.com/apidocs/tutorials/javascript-tutorials/javascript-example-game/


----------

## FileUploader

Example for adding UserFiles to your app. Recommended as a quick testing tool.

![File Uploader Steps](/screenshots/FileUploaderSteps.png?raw=true)
