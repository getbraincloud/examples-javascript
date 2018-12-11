# JavaScript

This repository contains example JavaScript projects that use the brainCloud client. This is a good place to start learning how the various brainCloud APIs can be used.

Examples:
- War Stone - RTT multiplayer card game example
- Acey Deucey - Simple single player card game example
- File Update - Example tool for uploading files to brainCloud


## War Stone
Turned Based card game, built as an example for brainCloud real-time Room Server Manager (RSM) and real-time Matchmaking

![](screenshots/warstone.png)

### Play the game
To play the game now, follow this link:
http://ec2-18-219-26-183.us-east-2.compute.amazonaws.com:3000/


> Play against yourself to get into a game fast: Run two browser tabs of the game with separate logins (username/pw). Matchmaking will most likely place you together in the same game.

### How to run your instance
You might want to modify this example, for your individual needs and debugging purposes. 

To further familiarize yourself with the system, it is a good idea to try to run your own War Stone project.

#### Portal setup
We first need to create the application in the brainCloud portal, then upload configuration that defines the settings and rules of the game.
1. Create a new app, call it `War Stone` or your chosen project name.

2. In the **Design / Core App Info / Admin Tools** section of the portal, then **Import Configuration Data** from `warstone/game/portal-configs/configuration-data.bcconfig`.
3. In the **Design / Cloud Code / Web Services** section of the portal, edit the **Base URL** of the **RSM** service. By default, it points to the example RSM instance.
4. Now in the portal, go in the section **Monitoring / Global Entities** and **Bulk Actions / Import from Raw JSON Object file** from `warstone/game/portal-configs/global-entities_raw.json`

#### Run the server
1. Clone the WarStone example: 
    ```
    git clone https://github.com/getbraincloud/examples-javascript.git
    ```
2. In the `warstone/rsm/Scripts` folder, create a ids.js file. See `warstone/rsm/Scripts/ids-example.js` for a reference.

3. In the new file `warstone/rsm/Scripts/ids.js`, fill in the following information:
   ```
   let appId = "...";  // Fill in your appId
   let appSecret = "...";   // Fill in your appSecret
   ```
   Found in **Design / Core App Info / Application IDs**

4. Make sure your router allows for TCP ports 9306/9308/9310. If you wish to change the ports, check in the file `warstone/rsm/Scripts/ids.js` for `tcp`, `http` and `port`.

   Don't forget to update the URL for the RSM in the portal.

5. In the `warstone/rsm/Scripts/RoomServerManager.js`, fill in the following information:

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
   cd warstone/rsm/
   npm install
   node Scripts/main.js
   ```

#### Run the client
1. Clone the WarStone example: 
    ```
    git clone https://github.com/getbraincloud/examples-javascript.git
    ```

2. In the `warstone/game/src` folder, create a ids.js file. See `warstone/game/src/ids-example.js` for a reference.

3. In the new file `warstone/game/src/ids.js`, fill in the following information:
   ```
   let appId = "...";  // Fill in your appId
   let appSecret = "...";   // Fill in your appSecret
   ```
   Found in **Design / Core App Info / Application IDs**
4. In the `warstone/game` folder, install npm modules: 
    ```
    npm install
    ```
5. Then in the same folder, run the project:
    ```
    npm start
    ```



## AceyDeucy

Card game example.

Additional information can be found here: https://getbraincloud.com/apidocs/tutorials/javascript-tutorials/javascript-example-game/




## FileUploader

Example for adding UserFiles to your app. Recommended as a quick testing tool.

![File Uploader Steps](/screenshots/FileUploaderSteps.png?raw=true)
