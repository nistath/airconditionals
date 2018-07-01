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
                light:50
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
                light:30
            },
            internal : {
                temperature: 26,
                humidity: 10,
                light:70,
                population: 4
            }
        },
    ],

    result: {
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
            light:60
        }
    }
}

let inactiveResults = {
    settings : {
        ac: 0,
        humidity: 0,
        light: 0
    },
    resultData: {
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
}

let transitionDuration = 500;

export default class Root extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentScenario: 0,
            active : false,
            scenarios: [],
            results : inactiveResults
        }
        this._getScenarios = this._getScenarios.bind(this);
        this._getResults = this._getResults.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this._trigger = this._trigger.bind(this);
    }

    _getScenarios() {
        // fetch("localhost:3003/api/scenario/get", {
        //     method: "GET"
        // }).then((resp) =>resp.json())
        // .then(function(data){
        //     this.setState({
        //         scenarios:data
        //     });
        // }.bind(this));
        this.setState({
            scenarios:state.scenarios
        })
    }

    _getResults() {
        fetch("localhost:3003/api/scenario/" + this.state.currentScenario, {
            method: "GET"
        }).then((resp) =>resp.json())
        .then(function(data){
            this.setState({
                results:data
            });
        }.bind(this));
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

    componentWillMount() {
        this._getScenarios();
    }

    render() {
        return (
            <main>
                <div className="panel_container">
                    <div className="panel_container__int">
                        <ControlPanel onSelect={this._onSelect} scenarios={this.state.scenarios} currentScenario={this.state.currentScenario} onClick={this._trigger}/>
                        <SettingsPanel settings={this.state.results.settings} transitionDuration={transitionDuration}/>
                    </div>
                </div>
                <div className="result_container">
                    <ResultBox active={false} data={this.state.results.resultData} onClick={this._trigger} transitionDuration={transitionDuration}/>
                </div>
            </main>
        )
    }
}