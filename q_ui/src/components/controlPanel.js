import React, { Component } from "react";
import InfoBox from "./controlPanel/infoBox";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export default class ControlPanel extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let dropdownOptions = this.props.scenarios.map(s => {return {label:s.name, value:s.id}});

        return (
            <div className="control_panel">

                <div className="row gap"/>
                <div className="row content" id="row1">
                    <div className="circle"/>
                    <div className="tag">Scenario selection</div>
                    <div className="row__int">
                        <Dropdown options={dropdownOptions} value={dropdownOptions[this.props.currentScenario]}  placeholder="Select scenario" onChange={this.props.onSelect}/>
                        <div className="scenario_info">
                            <p>
                                Current: {this.props.scenarios[this.props.currentScenario].name}
                                <br/>
                                Info: {this.props.scenarios[this.props.currentScenario].desc}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="row gap"/>
                <div className="row content" id="row2">
                    <div className="circle"/>
                    <div className="tag">External conditions</div>
                    <InfoBox title="Temperature" data="20°C"/>
                    <InfoBox title="Humidity" data="30%"/>
                    <InfoBox title="Brightness" data="420 Lux"/>
                </div>

                <div className="row gap"/>
                <div className="row content">
                    <div className="tag">Internal conditions</div>
                    <div className="circle"/>
                </div>

                <div className="row gap"/>
                <div className="row content">
                    <div className="tag">Target conditions</div>
                    <div className="circle"/>
                </div>

                <div className="row gap"/>
                <div className="row content">
                    <div className="circle"/>
                </div>
            </div>
        );
    }
}