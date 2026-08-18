import React, { Component } from 'react'
import packageJson from '../package.json'
import ids from './ids'
import GlobalChatPanel from './GlobalChatPanel'
import LeaderboardPanel from './LeaderboardPanel'

// Props:
//  user
//  appLobbies
//  usePingData
//  lastLobbyType  — previously selected lobby type, used to default the dropdown
//  defaultProtocol — ?protocol= URL override for the relay protocol dropdown (e.g. "wss")
//  bcWrapper
//  onPlay
//  onLogout
class MainMenuScreen extends Component
{
    constructor(props) {
        super(props)
        this.state = { usePingData: !!props.usePingData, rightTab: 'leaderboard' }
    }

    onLogout()
    {
        this.props.onLogout()
    }

    onPlay(e) {
        console.log('[DEBUG] MainMenuScreen.onPlay fired') // TEMP diagnostic — remove once Play navigation is confirmed working
        e.preventDefault();
        const form = e.target
        const formData = new FormData(form)
        const formJson = Object.fromEntries(formData.entries());
        console.log('[DEBUG] onPlay form values', formJson) // TEMP diagnostic
        this.props.onPlay(formJson.lobbyTypes, formJson.usePingData === 'on', formJson.relayProtocol)
    }

    setRightTab(tab) {
        this.setState({ rightTab: tab })
    }

    render()
    {
        let versionSuffix = ""
        switch(ids.url){
            case "https://api.internal.braincloudservers.com":
                versionSuffix = " - internal"
                break
            case "https://api.internalg.braincloudservers.com":
                versionSuffix = " - internalg"
                break
            case "https://api.internala.braincloudservers.com":
                versionSuffix = " - internala"
                break
            default:
                versionSuffix = " - prod"
                break
        }

        // Default the dropdown to the last selected lobby type (or a ?lobbyType= URL
        // override, matched case-insensitively so links don't need exact casing), but
        // only if it is still a valid option; otherwise fall back to the first lobby.
        let defaultLobbyType = this.props.lastLobbyType
        const matchedLobby = this.props.appLobbies.find(lobby =>
            lobby.lobby.toLowerCase() === (defaultLobbyType || '').toLowerCase())
        defaultLobbyType = matchedLobby
            ? matchedLobby.lobby
            : (this.props.appLobbies.length > 0 ? this.props.appLobbies[0].lobby : '')

        // Default the protocol dropdown to a ?protocol= URL override (e.g. "wss" for
        // testing), matched case-insensitively; falls back to "ws" if absent/invalid.
        const validProtocols = ['ws', 'wss']
        const urlProtocol = (this.props.defaultProtocol || '').toLowerCase()
        const defaultProtocol = validProtocols.includes(urlProtocol) ? urlProtocol : 'ws'

        return (
            <div id="main-wrapper">
                <div className="CardsRow">
                    <div className="Card">
                        <form onSubmit={this.onPlay.bind(this)}>
                            <p className="text-small">Logged in as {this.props.user.name}</p>
                            <label>Choose lobby type:</label>
                            <select name="lobbyTypes" defaultValue={defaultLobbyType}>
                                {
                                    this.props.appLobbies.map((lobby, index) =>
                                        <option key={index} value={lobby.lobby}>{lobby.lobby}</option>
                                    )
                                }
                            </select>
                            <div style={{ margin: '8px 0' }}>
                                <label>Protocol:</label>
                                <select name="relayProtocol" style={{ marginLeft: '6px' }} defaultValue={defaultProtocol}>
                                    <option value="ws">WS (WebSocket)</option>
                                    <option value="wss">WSS (WebSocket Secure)</option>
                                </select>
                            </div>
                            <div style={{ margin: '8px 0' }}>
                                <input
                                    type="checkbox"
                                    id="usePingData"
                                    name="usePingData"
                                    defaultChecked={this.state.usePingData}
                                />
                                <label htmlFor="usePingData" style={{ marginLeft: '6px' }}>
                                    With Ping Region Data
                                </label>
                            </div>
                            <div className="btn-frame">
                                <button className="Button" type="button" onClick={this.onLogout.bind(this)}>LOG OUT</button>
                                <button className="Button ButtonPrimary" type="submit">PLAY</button>
                            </div>
                        </form>
                    </div>

                    <div className="Card CardRight">
                        <div className="CardTabRow">
                            <button
                                className={`CardTabBtn${this.state.rightTab === 'leaderboard' ? ' active' : ''}`}
                                onClick={this.setRightTab.bind(this, 'leaderboard')}
                            >LEADERBOARD</button>
                            <button
                                className={`CardTabBtn${this.state.rightTab === 'chat' ? ' active' : ''}`}
                                onClick={this.setRightTab.bind(this, 'chat')}
                            >CHAT</button>
                        </div>
                        {this.state.rightTab === 'leaderboard' ? (
                            <LeaderboardPanel bcWrapper={this.props.bcWrapper} />
                        ) : (
                            <GlobalChatPanel bcWrapper={this.props.bcWrapper} />
                        )}
                    </div>
                </div>

                <div className="bottomText">
                    <small className="ver-text">Version: {packageJson.version}{versionSuffix}</small>
                </div>
            </div>
        )
    }
}

export default MainMenuScreen;
