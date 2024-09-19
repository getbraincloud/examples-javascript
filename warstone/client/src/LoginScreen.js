import React, { Component } from 'react'
import './style.css'
import packageJson from '../package.json'
import ids from './ids'

// onLogin(user, pass)
class LoginScreen extends Component {
    
    onLogin(e) {

        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries())

        console.log(JSON.stringify(formJson))

        console.log("Username: " + formJson.username)
        console.log("Password: " + formJson.password)

        if (formJson.username === '') {
            alert('Username is required');
        }
        else if (formJson.password === '') {
            alert('Password is required');
        }
        else {
            this.props.onLogin(formJson.username, formJson.password);
        }
    }

    componentDidMount() {
        this.props.onLoad();
    }

    render() {
        let versionSuffix = (ids.url) ? " - dev" : " - prod"
        return (
            <div className="LoginScreen">
                <form onSubmit={this.onLogin.bind(this)}>
                    <div id="login-area">
                        <div id="field-area">
                            <div id="user-wrapper" style={{ marginTop: 24 }}>
                                Username: <input type="text" name="username" className="input-field" />
                            </div>
                            <div id="pass-wrapper">
                                Password: <input type="password" name="password" className="input-field" />
                            </div>
                        </div>

                        <div>
                            <button type="submit" id="btn-login">LOG IN</button>
                        </div>
                    </div>

                    <div className="bottomText">
                        <p>A user will be created if not already registered.</p>
                        <p className="ver-text">Version: {packageJson.version}{versionSuffix}</p>
                    </div>
                </form>
            </div>
        )
    }
}

export default LoginScreen;
