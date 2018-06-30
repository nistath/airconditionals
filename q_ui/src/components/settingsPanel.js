import React, { Component } from "react";
import GaugeContainer from './settingsPanel/gaugeContainer';


export default class SettingsPanel extends Component {

    render() {
        return (
            <div className="settings_panel">
                <GaugeContainer id="ac" min={-100} max={100} width={400} height={200} transitionDuration={this.props.transitionDuration} data={this.props.settings.ac} label="A/C"/>
                <GaugeContainer id="hum" min={-100} max={100} width={400} height={200} transitionDuration={this.props.transitionDuration} data={this.props.settings.humidity} label="Humidity"/>
                <GaugeContainer id="light" min={0} max={100} width={280} height={180} transitionDuration={this.props.transitionDuration} data={this.props.settings.light} label="Lighting">
                <div className="blinds">Blinds open: 
                    <span style={{color:this.props.settings.blinds_open ? "#48e908" : "red"}}> 
                        {this.props.settings.blinds_open ? "Y" : "N"}
                    </span>
                </div>
                </GaugeContainer>
            </div>
        );
    }
}