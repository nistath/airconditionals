import React, { Component } from "react";
import ReactDOM from "react-dom";
import ResultDisplay from "./resultBox/resultDisplay";

export default class ResultBox extends Component {
    render() {
        return (
            <div className="result_box">
                <ResultDisplay id="naive" data={this.props.data.naive}/>
                <ResultDisplay id="optimized" data={this.props.data.optimized}/>
                <ResultDisplay id="savings" data={this.props.data.savings}/>
            </div>
        );
    }
}