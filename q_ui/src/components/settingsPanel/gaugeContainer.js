import React, { Component } from "react";
import Gauge from 'react-svg-gauge';

export default class GaugeContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.data,
            target: this.props.data,
            int: null
        }
    }

    _countUp(initial) {
        var inc = Math.abs(this.state.value - this.props.data) / this.props.transitionDuration * (this.props.transitionDuration/100)
        inc = this.props.data > initial ? inc : -1 * inc;
        this.setState({int:setInterval(() => {
            this.setState({
                value : this.state.value + inc
            })
        }, this.props.transitionDuration/100)});
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.target !== this.props.data) {
            this.setState({
                target: this.props.data
            });
            this._countUp(prevState.value);
        }
        if (Math.ceil(this.state.value) === this.props.data && this.state.int !== null) {
            clearInterval(this.state.int);
        }
    }

    render() {
        return (
            <div className="gauge_container" id={this.props.id}>
                <Gauge {...this.props} color={"#56d395"} value={Math.ceil(this.state.value)} label={""}/>
                <span className="label">{this.props.label}</span>
                {this.props.children}
            </div>
        )
    }
}