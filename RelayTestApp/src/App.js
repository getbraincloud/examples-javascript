import React, { Component } from 'react'
import './App.css'
import ids from './ids' // CREATE ids.js AND EXPORT appId, appSecret (and optionally url)

// Screens
import LoginScreen from './LoginScreen'
import LoadingScreen from './LoadingScreen'
import MainMenuScreen from './MainMenuScreen'
import LobbyScreen from './LobbyScreen'
import GameScreen from './GameScreen'
import MatchSummaryScreen from './MatchSummaryScreen'
import { computeCoverage } from './coverage'
import { LEADERBOARD_IDS } from './LeaderboardPanel'

var Buffer = require('buffer/').Buffer // note: the trailing slash is important!

let brainCloud = require('@braincloud/client')
let colors = require('./Colors').colors

const MATCH_DURATION_SEC = 90
const NUM_ARROW_IMAGES = 8
const RESULT_GRACE_MS = 1000 // delay between match_result broadcast and onEndMatch()
const COVERAGE_RECOMPUTE_MS = 250 // live-scoreboard recompute throttle
const MATCH_SUMMARY_REMATCH_MS = 45000 // how long the Match Summary screen waits before the host auto-starts the next round

let presentWhileStarted = false
let server = null
let showJoinButton = false
let pingInterval = null
let matchTickInterval = null // live coverage recompute + host auto-end sequence (see tickMatch)
let rematchGateInterval = null // host-only: ticks tickRematchGate while awaitingRematch
let loadingTimerStart = null // When the user first clicked Play (drives the elapsed timer)

// Match-end bookkeeping — internal, doesn't drive rendering (mirrors cpp's app.cpp file-
// static equivalents). Reset every fresh round in connectRelay()'s success callback.
let matchPhase = 'running' // 'running' | 'resultsBroadcast' | 'ended'
let resultsSentAtMs = 0
let coverageComputedAtMs = 0
let pendingMatchResult = [] // match_result chunk-reassembly buffer
let pendingLbChunk = [] // lb_result chunk-reassembly buffer: [{cxId, delta}]
let pendingLbResults = {} // cxId -> LeaderboardDelta, for lb_result arriving before match_result
let leaderboardPostedRound = -1 // guards against double-posting the cumulative points board

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
      lobbyTeamNames: [],
      server: null,
      splotches: [],
      gameStartTime: null,
      splotchDurationSec: -1,
      round: 0,
      lobbyResetting: false,
      loadingStatus: '',
      usePingData: false,
      pingData: {},
      relayOptions: {
        reliable: false,
        ordered: true
      },
      relayProtocol: 'ws',
      coverage: [],
      matchResult: { valid: false, round: 0, entries: [] },
      awaitingRematch: false,
      matchSummaryArrivalTime: null,
      isProvisioning: false,
      provisioningStatus: ''
    }

    this.state = state

    console.log('Checking if reconnect is possible . . .')
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
    this.rttEnableWaiters = null // drop any pending ensureRTTEnabled callers from the old bc instance
    this.bc = new brainCloud.BrainCloudWrapper('relayservertest')
    this.bc.initialize(ids.appId, ids.appSecret, '6.0.0')
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
      lobbyTeamNames: [],
      server: null,
      splotches: [],
      gameStartTime: null,
      splotchDurationSec: -1,
      round: 0,
      loadingStatus: '',
      usePingData: false,
      pingData: {},
      relayOptions: {
        reliable: false,
        ordered: true
      },
      coverage: [],
      matchResult: { valid: false, round: 0, entries: [] },
      awaitingRematch: false,
      matchSummaryArrivalTime: null,
      isProvisioning: false,
      provisioningStatus: ''
    }
  }

  // Build the extra JSON for lobby join/updateReady calls.
  // Always includes colorIndex and presentSinceStart; includes per-region pings when available.
  makeExtraJson (colorIndex, presentSinceStart) {
    let extra = {
      colorIndex: colorIndex !== undefined ? colorIndex : this.state.user.colorIndex,
      presentSinceStart: !!presentSinceStart
    }
    let pingData = this.state.pingData || {}
    if (Object.keys(pingData).length > 0) extra.pings = pingData
    return extra
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
    if (pingInterval) { clearInterval(pingInterval); pingInterval = null }
    if (matchTickInterval) { clearInterval(matchTickInterval); matchTickInterval = null }
    if (rematchGateInterval) { clearInterval(rematchGateInterval); rematchGateInterval = null }
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

          if (readPropertiesResponse.data.Colors) {
            try {
              const newColors = JSON.parse(readPropertiesResponse.data.Colors.value)
              if (Array.isArray(newColors) && newColors.length > 0) {
                colors.splice(0, colors.length, ...newColors)
              }
            } catch (e) {}
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

          // Keep RTT connected from the main menu onward so Global Chat works there
          // (brainCloud's chat calls require RTT). onPlayClicked's ensureRTTEnabled
          // call resolves immediately once this has already succeeded.
          this.ensureRTTEnabled(() => {
            let state = this.state
            if (state.user) state.user.cxId = this.bc.rttService.getRTTConnectionId()
            this.setState(state)
          }, () => {})
        } else {
          console.log('globalApp.readProperties failed')
        }
      })
    } else {
      this.dieWithMessage('Failed to login')
    }
  }

  // Enables RTT if not already enabled, then invokes onReady. RTT's own enableRTT()
  // silently no-ops (without invoking either callback) when already enabled OR still
  // connecting, so callers must go through this rather than calling enableRTT
  // directly. Also queues concurrent callers instead of re-calling enableRTT while a
  // connection is already in flight — e.g. the main menu enables RTT for chat right
  // after login, and if Play is clicked before that resolves, a second raw enableRTT
  // call would no-op and silently drop onPlayClicked's callback (which registers the
  // lobby callback and starts matchmaking), leaving the screen stuck on
  // "joiningLobby" forever.
  ensureRTTEnabled (onReady, onFail) {
    if (this.bc.rttService.isRTTEnabled()) {
      // Defer to the next tick rather than calling onReady() inline. enableRTT's own
      // success callback is always async in the "not yet enabled" branch below (a real
      // network round trip) — callers rely on that: e.g. onPlayClicked calls this
      // synchronously right after setState({screen: 'joiningLobby', ...}), and onReady's
      // body does this file's usual `let state = this.state; state.x = y;
      // this.setState(state)` pattern. React batches setState calls made within one
      // event handler, so a SYNCHRONOUS onReady here would read the pre-flush
      // this.state (still screen: 'mainMenu'), and passing that stale snapshot back to
      // setState — merged AFTER the pending 'joiningLobby' update — would silently
      // revert screen back to 'mainMenu'. Deferring keeps the "already enabled" fast
      // path's timing consistent with the always-async slow path below.
      setTimeout(onReady, 0)
      return
    }
    if (this.rttEnableWaiters) {
      this.rttEnableWaiters.push({ onReady, onFail })
      return
    }
    this.rttEnableWaiters = [{ onReady, onFail }]
    this.bc.rttService.enableRTT(
      (...args) => {
        let waiters = this.rttEnableWaiters
        this.rttEnableWaiters = null
        waiters.forEach(w => w.onReady(...args))
      },
      (...args) => {
        let waiters = this.rttEnableWaiters
        this.rttEnableWaiters = null
        waiters.forEach(w => w.onFail(...args))
      }
    )
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
  onPlayClicked (lobbyType, usePingData, protocol) {
    console.log('[DEBUG] App.onPlayClicked fired', lobbyType, usePingData, protocol) // TEMP diagnostic — remove once Play navigation is confirmed working
    loadingTimerStart = Date.now()
    // Remember the last selected lobby type so the main menu defaults to it next time
    localStorage.setItem('lobbyType', lobbyType)
    this.setState({
      screen: 'joiningLobby',
      lobbyType: lobbyType,
      usePingData: !!usePingData,
      relayProtocol: protocol || 'ws',
      loadingStatus: 'Searching...'
    })

    const algo = { strategy: 'ranged-absolute', alignment: 'center', ranges: [1000] }

    // Enable RTT service (no-op if the main menu already enabled it for chat)
    this.ensureRTTEnabled(
      () => {
        let state = this.state
        state.user.cxId = this.bc.rttService.getRTTConnectionId()
        this.setState(state)

        this.bc.rttService.registerRTTLobbyCallback(this.onLobbyEvent.bind(this))

        const doFindLobby = (withPingData) => {
          let extraJson = this.makeExtraJson(
            this.state.user.colorIndex,
            this.state.user.presentSinceStart
          )
          if (withPingData) {
            this.bc.lobby.findOrCreateLobbyWithPingData(
              lobbyType, 0, 1, algo, {}, null, {}, false, extraJson, '',
              result => {
                if (result.status !== 200) this.dieWithMessage('Failed to find lobby')
              }
            )
          } else {
            this.bc.lobby.findOrCreateLobby(
              lobbyType, 0, 1, algo, {}, null, {}, false, extraJson, '',
              result => {
                if (result.status !== 200) this.dieWithMessage('Failed to find lobby')
              }
            )
          }
        }

        // Ping regions when explicitly requested or for GameLift lobbies
        const needsPing = usePingData || lobbyType.toLowerCase().includes('gamelift')
        if (needsPing) {
          this.setState({ loadingStatus: 'Getting regions...' })
          this.bc.lobby.getRegionsForLobbies([lobbyType], result => {
            if (result.status !== 200) {
              doFindLobby(false)
              return
            }
            this.bc.lobby.pingRegions(result => {
              if (result.status !== 200) {
                doFindLobby(false)
                return
              }
              let pingData = result.data || {}
              this.setState({ pingData, loadingStatus: 'Searching...' }, () => {
                doFindLobby(true)
              })
            })
          })
        } else {
          doFindLobby(false)
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
      let state = this.state
      // This-lobby chat (SIGNAL below) lives on state.lobby.chatMessages, but every
      // lobby event here rebuilds state.lobby fresh from server data — carry the
      // existing history forward instead of losing it on the next MEMBER_JOIN/UPDATE.
      let prevChatMessages = (state.lobby && state.lobby.chatMessages) || []
      state.lobby = { ...result.data.lobby, lobbyId: result.data.lobbyId, chatMessages: prevChatMessages }

      // The lobby RTT event already carries the latest member data (incl. each
      // member's selected colour in extra.colorIndex), so we derive lobby state
      // directly from it instead of issuing a redundant getLobbyData call on
      // every event. This matches the C++/Java/Godot RTAs, which never re-fetch.
      //
      // lobbyTypeDef (teams + rules) is only present on the fuller events
      // (e.g. MEMBER_JOIN); the server strips it from MEMBER_UPDATE events
      // (which fire on every colour/ready change). So cache the team names and
      // disbandOnStart when they arrive, and always rebuild the team member
      // grouping from the current members — otherwise team rows would keep
      // pointing at stale member objects and miss colour changes.
      let lobbyTypeDef = result.data.lobby.lobbyTypeDef
      if (lobbyTypeDef) {
        state.disbandOnStart = lobbyTypeDef.rules.disbandOnStart
        state.lobbyTeamNames = Object.keys(lobbyTypeDef.teams)
      }

      // Fall back to the team names present on the members if we haven't seen a
      // lobbyTypeDef yet (e.g. first event is a MEMBER_UPDATE).
      let teamNames = state.lobbyTeamNames
      if (teamNames.length === 0) {
        let seen = new Set()
        state.lobby.members.forEach(member => {
          if (member.team && !seen.has(member.team)) seen.add(member.team)
        })
        teamNames = Array.from(seen)
      }

      let teams = []
      teamNames.forEach(teamName => {
        let team = { name: teamName, members: [] }
        state.lobby.members.forEach(member => {
          if (member.team === teamName) {
            team.members.push(member)
            if (member.cxId === this.state.user.cxId && !state.user.team) {
              this.onTeamChanged(member.team)
            }
          }
        })
        teams.push(team)
      })
      state.teams = teams

      if (this.state.screen === 'joiningLobby') {
        state.screen = 'lobby'
      } else if (this.state.lobbyResetting) {
        state.lobbyResetting = false
      }

      this.setState(state)
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
      // Stay on whatever screen we're already on (Lobby, normally) — chat and the rest
      // of the lobby UI keep working through the whole provisioning sequence instead of
      // being replaced by a blocking loading screen. isProvisioning just drives a small
      // inline status line (see LobbyScreen); the actual screen change to Game only
      // happens once relay truly connects (connectRelay's success callback).
      loadingTimerStart = Date.now()
      presentWhileStarted = true
      this.updatePresentSinceStart()
      this.setState({
        isProvisioning: true,
        provisioningStatus: 'Provisioning server...'
      })
    } else if (result.operation === 'ROOM_ASSIGNED') {
      this.setState({ provisioningStatus: 'Server assigned...' })
    } else if (result.operation === 'ROOM_PROGRESS') {
      let step = result.data && result.data.step ? result.data.step : ''
      let msg = result.data && result.data.msg ? result.data.msg : ''
      this.setState({
        provisioningStatus: step ? `${step}: ${msg}` : msg || 'Starting server...'
      })
    } else if (result.operation === 'ROOM_READY') {
      server = result.data
      this.setState({ provisioningStatus: 'Connecting...' })
      if (presentWhileStarted) {
        this.connectRelay()
      } else {
        showJoinButton = true
      }
    } else if (result.operation === 'SIGNAL') {
      // This-lobby chat, via the Lobby service's SendSignal (not the Chat service —
      // rides the RTT connection the lobby already has, no separate channel needed).
      // "from" is the server's authoritative sender info. Skip echoes of our own
      // signal — onSendLobbySignal already appended it locally on send (compared by
      // cxId, not name, since two players could share a display name).
      let fromCxId = result.data.from && result.data.from.cxId
      let text = result.data.signalData && result.data.signalData.text
      if (text && this.state.lobby && fromCxId !== this.state.user.cxId) {
        let fromName = (result.data.from && result.data.from.name) || 'Player'
        let state = this.state
        state.lobby.chatMessages = (state.lobby.chatMessages || []).concat([{ fromName, text }])
        this.setState(state)
      }
    }
  }

  // Sends a this-lobby chat message via the Lobby service's SendSignal. Appends
  // locally right away — the receive handler (onLobbyEvent's SIGNAL case) skips the
  // echo of our own signal, which the server does send back to us too.
  onSendLobbySignal (text) {
    if (!text || !this.state.lobby) return
    this.bc.lobby.sendSignal(this.state.lobby.lobbyId, { text }, () => {})
    let state = this.state
    state.lobby.chatMessages = (state.lobby.chatMessages || []).concat([{ fromName: state.user.name, text }])
    this.setState(state)
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
    if (pingInterval) {
      clearInterval(pingInterval)
      pingInterval = null
    }
    if (matchTickInterval) {
      clearInterval(matchTickInterval)
      matchTickInterval = null
    }
    if (rematchGateInterval) {
      clearInterval(rematchGateInterval)
      rematchGateInterval = null
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
    state.coverage = []
    state.matchResult = { valid: false, round: 0, entries: [] }
    state.awaitingRematch = false
    state.isProvisioning = false
    state.provisioningStatus = ''
    showJoinButton = false
    loadingTimerStart = null
    this.setState(state)
  }

  // The player has picked a different color in the Lobby menu
  onColorChanged (colorIndex) {
    let state = this.state
    state.user.colorIndex = colorIndex
    let extraJson = this.makeExtraJson(colorIndex, state.user.presentSinceStart)
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

  // Owner of the lobby clicked the "Start" button (also reused by tickRematchGate to
  // auto-start the next round).
  onStart () {
    let state = this.state
    state.user.isReady = true
    state.awaitingRematch = false // in case this was triggered by the rematch gate
    let extraJson = this.makeExtraJson(state.user.colorIndex, state.user.presentSinceStart)
    this.setState(state)
    this.bc.lobby.updateReady(
      this.state.lobby.lobbyId,
      this.state.user.isReady,
      extraJson
    )
  }

  // Non-host lobby members have no "Start" button (only the host can start the round),
  // but they still need a way to signal they're ready before the host starts — this is
  // that toggle, reused for both the initial pre-match lobby and un-readying if a guest
  // changes their mind. (Rematch queuing uses the separate onSetRematchReady below.)
  onToggleReady () {
    let state = this.state
    state.user.isReady = !state.user.isReady
    let extraJson = this.makeExtraJson(state.user.colorIndex, state.user.presentSinceStart)
    this.setState(state)
    this.bc.lobby.updateReady(
      this.state.lobby.lobbyId,
      this.state.user.isReady,
      extraJson
    )
  }

  // Marks this player queued for a rematch and takes them back to the Lobby screen —
  // used both by the Match Summary screen's "Queue for Rematch" button and by its own
  // per-player MATCH_SUMMARY_REMATCH_MS auto-timeout. Either path looks identical from
  // here on: the player sits in the Lobby waiting for tickRematchGate() to actually start
  // the next round.
  onSetRematchReady (ready) {
    let state = this.state
    state.user.isReady = ready
    if (ready) state.screen = 'lobby'
    this.setState(state)
    this.bc.lobby.updateReady(
      state.lobby.lobbyId, ready,
      this.makeExtraJson(state.user.colorIndex, state.user.presentSinceStart)
    )
  }

  // Host-only gate on starting the next round: waits until every current lobby member has
  // queued for a rematch (each auto-queues within MATCH_SUMMARY_REMATCH_MS at the latest —
  // see MatchSummaryScreen — so this is mostly a safety net against clock skew) OR that
  // same deadline elapses regardless. Once satisfied, calls the same onStart() that starts
  // every round — no separate "begin round 2" mechanism needed. isHost is re-evaluated
  // every call, so a host migration while some players are still on Match Summary is
  // picked up for free. Ticked on an interval from the END_MATCH handler while
  // awaitingRematch, regardless of whether the host itself is on Lobby or MatchSummary.
  tickRematchGate () {
    if (!this.state.awaitingRematch || !this.state.lobby) return
    const isHost = this.state.lobby.ownerCxId === this.state.user.cxId
    if (!isHost) return

    const members = this.state.lobby.members
    const allReady = members.length > 0 && members.every(m => m.isReady)
    const elapsedMs = Date.now() - (this.state.matchSummaryArrivalTime || Date.now())

    if (allReady || elapsedMs >= MATCH_SUMMARY_REMATCH_MS) {
      this.onStart()
    }
  }

  // Player clicked the "Join Match" button to join an in-progress game
  onJoin () {
    let state = this.state
    state.user.isReady = true
    let extraJson = this.makeExtraJson(state.user.colorIndex, state.user.presentSinceStart)
    this.setState(state)
    this.bc.lobby.updateReady(
      this.state.lobby.lobbyId,
      this.state.user.isReady,
      extraJson
    )
    this.connectRelay()
  }

  // Ends the current match (host-only) — there's no manual UI trigger anymore (matches
  // the cpp reference: no more "End Match" button), only tickMatch()'s auto-end
  // sequence RESULT_GRACE_MS after it broadcasts match_result.
  onEndMatch () {
    let extraJson = {
      cxId: this.bc.brainCloudClient.getRTTConnectionId(),
      lobbyId: this.state.lobby.lobbyId,
      op: 'END_MATCH'
    }
    this.bc.relay.endMatch(extraJson)
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
          // Use the sender's synced rotation (default random if an older client omits it)
          angle: json.data.angle === undefined ? Math.random() * Math.PI * 2 : json.data.angle,
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
            // "a" = synced rotation (default random if absent); "t" = original timestamp
            angle: s.a === undefined ? Math.random() * Math.PI * 2 : s.a,
            startTimeMs: s.t
          })
        })
        break

      // Live relay RTT broadcast from another player
      case 'relay_ping':
        if (member) member.activePing = json.data.ping
        break

      // Host-broadcast authoritative match result (chunked — see sendMatchResult).
      case 'match_result': {
        const round = json.data.round
        if (!(state.matchResult.valid && state.matchResult.round === round)) {
          if (json.data.first) pendingMatchResult = []
          json.data.e.forEach(entry => {
            pendingMatchResult.push({
              cxId: entry.cx,
              rank: entry.r,
              coveragePct: entry.c / 100,
              beaten: entry.b,
              lbDelta: { ready: false }
            })
          })
          if (json.data.last) {
            this.applyMatchResult(round, pendingMatchResult)
            pendingMatchResult = []
          }
        }
        break
      }

      // Host-computed leaderboard results for the whole round (see
      // hostPostMatchResultsToCloud/PostMatchResults), chunked like match_result. Can
      // arrive before this round's match_result has populated state.matchResult.entries
      // — buffer by cxId in that case (drained in applyMatchResult).
      case 'lb_result': {
        const round = json.data.round
        if (!(state.matchResult.valid && state.matchResult.round === round)) {
          if (json.data.first) pendingLbChunk = []
          json.data.e.forEach(entry => {
            const delta = {
              ready: true,
              pointsLifetime: { improved: false },
              pointsQuarterly: { improved: false },
              coverageLifetime: { improved: false },
              coverageQuarterly: { improved: false }
            }
            const readPeriod = (key, target) => {
              if (entry[key]) { target.improved = true; target.rankBefore = entry[key].b; target.rankAfter = entry[key].a }
            }
            readPeriod('pl', delta.pointsLifetime)
            readPeriod('pq', delta.pointsQuarterly)
            readPeriod('cl', delta.coverageLifetime)
            readPeriod('cq', delta.coverageQuarterly)
            pendingLbChunk.push({ cxId: entry.cx, delta })
          })
          if (json.data.last) {
            pendingLbChunk.forEach(({ cxId, delta }) => {
              const entry = state.matchResult.entries.find(e => e.cxId === cxId)
              if (entry) entry.lbDelta = delta
              else pendingLbResults[cxId] = delta
            })
            pendingLbChunk = []
          }
        }
        break
      }

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
      if (pingInterval) {
        clearInterval(pingInterval)
        pingInterval = null
      }
      if (matchTickInterval) {
        clearInterval(matchTickInterval)
        matchTickInterval = null
      }
      this.bc.relay.deregisterRelayCallback()
      this.bc.relay.deregisterSystemCallback()
      this.bc.relay.disconnect()
      loadingTimerStart = null
      let state = this.state
      // The Match Summary + rematch-queue screen (BCLOUD-14489) — state.matchResult is
      // always populated by the time END_MATCH arrives (tickMatch's auto-end sequence
      // broadcasts it RESULT_GRACE_MS before calling onEndMatch; a manual early end skips
      // that, so the screen just shows "Waiting for results..." in that case).
      state.screen = 'matchSummary'
      state.matchSummaryArrivalTime = Date.now()
      state.awaitingRematch = true
      state.lobbyResetting = true
      state.user.isReady = false
      state.user.presentSinceStart = false
      state.splotches = []
      state.shockwaves = []
      state.gameStartTime = null
      state.isProvisioning = false
      showJoinButton = false
      this.setState(state)

      // Actually clear readiness server-side too, not just the local mirror above —
      // otherwise the "Queue for Rematch N/M" count starts from whatever everyone's
      // pre-match ready state still was.
      this.bc.lobby.updateReady(
        state.lobby.lobbyId, false,
        this.makeExtraJson(state.user.colorIndex, false)
      )

      // Host-only: keeps evaluating whether to auto-start the next round even while
      // sitting on Lobby/MatchSummary, whichever screen the host itself is on.
      if (rematchGateInterval) clearInterval(rematchGateInterval)
      rematchGateInterval = setInterval(() => this.tickRematchGate(), 500)
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

    // Pick a rotation once and send it so every client renders this splotch the same.
    let angle = Math.random() * Math.PI * 2

    this.bc.relay.sendToPlayers(
      Buffer.from(
        JSON.stringify({
          op: 'shockwave',
          data: { x: pos.x, y: pos.y, teamCode: 0, angle: angle }
        }),
        'ascii'
      ),
      playerMask,
      true,
      false,
      this.bc.relay.CHANNEL_HIGH_PRIORITY_2
    )

    this.createSplotch(pos, this.state.user.colorIndex, angle)
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
    // Pick a rotation once and send it so every client renders this splotch the same.
    let angle = Math.random() * Math.PI * 2
    let teamCode = this.state.user.team === 'alpha' ? 1 : 2
    let opponentCode = this.state.user.opposingTeam === 'alpha' ? 1 : 2

    // Left click — splotch to everyone
    if (mouseButton === 0) {
      this.bc.relay.send(
        Buffer.from(
          JSON.stringify({
            op: 'shockwave',
            data: { x: pos.x, y: pos.y, teamCode: 0, angle: angle }
          }),
          'ascii'
        ),
        this.bc.relay.TO_ALL_PLAYERS,
        reliable,
        ordered,
        channel
      )
      this.createSplotch(pos, this.state.user.colorIndex, angle)
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
              data: { x: pos.x, y: pos.y, teamCode: opponentCode, angle: angle }
            }),
            'ascii'
          ),
          netId,
          reliable,
          ordered,
          channel
        )
      })
      this.createSplotch(pos, this.state.user.colorIndex, angle)
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
              data: { x: pos.x, y: pos.y, teamCode: teamCode, angle: angle }
            }),
            'ascii'
          ),
          netId,
          reliable,
          ordered,
          channel
        )
      })
      this.createSplotch(pos, this.state.user.colorIndex, angle)
      this.createShockwave(pos, colors[this.state.user.colorIndex])
    }
  }

  connectRelay () {
    const ports = server.connectData.ports
    let host = server.connectData.address
    let port = 0
    let ssl = false

    // Match C++ priority: gamelift → i3d (both force WS) → user-selected protocol
    // JS relay client only supports WS/WSS (no TCP/UDP in browsers)
    if (ports.gamelift) {
      port = ports.gamelift
      ssl = false
      console.log('[DEBUG] relay connect: gamelift port=' + port)
    } else if (ports.i3d) {
      port = ports.i3d
      ssl = false
      console.log('[DEBUG] relay connect: i3d port=' + port)
    } else if (this.state.relayProtocol === 'wss' && ports.wss) {
      // Use the secure hostname and WSS port when the server advertises them.
      ssl = true
      port = ports.wss
      host = server.connectData.secureAddress || server.connectData.address
      console.log('[DEBUG] relay connect: wss host=' + host + ' port=' + port)
    } else {
      ssl = false
      port = ports.ws
      console.log('[DEBUG] relay connect: ws port=' + port)
    }

    presentWhileStarted = false

    this.bc.relay.registerRelayCallback(this.onRelayMessage.bind(this))
    this.bc.relay.registerSystemCallback(this.onSystemMessage.bind(this))
    this.bc.relay.connect(
      {
        ssl: ssl,
        host: host,
        port: port,
        passcode: server.passcode,
        lobbyId: server.lobbyId
      },
      result => {
        let state = this.state
        state.screen = 'game'
        state.isProvisioning = false

        // Fresh round — reset per-round match/coverage state so nothing carries over
        // from the previous round.
        state.coverage = []
        state.matchResult = { valid: false, round: 0, entries: [] }
        state.awaitingRematch = false
        matchPhase = 'running'
        resultsSentAtMs = 0
        coverageComputedAtMs = 0
        pendingMatchResult = []
        pendingLbChunk = []
        pendingLbResults = {}
        leaderboardPostedRound = -1
        if (rematchGateInterval) {
          clearInterval(rematchGateInterval)
          rematchGateInterval = null
        }

        // Host sets the authoritative game start time and broadcasts it to all players
        if (state.lobby.ownerCxId === state.user.cxId) {
          state.gameStartTime = Date.now()
          state.round = (state.round || 0) + 1
          this.setState(state)
          this.sendGameStartToMask(this.bc.relay.TO_ALL_PLAYERS)
        } else {
          this.setState(state)
        }

        // Broadcast relay RTT to all players every 2 seconds
        if (pingInterval) clearInterval(pingInterval)
        pingInterval = setInterval(() => this.broadcastRelayPing(), 2000)

        // Live coverage recompute + host auto-end sequence (see tickMatch)
        if (matchTickInterval) clearInterval(matchTickInterval)
        matchTickInterval = setInterval(() => this.tickMatch(), COVERAGE_RECOMPUTE_MS)
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
      let entry = { x: s.x, y: s.y, c: s.colorIndex, a: s.angle, t: s.startTimeMs }
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

  // Mask of every OTHER lobby member (excludes self) — used to broadcast match_result/
  // lb_result to the rest of the match.
  buildAllOthersMask () {
    let mask = 0
    this.state.lobby.members.forEach(member => {
      if (member.cxId === this.state.user.cxId) return
      let netId = this.bc.relay.getNetIdForCxId(member.cxId)
      if (netId === undefined || netId < 0) return
      mask += Math.pow(2, netId)
    })
    return mask
  }

  toMatchResultEntries (coverage) {
    return coverage.map(c => ({
      cxId: c.cxId,
      rank: c.rank,
      coveragePct: c.coveragePct,
      beaten: c.beaten,
      lbDelta: { ready: false }
    }))
  }

  // Broadcasts the host-authoritative match result to the rest of the match, chunked to
  // stay under a relay packet's byte budget (mirrors sendSplotchSyncToMask's pattern).
  sendMatchResult (mask, round, coverage) {
    if (!coverage.length || mask === 0) return
    const MAX_BYTES = 900
    const ENVELOPE = 80
    let batches = []
    let batch = []
    let currentSize = ENVELOPE

    coverage.forEach(c => {
      let entry = { cx: c.cxId, r: c.rank, c: Math.round(c.coveragePct * 100), b: c.beaten }
      let entrySize = JSON.stringify(entry).length + 1
      if (currentSize + entrySize > MAX_BYTES && batch.length > 0) {
        batches.push(batch)
        batch = []
        currentSize = ENVELOPE
      }
      batch.push(entry)
      currentSize += entrySize
    })
    batches.push(batch)

    batches.forEach((entries, i) => {
      let msg = { op: 'match_result', data: { round, first: i === 0, last: i === batches.length - 1, e: entries } }
      this.bc.relay.sendToPlayers(
        Buffer.from(JSON.stringify(msg), 'ascii'),
        mask, true, true, this.bc.relay.CHANNEL_HIGH_PRIORITY_1
      )
    })
  }

  // Applies an authoritative coverage snapshot for a round — either a locally-computed one
  // (host, or the watchdog fallback) or one just reassembled from a "match_result"
  // broadcast. Idempotent per round. Only the host posts to the cloud (see
  // hostPostMatchResultsToCloud) — everyone else just waits for the "lb_result" broadcast
  // that call produces.
  applyMatchResult (round, entries) {
    if (this.state.matchResult.valid && this.state.matchResult.round === round) return
    let state = this.state
    state.matchResult = { valid: true, round, entries }

    // Drain any "lb_result" broadcasts that arrived before this round's match_result did.
    entries.forEach(e => {
      let pending = pendingLbResults[e.cxId]
      if (pending) {
        e.lbDelta = pending
        delete pendingLbResults[e.cxId]
      }
    })
    this.setState(state)

    if (leaderboardPostedRound === round) return
    leaderboardPostedRound = round

    const isHost = this.state.lobby.ownerCxId === this.state.user.cxId
    if (isHost) this.hostPostMatchResultsToCloud(round, entries)
  }

  // Host-only: posts the WHOLE round's results to the four leaderboards in one trusted
  // server-side call (PostMatchResults cloud script — see brainCloud Design > Cloud Code).
  // Replaces per-client direct-leaderboard-API posting entirely; postScoreToLeaderboard-
  // OnBehalfOf (which the script uses) is Cloud-Code-only, so individual clients can't
  // post to these boards at all anymore.
  hostPostMatchResultsToCloud (round, entries) {
    const scriptData = {
      round,
      pointsLeaderboardId: LEADERBOARD_IDS.points.lifetime,
      pointsLeaderboardIdQuarterly: LEADERBOARD_IDS.points.quarterly,
      coverageLeaderboardId: LEADERBOARD_IDS.coverage.lifetime,
      coverageLeaderboardIdQuarterly: LEADERBOARD_IDS.coverage.quarterly,
      entries: entries
        .map(e => {
          const member = this.state.lobby.members.find(m => m.cxId === e.cxId)
          if (!member || !member.profileId) return null // can't post server-side without a profileId
          return {
            profileId: member.profileId,
            name: member.name,
            points: e.beaten + 1,
            coverageBasisPoints: Math.round(e.coveragePct * 100)
          }
        })
        .filter(Boolean)
    }

    this.bc.script.runScript('PostMatchResults', scriptData, result => {
      if (result.status === 200) {
        this.applyLeaderboardResultsFromCloud(round, result.data.results)
      } else {
        console.log('[DEBUG] PostMatchResults script call failed for round ' + round, result)
      }
    })
  }

  // Applies the PostMatchResults response (keyed by profileId) onto state.matchResult.
  // entries (keyed by cxId — resolved via state.lobby.members, the only place both ids
  // are known together) and broadcasts the result to the rest of the match. Host-only.
  applyLeaderboardResultsFromCloud (round, resultsArr) {
    if (!(this.state.matchResult.valid && this.state.matchResult.round === round)) return // a newer round has already started

    const profileIdToCxId = {}
    this.state.lobby.members.forEach(m => { if (m.profileId) profileIdToCxId[m.profileId] = m.cxId })

    const readPeriod = j => ({ rankBefore: j.before, rankAfter: j.after, improved: j.improved })

    let state = this.state
    resultsArr.forEach(r => {
      const cxId = profileIdToCxId[r.profileId]
      if (!cxId) return
      const delta = {
        ready: true,
        pointsLifetime: readPeriod(r.pointsLifetime),
        pointsQuarterly: readPeriod(r.pointsQuarterly),
        coverageLifetime: readPeriod(r.coverageLifetime),
        coverageQuarterly: readPeriod(r.coverageQuarterly)
      }
      const entry = state.matchResult.entries.find(e => e.cxId === cxId)
      if (entry) entry.lbDelta = delta
    })
    this.setState(state)

    this.sendLeaderboardResultsToMask(this.buildAllOthersMask(), round, state.matchResult.entries)
  }

  // Broadcasts the host's cloud-computed leaderboard results for the whole round to the
  // rest of the match — chunked exactly like match_result. Only entries with
  // lbDelta.ready are included; a period sub-object is present only when it actually
  // improved (absent == "no change" on receipt).
  sendLeaderboardResultsToMask (mask, round, entries) {
    if (mask === 0) return
    const MAX_BYTES = 900
    const ENVELOPE = 80
    let batches = []
    let batch = []
    let currentSize = ENVELOPE

    const putPeriod = (je, key, pd) => {
      if (!pd.improved) return
      je[key] = { b: pd.rankBefore, a: pd.rankAfter }
    }

    entries.filter(e => e.lbDelta && e.lbDelta.ready).forEach(e => {
      let je = { cx: e.cxId }
      putPeriod(je, 'pl', e.lbDelta.pointsLifetime)
      putPeriod(je, 'pq', e.lbDelta.pointsQuarterly)
      putPeriod(je, 'cl', e.lbDelta.coverageLifetime)
      putPeriod(je, 'cq', e.lbDelta.coverageQuarterly)
      let entrySize = JSON.stringify(je).length + 1
      if (currentSize + entrySize > MAX_BYTES && batch.length > 0) {
        batches.push(batch)
        batch = []
        currentSize = ENVELOPE
      }
      batch.push(je)
      currentSize += entrySize
    })
    batches.push(batch) // always at least one (possibly empty) so "last" still fires

    batches.forEach((entriesBatch, i) => {
      let msg = { op: 'lb_result', data: { round, first: i === 0, last: i === batches.length - 1, e: entriesBatch } }
      this.bc.relay.sendToPlayers(
        Buffer.from(JSON.stringify(msg), 'ascii'),
        mask, true, true, this.bc.relay.CHANNEL_HIGH_PRIORITY_1
      )
    })
  }

  // Live coverage recompute (drives the in-game scoreboard sidebar) + the host's
  // auto-end-at-MATCH_DURATION_SEC sequence: compute+broadcast match_result, wait
  // RESULT_GRACE_MS, then call the same onEndMatch() the manual "End Match" button uses.
  // Ticked every COVERAGE_RECOMPUTE_MS while in the 'game' screen (started/cleared
  // alongside pingInterval).
  tickMatch () {
    if (!this.state.gameStartTime) return
    const nowMs = Date.now()

    if (nowMs - coverageComputedAtMs >= COVERAGE_RECOMPUTE_MS) {
      const fresh = computeCoverage(this.state.splotches, this.state.lobby.members)
      const prevCoverage = this.state.coverage
      fresh.forEach(e => {
        const old = prevCoverage.find(o => o.cxId === e.cxId)
        const prevRank = old ? old.rank : e.rank
        const prevChangedAt = old ? (old.rankChangedAtMs || 0) : 0
        e.prevRank = prevRank
        e.rankChangedAtMs = (prevRank !== e.rank) ? nowMs : prevChangedAt
      })
      this.setState({ coverage: fresh })
      coverageComputedAtMs = nowMs
    }

    const isHost = this.state.lobby.ownerCxId === this.state.user.cxId
    const elapsedMs = nowMs - this.state.gameStartTime

    if (matchPhase === 'running' && elapsedMs >= MATCH_DURATION_SEC * 1000 && isHost) {
      if (!(this.state.matchResult.valid && this.state.matchResult.round === this.state.round)) {
        const finalCoverage = computeCoverage(this.state.splotches, this.state.lobby.members)
        this.applyMatchResult(this.state.round, this.toMatchResultEntries(finalCoverage))
        this.sendMatchResult(this.buildAllOthersMask(), this.state.round, finalCoverage)
      }
      matchPhase = 'resultsBroadcast'
      resultsSentAtMs = nowMs
    } else if (matchPhase === 'resultsBroadcast' && isHost && nowMs - resultsSentAtMs >= RESULT_GRACE_MS) {
      this.onEndMatch()
      matchPhase = 'ended'
    }

    // Watchdog: well past the deadline with no authoritative result at all (a dropped
    // broadcast, or a gap during host migration) — compute and apply locally so the round
    // can't hang forever. Cheap and idempotent.
    if (!this.state.matchResult.valid && elapsedMs >= MATCH_DURATION_SEC * 1000 + RESULT_GRACE_MS + 3000) {
      const finalCoverage = computeCoverage(this.state.splotches, this.state.lobby.members)
      this.applyMatchResult(this.state.round, this.toMatchResultEntries(finalCoverage))
      if (isHost && matchPhase !== 'ended') {
        this.sendMatchResult(this.buildAllOthersMask(), this.state.round, finalCoverage)
        matchPhase = 'resultsBroadcast'
        resultsSentAtMs = nowMs
      }
    }
  }

  // Add a persistent colour splotch at pos (normalized 0-1 coords)
  createSplotch (pos, colorIndex, angle) {
    let splotch = {
      x: pos.x,
      y: pos.y,
      colorIndex: colorIndex % colors.length,
      angle: angle === undefined ? Math.random() * Math.PI * 2 : angle,
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
    let extraJson = this.makeExtraJson(state.user.colorIndex, true)
    this.bc.lobby.updateReady(
      this.state.lobby.lobbyId,
      this.state.user.isReady,
      extraJson
    )
  }

  // Broadcast our current relay RTT to all other players (called every 2 seconds while in game)
  broadcastRelayPing () {
    if (this.state.screen !== 'game' || !this.bc.relay) return
    let ping = typeof this.bc.relay.getPing === 'function' ? this.bc.relay.getPing() : -1
    if (ping < 0) return

    // Update own entry immediately
    let state = this.state
    let me = state.lobby.members.find(m => m.cxId === state.user.cxId)
    if (me) me.activePing = ping

    let msg = { op: 'relay_ping', data: { ping } }
    this.bc.relay.sendToAll(
      Buffer.from(JSON.stringify(msg), 'ascii'),
      false, false,
      this.bc.relay.CHANNEL_HIGH_PRIORITY_1
    )
    this.setState(state)
  }

  // Version overlay — always visible in the bottom-left corner on every screen
  renderVersionOverlay () {
    return (
      <div className='VersionOverlay'>
        <div>App: {ids.version}</div>
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
              usePingData={this.state.usePingData}
              lastLobbyType={localStorage.getItem('lobbyType')}
              bcWrapper={this.bc}
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
              lobbyResetting={this.state.lobbyResetting}
              usePingData={this.state.usePingData}
              pingData={this.state.pingData}
              bcWrapper={this.bc}
              isProvisioning={this.state.isProvisioning}
              provisioningStatus={this.state.provisioningStatus}
              awaitingRematch={this.state.awaitingRematch}
              matchResult={this.state.matchResult}
              onBack={this.onGameScreenClose.bind(this)}
              onColorChanged={this.onColorChanged.bind(this)}
              onTeamChanged={this.onTeamChanged.bind(this)}
              onStart={this.onStart.bind(this)}
              onToggleReady={this.onToggleReady.bind(this)}
              onJoin={this.onJoin.bind(this)}
              onSendLobbySignal={this.onSendLobbySignal.bind(this)}
            />
          </>
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
              teams={this.state.teams}
              shockwaves={this.state.shockwaves}
              splotches={this.state.splotches}
              splotchDurationSec={this.state.splotchDurationSec}
              gameStartTime={this.state.gameStartTime}
              relayOptions={this.state.relayOptions}
              coverage={this.state.coverage}
              onBack={this.onGameScreenClose.bind(this)}
              onPlayerMove={this.onPlayerMove.bind(this)}
              onPlayerClicked={this.onPlayerClicked.bind(this)}
              onToggleReliable={this.onToggleReliable.bind(this)}
              onToggleOrdered={this.onToggleOrdered.bind(this)}
              onTogglePlayerMask={this.onTogglePlayerMask.bind(this)}
              numArrowImages={NUM_ARROW_IMAGES}
            />
          </>
        )

      case 'matchSummary':
        return (
          <MatchSummaryScreen
            user={this.state.user}
            lobby={this.state.lobby}
            matchResult={this.state.matchResult}
            matchSummaryArrivalTime={this.state.matchSummaryArrivalTime}
            onSetRematchReady={this.onSetRematchReady.bind(this)}
            onMainMenu={this.onGameScreenClose.bind(this)}
          />
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
