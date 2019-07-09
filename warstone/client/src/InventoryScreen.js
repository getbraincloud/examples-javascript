import React, { Component } from 'react'
import './InventoryScreen.css'

// Props:
//  text
class InventoryScreen extends Component
{
    onBack()
    {
        this.props.onBack()
    }

    render()
    {
        return (
            <div className="InventoryScreen">
                <p>{this.props.text}</p>
                
                <button type="button" onClick={this.onBack.bind(this)}>Back</button>
            </div>
        )
    }
}

export default InventoryScreen;
