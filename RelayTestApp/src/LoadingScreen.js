import React, { Component } from 'react'

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
        if (this.props.onBack)
        {
            return (
                <div className="LoadingScreen">
                    <p>{this.props.text}</p>
                    <button className="Button" onClick={this.onBack.bind(this)}>Cancel</button>
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
