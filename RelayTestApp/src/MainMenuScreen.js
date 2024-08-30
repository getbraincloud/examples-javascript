import React, { Component } from 'react'
import packageJson from '../package.json'
import ids from './ids'

// Props:
//  user
//  onPlay
//  onInventory
//  onHowTo
class MainMenuScreen extends Component
{
    onLogout()
    {
        this.props.onLogout()
    }
    
    onPlay(e) {
        
        // Prevent the browser from reloading the page
        e.preventDefault();

        const form = e.target
        const formData = new FormData(form)

        const formJson = Object.fromEntries(formData.entries());

        this.props.onPlay(formJson.lobbyTypes)
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
        return (
            <div id="main-wrapper">
                <form onSubmit={this.onPlay.bind(this)}>
                    <p className="text-small">Logged in as {this.props.user.name}</p>
                    <label>Choose lobby type:</label>
                    <select name="lobbyTypes">
                        {
                            this.props.appLobbies.map((lobby, index) =>
                                <option key={index} value={lobby.lobby}>{lobby.lobby}</option>
                            )
                        }

                        {/** Game Lift usage requires additional configuration (i.e. using pings/regions) that has not yet been added to the other versions, so this lobby type is added manually */}
                        <option value="CursorPartyGameLift">CursorPartyGameLift</option>
                    </select>
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
