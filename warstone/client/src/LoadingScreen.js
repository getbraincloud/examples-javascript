import React, { Component } from 'react'
import './style.css'

// Props:
//  text
class LoadingScreen extends Component
{
    onBack()
    {
        this.props.onBack()
    }

    render()
    {
        if (this.props.text !== "Logging in...")
        {
            return (
                <div className="LoadingScreen">
                    <p>{this.props.text}</p>
                    <button id="btn-blue" onClick={this.onBack.bind(this)}>Cancel</button>
                </div>
            )
        }
        else
        {
            return (
                <div className="LoadingScreen">
                    <p>{this.props.text}</p>
                </div>
            )
        }
        
    }
}

export default LoadingScreen;
