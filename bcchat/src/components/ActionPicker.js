import React, { Component } from 'react';
import './ActionPicker.css';

// Props:
//  actions []
//  onAction("");
class ActionPicker extends Component
{
    constructor()
    {
        super();
        this.state = {
            visible: false,
            right: 0,
            top: 0
        };
    }

    onClickedOuside()
    {
        this.close();
    }

    onKeyPress(e)
    {
        if (e.key === "Escape")
        {
            this.close();
        }
    }

    onActionClicked(action, e)
    {
        this.close();
        this.props.onAction(action);
    }

    componentDidMount()
    {
        document.addEventListener('keydown', this.onKeyPress.bind(this));
    }

    close()
    {
        let state = this.state;
        state.visible = false;
        this.setState(state);
    }

    open()
    {
        let state = this.state;
        state.visible = true;

        let parentRect = this.refs.ActionPicker.getClientRects()[0];
        state.right = parentRect.right - 44;
        state.top = parentRect.top;
        state.height = this.props.actions.length * 48 + 6;
        
        this.setState(state);
    }

    render()
    {
        if (this.state.visible)
        {
            return (
                <div className="ActionPicker" ref="ActionPicker">
                    <div className="ActionPicker-ScreenBlocker" onClick={this.onClickedOuside.bind(this)} />
                    <div className="ActionPicker-Panel-Container">
                        <div className="ActionPicker-Panel" style={{top:Math.min(document.body.clientHeight - this.state.height, this.state.top) + "px", right:"calc(100vw - " + this.state.right + "px)"}}>
                            {
                                this.props.actions.map(action => (<div key={action} ref={action} onClick={this.onActionClicked.bind(this, action)} className="ActionPicker-ActionItem no-select">{action}</div>))
                            }
                        </div>
                    </div>
                </div>
            );
        }
        else
        {
            return (
                <div className="ActionPicker" ref="ActionPicker">
                </div>
            );
        }
    }
}

export default ActionPicker;
