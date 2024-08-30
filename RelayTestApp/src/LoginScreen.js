import React, { Component } from 'react'
// import './style.css'
import packageJson from '../package.json'
import ids from './ids'

// onLogin(user, pass)
class LoginScreen extends Component
{
    onLogin(e) {
        console.log("hello")

        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the login data
        const loginForm = e.target;
        const loginData = new FormData(loginForm);

        const loginJson = Object.fromEntries(loginData.entries());

        if (loginJson.username.trim() === '') {
            alert('Username is required');
        }
        else if (loginJson.password === '') {
            alert('Password is required');
        }
        else {
            this.props.onLogin(loginJson.username.trim(), loginJson.password);
        }
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
            <div className="LoginScreen">
                <div id="login-area">
                    <div id="field-area">
                        <form onSubmit={this.onLogin.bind(this)}>
                            <div id="user-wrapper">
                                Username: <input type="text" name="username" className="input-field" />
                            </div>
                            <div id="pass-wrapper">
                                Password: <input type="password" name="password" className="input-field" />
                            </div>
                            <div>
                            <button className="Button" type="submit">LOG IN</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="bottomText">
                    <p>A user will be created if not already registered.</p>
                    <small className="ver-text">Version: {packageJson.version}{versionSuffix}</small>
                </div>
            </div>
        )
    }
}

export default LoginScreen;
