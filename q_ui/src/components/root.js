import React, { Component } from "react";

import ResultBox from "./resultBox";
import ControlPanel from "./controlPanel";
import SettingsPanel from "./settingsPanel";
import "../css/index.css";

let state= {
    scenarios : [
        {
            id : 0,
            name: "Scenario 1",
            desc: "Description example 1",
            external : {
                temperature: 30,
                humidity:30,
                light:50,
                forecast : {
                }
            },
            internal : {
                temperature: 29,
                humidity: 50,
                light:10,
                population: 2
            }
        },
        {
            id : 1,
            name: "Scenario 2",
            desc: "Description example 2",
            external : {
                temperature: 20,
                humidity:60,
                light:30,
                forecast :{
    
                }
            },
            internal : {
                temperature: 26,
                humidity: 10,
                light:70,
                population: 4
            }
        },
    ],

    resultData : {
        isReal: true,
        naive : {
            value: 1230,
            unit: "W"
        },
        optimized : {
            value: 564,
            unit : "W"
        },
    
        savings : {
            value:1434,
            unit: "€"
        }
    },

    settings : {
        ac:-50,
        humidity:20,
        light:60,
        blinds_open:true
    }
}


let inactiveResultData = {
    isReal: false,
    naive : {
        value: 0,
        unit: "W"
    },
    optimized : {
        value: 0,
        unit : "W"
    },

    savings : {
        value:0,
        unit: "€"
    }
}

let inactiveSettings = {
    ac: 0,
    humidity: 0,
    light: 0,
    blinds_open: false
}

let transitionDuration = 500;

export default class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScenario: 0,
            active : false
        }
        this._getResultData = this._getResultData.bind(this);
        this._getSettings = this._getSettings.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this._trigger = this._trigger.bind(this);
    }

    _getResultData() {
        if (this.state.active) {
            return state.resultData;
        }

        return inactiveResultData;
    }

    _getSettings() {
        if (this.state.active) {
            return state.settings
        }

        return inactiveSettings;
    }

    _onSelect(scenario) {
        this.setState({
            currentScenario:scenario.value
        });
    }

    _trigger() {
        this.setState({
            active:!this.state.active
        })
    }

    render() {
        return (
            <main>
                <div className="panel_container">
                    <div className="panel_container__int">
                        <ControlPanel onSelect={this._onSelect} scenarios={state.scenarios} currentScenario={this.state.currentScenario} onClick={this._trigger}/>
                        <SettingsPanel settings={this._getSettings()} transitionDuration={transitionDuration}/>
                    </div>
                </div>
                <div className="result_container">
                    <ResultBox active={false} data={this._getResultData()} onClick={this._trigger} transitionDuration={transitionDuration}/>
                </div>
            </main>
        )
    }
}