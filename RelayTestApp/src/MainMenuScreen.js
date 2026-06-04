import React, { Component } from 'react'
import packageJson from '../package.json'
import ids from './ids'

// Props:
//  user
//  appLobbies
//  usePingData
//  lastLobbyType  — previously selected lobby type, used to default the dropdown
//  onPlay
//  onLogout
class MainMenuScreen extends Component
{
    constructor(props) {
        super(props)
        this.state = { usePingData: !!props.usePingData }
    }

    onLogout()
    {
        this.props.onLogout()
    }

    onPlay(e) {
        e.preventDefault();
        const form = e.target
        const formData = new FormData(form)
        const formJson = Object.fromEntries(formData.entries());
        this.props.onPlay(formJson.lobbyTypes, formJson.usePingData === 'on', formJson.relayProtocol)
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

        // Default the dropdown to the last selected lobby type, but only if it is
        // still a valid option; otherwise fall back to the first available lobby.
        let defaultLobbyType = this.props.lastLobbyType
        if (!this.props.appLobbies.some(lobby => lobby.lobby === defaultLobbyType)) {
            defaultLobbyType = this.props.appLobbies.length > 0 ? this.props.appLobbies[0].lobby : ''
        }

        return (
            <div id="main-wrapper">
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
                        <select name="relayProtocol" style={{ marginLeft: '6px' }}>
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
                        <button className="Button" onClick={this.onLogout.bind(this)}>LOG OUT</button>
                        <button className="Button" type="submit">PLAY</button>
                    </div>
                </form>


                <div className="bottomText">
                    <small className="ver-text">Version: {packageJson.version}{versionSuffix}</small>
                </div>
            </div>
        )
    }
}

export default MainMenuScreen;
