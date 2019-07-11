import React, { Component } from 'react'
import './LoadingScreen.css'

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
        return (
            <div className="LoadingScreen">
                <p>{this.props.text}</p>
                <button type="button" onClick={this.onBack.bind(this)}>Cancel</button>
            </div>
        )
    }
}

export default LoadingScreen;
