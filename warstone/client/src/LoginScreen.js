import React, { Component } from 'react'
import './LoginScreen.css'
import packageJson from '../package.json'
import ids from './ids'

// onLogin(user, pass)
class LoginScreen extends Component
{
    onLogin(e)
    {
        if (this.refs.username.value.trim() === '')
        {
            alert('Username is required');
        }
        else if (this.refs.password.value === '')
        {
            alert('Password is required');
        }
        else
        {
            this.props.onLogin(this.refs.username.value.trim(), this.refs.password.value);
        }
        
        e.preventDefault();
    }

    render()
    {
        let versionSuffix = (ids.url) ? " - dev" : " - prod"
        return (
            <div className="LoginScreen">
                <form>
                    <p>Username:</p>
                    <input type="text" ref="username" placeholder="username"/><br/>
                    <p>Password:</p>
                    <input type="password" ref="password" placeholder="password"/><br/>
                    <p>User will be created if not already registered</p>
                    <input type="submit" value="Login" onClick={this.onLogin.bind(this)}/><br/>
                </form>
                <small>Version: {packageJson.version}{versionSuffix}</small>
            </div>
        )
    }
}

export default LoginScreen;
