import React, { Component } from 'react';
import './AddButton.css';

// Props:
//  onClicked()
//  addText
class AddButton extends Component
{
    onClicked(e)
    {
        this.props.onClicked();
    }

    render()
    {
        return (
            <div className="AddButton noselect" onClick={this.onClicked.bind(this)}>
                {this.props.addText ? this.props.addText : "+"}
            </div>
        );
    }
}

export default AddButton;
