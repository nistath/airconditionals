import React, { Component } from "react";

import ResultBox from "./resultBox";
import ControlPanel from "./controlPanel";
import SettingsPanel from "./settingsPanel";
import "../css/index.css";

let sampleResultData = {
    isReal: true,
    naive : {
        value: 1000,
        unit: "W"
    },
    optimized : {
        value: 500,
        unit : "W"
    },

    savings : {
        value:10000,
        unit: "¥"
    }
}

let sampleSettings = {
    ac:50,
    humidity:20,
    light:60,
    blinds_open:true
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
        unit: "¥"
    }
}

let scenarios= [
    {
        id : 0,
        name: "Sc1",
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
        name: "Sc2",
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
]

export default class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScenario: 0,
            active : false
        }
        this._getResultData = this._getResultData.bind(this);
        this._onSelect = this._onSelect.bind(this);
    }

    _getResultData() {
        if (this.state.active) {
            return sampleResultData;
        }

        return inactiveResultData;
    }

    _onSelect(scenario) {
        this.setState({
            currentScenario:scenario.value
        });
    }

    render() {
        return (
            <main>
                <div className="panel_container">
                    <div className="panel_container__int">
                        <ControlPanel onSelect={this._onSelect} scenarios={scenarios} currentScenario={this.state.currentScenario}/>
                        <SettingsPanel settings={sampleSettings}/>
                    </div>
                </div>
                <div className="result_container">
                    <ResultBox active={false} data={this._getResultData()}/>
                </div>
            </main>
        )
    }
}