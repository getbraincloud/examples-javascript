let brainclouds2s = require('brainclouds2s')
let express = require('express')
let globals = require('./globals')
let ids = require('./ids')
let log = require('./log').log
let RoomServerManager = require('./RoomServerManager.js')

// Helper function to read post data from HTTP request
function readPOSTData(request, callback)
{
    let body = ''

    request.on('data', (data) =>
    {
        body += data

        // Too much POST data, kill the connection!
        // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
        if (body.length > 1e6)
        {
            request.connection.destroy()
        }
    })

    request.on('end', () =>
    {
        log("  headers: " + JSON.stringify(request.headers))
        log("  body: " + body)

        callback(body)
    })
}

// Send back a cancel room request to brainCloud
function cancelRoom(roomId, msg)
{
    brainclouds2s.request(globals.s2sContext, {
        service: "lobby",
        operation: "SYS_ROOM_CANCELLED",
        data: {
            lobbyId: roomId,
            msg: msg,
            details: {}
        }
    })
}

function respond(res, code, msg)
{
    res.writeHead(code, {'Content-Type': 'text/plain'})
    res.write(msg)
    res.end()
}

// We received a bad end point
function onBadEndPoint(request, res)
{
    log("bad endpoint")
    respond(res, 200, "bad endpoint")
}

function onRequestRoomServer(request, res)
{
    log("Incoming /bcrsm/requestRoomServer:")
    readPOSTData(request, data =>
    {
        let room = JSON.parse(data)
    
        let roomServer = RoomServerManager.createRoomServer(room)
        if (!roomServer)
        {
            respond(res, 400, "bad request, failed to create room server")
            return;
        }

        if (RoomServerManager.launchRoomServer(roomServer))
        {
            respond(res, 200, JSON.stringify({
                lobbyId: room.id,
                connectInfo: {
                    roomId: room.id,
                    url: globals.publicIP,
                    wsPort: roomServer.port
                }
            }))
        }
        else
        {
            respond(res, 500, "Failed to launch room server")
        }
    })
}

// Starts the HTTP server
exports.start = function()
{
    // Create the HTTP listener
    var app = express()

    // Setup endpoints
    app.get('/', onBadEndPoint)
    app.post('/', onBadEndPoint)
    app.post('/bcrsm/requestRoomServer', onRequestRoomServer)

    // Start listening
    let port = ids.ports.http
    app.listen(port)
    log(`HTTP server listning on port ${port}`)
}
