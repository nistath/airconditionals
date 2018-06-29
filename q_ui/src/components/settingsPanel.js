import React, { Component } from "react";
import GaugeContainer from './settingsPanel/gaugeContainer';


export default class SettingsPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value : -20
        }
        this._set = this._set.bind(this);
    }

    _set() {
        this.setState({value:32});
    }
    render() {
        return (
            <div className="settings_panel" onClick={this._set}>
                <GaugeContainer id="ac" min={-100} max={100} width={400} height={200} data={4} label=""/>
                <GaugeContainer id="hum" min={-100} max={100} width={400} height={200} data={4} label=""/>
                <GaugeContainer id="light" min={0} max={100} width={280} height={180} data={this.state.value} label="">
                <div className="blinds">Blinds open: 
                    <span style={{color:this.props.settings.blinds_open ? "#48e908" : "red"}}> 
                        {this.props.settings.blinds_open ? "Yes" : "No"}
                    </span>
                </div>
                </GaugeContainer>
            </div>
        );
    }
}