import React, { Component } from 'react'
import './style.css'
import packageJson from '../package.json'
import ids from './ids'

// onLogin(user, pass)
class LoginScreen extends Component {
    onLogin(e) {
        if (this.refs.username.value.trim() === '') {
            alert('Username is required');
        }
        else if (this.refs.password.value === '') {
            alert('Password is required');
        }
        else {
            this.props.onLogin(this.refs.username.value.trim(), this.refs.password.value);
        }

        e.preventDefault();
    }

    componentDidMount() {
        this.props.onLoad();
    }

    render() {
        let versionSuffix = (ids.url) ? " - dev" : " - prod"
        return (
            <div className="LoginScreen">
                <div id="login-area">
                    <div id="field-area">
                        <form>
                            <div id="user-wrapper">
                                Username: <input type="text" ref="username" name="Username" class="input-field" />
                            </div>
                            <div id="pass-wrapper">
                                Password: <input type="password" ref="password" name="Password" class="input-field" />
                            </div>
                        </form>
                    </div>
                    <input type="submit" name="submit" value="LOG IN" id="btn-login" onClick={this.onLogin.bind(this)} />
                </div>

                <div class="bottomText">
                    <p>A user will be created if not already registered.</p>
                    <p class="ver-text">Version: {packageJson.version}{versionSuffix}</p>
                </div>
            </div>
        )
    }
}

export default LoginScreen;
