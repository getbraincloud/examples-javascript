import React, { Component } from 'react';
import Theme from '../../Theme';

// Props:
//  games [bcchat", ...]
//  onLogin({username, password, appName})
class LogInScreen extends Component
{
    constructor()
    {
        super();
        this.state = {
            login: {}
        };
    }

    handleSubmit(e)
    {
        if (this.refs.username.value === '')
        {
            alert('Username is required');
        }
        else if (this.refs.password.value === '')
        {
            alert('Password is required');
        }
        else
        {
            this.setState({login:{
                username: this.refs.username.value,
                password: this.refs.password.value,
                appName: this.refs.appName.value
            }}, function() {
                this.props.onLogin(this.state.login);
            });
        }
        
        e.preventDefault();
    }

    render()
    {
        return (
            <div style={{...Theme.FormStyle, marginTop:"25vh"}}>
                <h1 style={{...Theme.DefaultStyle, display:"block"}}>
                    LOG IN
                </h1>
                <p style={{...Theme.DefaultStyle, color:Theme.DarkTextColor, display:"block"}}>
                    A new user will be created if it doesn't exist. 
                </p>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <select name="app" ref="appName" style={{...Theme.TextInputStyle, display:"block", margin:"16px 0"}}>
                        {
                            this.props.games.map(app =>
                            {
                                return (
                                    <option key={app} value={app} style={{...Theme.TextInputStyle, display:"block", margin:"16px 0"}}>
                                        {app}
                                    </option>
                                )
                            })
                        }
                    </select>
                    <input type="text" ref="username" placeholder="Username"
                        style={{...Theme.TextInputStyle, display:"block", margin:"16px 0"}} />
                    <input type="password" ref="password" placeholder="Password"
                        style={{...Theme.TextInputStyle, display:"block", margin:"16px 0"}} />
                    <input type="submit" value="Login"
                        style={{...Theme.ButtonStyle, display:"block", margin:"16px 0px 16px auto"}} />
                </form>
            </div>
        );
    }
}

export default LogInScreen;
