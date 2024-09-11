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

    handleSubmit(e) {
        
        // Prevent the browser from reloading the page
        e.preventDefault();

        // Read the form data
        const form = e.target;
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson);
        console.log("Username: " + formJson.username)
        console.log("Password: " + formJson.password)
        console.log("App Name: " + formJson.app)

        if (formJson.username === '') {
            alert('Username is required');
        }
        else if (formJson.password === '') {
            alert('Password is required');
        }
        else {
            this.setState({
                login: {
                    username: formJson.username,
                    password: formJson.password,
                    appName: formJson.app
                }
            }, function () {
                this.props.onLogin(this.state.login);
            });
        }
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
                    <select name="app" style={{...Theme.TextInputStyle, display:"block", margin:"16px 0"}}>
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
                    <input type="text" name="username" placeholder="Username" style={{...Theme.TextInputStyle, display:"block", margin:"16px 0"}} />
                    <input type="password" name="password" placeholder="Password" style={{...Theme.TextInputStyle, display:"block", margin:"16px 0"}} />
                    <input type="submit" value="Login" style={{...Theme.ButtonStyle, display:"block", margin:"16px 0px 16px auto"}} />
                </form>
            </div>
        );
    }
}

export default LogInScreen;
