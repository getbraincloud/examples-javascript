// Imports
var net = require('net');
var ConnectionManager = require('./ConnectionManager.js');
const publicIp = require('public-ip');
var brainclouds2s = require('brainclouds2s');
const WebSocket = require('ws');
const S2S = require('./S2S.js');
let RoomServerManager = require('./RoomServerManager.js')

// Constants
var TCP_PORT = 9314;
var WS_PORT = 9313;

// Get some envs
const SERVER_PORT       = process.env["SERVER_PORT"];
const SERVER_HOST       = process.env["SERVER_HOST"];
const APP_ID            = process.env["APP_ID"];
const SERVER_SECRET     = process.env["SERVER_SECRET"];
const SERVER_NAME       = process.env["SERVER_NAME"];
const LOBBY_ID          = process.env["LOBBY_ID"];

function makeS2SURL(host, port)
{
    if (!host)
    {
        if (!port)
        {
            return "sharedprod.braincloudservers.com"
        }
        else
        {
            return "sharedprod.braincloudservers.com:" + port
        }
    }
    else
    {
        if (!port)
        {
            return host
        }
        else
        {
            return host + ":" + port
        }
    }
}

// Init braincloud S2S
S2S.context = brainclouds2s.init(APP_ID, SERVER_NAME, SERVER_SECRET, makeS2SURL(SERVER_HOST, SERVER_PORT));
brainclouds2s.setLogEnabled(S2S.context, true);

// Get our public IP
let myPublicIp = "";
publicIp.v4().then(ip =>
{
    myPublicIp = ip;
    console.log("Public IP: " + myPublicIp);
    retreiveLobby();
});

function retreiveLobby()
{
    // Ask braincloud for our lobby json
    brainclouds2s.request(S2S.context, {
        service: "lobby",
        operation: "GET_LOBBY_DATA",
        data: {
            lobbyId: LOBBY_ID
        }
    }, (context, result) =>
    {
        if (result == null)
        {
            console.log("Failed to retreive Lobby Data from brainCloud")
            process.exit(1)
        }
        else
        {
            let roomServer = RoomServerManager.createRoomServer(result.data);
            if (!roomServer)
            {
                console.log("Failed to retreive Lobby Data from brainCloud")
                process.exit(1)
            }
            start()
        }
    });
}

function start()
{   
    // Create our TCP server
    var server = net.createServer();
    server.listen(TCP_PORT);
    console.log("TCP server listning on port " + TCP_PORT);
    
    // Receive connections
    server.on('connection', function(socket)
    {
        if (!socket)
        {
            console.log("ERROR " + "connection with undefined socket!");
            return;
        }
        try
        {
            console.log("Received connection - " + socket.remoteAddress + ":" + socket.remotePort);
            ConnectionManager.createConnection(socket);
        }
        catch (e)
        {
            console.log("ERROR " + "Exception: " + e);
        }
    });

    // Create websocket server
    const wsServer = new WebSocket.Server({port: WS_PORT});
    console.log("WS server listning on port " + WS_PORT);
    
    // Receive connections
    wsServer.on('connection', function connection(ws)
    {
        if (!ws)
        {
            console.log("ERROR " + "connection with undefined websocket!");
            return;
        }
        try
        {
            let con = ConnectionManager.createWSConnection(ws);
            console.log("Received connection - " + con.id);
        }
        catch (e)
        {
            console.log("ERROR " + "Exception: " + e);
        }
    });

    // Notify braincloud that our server is up and waiting for connections
    brainclouds2s.request(S2S.context, {
        service: "lobby",
        operation: "SYS_ROOM_READY",
        data: {
            lobbyId: LOBBY_ID
        }
    });
}
