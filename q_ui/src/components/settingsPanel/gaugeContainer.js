import React, { Component } from "react";
import Gauge from 'react-svg-gauge';

export default class GaugeContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.data
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.data !== prevState.value) {
            let inc = this.props.data > prevState.value ? 0.1 : -0.1
            this.setState({
                value:prevState.value + inc
            });
        }
    }

    render() {
        return (
            <div className="gauge_container" id={this.props.id}>
                <Gauge {...this.props} value={this.state.value} width={560} height={400}/>
            </div>
        )
    }
}