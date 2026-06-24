var Connection = require('./Connection.js');
var WSConnection = require('./WSConnection.js');
var prl = require('./brainclouds2s-prl');
var S2S = require('./S2S.js');

const TIMEOUT_TIME = 30 * 1000 // 30sec
var connections = [];

function death()
{
    console.log("No connections after 30sec, timeout")
    prl.sendSessionEnded(S2S.context, () => process.exit(2));
}

let deathTimeout = setTimeout(death, TIMEOUT_TIME)

exports.cancelDeathTimer = function()
{
    console.log("Death timer cancelled (PRL in progress)");
    clearTimeout(deathTimeout);
    deathTimeout = null;
}

exports.resetDeathTimer = function()
{
    clearTimeout(deathTimeout);
    deathTimeout = setTimeout(death, TIMEOUT_TIME);
    console.log("Death timer reset (" + (TIMEOUT_TIME / 1000) + "sec)");
}

exports.getConnection = function(id)
{
    return connections.find(connection => connection.id === id);
}

exports.createConnection = function(socket)
{
    var newConnection = new Connection(socket);

    connections = connections.filter(connection => connection.id !== newConnection.id);
    connections.push(newConnection);

    clearTimeout(deathTimeout)

    return newConnection;
}

exports.createWSConnection = function(socket)
{
    var newConnection = new WSConnection(socket);

    connections = connections.filter(connection => connection.id !== newConnection.id);
    connections.push(newConnection);

    clearTimeout(deathTimeout)

    return newConnection;
}

exports.removeConnection = function(connectionToRemove)
{
    if (!connectionToRemove) return;

    connections = connections.filter(connection => connection.id !== connectionToRemove.id);
    if (connectionToRemove.socket)
    {
        if (connectionToRemove.socket.destroy)
        {
            connectionToRemove.socket.destroy();
        }
        connectionToRemove.socket = null;
    }

    console.log("Removed connection: " + connectionToRemove.id + ", stack: " + new Error().stack);

    if (connectionToRemove.roomServer)
    {
        let member = connectionToRemove.roomServer.room.members.find(member => member.connection === connectionToRemove);
        if (member)
        {
            member.connection = null;
            connectionToRemove.roomServer.onMemberDisconnected(member);
        }
    }

    if (connections.length == 0) deathTimeout = setTimeout(death, TIMEOUT_TIME)
}
