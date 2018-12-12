let TurnBasedRoomServer = new require('./TurnBasedRoomServer.js');
let ids = require('./ids.js');

let roomServers = [];

exports.createRoomServer = function(room)
{
    let roomServer = null;

    switch (room.appId)
    {
        case ids.appId:
            roomServer = new TurnBasedRoomServer(room, "Warstone");
            break;
        default:
            return null;
    }

    if (roomServer)
    {
        roomServers.push(roomServer);
    }

    return roomServer;
}

exports.getRoomServer = function(id)
{
    return roomServers.find(roomServer => roomServer.room.id === id);
}

exports.removeRoomServer = function(roomServerToRemove)
{
    roomServers = roomServers.filter(roomServer => roomServer !== roomServerToRemove);
}
