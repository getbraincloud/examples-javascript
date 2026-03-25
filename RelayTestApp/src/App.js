import React, { Component } from 'react'
import './App.css'
import ids from './ids' // CREATE ids.js AND EXPORT appId, appSecret (and optionally url)

// Screens
import LoginScreen from './LoginScreen'
import LoadingScreen from './LoadingScreen'
import MainMenuScreen from './MainMenuScreen'
import LobbyScreen from './LobbyScreen'
import GameScreen from './GameScreen'

var Buffer = require('buffer/').Buffer // note: the trailing slash is important!

let brainCloud = require('braincloud')
let colors = require('./Colors').colors

const APP_VERSION = '1.0'
const MATCH_DURATION_SEC = 90
const NUM_ARROW_IMAGES = 8

let presentWhileStarted = false
let server = null
let showJoinButton = false
let autoEndTimer = null
let loadingTimerStart = null // When the user first clicked Play (drives the elapsed timer)

export function getShowJoinButton () {
  return showJoinButton
}

class App extends Component {
  constructor () {
    super()

    this.initBC()
    this.shockwaveNextId = 0

    let state = {
      screen: 'reconnecting',
      storedProfileID: null,
      shockwaves: [],
      user: null,
      appLobbies: [],
      lobby: null,
      disbandOnStart: false,
      teams: [],
      server: null,
      splotches: [],
      gameStartTime: null,
      splotchDurationSec: -1,
      round: 0,
      loadingStatus: '',
      relayOptions: {
        reliable: false,
        ordered: true
      }
    }

    this.state = state

    if (this.bc.canReconnect()) {
      console.log('Attempting reconnect . . .')
      this.bc.reconnect(reconnectResponse => {
        if (reconnectResponse.status === 200) {
          console.log('Reconnect success')
          if (reconnectResponse.data.playerName) {
            this.username = reconnectResponse.data.playerName
            this.onLoggedIn(reconnectResponse)
          } else {
            this.dieWithMessage('No player name')
          }
        } else {
          console.log(
            'Reconnect failed, displaying login screen. Error: ' +
              reconnectResponse
          )
          this.initBC()
          this.setState(this.makeDefaultState())
        }
      })
    } else {
      console.log('No saved profile ID. Welcome new user')
      this.state = this.makeDefaultState()
    }
  }

  componentDidMount () {
    window.addEventListener('beforeunload', ev => {
      this.bc.logoutOnApplicationClose(false)
      return
    })
  }

  // Initialize brainCloud library
  initBC () {
    this.bc = new brainCloud.BrainCloudWrapper('relayservertest')
    this.bc.initialize(ids.appId, ids.appSecret, '5.9.0')
    if (ids.url) this.bc.brainCloudClient.setServerUrl(ids.url)
    this.bc.brainCloudClient.enableLogging(true)
  }

  // Create default blank state for the app
  makeDefaultState () {
    return {
      screen: 'login',
      storedProfileID: null,
      shockwaves: [], // Players' created shockwaves
      user: null,
      appLobbies: [],
      lobby: null,
      disbandOnStart: false,
      teams: [],
      server: null,
      splotches: [],
      gameStartTime: null,
      splotchDurationSec: -1,
      round: 0,
      loadingStatus: '',
      relayOptions: {
        reliable: false,
        ordered: true
      }
    }
  }

  // Derive a display label for the brainCloud server environment
  getServerLabel () {
    if (!ids.url) return 'prod'
    if (ids.url.includes('internalgb')) return 'internal-gb'
    if (ids.url.includes('internal')) return 'internal'
    return ids.url
  }

  // Reset the app to the login page with an error popup
  dieWithMessage (message) {
    if (autoEndTimer) {
      clearTimeout(autoEndTimer)
      autoEndTimer = null
    }
    this.bc.logoutOnApplicationClose(false)
    this.bc.relay.disconnect()
    this.bc.relay.deregisterSystemCallback()
    this.bc.relay.deregisterRelayCallback()
    this.bc.rttService.deregisterAllRTTCallbacks()
    this.bc.brainCloudClient.resetCommunication()
    alert(message)
    this.initBC()
    this.setState(this.makeDefaultState())
  }

  // Clicked "Login"
  onLoginClicked (user, pass) {
    this.setState({ screen: 'loginIn' })
    this.username = user
    this.bc.authenticateUniversal(user, pass, true, this.onLoggedIn.bind(this))
  }

  // brainCloud authentication response
  onLoggedIn (result) {
    if (result.status === 200) {
      // Update username stored in brainCloud if first time loging in with that user.
      if (this.username !== '' && this.username !== undefined) {
        this.bc.playerState.updateUserName(this.username)
      } else {
        this.username = result.data.playerName
      }

      // Set the state with our user information. Include in there our
      let localStorageColor = localStorage.getItem('color')
      if (localStorageColor == null) localStorageColor = '7'

      // Get app's lobby types and global settings
      this.bc.globalApp.readProperties(readPropertiesResponse => {
        if (readPropertiesResponse.status === 200) {
          var parsedValue = JSON.parse(
            readPropertiesResponse.data.AllLobbyTypes.value
          )
          var values = Object.values(parsedValue)
          var allLobbyTypes = []
          for (let i = 0; i < values.length; i++) {
            allLobbyTypes[i] = values[i]
          }

          // Read splotch duration (-1 = forever)
          let splotchDurationSec = -1
          if (readPropertiesResponse.data.SplotchDuration) {
            splotchDurationSec = parseInt(
              readPropertiesResponse.data.SplotchDuration.value
            )
          }

          this.setState({
            screen: 'mainMenu',
            user: {
              id: result.data.profileId,
              cxId: null,
              name: this.username,
              colorIndex: parseInt(localStorageColor) % colors.length,
              isReady: false,
              presentSinceStart: false
            },
            appLobbies: allLobbyTypes,
            splotchDurationSec: splotchDurationSec
          })
        } else {
          console.log('globalApp.readProperties failed')
        }
      })
    } else {
      this.dieWithMessage('Failed to login')
    }
  }

  onLogout () {
    this.bc.logout(true, () => {
      // Close Relay/RTT/BC connections
      this.bc.relay.disconnect()
      this.bc.relay.deregisterSystemCallback()
      this.bc.relay.deregisterRelayCallback()
      this.bc.rttService.deregisterAllRTTCallbacks()
      this.bc.brainCloudClient.resetCommunication()
      // Initialize BC libs and start over
      this.initBC()
      // Go back to default login state
      this.setState(this.makeDefaultState())
    })
  }

  // Clicked play from the main menu
  onPlayClicked (lobbyType) {
    loadingTimerStart = Date.now()
    this.setState({
      screen: 'joiningLobby',
      lobbyType: lobbyType,
      loadingStatus: 'Searching...'
    })

    // Enable RTT service
    this.bc.rttService.enableRTT(
      () => {
        let state = this.state
        let extraJson = {
          colorIndex: this.state.user.colorIndex,
          presentSinceStart: this.state.user.presentSinceStart
        }
        state.user.cxId = this.bc.rttService.getRTTConnectionId()
        this.setState(state)

        this.bc.rttService.registerRTTLobbyCallback(
          this.onLobbyEvent.bind(this)
        )

        // If using gamelift, we will do region pings
        if (lobbyType.toLowerCase().includes('gamelift')) {
          console.log('GameLift Lobby')
          this.bc.lobby.getRegionsForLobbies([lobbyType], result => {
            if (result.status !== 200) {
              this.dieWithMessage('Failed to get regions for lobbies')
              return
            }
            this.bc.lobby.pingRegions(result => {
              if (result.status !== 200) {
                this.dieWithMessage('Failed to ping regions')
                return
              }
              this.bc.lobby.findOrCreateLobbyWithPingData(
                lobbyType,
                0,
                1,
                {
                  strategy: 'ranged-absolute',
                  alignment: 'center',
                  ranges: [1000]
                },
                {},
                null,
                {},
                false,
                extraJson,
                '',
                result => {
                  if (result.status !== 200) {
                    this.dieWithMessage('Failed to find lobby')
                  }
                }
              )
            })
          })
        } else {
          this.bc.lobby.findOrCreateLobby(
            lobbyType,
            0,
            1,
            {
              strategy: 'ranged-absolute',
              alignment: 'center',
              ranges: [1000]
            },
            {},
            null,
            {},
            false,
            extraJson,
            '',
            result => {
              if (result.status !== 200) {
                this.dieWithMessage('Failed to find lobby')
              }
            }
          )
        }
      },
      () => {
        if (this.state.screen === 'joiningLobby') {
          this.dieWithMessage('Failed to enable RTT')
        } else {
          this.dieWithMessage('RTT Disconnected')
        }
      }
    )
  }

  // Update events from the lobby service
  onLobbyEvent (result) {
    if (result.data.lobby) {
      this.setState({
        lobby: { ...result.data.lobby, lobbyId: result.data.lobbyId }
      })

      this.bc.lobby.getLobbyData(this.state.lobby.lobbyId, response => {
        var status = response.status
        if (status === 200) {
          let state = this.state
          state.disbandOnStart = response.data.lobbyTypeDef.rules.disbandOnStart

          var lobbyTeams = Object.keys(response.data.lobbyTypeDef.teams)
          var teams = []
          lobbyTeams.forEach(lobbyTeam => {
            var team = { name: lobbyTeam, members: [] }
            state.lobby.members.forEach(member => {
              if (member.team === lobbyTeam) {
                team.members.push(member)
                if (member.cxId === this.state.user.cxId) {
                  if (!state.user.team) {
                    this.onTeamChanged(member.team)
                  }
                }
              }
            })
            teams.push(team)
          })
          state.teams = teams
          this.setState(state)
        }
      })

      if (this.state.screen === 'joiningLobby') {
        this.setState({ screen: 'lobby' })
      }
    }

    if (result.operation === 'DISBANDED') {
      if (result.data.reason.code !== this.bc.reasonCodes.RTT_ROOM_READY) {
        this.onGameScreenClose()
      }
    } else if (result.operation === 'MATCHMAKING_IN_PROGRESS') {
      this.setState({ loadingStatus: 'Searching for lobby...' })
    } else if (result.operation === 'MEMBER_JOIN') {
      let joinedName =
        result.data && result.data.member ? result.data.member.name : 'Player'
      this.setState({ loadingStatus: `Joined: ${joinedName}` })
    } else if (result.operation === 'MEMBER_LEFT') {
      this.setState({ loadingStatus: 'A player left the lobby.' })
    } else if (result.operation === 'STARTING') {
      presentWhileStarted = true
      this.updatePresentSinceStart()
      this.setState({
        screen: 'connecting',
        loadingStatus: 'Provisioning server...'
      })
    } else if (result.operation === 'ROOM_ASSIGNED') {
      this.setState({ loadingStatus: 'Server assigned...' })
    } else if (result.operation === 'ROOM_PROGRESS') {
      let step = result.data && result.data.step ? result.data.step : ''
      let msg = result.data && result.data.msg ? result.data.msg : ''
      this.setState({
        loadingStatus: step ? `${step}: ${msg}` : msg || 'Starting server...'
      })
    } else if (result.operation === 'ROOM_READY') {
      server = result.data
      this.setState({ loadingStatus: 'Connecting...' })
      if (presentWhileStarted) {
        this.connectRelay()
      } else {
        showJoinButton = true
        this.setState({ screen: 'lobby' })
      }
    }
  }

  // Gameplay option toggles
  onToggleReliable () {
    let state = this.state
    state.relayOptions.reliable = !state.relayOptions.reliable
    this.setState(state)
  }

  onToggleOrdered () {
    let state = this.state
    state.relayOptions.ordered = !state.relayOptions.ordered
    this.setState(state)
  }

  onTogglePlayerMask (cxId) {
    let state = this.state
    let member = state.lobby.members.find(member => member.cxId === cxId)
    if (member) member.allowSendTo = !member.allowSendTo
    this.setState(state)
  }

  // Called to terminate the current session and go back to the main menu
  onGameScreenClose () {
    if (autoEndTimer) {
      clearTimeout(autoEndTimer)
      autoEndTimer = null
    }
    this.bc.relay.deregisterRelayCallback()
    this.bc.relay.deregisterSystemCallback()
    this.bc.relay.disconnect()
    this.bc.rttService.deregisterAllRTTCallbacks()
    this.bc.rttService.disableRTT()

    let state = this.state
    state.screen = 'mainMenu'
    state.lobby = null
    state.user.isReady = false
    state.user.presentSinceStart = false
    state.user.team = null
    state.splotches = []
    state.shockwaves = []
    state.gameStartTime = null
    state.round = 0
    state.loadingStatus = ''
    showJoinButton = false
    loadingTimerStart = null
    this.setState(state)
  }

  // The player has picked a different color in the Lobby menu
  onColorChanged (colorIndex) {
    let state = this.state
    state.user.colorIndex = colorIndex
    let extraJson = {
      colorIndex: colorIndex,
      presentSinceStart: state.user.presentSinceStart
    }
    this.setState(state)
    this.bc.lobby.updateReady(
      this.state.lobby.lobbyId,
      this.state.user.isReady,
      extraJson
    )
  }

  onTeamChanged (team) {
    let state = this.state
    state.user.team = team

    if (team === 'alpha') {
      state.user.colorIndex = 6 // vivid sky blue
      state.user.opposingTeam = 'beta'
    } else if (team === 'beta') {
      state.user.colorIndex = 0 // vivid red
      state.user.opposingTeam = 'alpha'
    }

    this.setState(state)

    this.bc.lobby.switchTeam(state.lobby.lobbyId, team, result => {
      if (result.status === 200) {
        this.onColorChanged(state.user.colorIndex)
      }
    })
  }

  // Owner of the lobby clicked the "Start" button
  onStart () {
    let state = this.state
    let extraJson = {
      colorIndex: this.state.user.colorIndex,
      presentSinceStart: this.state.user.presentSinceStart
    }
    state.user.isReady = true
    this.setState(state)
    this.bc.lobby.updateReady(
      this.state.lobby.lobbyId,
      this.state.user.isReady,
      extraJson
    )
  }

  // Player clicked the "Join Match" button to join an in-progress game
  onJoin () {
    let state = this.state
    let extraJson = {
      colorIndex: this.state.user.colorIndex,
      presentSinceStart: this.state.user.presentSinceStart
    }
    state.user.isReady = true
    this.setState(state)
    this.bc.lobby.updateReady(
      this.state.lobby.lobbyId,
      this.state.user.isReady,
      extraJson
    )
    this.connectRelay()
  }

  // Return to the lobby with the same players (host-only)
  onEndMatch () {
    if (autoEndTimer) {
      clearTimeout(autoEndTimer)
      autoEndTimer = null
    }
    let extraJson = {
      cxId: this.bc.brainCloudClient.getRTTConnectionId(),
      lobbyId: this.state.lobby.lobbyId,
      op: 'END_MATCH'
    }
    this.bc.relay.endMatch(extraJson)
  }

  // Host clears all splotches from the canvas
  onClearSplotches () {
    this.setState({ splotches: [] })
    this.bc.relay.sendToAll(
      Buffer.from(JSON.stringify({ op: 'clear_splotches' }), 'ascii'),
      true,
      false,
      this.bc.relay.CHANNEL_HIGH_PRIORITY_2
    )
  }

  // A relay message coming from another player
  onRelayMessage (netId, data) {
    let state = this.state
    let memberCxId = this.bc.relay.getCxIdForNetId(netId)
    let member = state.lobby.members.find(member => member.cxId === memberCxId)
    let str = data.toString('ascii')
    let json = JSON.parse(str)

    switch (json.op) {
      // Player moved the mouse
      case 'move':
        if (member) member.pos = { x: json.data.x, y: json.data.y }
        break

      // Player clicked — leave a persistent splotch
      case 'shockwave':
        let colorIndex =
          member && member.extra ? member.extra.colorIndex % colors.length : 0
        state.splotches.push({
          x: json.data.x,
          y: json.data.y,
          colorIndex: colorIndex,
          startTimeMs: Date.now()
        })

        this.createShockwave(json.data, colors[member.extra.colorIndex])
        break

      // Host is syncing game start time (also sent to JIP players)
      case 'game_start':
        state.gameStartTime = json.data.startTime
        state.round = json.data.round
        break

      // Host is syncing splotch canvas to a newly joined player
      case 'splotch_sync':
        if (json.data.first) state.splotches = []
        json.data.splotches.forEach(s => {
          state.splotches.push({
            x: s.x,
            y: s.y,
            colorIndex: s.c,
            startTimeMs: s.t
          })
        })
        break

      // Host cleared all splotches
      case 'clear_splotches':
        state.splotches = []
        break

      default:
        break
    }

    this.setState(state)
  }

  // Received a Relay Server system message
  onSystemMessage (json) {
    if (json.op === 'DISCONNECT') {
      let state = this.state
      let member = state.lobby.members.find(member => member.cxId === json.cxId)
      if (member) member.pos = null
      this.setState(state)
    } else if (json.op === 'CONNECT') {
      let state = this.state
      state.lobby.members.forEach(
        member => (member.allowSendTo = member.cxId !== state.user.cxId)
      )
      this.setState(state)

      // If we are the host and in-game, send current state to the newly joined player
      if (
        state.lobby.ownerCxId === state.user.cxId &&
        state.screen === 'game'
      ) {
        let newPlayerNetId = this.bc.relay.getNetIdForCxId(json.cxId)
        let mask = Math.pow(2, newPlayerNetId)
        this.sendGameStartToMask(mask)
        this.sendSplotchSyncToMask(mask)
      }
    } else if (json.op === 'END_MATCH') {
      if (autoEndTimer) {
        clearTimeout(autoEndTimer)
        autoEndTimer = null
      }
      let state = this.state
      state.screen = 'lobby'
      state.user.isReady = false
      state.user.presentSinceStart = false
      state.splotches = []
      state.shockwaves = []
      state.gameStartTime = null
      showJoinButton = false
      this.setState(state)
    }
  }

  // Called by the game screen when our player moves the mouse
  onPlayerMove (pos) {
    let state = this.state
    let member = state.lobby.members.find(
      member => member.cxId === state.user.cxId
    )
    member.pos = { x: pos.x, y: pos.y }
    this.setState(state)

    this.bc.relay.sendToAll(
      Buffer.from(JSON.stringify({ op: 'move', data: pos }), 'ascii'),
      false,
      true,
      this.bc.relay.CHANNEL_HIGH_PRIORITY_1
    )
  }

  // FFA: player clicked to create a splotch visible to all (filtered by player mask)
  onPlayerSplotch (pos) {
    let playerMask = this.state.lobby.members.reduce((playerMask, member) => {
      if (!member.allowSendTo) return playerMask
      let netId = this.bc.relay.getNetIdForCxId(member.cxId)
      // Note: we avoid bitwise ops here to support up to 40 players (JS bitwise is 32-bit)
      return playerMask + Math.pow(2, netId)
    }, 0)

    this.bc.relay.sendToPlayers(
      Buffer.from(
        JSON.stringify({
          op: 'shockwave',
          data: { x: pos.x, y: pos.y, teamCode: 0 }
        }),
        'ascii'
      ),
      playerMask,
      true,
      false,
      this.bc.relay.CHANNEL_HIGH_PRIORITY_2
    )

    this.createSplotch(pos, this.state.user.colorIndex)
    this.createShockwave(pos, colors[this.state.user.colorIndex])
  }

  // Dispatch a click based on mouse button and team mode
  onPlayerClicked (pos, mouseButton) {
    // FFA mode
    if (this.state.teams.length === 1) {
      this.onPlayerSplotch(pos)
      return
    }

    // Team mode
    let toNetId = []
    let reliable = true
    let ordered = false
    let channel = this.bc.relay.CHANNEL_HIGH_PRIORITY_2
    let teamCode = this.state.user.team === 'alpha' ? 1 : 2
    let opponentCode = this.state.user.opposingTeam === 'alpha' ? 1 : 2

    // Left click — splotch to everyone
    if (mouseButton === 0) {
      this.bc.relay.send(
        Buffer.from(
          JSON.stringify({
            op: 'shockwave',
            data: { x: pos.x, y: pos.y, teamCode: 0 }
          }),
          'ascii'
        ),
        this.bc.relay.TO_ALL_PLAYERS,
        reliable,
        ordered,
        channel
      )
      this.createSplotch(pos, this.state.user.colorIndex)
      this.createShockwave(pos, colors[this.state.user.colorIndex])
    }
    // Middle click — splotch to opponents
    else if (mouseButton === 1) {
      this.state.lobby.members.forEach(member => {
        if (member.team === this.state.user.opposingTeam) {
          toNetId.push(this.bc.relay.getNetIdForCxId(member.cxId))
        }
      })
      toNetId.forEach(netId => {
        this.bc.relay.send(
          Buffer.from(
            JSON.stringify({
              op: 'shockwave',
              data: { x: pos.x, y: pos.y, teamCode: opponentCode }
            }),
            'ascii'
          ),
          netId,
          reliable,
          ordered,
          channel
        )
      })
      this.createSplotch(pos, this.state.user.colorIndex)
      this.createShockwave(pos, colors[this.state.user.colorIndex])
    }
    // Right click — splotch to teammates
    else if (mouseButton === 2) {
      this.state.lobby.members.forEach(member => {
        if (member.team === this.state.user.team) {
          toNetId.push(this.bc.relay.getNetIdForCxId(member.cxId))
        }
      })
      toNetId.forEach(netId => {
        this.bc.relay.send(
          Buffer.from(
            JSON.stringify({
              op: 'shockwave',
              data: { x: pos.x, y: pos.y, teamCode: teamCode }
            }),
            'ascii'
          ),
          netId,
          reliable,
          ordered,
          channel
        )
      })
      this.createSplotch(pos, this.state.user.colorIndex)
      this.createShockwave(pos, colors[this.state.user.colorIndex])
    }
  }

  connectRelay () {
    let wsPort = 0
    if (this.state.lobbyType.toLowerCase().includes('gamelift')) {
      wsPort = server.connectData.ports.gamelift
    } else if (this.state.lobbyType.toLowerCase().includes('i3d')) {
      wsPort = server.connectData.ports.i3d
      console.log('i3d detected')
    } else {
      wsPort = server.connectData.ports.ws
    }

    presentWhileStarted = false

    this.bc.relay.registerRelayCallback(this.onRelayMessage.bind(this))
    this.bc.relay.registerSystemCallback(this.onSystemMessage.bind(this))
    this.bc.relay.connect(
      {
        ssl: false,
        host: server.connectData.address,
        port: wsPort,
        passcode: server.passcode,
        lobbyId: server.lobbyId
      },
      result => {
        let state = this.state
        state.screen = 'game'

        // Host sets the authoritative game start time and broadcasts it to all players
        if (state.lobby.ownerCxId === state.user.cxId) {
          state.gameStartTime = Date.now()
          state.round = (state.round || 0) + 1
          this.setState(state)
          this.sendGameStartToMask(this.bc.relay.TO_ALL_PLAYERS)
          this.scheduleAutoEnd()
        } else {
          this.setState(state)
        }
      },
      error => this.dieWithMessage('Failed to connect to server, msg: ' + error)
    )
  }

  // Send game start time and round to a player mask (used for initial broadcast and JIP sync)
  sendGameStartToMask (mask) {
    let msg = {
      op: 'game_start',
      data: {
        startTime: this.state.gameStartTime,
        round: this.state.round
      }
    }
    this.bc.relay.sendToPlayers(
      Buffer.from(JSON.stringify(msg), 'ascii'),
      mask,
      true,
      false,
      this.bc.relay.CHANNEL_HIGH_PRIORITY_2
    )
  }

  // Send the full splotch canvas to a player mask in chunked packets
  sendSplotchSyncToMask (mask) {
    const MAX_BYTES = 900
    let splotches = this.state.splotches
    let isFirst = true
    let batch = []
    let currentSize = 80 // rough envelope overhead

    const sendBatch = (first, splotchBatch) => {
      let msg = {
        op: 'splotch_sync',
        data: { first: first, splotches: splotchBatch }
      }
      this.bc.relay.sendToPlayers(
        Buffer.from(JSON.stringify(msg), 'ascii'),
        mask,
        true,
        false,
        this.bc.relay.CHANNEL_HIGH_PRIORITY_2
      )
    }

    for (let i = 0; i < splotches.length; i++) {
      let s = splotches[i]
      let entry = { x: s.x, y: s.y, c: s.colorIndex, t: s.startTimeMs }
      let entrySize = JSON.stringify(entry).length + 1 // +1 for comma separator

      if (currentSize + entrySize > MAX_BYTES && batch.length > 0) {
        sendBatch(isFirst, batch)
        isFirst = false
        batch = []
        currentSize = 80
      }

      batch.push(entry)
      currentSize += entrySize
    }

    // Send remaining batch (also handles empty canvas, signalling JIP player to clear)
    sendBatch(isFirst, batch)
  }

  // Schedule auto-end of match at MATCH_DURATION_SEC seconds (host only)
  scheduleAutoEnd () {
    if (autoEndTimer) clearTimeout(autoEndTimer)
    autoEndTimer = setTimeout(() => {
      autoEndTimer = null
      this.onEndMatch()
    }, MATCH_DURATION_SEC * 1000)
  }

  // Add a persistent colour splotch at pos (normalized 0-1 coords)
  createSplotch (pos, colorIndex) {
    let splotch = {
      x: pos.x,
      y: pos.y,
      colorIndex: colorIndex % colors.length,
      startTimeMs: Date.now()
    }
    let state = this.state
    state.splotches.push(splotch)
    this.setState(state)
  }

  // Add a transient shockwave ring at pos (normalized 0-1 coords), auto-removed after 1s
  createShockwave (pos, color) {
    let shockwave = {
      pos: { x: pos.x * 800, y: pos.y * 600 },
      color: color,
      id: this.shockwaveNextId++
    }
    let state = this.state
    state.shockwaves.push(shockwave)
    this.setState(state)

    setTimeout(() => {
      let sw = this.state.shockwaves
      sw.splice(sw.indexOf(shockwave), 1)
      this.setState({ shockwaves: sw })
    }, 1000)
  }

  updatePresentSinceStart () {
    let state = this.state
    state.user.presentSinceStart = true
    state.user.isReady = true

    let extraJson = {
      colorIndex: this.state.user.colorIndex,
      presentSinceStart: this.state.user.presentSinceStart
    }
    this.bc.lobby.updateReady(
      this.state.lobby.lobbyId,
      this.state.user.isReady,
      extraJson
    )
  }

  // Version overlay — always visible in the bottom-left corner on every screen
  renderVersionOverlay () {
    return (
      <div className='VersionOverlay'>
        <div>App: v{APP_VERSION}</div>
        <div>App ID: {ids.appId}</div>
        <div>Server: {this.getServerLabel()}</div>
      </div>
    )
  }

  // Inner screen content (no outer wrapper — render() provides that)
  renderScreen () {
    switch (this.state.screen) {
      case 'reconnecting':
        return <LoadingScreen text='Reconnecting . . .' />

      case 'login':
        return (
          <>
            <h1>Cursor Party</h1>
            <LoginScreen onLogin={this.onLoginClicked.bind(this)} />
          </>
        )

      case 'loginIn':
        return <LoadingScreen text='Logging in...' />

      case 'mainMenu':
        return (
          <>
            <h1>Cursor Party</h1>
            <MainMenuScreen
              user={this.state.user}
              appLobbies={this.state.appLobbies}
              onLogout={this.onLogout.bind(this)}
              onPlay={this.onPlayClicked.bind(this)}
            />
          </>
        )

      case 'joiningLobby':
        return (
          <LoadingScreen
            text='Finding lobby...'
            statusText={this.state.loadingStatus}
            lobbyId={this.state.lobby ? this.state.lobby.lobbyId : null}
            startTime={loadingTimerStart}
            onBack={this.onGameScreenClose.bind(this)}
          />
        )

      case 'lobby':
        return (
          <>
            <h1>Cursor Party</h1>
            <LobbyScreen
              user={this.state.user}
              lobby={this.state.lobby}
              teams={this.state.teams}
              onBack={this.onGameScreenClose.bind(this)}
              onColorChanged={this.onColorChanged.bind(this)}
              onTeamChanged={this.onTeamChanged.bind(this)}
              onStart={this.onStart.bind(this)}
              onJoin={this.onJoin.bind(this)}
            />
          </>
        )

      case 'connecting':
        return (
          <LoadingScreen
            text='Joining match...'
            statusText={this.state.loadingStatus}
            lobbyId={this.state.lobby ? this.state.lobby.lobbyId : null}
            startTime={loadingTimerStart}
          />
        )

      case 'game':
        return (
          <>
            <h1>Cursor Party</h1>
            <small>
              Move mouse around and click to leave colour splotches.
            </small>
            <GameScreen
              user={this.state.user}
              lobby={this.state.lobby}
              lobbyType={this.state.lobbyType}
              disbandOnStart={this.state.disbandOnStart}
              teams={this.state.teams}
              shockwaves={this.state.shockwaves}
              splotches={this.state.splotches}
              splotchDurationSec={this.state.splotchDurationSec}
              gameStartTime={this.state.gameStartTime}
              relayOptions={this.state.relayOptions}
              onBack={this.onGameScreenClose.bind(this)}
              onEndMatch={this.onEndMatch.bind(this)}
              onClearSplotches={this.onClearSplotches.bind(this)}
              onPlayerMove={this.onPlayerMove.bind(this)}
              onPlayerClicked={this.onPlayerClicked.bind(this)}
              onToggleReliable={this.onToggleReliable.bind(this)}
              onToggleOrdered={this.onToggleOrdered.bind(this)}
              onTogglePlayerMask={this.onTogglePlayerMask.bind(this)}
              numArrowImages={NUM_ARROW_IMAGES}
            />
          </>
        )

      default:
        return <p>Invalid state</p>
    }
  }

  // Render ReactJS components
  render () {
    return (
      <div className='App'>
        {this.renderVersionOverlay()}
        <header className='App-header'>{this.renderScreen()}</header>
      </div>
    )
  }
}

export default App
