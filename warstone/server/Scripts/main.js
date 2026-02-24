// Imports
var net = require('net')
var ConnectionManager = require('./ConnectionManager.js')
const publicIp = require('public-ip')
var brainclouds2s = require('./brainclouds2s')
const WebSocket = require('ws')
const S2S = require('./S2S.js')
let RoomServerManager = require('./RoomServerManager.js')
var prl = require('./brainclouds2s-prl')

// Constants
var TCP_PORT = 9314
var WS_PORT = 9313

// Get some envs
const SERVER_PORT = process.env['SERVER_PORT']
const SERVER_HOST = process.env['SERVER_HOST']
const APP_ID = process.env['APP_ID']
const SERVER_SECRET = process.env['SERVER_SECRET']
const SERVER_NAME = process.env['SERVER_NAME']
const LOBBY_ID = process.env['LOBBY_ID']

function makeS2SURL (host, port) {
  if (!host) {
    if (!port) {
      return 'api.internal.braincloudservers.com'
    } else {
      return 'api.internal.braincloudservers.com' //:" + port
    }
  } else {
    if (!port) {
      return host
    } else {
      return host // + ":" + port
    }
  }
}

// Log all PRL-relevant environment variables at startup for debugging
console.log('[Server] === Startup Environment ===')
console.log('[Server] APP_ID           = ' + APP_ID)
console.log('[Server] SERVER_NAME      = ' + SERVER_NAME)
console.log('[Server] SERVER_HOST      = ' + SERVER_HOST)
console.log('[Server] SERVER_PORT      = ' + SERVER_PORT)
console.log('[Server] LOBBY_ID         = ' + LOBBY_ID)
console.log('[Server] SERVER_ID        = ' + process.env['SERVER_ID'])
console.log('[Server] PRE_READY_LAUNCH = ' + process.env['PRE_READY_LAUNCH'])
console.log('[Server] PRL_TIMEOUT_SECS = ' + process.env['PRL_TIMEOUT_SECS'])
console.log(
  '[Server] PRE_READY_LAUNCH_TIMEOUT_SECS = ' +
    process.env['PRE_READY_LAUNCH_TIMEOUT_SECS']
)
console.log('[Server] SERVER_CONTEXT   = ' + process.env['SERVER_CONTEXT'])
console.log('[Server] ===================================')

// Init braincloud S2S
S2S.context = brainclouds2s.init(
  APP_ID,
  SERVER_NAME,
  SERVER_SECRET,
  makeS2SURL(SERVER_HOST, SERVER_PORT)
)
brainclouds2s.setLogEnabled(S2S.context, true)

// Authenticate first, then get public IP and proceed
brainclouds2s.authenticate(S2S.context, (context, result) => {
  if (!result || result.status !== 200) {
    console.log('Failed to authenticate with brainCloud S2S')
    process.exit(1)
  }

  // Get our public IP
  let myPublicIp = ''
  publicIp.v4().then(ip => {
    myPublicIp = ip
    console.log('Public IP: ' + myPublicIp)

    var isPRL = prl.isPreReadyLaunch()
    console.log('[Server] PRL check: isPreReadyLaunch() = ' + isPRL)

    if (isPRL) {
      ConnectionManager.cancelDeathTimer()
      prl.start(S2S.context, LOBBY_ID, proceed => {
        console.log('[Server] PRL flow complete. proceed=' + proceed)
        if (!proceed) {
          console.log('[PRL] Server not proceeding with launch.')
          process.exit(0)
        }
        retreiveLobby()
      })
    } else {
      retreiveLobby()
    }
  })
})

function retreiveLobby () {
  // Ask braincloud for our lobby json
  brainclouds2s.request(
    S2S.context,
    {
      service: 'lobby',
      operation: 'GET_LOBBY_DATA',
      data: {
        lobbyId: LOBBY_ID
      }
    },
    (context, result) => {
      if (result == null) {
        console.log('Failed to retreive Lobby Data from brainCloud')
        prl.sendSessionEnded(S2S.context, () => process.exit(1))
      } else {
        let roomServer = RoomServerManager.createRoomServer(result.data)
        if (!roomServer) {
          console.log('Failed to retreive Lobby Data from brainCloud')
          prl.sendSessionEnded(S2S.context, () => process.exit(1))
          return
        }
        start()
      }
    }
  )
}

function start () {
  // Restart the no-connection death timer now that we're open for connections
  ConnectionManager.resetDeathTimer()

  // Create our TCP server
  var server = net.createServer()
  server.listen(TCP_PORT)
  console.log('TCP server listning on port ' + TCP_PORT)

  // Receive connections
  server.on('connection', function (socket) {
    if (!socket) {
      console.log('ERROR ' + 'connection with undefined socket!')
      return
    }
    try {
      console.log(
        'Received connection - ' +
          socket.remoteAddress +
          ':' +
          socket.remotePort
      )
      ConnectionManager.createConnection(socket)
    } catch (e) {
      console.log('ERROR ' + 'Exception: ' + e)
    }
  })

  // Create websocket server
  const wsServer = new WebSocket.Server({ port: WS_PORT })
  console.log('WS server listning on port ' + WS_PORT)

  // Receive connections
  wsServer.on('connection', function connection (ws) {
    if (!ws) {
      console.log('ERROR ' + 'connection with undefined websocket!')
      return
    }
    try {
      let con = ConnectionManager.createWSConnection(ws)
      console.log('Received connection - ' + con.id)
    } catch (e) {
      console.log('ERROR ' + 'Exception: ' + e)
    }
  })

  // Notify braincloud that our server is up and waiting for connections
  brainclouds2s.request(S2S.context, {
    service: 'lobby',
    operation: 'SYS_ROOM_READY',
    data: {
      lobbyId: LOBBY_ID
    }
  })
}
