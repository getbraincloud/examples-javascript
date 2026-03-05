
# Warstone
Warstone is a turn-based card game built using the brainCloud real-time Matchmaking facilities.

![](Screenshots/warstone-GamePlay.png)

Of note, there are 2 versions of the server-side source for this game: a Room Server (RS) based approach and a Room Server Manager (RSM) based approach. 

The RS approach takes advantage of the built-in brainCloud hosted infrastructure and runs Room Server instances (provided via a Docker image) for each match.

The RSM approach takes advantage of the built-in brainCloud facility to talk to an external Room Server Manager for spinning up match instances.

The RS approach is the simpler of the two scenarios while the RSM version is slightly more complex but particularly useful if you or your company already have infrastructure in place for running server instances (i.e. you want to host your own Room Server instances).

The following sections describe the protocols and requirements for the RS approach. The RSM approach will be described in a separate article.


## How matchmaking works
Room Server instances in brainCloud are launched when the matchmaking requirements are satified for a particular lobby instance. Lobby matchmaking details are outside the scope of this article however you can find them [here](https://getbraincloud.com/apidocs/api-modules/multiplayer/lobbies/) if you haven't been exposed to it before.

Assuming a player (or players) have been assigned to a lobby instance (typically via the Lobby service FindOrCreateLobby() API call) and the launch criteria have been satisfied for that lobby instance (ex. all the players are "ready") then the next step for brainCloud is to spin up a Room Server instance for those players. How brainCloud does this is determined by the configuration of the corresponding lobby type.

In our Warstone example, our lobby type is called "unranked" and it maps to a Server type called appropriately enough... "WarStone":

![](Screenshots/unranked_lobby_type.png)

The definition of the "WarStone" server type looks like this:

![](Screenshots/warstone_rs_settings.png)

The significant setting for our purposes here is that of the "WarStone" Server Type. It is set to *Room Server (hosted)*. This corresponds to the RS approach of matchmaking. (If the type were *Room Server Manager* then that would correspond to the RSM approach of launching room server instances.)


## Room Server launch protocol
When it comes time for brainCloud to launch a Room Server instance, the internal brainCloud Room Server Manager will do so by following these basic steps:

1. Assign a short random one-time password for each lobby member.
2. Pull the configured docker image from the docker registry.
3. Start an instance of the image in docker and set [various environment variables](#room-server-instance-environment-variables) to communicate relevant data to the instance.
4. Wait for the RS instance to indicate that it's ready to accept client connections. This is accomplished by the RS instance calling [SysRoomReady](https://getbraincloud.com/apidocs/apiref/#s2s-lobby-sysroomready) via the brainCloud S2S interface.
5. Upon receipt of the SysRoomReady call, the brainCloud lobby service sends an RTT message to all the lobby members indicating the instance is ready and they should connect to it.
6. The lobby instance is DISBANDED with a message stating "Room successfully launched". The lobby service does not wait to validate whether everybody connected or not before disbanding the lobby instance.
7. Lobby members connect to the RS instance directly. The RS instance can validate the connection requests using the one-time passwords generated in step 1.


## Room Server instance environment variables
The following environment variables are set for each RS instance:

* APP_ID -- The brainCloud app id.
* EXTERNAL_IP -- The external ip of this room server instance.
* LOBBY_ID -- The lobby instance id this room server instance corresponds to.
* SERVER_HOST -- The host to call for S2S requests.
* SERVER_PORT -- The port to call for S2S requests.
* SERVER_NAME -- The name of the "My Servers" entry that corresponds to this RS instance.
* SERVER_SECRET -- The secret for the "My Servers" entry that corresponds to this RS instance.

In addition to these values, any custom values defined in the "Custom Environment" section of the "My Servers" section for this server type will also be set.

![](Screenshots/warstone_rs_custom_env.png)


## Pre-Ready Launch (PRL)

By default, brainCloud waits until all lobby members have marked themselves as "ready" before launching a Room Server instance. **Pre-Ready Launch (PRL)** is an optional mode that inverts this order: brainCloud launches the server instance *before* the lobby has fully transitioned to the "starting" state, allowing the server to warm up in parallel while players are still readying up.

This is useful for latency-sensitive games where every millisecond of startup time matters — the server is already running and authenticated by the time the lobby reaches its launch threshold.

### How it works

When PRL is enabled for a server type, brainCloud sets the `PRE_READY_LAUNCH` environment variable to `"true"` when launching the RS instance. The server is responsible for detecting this flag and executing the PRL handshake before proceeding with normal startup.

The PRL flow, implemented in [`brainclouds2s-prl.js`](server/Scripts/brainclouds2s-prl.js), works as follows:

1. After S2S authentication, the server checks `PRE_READY_LAUNCH`.
2. If enabled, the server **cancels its death timer** (it must not self-terminate while waiting).
3. The server enables RTT and subscribes to the lobby's status channel via `chat/SYS_CHANNEL_CONNECT`.
4. The server notifies brainCloud it is running via `roomServer/SYS_ROOM_SESSION_STARTED`.
5. The server queries the current lobby state via `lobby/GET_LOBBY_DATA`.
6. Depending on the lobby state:
   - **`starting`** — the lobby is ready to launch; the server proceeds normally.
   - **`disbanded`** or not found — the lobby was cancelled; the server exits cleanly.
   - **Any other state** — the server waits, monitoring RTT push messages for a state transition.
7. If the lobby does not reach `starting` within the timeout window, the server exits.

Once the PRL handshake resolves with `proceed = true`, the server continues with the standard launch sequence (retrieving lobby data, calling `SysRoomReady`, accepting client connections).

### PRL environment variables

The following additional environment variables apply when PRL is enabled:

* `PRE_READY_LAUNCH` -- Set to `"true"` by brainCloud when the server is launched in PRL mode.
* `SERVER_ID` -- The server instance identifier, included in session lifecycle S2S calls.
* `SERVER_CONTEXT` -- Optional JSON context data passed from brainCloud to the server instance.
* `PRL_TIMEOUT_SECS` -- How long (in seconds) the server will wait for the lobby to reach `starting` before giving up. Defaults to `60`.
* `PRE_READY_LAUNCH_TIMEOUT_SECS` -- Alias for `PRL_TIMEOUT_SECS`, checked as a fallback.

### Example (from main.js)

```javascript
var isPRL = prl.isPreReadyLaunch()

if (isPRL) {
    ConnectionManager.cancelDeathTimer()
    prl.start(S2S.context, LOBBY_ID, proceed => {
        if (!proceed) {
            process.exit(0)
        }
        retreiveLobby()
    })
} else {
    retreiveLobby()
}
```

### Session lifecycle S2S calls

PRL introduces two S2S calls that servers must make to keep brainCloud informed of their state:

* `roomServer/SYS_ROOM_SESSION_STARTED` — sent during the PRL handshake to indicate the server is alive and waiting.
* `roomServer/SYS_ROOM_SESSION_ENDED` — sent if the server exits without completing a match (e.g. lobby disbanded, timeout). Call `prl.sendSessionEnded()` before `process.exit()` in any early-exit path.


## Room Server instance development
As a Room Server instance developer, you can use the S2S [Logging](https://getbraincloud.com/apidocs/apiref/#s2s-log) interface to log any debugging or info level messages to aid you when developing the Room Server instance docker image.
