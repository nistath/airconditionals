import React, { Component } from "react";
import ReactDOM from "react-dom";
import ResultBox from "./resultBox";
import ControlPanel from "./controlPanel";
import SettingsPanel from "./settingsPanel";
import "../css/index.css";

let sampleResultData = {
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

export default class Root extends Component {
    render() {
        return (
            <main>
                <div className="panel_container">
                    <div className="panel_container__int">
                        <ControlPanel/>
                        <SettingsPanel/>
                    </div>
                </div>
                <div className="result_container">
                    <ResultBox data={sampleResultData}/>
                </div>
            </main>
        )
    }
}