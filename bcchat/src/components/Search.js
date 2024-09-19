import React, { Component } from 'react';
import Theme from '../Theme';

// Props:
//  placeholder
//  minCharCount
//  onClearSearch()
//  onSearch(text)
class Search extends Component
{
    constructor()
    {
        super();

        this.locked = false;
        this.searchText = "";
        this.currentText = "";

        this.txtNameRef = React.createRef()
    }

    onTextChanged()
    {
        this.currentText = this.txtNameRef.current.value;
        if (!this.locked)
        {
            this.updateSearch();
        }
    }

    updateSearch()
    {
        this.searchText = this.currentText;
        if (this.searchText.length < (this.props.minCharCount ? this.props.minCharCount : 1))
        {
            this.props.onClearSearch();
        }
        else
        {
            this.locked = true;
            this.props.onSearch(this.searchText, this.unlock.bind(this));
        }
    }

    componentDidMount()
    {
        this.txtNameRef.current.value = "";
        this.searchText = "";
        this.currentText = "";
        this.locked = false;

        if (this.props.autofocus)
        {
            this.txtNameRef.current.focus();
        }
    }

    unlock()
    {
        this.locked = false;
        if (this.searchText !== this.currentText)
        {
            this.updateSearch();
        }
    }

    render()
    {
        return (
            <input type="text" ref={this.txtNameRef} placeholder={this.props.placeholder}
                        style={{...Theme.TextInputStyle, display:"block", margin:"16px 0"}}
                        onChange={this.onTextChanged.bind(this)} />
        );
    }
}

export default Search;
