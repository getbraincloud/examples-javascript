import React, { Component } from 'react'
import './App.css'
import LoginScreen from './LoginScreen';
import LoadingScreen from './LoadingScreen';
import MainMenuScreen from './MainMenuScreen';
import GameScreen from './GameScreen';
import ids from './ids'; // CREATE ids.js AND EXPORT appId, appSecret and url
import HowToScreen from './HowToScreen';

let brainCloud = require("braincloud")

let appId = ids.appId
let appSecret = ids.appSecret
let url = ids.url

class App extends Component {
    constructor() {
        super()

        this.initBC()
        this.state = this.makeDefaultState()
    }

    makeDefaultState() {
        return {
            screen: "login",
            joiningState: "",
            user: null,
            lobby: null,
            server: null
        }
    }

    dieWithMessage(message) {
        // Close RTT connection
        this.bc.rttService.deregisterAllRTTCallbacks()
        this.bc.brainCloudClient.resetCommunication()

        // Pop alert message
        alert(message)

        // Initialize BC libs and start over
        this.initBC()

        // Go back to default login state
        this.setState(this.makeDefaultState())
    }

    initBC() {
        this.bc = new brainCloud.BrainCloudWrapper("warstone")
        this.bc.initialize(appId, appSecret, "1.0.0")
        if (url) this.bc.brainCloudClient.setServerUrl(url)
        this.bc.brainCloudClient.enableLogging(true)
    }

    renderTitle() {
        return (
            <h1>Warstone</h1>
        )
    }

    onLoginClicked(user, pass) {
        this.setState({ screen: "loginIn" })

        // Connect to braincloud
        console.log("BC: authenticateUniversal")
        this.username = user
        this.bc.authenticateUniversal(user, pass, true, this.onLoggedIn.bind(this))
    }

    onAutoLogin() {
        if (false) {
            console.log("BC: authenticateAnonymous")
            this.setState({ screen: "loginIn" })
            this.bc.authenticateAnonymous(this.onLoggedIn.bind(this))
        }
    }

    onLoggedIn(result) {
        console.log(result)
        if (result.status === 200) {
            if (this.username !== "" && this.username !== undefined)
                this.bc.playerState.updateUserName(this.username, result => { })
            else
                this.username = result.data.playerName

            this.setState({})
            this.setState({
                screen: "mainMenu",
                user: {
                    id: result.data.profileId,
                    name: this.username,
                    pic: result.data.pictureUrl
                }
            })
        }
        else {
            this.dieWithMessage("Failed to login");
        }
    }

    onPlayClicked() {
        this.setState({ screen: "lookingForOpponent" })

        // Enable RTT service
        this.bc.rttService.enableRTT(() => {
            console.log("RTT Enabled");

            // Register lobby callback
            this.bc.rttService.registerRTTLobbyCallback(this.onLobbyEvent.bind(this))

            // Find an opponent
            this.bc.lobby.findOrCreateLobby("unranked", 0, 1, { strategy: "ranged-absolute", alignment: "center", ranges: [1000] }, {}, null, {}, true, {}, "", result => {
                if (result.status !== 200) {
                    this.dieWithMessage("Failed to find lobby")
                }
                // Success of lobby found will be in the event onLobbyEvent
            })
        }, () => {
            if (this.state.screen === "lookingForOpponent") {
                this.dieWithMessage("Failed to enable RTT")
            }
        })
    }

    onChooseDeck() {
        this.setState({ screen: "chooseDeck" })
    }

    onHowToClicked() {
        this.setState({ screen: "howToPlay" })
    }

    onMainMenu() {
        this.setState({ screen: "mainMenu" })
    }

    onCancelFindToMainMenu() {
        // cancel the find request
        var cxId = String(this.bc.rttService.getRTTConnectionId());
        console.log(cxId);
        this.bc.lobby.cancelFindRequest("unranked", result => {
            // go back to main menu
            this.setState({ screen: "mainMenu" })
        }, () => {
                // go back to main menu
                this.setState({ screen: "mainMenu" })
            })

        this.setState({ screen: "mainMenu" })
    }

    onLobbyEvent(result) {
        if (result.data.lobby) {
            this.setState({ lobby: { ...result.data.lobby, lobbyId: result.data.lobbyId }, joiningState: result.data.lobby.state })
        }
        if (result.data.connectData) {
            this.setState({ server: result.data })
        }

        if (result.operation === "DISBANDED") {
            if (result.data.reason.code === 80101) {
                // Start the game!
                this.setState({ screen: "game" })
            }
            else {
                this.onGameScreenClose()
            }
        }
    }

    onGameScreenClose() {
        this.bc.rttService.deregisterAllRTTCallbacks()
        this.bc.rttService.disableRTT()

        this.setState({
            screen: "mainMenu",
            joiningState: "",
            lobby: null,
            server: null
        })
    }

    render() {
        switch (this.state.screen) {
            case "login":
                {
                    return (
                        <div className="App">
                            {this.renderTitle()}
                            <LoginScreen onLogin={this.onLoginClicked.bind(this)}
                                onLoad={this.onAutoLogin.bind(this)} />
                        </div>
                    )
                }
            case "loginIn":
                {
                    return (
                        <div className="App">
                            {this.renderTitle()}
                            <LoadingScreen text="Logging in..." />
                        </div>
                    )
                }
            case "mainMenu":
                {
                    return (
                        <div className="App">
                            {this.renderTitle()}
                            <MainMenuScreen user={this.state.user}
                                onPlay={this.onPlayClicked.bind(this)}
                                onHowTo={this.onHowToClicked.bind(this)} />
                        </div>
                    )
                }
            case "lookingForOpponent":
                {
                    return (
                        <div className="App">
                            {this.renderTitle()}
                            <LoadingScreen text={`Looking for Opponent... ${this.state.joiningState}`}
                                onBack={this.onCancelFindToMainMenu.bind(this)} />
                            {
                                this.state.lobby ? (
                                    <div style={{ margin: "0 auto" }}>
                                        <p>Lobby: {this.state.lobby.id}</p>
                                        <ul>
                                            {(this.state.lobby ? (this.state.lobby.members.map(member => (<li>{member.team + ": " + member.name}</li>))) : (""))}
                                        </ul>
                                    </div>
                                ) : ""
                            }
                        </div>
                    )
                }
            case "game":
                {
                    return (
                        <div className="App">
                            {this.renderTitle()}
                            <GameScreen user={this.state.user}
                                lobby={this.state.lobby}
                                server={this.state.server}
                                onClose={this.onGameScreenClose.bind(this)} />
                        </div>
                    )
                }
            case "howToPlay":
                {
                    return (
                        <div className="App">
                            <HowToScreen onBack={this.onMainMenu.bind(this)} />
                        </div>
                    )
                }
            default:
                {
                    return (
                        <div className="App">
                            {this.renderTitle()}
                            Invalid state
                        </div>
                    )
                }
        }
    }
}

export default App;
