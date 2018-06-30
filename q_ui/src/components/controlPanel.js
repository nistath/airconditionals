import React, { Component } from "react";
import InfoBox from "./controlPanel/infoBox";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import SpeedSlider from "./controlPanel/speedSlider";

export default class ControlPanel extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.currentScenario !== this.props.currentScenario
    }

    render() {
        let dropdownOptions = this.props.scenarios.map(s => {return {label:s.name, value:s.id}});
        let scenario = this.props.scenarios[this.props.currentScenario];
        return (
            <div className="control_panel">

                <div className="row gap"/>
                <div className="row content" id="row1">
                    <div className="circle"/>
                    <div className="tag">Simulation settings</div>
                    <div className="row__int">
                        <Dropdown options={dropdownOptions} value={dropdownOptions[this.props.currentScenario]}  placeholder="Select scenario" onChange={this.props.onSelect}/>
                        <SpeedSlider/>
                        <span className="label">Simulation speed</span>
                    </div>
                </div>

                <div className="row gap"/>
                <div className="row content" id="row2">
                    <div className="circle"/>
                    <div className="tag">External conditions</div>
                    <InfoBox title="Temperature" data={scenario.external.temperature + "°C"}/>
                    <InfoBox title="Humidity" data={scenario.external.humidity + "%"}/>
                    <InfoBox title="Brightness" data={scenario.external.light + ""}/>
                </div>

                <div className="row gap"/>
                <div className="row content" id="row3">
                    <div className="circle"/>
                    <div className="tag">Internal conditions</div>
                    <InfoBox title="Temperature" data={scenario.internal.temperature + "°C"}/>
                    <InfoBox title="Humidity" data={scenario.internal.humidity + "%"}/>
                    <InfoBox title="Brightness" data={scenario.internal.light + ""}/>
                    <InfoBox title="Population" data={scenario.internal.population + ""}/>
                </div>

                <div className="row gap"/>
                <div className="row content" id="row4">
                    <div className="tag">Set points</div>
                    <div className="circle"/>
                    <InfoBox title="Temperature" type={1} data={"°C"}/>
                    <InfoBox title="Humidity" type={1} data={"%"}/>
                    <InfoBox title="Brightness" type={1} data={"Lux"}/>
                </div>

                <div className="row gap"/>
                <div className="row content" id="row5" onClick={this.props.onClick}>
                    <div className="circle"/>
                    <p>Execute</p>
                </div>
            </div>
        );
    }
}