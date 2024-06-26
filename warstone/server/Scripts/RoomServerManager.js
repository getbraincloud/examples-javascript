let TurnBasedRoomServer = new require('./TurnBasedRoomServer.js');

let roomServers = [];

exports.createRoomServer = function(room)
{
    let roomServer = null;
    
    roomServer = new TurnBasedRoomServer(room, "WarStone");

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
