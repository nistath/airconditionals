import React, { Component } from "react";

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
            "complete":this.props.isReal
        });
        return (
            <div className={classNames} id={this.props.id} style={{transition: "background-color " + this.props.transitionDuration + "ms ease-out"}}>
                <CountUp className="counter"
                start = {0}
                end = {this.props.data.value}
                duration = {this.props.transitionDuration/1000}
                useEasing = {true}
                suffix = {this.props.data.unit}
                onComplete = {this._setComplete}
                />
                <span className="title">{this.props.title}</span>
            </div>
        );
    }
}