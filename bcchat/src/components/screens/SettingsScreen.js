import React, { Component } from 'react';
import './SettingsScreen.css';
import Theme from '../../Theme';
import Dropzone from 'react-dropzone';

// Props
//  user {}
//  onDismiss
//  onSettingsChanged
class SettingsScreen extends Component
{
    constructor()
    {
        super();

        this.picUrl = null;
        this.imgReader = null;
        this.imgFile = null;
    }
    onKeyPress(e)
    {
        if (e.key === "Escape")
        {
            this.props.onDismiss();
        }
    }

    onClickedOuside(e)
    {
        if (e.target === this.refs.SettingsScreen)
        {
            this.props.onDismiss();
        }
    }

    onCloseClicked()
    {
        this.props.onDismiss();
    }

    componentDidMount()
    {
        document.addEventListener('keydown', this.onKeyPress.bind(this));
    }

    handleSubmit(e)
    {
        let settings = {
            name: this.refs.name.value,
            picFile: this.imgFile
        };
        if (this.props.onSettingsChanged)
        {
            this.props.onSettingsChanged(settings);
        }
        
        this.props.onDismiss();
        e.preventDefault();
    }

    onImageLoaded()
    {
        this.refs.image.src = this.imgReader.result;
        this.imgReader = null;
    }

    onDrop(acceptedFiles, rejectedFiles)
    {
        console.log(acceptedFiles, rejectedFiles);

        let file = acceptedFiles[0];
        if (!file) return;

        this.imgFile = file;
        this.imgReader = new FileReader();
        this.imgReader.readAsDataURL(file);
        this.imgReader.onloadend = this.onImageLoaded.bind(this);
    }
    
    render()
    {
        return (
            <div className="SettingsScreen" ref="SettingsScreen" onClick={this.onClickedOuside.bind(this)} >
                <div className="form" style={{...Theme.FormStyle, marginTop:"25vh", textAlign:"left"}}>
                    <h1 className="noselect" style={{...Theme.DefaultStyle}}>
                        Settings
                        <div className="closeBtn noselect" onClick={this.onCloseClicked.bind(this)}>X</div>
                    </h1>
                    <form onSubmit={this.handleSubmit.bind(this)}>
                        <div className="block">
                            <label>Profile Picture:</label><br/>
                            <img className="dropZonePic" ref="image" alt="" src={this.props.user.pic} width="128" height="128"/>
                            <div className="dropZone"><Dropzone accept="image/*" onDrop={this.onDrop.bind(this)} /></div>
                        </div>
                        <div className="block">
                            <label>Name:</label>
                            <input type="text" ref="name" placeholder="name" style={{...Theme.TextInputStyle}} defaultValue={this.props.user.name} />
                        </div>
                        <input type="submit" value="Save"
                            style={{...Theme.ButtonStyle, display:"block", margin:"16px 0px 16px auto"}} />
                    </form>
                </div>
            </div>
        );
    }
}

export default SettingsScreen;
