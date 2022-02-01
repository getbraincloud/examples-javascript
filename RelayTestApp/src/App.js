import React, { Component } from 'react'
import './App.css';
import ids from './ids'; // CREATE ids.js AND EXPORT appId, appSecret (and optionally url)

// Screens
import LoginScreen from './LoginScreen';
import LoadingScreen from './LoadingScreen';
import MainMenuScreen from './MainMenuScreen';
import LobbyScreen from './LobbyScreen';
import GameScreen from './GameScreen';

let brainCloud = require("braincloud")
let colors = require('./Colors').colors

class App extends Component
{
    constructor()
    {
        super()

        this.shockwaveNextId = 0
        this.initBC()
        this.state = this.makeDefaultState()
    }
    
    // Initialize brainCloud library
    initBC()
    {
        // Create brainCloud Wrapper and initialize it
        this.bc = new brainCloud.BrainCloudWrapper("relayservertest")
        this.bc.initialize(ids.appId, ids.appSecret, "1.0.0")

        // Set server URL if specified in ids.txt
        if (ids.url) this.bc.brainCloudClient.setServerUrl(ids.url)

        // Log all the things so we can see what's going on (Turn that off for release)
        this.bc.brainCloudClient.enableLogging(true)
    }

    // Create default blank state for the app
    makeDefaultState()
    {
        return {
            screen: "login",    // Current screen we are on
            user: null,         // Our user
            lobby: null,        // Lobby with its members as received from brainCloud Lobby Service
            server: null,       // Server info (IP, port, protocol, passcode)
            shockwaves: [],     // Players' created shockwaves
            relayOptions: {
                reliable: false,
                ordered: true
            }
        }
    }

    // Reset the app to the login page with an error popup
    dieWithMessage(message)
    {
        // Close Relay/RTT/BC connections
        this.bc.relay.disconnect()
        this.bc.relay.deregisterSystemCallback()
        this.bc.relay.deregisterRelayCallback()
        this.bc.rttService.deregisterAllRTTCallbacks()
        this.bc.brainCloudClient.resetCommunication()

        // Pop alert message
        alert(message)

        // Initialize BC libs and start over
        this.initBC()

        // Go back to default login state
        this.setState(this.makeDefaultState())
    }

    // Clicked "Login"
    onLoginClicked(user, pass)
    {
        // Show "Loging in..." screen
        this.setState({ screen: "loginIn" })

        // Connect to braincloud
        this.username = user
        this.bc.authenticateUniversal(user, pass, true, this.onLoggedIn.bind(this))
    }

    // brainCloud authentication response
    onLoggedIn(result)
    {
        if (result.status === 200)
        {
            // Update username stored in brainCloud if first time loging in with that user.
            // This is necessary because the login username is not necessary the app username (Player name)
            if (this.username !== "" && this.username !== undefined)
            {
                this.bc.playerState.updateUserName(this.username)
            }
            else
            {
                this.username = result.data.playerName
            }

            // Set the state with our user information. Include in there our
            // color pick from last time.
            let localStorageColor = localStorage.getItem("color")
            if (localStorageColor == null) localStorageColor = "7" // Default to white
            this.setState({
                screen: "mainMenu",
                user: {
                    id: result.data.profileId,
                    cxId: null,
                    name: this.username,
                    colorIndex: parseInt(localStorageColor),
                    isReady: false
                }
            })
        }
        else
        {
            this.dieWithMessage("Failed to login");
        }
    }

    // Clicked play from the main menu (Menu shown after authentication)
    onPlayClicked(lobbyType)
    {
        this.setState({ screen: "joiningLobby", lobbyType: lobbyType })

        // Enable RTT service
        this.bc.rttService.enableRTT(() =>
        {
            let state = this.state
            state.user.cxId = this.bc.rttService.getRTTConnectionId()
            this.setState(state)

            console.log("RTT Enabled");

            // Register lobby callback
            this.bc.rttService.registerRTTLobbyCallback(this.onLobbyEvent.bind(this))

            // If using gamelift, we will do region pings
            if (lobbyType == "CursorPartyGameLift")
            {
                this.bc.lobby.getRegionsForLobbies([lobbyType], (result) =>
                {
                    if (result.status !== 200) 
                    {
                        this.dieWithMessage("Failed to get regions for lobbies")
                        return
                    }

                    this.bc.lobby.pingRegions((result) =>
                    {
                        if (result.status !== 200) 
                        {
                            this.dieWithMessage("Failed to ping regions")
                            return
                        }

                        // Find or create a lobby
                        this.bc.lobby.findOrCreateLobbyWithPingData(lobbyType, 0, 1, { strategy: "ranged-absolute", alignment: "center", ranges: [1000] }, {}, null, {}, false, {colorIndex:this.state.user.colorIndex}, "all", result =>
                        {
                            if (result.status !== 200)
                            {
                                this.dieWithMessage("Failed to find lobby")
                            }
                            // Success of lobby found will be in the event onLobbyEvent
                        })
                    })
                })
            }
            else
            {
                // Find or create a lobby
                this.bc.lobby.findOrCreateLobby(lobbyType, 0, 1, { strategy: "ranged-absolute", alignment: "center", ranges: [1000] }, {}, null, {}, false, {colorIndex:this.state.user.colorIndex}, "all", result =>
                {
                    if (result.status !== 200)
                    {
                        this.dieWithMessage("Failed to find lobby")
                    }
                    // Success of lobby found will be in the event onLobbyEvent
                })
            }
        }, () =>
        {
            if (this.state.screen === "joiningLobby")
            {
                this.dieWithMessage("Failed to enable RTT")
            }
            else
            {
                this.dieWithMessage("RTT Disconnected")
            }
        })
    }

    // Update events from the lobby Service
    onLobbyEvent(result)
    {
        // If there is a lobby object present in the message, update our lobby
        // state with it.
        if (result.data.lobby)
        {
            this.setState({lobby: { ...result.data.lobby, lobbyId: result.data.lobbyId }})

            // If we were joining lobby, show the lobby screen. We have the information to
            // display now.
            if (this.state.screen === "joiningLobby")
            {
                this.setState({ screen: "lobby" })
            }
        }

        if (result.operation === "DISBANDED")
        {
            if (result.data.reason.code != this.bc.reasonCodes.RTT_ROOM_READY)
            {
                // Disbanded for any other reason than ROOM_READY, means we failed to launch the game.
                this.onGameScreenClose()
            }
        }
        else if (result.operation === "STARTING")
        {
            // Game is starting, show loading screen
            this.setState({ screen: "connecting" })
        }
        else if (result.operation === "ROOM_READY")
        {
            let server = result.data;

            // Make sure we're back at ready = false, if we have multiple rounds
            // this.bc.lobby.updateReady(this.state.lobby.lobbyId, false, {colorIndex: this.state.user.colorIndex})

            // If the lobby is gamelift, the port name will be "gamelift"
            let wsPort = 0;
            if (this.state.lobbyType == "CursorPartyGameLift") wsPort = server.connectData.ports.gamelift;
            else wsPort = server.connectData.ports.ws;

            // Server has been created. Connect to it
            this.bc.relay.registerRelayCallback(this.onRelayMessage.bind(this))
            this.bc.relay.registerSystemCallback(this.onSystemMessage.bind(this))
            this.bc.relay.connect({
                ssl: false,
                host: server.connectData.address,
                port: wsPort,
                passcode: server.passcode,
                lobbyId: server.lobbyId
            }, result =>
            {
                let state = this.state
                state.lobby.members.forEach(member => member.allowSendTo = (member.cxId !== state.user.cxId))
                state.screen = "game"

                // If we are Long Live Lobby, we quit the game after 20sec
                if (this.state.lobbyType == "CursorPartyV2LongLive")
                {
                    state.nextRoundTimeout = setTimeout(this.onRoundFinished.bind(this), 20000);
                    state.lobby.timeLeft = 20;
                    state.timeLeftTick = setInterval(() =>
                    {
                        let state = this.state
                        state.lobby.timeLeft = Math.max(0, state.lobby.timeLeft - 1);
                        this.setState(state)
                    }, 1000);
                }

                this.setState(state)
            }, error => this.dieWithMessage("Failed to connect to server, msg: " + error))
        }
    }

    // Gameplay option toggles
    onToggleReliable()
    {
        let state = this.state
        state.relayOptions.reliable = !state.relayOptions.reliable
        this.setState(state)
    }

    onToggleOrdered()
    {
        let state = this.state
        state.relayOptions.ordered = !state.relayOptions.ordered
        this.setState(state)
    }

    onTogglePlayerMask(cxId)
    {
        let state = this.state
        let member = state.lobby.members.find(member => member.cxId === cxId)
        if (member)
        {
            member.allowSendTo = !member.allowSendTo
        }
        this.setState(state)
    }

    // Called to terminate the current session and go back to the main menu
    onGameScreenClose()
    {
        this.bc.relay.deregisterRelayCallback()
        this.bc.relay.deregisterSystemCallback()
        this.bc.relay.disconnect()
        this.bc.rttService.deregisterAllRTTCallbacks()
        this.bc.rttService.disableRTT()

        let state = this.state
        state.screen = "mainMenu"
        state.lobby = null
        state.user.isReady = false
        if (state.nextRoundTimeout)
        {
            clearTimeout(state.nextRoundTimeout);
            state.nextRoundTimeout = null;
        }
        if (state.timeLeftTick)
        {
            clearInterval(state.timeLeftTick);
            state.timeLeftTick = null;
        }
        this.setState(state)
    }

    // For long lived lobby, rounds last 20sec then go back here, to the lobby screen
    onRoundFinished()
    {
        this.bc.relay.deregisterRelayCallback()
        this.bc.relay.deregisterSystemCallback()
        this.bc.relay.disconnect()

        let state = this.state
        state.screen = "lobby"
        state.user.isReady = false
        state.nextRoundTimeout = null;
        if (state.timeLeftTick)
        {
            clearInterval(state.timeLeftTick);
            state.timeLeftTick = null;
        }
        this.setState(state)

        // Set our state to not ready and notify the lobby Service.
        // this.bc.lobby.updateReady(this.state.lobby.lobbyId, this.state.user.isReady, {colorIndex: this.state.user.colorIndex})
    }

    // The player has picked a different color in the Lobby menu
    onColorChanged(colorIndex)
    {
        let state = this.state
        state.user.colorIndex = colorIndex
        this.setState(state)

        // Update the extra information for our player so other lobby members are notified of
        // our color change.
        this.bc.lobby.updateReady(this.state.lobby.lobbyId, this.state.user.isReady, {colorIndex: colorIndex})
    }

    // Owner of the lobby clicked the "Start" button
    onStart()
    {
        let state = this.state
        state.user.isReady = true
        this.setState(state)

        // Set our state to ready and notify the lobby Service.
        this.bc.lobby.updateReady(this.state.lobby.lobbyId, this.state.user.isReady, {colorIndex: this.state.user.colorIndex})
    }

    // A relay message coming from another player
    onRelayMessage(netId, data)
    {
        let state = this.state;
        let memberCxId = this.bc.relay.getCxIdForNetId(netId)
        let member = state.lobby.members.find(member => member.cxId === memberCxId)
        let str = data.toString('ascii');
        console.log(str)
        let json = JSON.parse(str)

        switch (json.op)
        {
            // Player moved the mouse
            case "move":
                member.pos = {x: json.data.x, y: json.data.y};
                break

            // Player clicked to create a shockwave
            case "shockwave":
                this.createShockwave(json.data, colors[member.extra.colorIndex])
                break

            default: break;
        }

        this.setState(state)
    }

    // Received a Relay Server system message
    onSystemMessage(json)
    {
        if (json.op === "DISCONNECT") // A member has disconnected from the game
        {
            let state = this.state;
            let member = state.lobby.members.find(member => member.cxId === json.cxId)
            if (member) member.pos = null // This will stop displaying this member
            this.setState(state)
        }
    }

    // Called by the gamescreen when our player moves the mouse
    onPlayerMove(pos)
    {
        let state = this.state;
        let member = state.lobby.members.find(member => member.cxId === state.user.cxId)
        member.pos = {x: pos.x, y: pos.y};
        this.setState(state)

        // We send the movement update as unreliable. Exact position is not important and we can accept
        // packet loss.
        // Note: This is using the JS API which uses only WebSocket, meaning there will never be packet loss. But other
        // API can connect to the same game instance and might communicate to the relay server in UDP.
        this.bc.relay.sendToAll(Buffer.from(JSON.stringify({op:"move",data:pos}), 'ascii'), false, true, this.bc.relay.CHANNEL_HIGH_PRIORITY_1);
    }

    // Player has clicked to create a shockwave
    onPlayerShockwave(pos)
    {
        // Build player mask.
        let playerMask = this.state.lobby.members.reduce((playerMask, member) =>
        {
            if (!member.allowSendTo)
            {
                return playerMask
            }
            else
            {
                let netId = this.bc.relay.getNetIdForCxId(member.cxId)

                // Note here we don't use bitwise operations because
                // the mask can be up to 40 players, and using bitwise limits us to 32 bits in JS.
                // But for a game with less than 32 players, this shouldn't be a problem.
                return playerMask + Math.pow(2, netId)
            }
        }, 0)

        // We send the shockewave event as reliable because such action needs to be guaranteed.
        this.bc.relay.sendToPlayers(Buffer.from(JSON.stringify({op:"shockwave",data:pos}), 'ascii'), playerMask, true, false, this.bc.relay.CHANNEL_HIGH_PRIORITY_2);

        // Create the shockwave instance on our instance
        this.createShockwave(pos, colors[this.state.user.colorIndex])
    }

    // Create a shocwave at position and color on the game screen
    createShockwave(pos, color)
    {
        let shockwaves = this.state.shockwaves;
        let shockwave = {
            pos: {x: pos.x, y: pos.y},
            color: color,
            id: this.shockwaveNextId++ // This is used to ID the HTML element so the CSS animation doesn't bug.
        }
        shockwaves.push(shockwave)
        this.setState({shockwaves: shockwaves})

        // Set a timeout to kill that shockwave instance in 1 second
        setTimeout(() =>
        {
            let shockwaves = this.state.shockwaves;
            shockwaves.splice(shockwaves.indexOf(shockwave), 1)
            this.setState({shockwaves: shockwaves})
        }, 1000)
    }

    // Render ReactJS components
    render()
    {
        switch (this.state.screen)
        {
            case "login":
            {
                return (
                    <div className="App">
                        <header className="App-header">
                            <p>Relay Server Test App.</p>
                            <LoginScreen onLogin={this.onLoginClicked.bind(this)}/>
                        </header>
                    </div>
                )
            }
            case "loginIn":
            {
                return (
                    <div className="App">
                        <header className="App-header">
                            <LoadingScreen text="Logging in..." />
                        </header>
                    </div>
                )
            }
            case "mainMenu":
            {
                return (
                    <div className="App">
                        <header className="App-header">
                            <p>Relay Server Test App.</p>
                            <MainMenuScreen user={this.state.user}
                                onPlay={this.onPlayClicked.bind(this)} />
                        </header>
                    </div>
                )
            }
            case "joiningLobby":
            {
                return (
                    <div className="App">
                        <header className="App-header">
                            <LoadingScreen text="Joining..." onBack={this.onGameScreenClose.bind(this)} />
                        </header>
                    </div>
                )
            }
            case "lobby":
            {
                return (
                    <div className="App">
                        <header className="App-header">
                            <p>Relay Server Test App.</p>
                            <p>LOBBY</p>
                            <LobbyScreen user={this.state.user} lobby={this.state.lobby} onBack={this.onGameScreenClose.bind(this)} onColorChanged={this.onColorChanged.bind(this)} onStart={this.onStart.bind(this)} />
                        </header>
                    </div>
                )
            }
            case "connecting":
            {
                return (
                    <div className="App">
                        <header className="App-header">
                            <LoadingScreen text="Joining Match..." />
                            {/*<small>If this takes a while, don't worry. This means a new server is warming up just for you.</small>*/}
                        </header>
                    </div>
                )
            }
            case "game":
            {
                return (
                    <div className="App">
                        <header className="App-header">
                            <p>Relay Server Test App.</p>
                            <small>Move mouse around and click to create shockwaves.</small>
                            <GameScreen user={this.state.user} 
                                        lobby={this.state.lobby} 
                                        shockwaves={this.state.shockwaves} 
                                        relayOptions={this.state.relayOptions}
                                        onBack={this.onGameScreenClose.bind(this)} 
                                        onPlayerMove={this.onPlayerMove.bind(this)} 
                                        onPlayerShockwave={this.onPlayerShockwave.bind(this)}
                                        onToggleReliable={this.onToggleReliable.bind(this)} 
                                        onToggleOrdered={this.onToggleOrdered.bind(this)} 
                                        onTogglePlayerMask={this.onTogglePlayerMask.bind(this)} />
                        </header>
                    </div>
                )
            }
            default:
            {
                return (
                    <div className="App">
                        Invalid state
                    </div>
                )
            }
        }
    }
}

export default App;
