import React, { Component } from 'react';
import Theme from '../../Theme';

// Props:
//  onSubmitName({firstname, lastname})
class EnterNameScreen extends Component
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
        if (this.refs.firstname.value === '')
        {
            alert('First name is required');
        }
        else if (this.refs.lastname.value === '')
        {
            alert('Last name is required');
        }
        else
        {
            this.setState({name:{
                firstname: this.refs.firstname.value,
                lastname: this.refs.lastname.value
            }}, function() {
                this.props.onSubmitName(this.state.name);
            });
        }
        
        e.preventDefault();
    }

    render()
    {
        return (
            <div style={{...Theme.FormStyle, marginTop:"25vh"}}>
                <h1 style={{...Theme.DefaultStyle, display:"block"}}>
                    Enter Name
                </h1>
                <p style={{...Theme.DefaultStyle, color:Theme.DarkTextColor, display:"block"}}>
                    Please enter your full name.
                </p>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <input type="text" ref="firstname" placeholder="First name"
                        style={{...Theme.TextInputStyle, display:"block", margin:"16px 0"}} />
                    <input type="text" ref="lastname" placeholder="Last name"
                        style={{...Theme.TextInputStyle, display:"block", margin:"16px 0"}} />
                    <input type="submit" value="Submit"
                        style={{...Theme.ButtonStyle, display:"block", margin:"16px 0px 16px auto"}} />
                </form>
            </div>
        );
    }
}

export default EnterNameScreen;
