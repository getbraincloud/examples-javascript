import React, { Component } from 'react';
import Theme from '../Theme';

// Props:
//  defaultText ""
//  placeholder ""
//  onTextEntered("")
class MultilineTextInput extends Component
{
    onKeyDown(e)
    {
        if (e.key === "Enter")
        {
            if (!e.ctrlKey && !e.shiftKey)
            {
                let message = this.refs.TextArea.value.trim();
                this.refs.TextArea.value = "";

                if (message.length > 0)
                {
                    // Notity
                    this.props.onTextEntered(message);
                }

                e.preventDefault();
            }
        }
    }

    render()
    {
        return (
            <div style={{
                    backgroundColor:Theme.TabColor, 
                    borderTop:"1px solid " + Theme.TrimColor, 
                    width:"calc(100% - 8px)", 
                    height:"calc(100% - 8px)",
                    padding:"4px"
                }}>
                <textarea ref="TextArea" placeholder={this.props.placeholder ? this.props.placeholder : "Enter text here - /me Message that will not persist in history"}
                    style={{
                        ...Theme.TextInputStyle,
                        fontFamily:"sans-serif",
                        fontSize:"10pt",
                        resize:"none",
                        width:"calc(100%)", 
                        height:"calc(100%)"
                    }}
                    onKeyPress={this.onKeyDown.bind(this)}
                    defaultValue={this.props.defaultText ? this.props.defaultText : ""} />
            </div>
        );
    }
}

export default MultilineTextInput;
