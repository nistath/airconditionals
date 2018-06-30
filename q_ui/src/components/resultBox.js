import React, { Component } from "react";

import ResultDisplay from "./resultBox/resultDisplay";

export default class ResultBox extends Component {
    render() {
        return (
            <div className="result_box">
                <ResultDisplay id="naive" transitionDuration={this.props.transitionDuration} isReal={this.props.data.isReal} data={this.props.data.naive} title={"Naive consumption"}/>
                <ResultDisplay id="optimized" transitionDuration={this.props.transitionDuration} isReal={this.props.data.isReal} data={this.props.data.optimized} title={"Optimized consumption"}/>
                <ResultDisplay id="savings" transitionDuration={this.props.transitionDuration} isReal={this.props.data.isReal} data={this.props.data.savings} title={"Estimated savings"}/>
                <div id="logo"/>
            </div>
        );
    }
}