import React, { Component } from "react";
import Gauge from 'react-svg-gauge';

var int = null;

export default class GaugeContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.data,
            target: this.props.data
        }
    }

    _countUp(initial) {
        var inc = this.props.data > initial ? 1 : -1
        int = setInterval(() => {
            this.setState({
                value : this.state.value + inc
            })
        }, 10);
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.target !== this.props.data) {
            this.setState({
                target: this.props.data
            });
            this._countUp(prevState.value);
        }
        if (this.state.value == this.props.data && int !== null) {
            clearInterval(int);
        }
    }

    render() {
        return (
            <div className="gauge_container" id={this.props.id}>
                <Gauge {...this.props} color={"#56d395"} value={this.state.value}/>
                {this.props.children}
            </div>
        )
    }
}