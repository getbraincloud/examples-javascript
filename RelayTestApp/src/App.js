import React, { Component } from 'react'
import './App.css';
import ids from './ids'; // CREATE ids.js AND EXPORT appId, appSecret (and optionally url)

// Screens
import LoginScreen from './LoginScreen';
import LoadingScreen from './LoadingScreen';
import MainMenuScreen from './MainMenuScreen';
import FFALobbyScreen from './FFALobbyScreen';
import TeamLobbyScreen from './TeamLobbyScreen';
import FFAGameScreen from './FFAGameScreen';
import TeamGameScreen from './TeamGameScreen'

let brainCloud = require("braincloud")
let colors = require('./Colors').colors

let presentWhileStarted = false;
let server = null;
let showJoinButton = false;
let teamMode = false;

export function getShowJoinButton(){
    return showJoinButton
}

export function getGameMode(){
    return teamMode
}

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
                    isReady: false,
                    presentSinceStart: false
                }
            })
        }
        else
        {
            this.dieWithMessage("Failed to login");
        }
    }

    // Clicked play from the main menu (Menu shown after authentication)
    onPlayClicked(lobbyType) {
        this.setState({ screen: "joiningLobby", lobbyType: lobbyType })

        // Enable RTT service
        this.bc.rttService.enableRTT(() => {
            let state = this.state
            let extraJson = {
                colorIndex: this.state.user.colorIndex,
                presentSinceStart: this.state.user.presentSinceStart
            }
            state.user.cxId = this.bc.rttService.getRTTConnectionId()
            this.setState(state)

            console.log("RTT Enabled");

            // Register lobby callback
            this.bc.rttService.registerRTTLobbyCallback(this.onLobbyEvent.bind(this))

            switch (lobbyType) {
                case "CursorPartyV2":
                case "CursorPartyV2Backfill":
                    teamMode = false

                    // Find or create a lobby
                    this.bc.lobby.findOrCreateLobby(lobbyType, 0, 1, { strategy: "ranged-absolute", alignment: "center", ranges: [1000] }, {}, null, {}, false, extraJson, "all", result => {
                        if (result.status !== 200) {
                            this.dieWithMessage("Failed to find lobby")
                        }
                        // Success of lobby found will be in the event onLobbyEvent
                    })
                    break;
                case "CursorPartyGameLift":
                    teamMode = false

                        this.bc.lobby.getRegionsForLobbies([lobbyType], (result) => {
                            if (result.status !== 200) {
                                this.dieWithMessage("Failed to get regions for lobbies")
                                return
                        }

                        this.bc.lobby.pingRegions((result) => {
                            if (result.status !== 200) {
                                this.dieWithMessage("Failed to ping regions")
                                return
                            }

                            // Find or create a lobby
                            this.bc.lobby.findOrCreateLobbyWithPingData(lobbyType, 0, 1, { strategy: "ranged-absolute", alignment: "center", ranges: [1000] }, {}, null, {}, false, extraJson, "all", result => {
                                if (result.status !== 200) {
                                    this.dieWithMessage("Failed to find lobby")
                                }
                                // Success of lobby found will be in the event onLobbyEvent
                            })
                        })
                    })
                    break;
                case "TeamCursorPartyV2":
                case "TeamCursorPartyV2Backfill":
                    teamMode = true
                    // Find or create a lobby
                    this.bc.lobby.findOrCreateLobby(lobbyType, 0, 1, { strategy: "ranged-absolute", alignment: "center", ranges: [1000] }, {}, null, {}, false, extraJson, "", result => {
                        if (result.status !== 200) {
                            this.dieWithMessage("Failed to find lobby")
                        }
                        // Success of lobby found will be in the event onLobbyEvent
                    })
                    break;
                default:
                    break;
            }

            // Old Money
            // If using gamelift, we will do region pings
            if (lobbyType === "CursorPartyGameLift") {
                this.bc.lobby.getRegionsForLobbies([lobbyType], (result) => {
                    if (result.status !== 200) {
                        this.dieWithMessage("Failed to get regions for lobbies")
                        return
                    }

                    this.bc.lobby.pingRegions((result) => {
                        if (result.status !== 200) {
                            this.dieWithMessage("Failed to ping regions")
                            return
                        }

                        // Find or create a lobby
                        this.bc.lobby.findOrCreateLobbyWithPingData(lobbyType, 0, 1, { strategy: "ranged-absolute", alignment: "center", ranges: [1000] }, {}, null, {}, false, extraJson, "all", result => {
                            if (result.status !== 200) {
                                this.dieWithMessage("Failed to find lobby")
                            }
                            // Success of lobby found will be in the event onLobbyEvent
                        })
                    })
                })
            }
            
        }, () => {
            if (this.state.screen === "joiningLobby") {
                this.dieWithMessage("Failed to enable RTT")
            }
            else {
                this.dieWithMessage("RTT Disconnected")
            }
        })
    }

    // Update events from the lobby Service
    onLobbyEvent(result)
    {
        console.log("onLobbyEvent function")
        // If there is a lobby object present in the message, update our lobby
        // state with it.
        if (result.data.lobby)
        {   
            this.setState({lobby: { ...result.data.lobby, lobbyId: result.data.lobbyId }})

            // Display assigned teams
            if (teamMode) {
                let state = this.state
                state.lobby.members.forEach(member => {
                    console.log("Checking team...")
                    console.log("Member " + member.cxId + " is team " + member.team)
                    
                    if(member.cxId === this.state.user.cxId){
                        console.log("this is our user")
                        
                        if(!state.user.team){
                            this.onTeamChanged(member.team)
                        }
                    }
                })
            }

            // If we were joining lobby, show the lobby screen. We have the information to
            // display now.
            if (this.state.screen === "joiningLobby")
            {
                this.setState({ screen: "lobby" })
            }
        }

        if (result.operation === "DISBANDED")
        {
            if (result.data.reason.code !== this.bc.reasonCodes.RTT_ROOM_READY)
            {
                // Disbanded for any other reason than ROOM_READY, means we failed to launch the game.
                this.onGameScreenClose()
            }
        }
        else if (result.operation === "STARTING")
        {
            presentWhileStarted = true;

            this.updatePresentSinceStart();

            // Game is starting, show loading screen
            this.setState({ screen: "connecting" })
        }
        else if (result.operation === "ROOM_READY")
        {
            server = result.data;

            // Server has been created. Connect to it

            // Check to see if a user joined the lobby before the match started or after.
            // If a user joins while match is in progress, you will only receive MEMBER_JOIN & ROOM_READY RTT updates.
            if (presentWhileStarted) {
                this.connectRelay();
            }
            else{
                showJoinButton = true;

                // refresh the screen to display join button
                this.setState({ screen: "lobby" })
            }
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
        state.user.presentSinceStart = false
        showJoinButton = false
        this.setState(state)
    }

    // The player has picked a different color in the Lobby menu
    onColorChanged(colorIndex)
    {
        let state = this.state
        state.user.colorIndex = colorIndex
        let extraJson = {
            colorIndex: colorIndex,
            presentSinceStart: state.user.presentSinceStart
        }
        this.setState(state)

        // Update the extra information for our player so other lobby members are notified of
        // our color change.
        this.bc.lobby.updateReady(this.state.lobby.lobbyId, this.state.user.isReady, extraJson)
    }

    onTeamChanged(team) {
        let state = this.state
        state.user.team = team

        if (team === "alpha") {
            state.user.colorIndex = 4
            state.user.opposingTeam = "beta"
        }
        else if (team === "beta") {
            state.user.colorIndex = 3
            state.user.opposingTeam = "alpha"
        }
        let extraJson = {
            colorIndex: state.user.colorIndex,
            presentSinceStart: state.user.presentSinceStart
        }

        this.setState(state)

        this.bc.lobby.switchTeam(state.lobby.lobbyId, team, result => {
            var status = result.status
            console.log(status + " : " + JSON.stringify(result, null, 2));

            // Update the extra information for our player so other lobby members are notified of
            // our color change.
            this.bc.lobby.updateReady(this.state.lobby.lobbyId, this.state.user.isReady, extraJson)
        })
    }

    // Owner of the lobby clicked the "Start" button
    onStart()
    {
        let state = this.state
        let extraJson = {
            colorIndex: this.state.user.colorIndex,
            presentSinceStart: this.state.user.presentSinceStart
        }
        state.user.isReady = true
        this.setState(state)

        // Set our state to ready and notify the lobby Service.
        this.bc.lobby.updateReady(this.state.lobby.lobbyId, this.state.user.isReady, extraJson)
    }

    // Player clicked the "Join Match" button, requesting to join a match that had been started prior to them joining the lobby
    onJoin()
    {        
        let state = this.state
        let extraJson = {
            colorIndex: this.state.user.colorIndex,
            presentSinceStart: this.state.user.presentSinceStart
        }
        state.user.isReady = true
        this.setState(state)

        // Set our state to ready and notify the lobby Service.
        this.bc.lobby.updateReady(this.state.lobby.lobbyId, this.state.user.isReady, extraJson)
        
        this.connectRelay();
    }

    // Return to the lobby with the same players
    onEndMatch()
    {
        let extraJson = {
            cxId: this.bc.brainCloudClient.getRTTConnectionId(),
            lobbyId: this.state.lobby.lobbyId,
            op: "END_MATCH"
        }

        this.bc.relay.endMatch(extraJson)
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
            if(json.data.teamCode === 0){
                this.createShockwave(json.data, colors[7])
                break
            }    
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
        else if(json.op === "CONNECT"){            
            let state = this.state
            state.lobby.members.forEach(member => member.allowSendTo = (member.cxId !== state.user.cxId)
            )
        }
        else if(json.op === "END_MATCH")
        {
            let state = this.state
            state.user.isReady = false;
            state.user.presentSinceStart = false;
            showJoinButton = false;

            let extraJson = {
                colorIndex: this.state.user.colorIndex,
                presentSinceStart: this.state.user.presentSinceStart
            }

            this.bc.lobby.updateReady(this.state.lobby.lobbyId, this.state.user.isReady, extraJson, result => {
                if(result.status === 200){
                    this.setState({screen: "lobby"})
                }
            })
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
        // TODO:  unused now
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

    // Player has clicked to create a shockwave
    onPlayerClicked(pos, mouseButton) {
        console.log("player clicked!")
        
        let toNetId = []
        let reliable = true
        let ordered = false
        let channel = this.bc.relay.CHANNEL_HIGH_PRIORITY_2

        // TODO:  TEMPORARY FIX. Get rid of .team and .opposingTeam, and switch to teamCodes everywhere to make this simpler.
        let teamCode = this.state.user.team === "alpha" ? 1 : 2
        let opponentCode = this.state.user.opposingTeam === "alpha" ? 2 : 1

        if (mouseButton === 0) {
            console.log("Left Click - sending to everyone")
            // TODO:  send to everyone
            this.bc.relay.send(this.createShockwaveJSON(pos, 0), this.bc.relay.TO_ALL_PLAYERS, reliable, ordered, channel)

            this.createShockwave(pos, colors[7])
        }
        else if (mouseButton === 1) {
            console.log("Midle click - sending to opposing team: " + this.state.user.opposingTeam)
            // TODO:  send to opponents
            this.state.lobby.members.forEach(member => {
                if (member.team === this.state.user.opposingTeam) {
                    console.log("found an opp")
                    let netId = this.bc.relay.getNetIdForCxId(member.cxId)
                    toNetId.push(netId)
                }
            })

            toNetId.forEach(netId => {
                this.bc.relay.send(this.createShockwaveJSON(pos, opponentCode), netId, reliable, ordered, channel)
            })

            this.createShockwave(pos, colors[this.state.user.colorIndex])
        }
        else if (mouseButton === 2) {
            console.log("Right click - sending to team " + this.state.user.team)
            // TODO:  send to team mates
            this.state.lobby.members.forEach(member => {
                if (member.team === this.state.user.team) {
                    console.log("found a team mate: " + member.name)
                    let netId = this.bc.relay.getNetIdForCxId(member.cxId)
                    toNetId.push(netId)
                }
            })

            toNetId.forEach(netId => {
                this.bc.relay.send(this.createShockwaveJSON(pos, teamCode), netId, reliable, ordered, channel)
            })

            this.createShockwave(pos, colors[this.state.user.colorIndex])
        }
    }

    connectRelay() {
        
        // If the lobby is gamelift, the port name will be "gamelift"
        let wsPort = 0;
        if (this.state.lobbyType === "CursorPartyGameLift") wsPort = server.connectData.ports.gamelift;
        else wsPort = server.connectData.ports.ws;
        
        presentWhileStarted = false;

        this.bc.relay.registerRelayCallback(this.onRelayMessage.bind(this))
        this.bc.relay.registerSystemCallback(this.onSystemMessage.bind(this))
        this.bc.relay.connect({
            ssl: false,
            host: server.connectData.address,
            port: wsPort,
            passcode: server.passcode,
            lobbyId: server.lobbyId
        }, result => {
            let state = this.state
            state.screen = "game"
            this.setState(state)
        }, error => this.dieWithMessage("Failed to connect to server, msg: " + error))
    }

    updatePresentSinceStart()
    {
        let state = this.state
        state.user.presentSinceStart = true;
        state.user.isReady = true;
        
        let extraJson = {
            colorIndex: this.state.user.colorIndex,
            presentSinceStart: this.state.user.presentSinceStart
        }
        this.bc.lobby.updateReady(this.state.lobby.lobbyId, this.state.user.isReady, extraJson)

    }

    // Create shockwave JSON for to send to lobby members
    createShockwaveJSON(pos, intendedTeam){
        let shockwaveData = {
            x: pos.x,
            y: pos.y,
            teamCode: intendedTeam,
            instigator: this.state.user.team === "alpha" ? 1 : 2
        }
        
        return Buffer.from(JSON.stringify({ op: "shockwave", data: shockwaveData }), 'ascii')
    }

    // Create a shockwave at position and color on the game screen
    createShockwave(pos, color)
    {
        let shockwaves = this.state.shockwaves;
        let shockwave = {
            pos: {x: pos.x * 800, y: pos.y * 600},
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
                            {
                                teamMode ? console.log("teammode loading") : console.log("ffa loading")
                            }
                            {teamMode ? <TeamLobbyScreen user={this.state.user} lobby={this.state.lobby} onBack={this.onGameScreenClose.bind(this)} onTeamChanged={this.onTeamChanged.bind(this)} onStart={this.onStart.bind(this)} onJoin={this.onJoin.bind(this)}/> : <FFALobbyScreen user={this.state.user} lobby={this.state.lobby} onBack={this.onGameScreenClose.bind(this)} onColorChanged={this.onColorChanged.bind(this)} onStart={this.onStart.bind(this)} onJoin={this.onJoin.bind(this)}/>}
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
                            {
                                teamMode ?
                                    <TeamGameScreen user={this.state.user}
                                        lobby={this.state.lobby}
                                        shockwaves={this.state.shockwaves}
                                        relayOptions={this.state.relayOptions}
                                        onBack={this.onGameScreenClose.bind(this)}
                                        onEndMatch={this.onEndMatch.bind(this)}
                                        onPlayerMove={this.onPlayerMove.bind(this)}
                                        onPlayerClicked={this.onPlayerClicked.bind(this)}
                                        onToggleReliable={this.onToggleReliable.bind(this)}
                                        onToggleOrdered={this.onToggleOrdered.bind(this)}
                                        onTogglePlayerMask={this.onTogglePlayerMask.bind(this)} /> :

                                    <FFAGameScreen user={this.state.user}
                                        lobby={this.state.lobby}
                                        shockwaves={this.state.shockwaves}
                                        relayOptions={this.state.relayOptions}
                                        onBack={this.onGameScreenClose.bind(this)}
                                        onEndMatch={this.onEndMatch.bind(this)}
                                        onPlayerMove={this.onPlayerMove.bind(this)}
                                        onPlayerShockwave={this.onPlayerShockwave.bind(this)}
                                        onToggleReliable={this.onToggleReliable.bind(this)}
                                        onToggleOrdered={this.onToggleOrdered.bind(this)}
                                        onTogglePlayerMask={this.onTogglePlayerMask.bind(this)} />
                            }
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
