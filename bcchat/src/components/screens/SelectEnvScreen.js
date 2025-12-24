import React, { Component } from 'react';
import Theme from '../../Theme';

class SelectEnvScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedEnvName: null
        };
    }

    onEnvSelected = () => {
        const env = this.props.envs.find(e => e.name === this.state.selectedEnvName);
        this.props.onEnvSelected(env);
    };

    setSelected = (envName) => {
        this.setState({ selectedEnvName: envName });
    };

    render() {
        const { envs, loading } = this.props;
        const { selectedEnvName } = this.state;

        if (loading) {
            return (
                <div style={Theme.ListContainer}>
                    <p style={Theme.SubtleText}>Loading environments...</p>
                </div>
            );
        }

        console.log(`SelectEnvScreen: envs ${JSON.stringify(envs)}`);

        return (
            <div style={Theme.ListContainer}>
                <h2>Select Environment</h2>

                <ul style={Theme.List}>
                    {envs.map(env => (
                        <li
                            key={env.name}
                            style={{
                                ...Theme.ListItem,
                                ...(selectedEnvName === env.name
                                    ? Theme.SelectedListItem
                                    : {})
                            }}
                            onClick={() => this.setSelected(env.name)}
                        >
                            {env.name}
                        </li>
                    ))}
                </ul>

                <button
                    disabled={!selectedEnvName}
                    style={{
                        ...Theme.ButtonSecondaryStyle,
                        opacity: selectedEnvName ? 1 : 0.5
                    }}
                    onClick={this.onEnvSelected}
                >
                    Continue
                </button>
            </div>
        );
    }
}

export default SelectEnvScreen;
