let ids = require('./ids')
let log = require('./log').log
let Docker = require('docker-cli-js').Docker

let REPORT_INTERVAL_SEC = 30
let ASSIGN_TO_LAUNCH_TIMEOUT_SEC = 60

let roomServers = []
let possiblePorts = []
let docker = new Docker()

for (var i = ids.ports.RSRange[0]; i <= ids.ports.RSRange[1]; ++i)
{
    possiblePorts.push(i)
}

// Every couple seconds, report on current active rooms
setInterval(() =>
{
    if (roomServers.length === 0) return // don't spam

    log("--- Room servers report ---")
    roomServers.forEach(roomServer =>
    {
        log(`  ${roomServer.room.id}:${roomServer.port} spawned:${roomServer.spawned}`)
    })
}, REPORT_INTERVAL_SEC * 1000)

exports.createRoomServer = function(room)
{
    // Find an available port
    let availPorts = possiblePorts.filter(
        port => !roomServers.find(roomServer => roomServer.port == port))
    if (availPorts.length === 0)
    {
        log("Can't create room, no more available ports")
        return null
    }

    // Create it
    let roomServer = {
        spawned: false,      // Has spawned or not
        room: room,          // Lobby info
        port: availPorts[0], // Pick first available port
        timeoutHandle: null
    }
    roomServers.push(roomServer)

    // Start a timer to kill it if we never get a launch
    roomServer.timeoutHandle = setTimeout(() =>
    {
        log(`TIMEOUT. Room ${room.id} was assigned, but never launched for ${ASSIGN_TO_LAUNCH_TIMEOUT_SEC} sec`)
        exports.removeRoomServer(roomServer)
    }, ASSIGN_TO_LAUNCH_TIMEOUT_SEC * 1000)

    return roomServer
}

exports.launchRoomServer = function(roomServer)
{
    if (roomServer.spawned) return false; // Already spawned

    try
    {
        let room = roomServer.room

        // Run docker image
        docker.command(`run -p ${roomServer.port}:${ids.ports.docker} -e SERVER_HOST=${ids.url} -e APP_ID=${ids.appId} -e SERVER_SECRET=${ids.rsServerSecret} -e SERVER_NAME=${ids.rsServerName} -e LOBBY_ID=${room.id} ${ids.dockerImage}`).then(data =>
        {
            // Room closed
            log(`<-- ROOM TERMINATED: ${room.id}`)
            exports.removeRoomServer(roomServer)
        }, error =>
        {
            console.log(`Error: ${error}`)

            // Room closed
            log(`<-- ROOM TERMINATED WITH ERROR: ${room.id}`)
            exports.removeRoomServer(roomServer)
        })
        
        // Spawn successful, set flags
        roomServer.spawned = true
        if (roomServer.timeoutHandle)
        {
            clearTimeout(roomServer.timeoutHandle)
            roomServer.timeoutHandle = null
        }
    }
    catch (e)
    {
        log(`Failed to launch room ${room.id}, ${e}`)
        exports.removeRoomServer(roomServer)
        return false
    }

    return true
}

exports.getRoomServer = function(roomId)
{
    return roomServers.find(roomServer => roomServer.room.id === roomId)
}

exports.removeRoomServer = function(roomServerToRemove)
{
    roomServers = roomServers.filter(
        roomServer => roomServer !== roomServerToRemove)
}
