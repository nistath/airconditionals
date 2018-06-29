import React, { Component } from "react";

import ResultDisplay from "./resultBox/resultDisplay";

export default class ResultBox extends Component {
    render() {
        return (
            <div className="result_box" onClick={this.props.onClick}>
                <ResultDisplay id="naive" isReal={this.props.data.isReal} data={this.props.data.naive}/>
                <ResultDisplay id="optimized" isReal={this.props.data.isReal} data={this.props.data.optimized}/>
                <ResultDisplay id="savings" isReal={this.props.data.isReal} data={this.props.data.savings}/>
            </div>
        );
    }
}