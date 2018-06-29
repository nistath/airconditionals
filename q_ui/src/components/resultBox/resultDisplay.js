import React, { Component } from "react";
import ReactDOM from "react-dom";
import CountUp from "react-countup";
import classnames from "classnames";

export default class ResultDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            complete : false
        }
        this._setComplete = this._setComplete.bind(this);
    }

    _setComplete() {
        this.setState({complete:true});
    }
    render() {
        let classNames = classnames("result_display", {
            "complete":this.state.complete
        });
        return (
            <div className="result_display" id={this.props.id}>
                <CountUp className="counter"
                start = {0}
                end = {this.props.data.value}
                duration = {1.75}
                useEasing = {true}
                suffix = {this.props.data.unit}
                onComplete = {this._setComplete}
                />

            </div>
        );
    }
}