import React, { Component } from "react";
import GaugeContainer from './settingsPanel/gaugeContainer';


export default class SettingsPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value : 50
        }
        this._set = this._set.bind(this);
    }

    _set() {
        this.setState({value:-50});
    }
    render() {
        return (
            <div className="settings_panel" onClick={this._set}>
                <GaugeContainer id="ac" min={-100} max={100} data={this.state.value}/>
            </div>
        );
    }
}