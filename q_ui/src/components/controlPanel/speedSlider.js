import React, { Component } from 'react'
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';

export default class SpeedSlider extends Component {
    constructor(props) {
        super(props);
        this._onChange = this._onChange.bind(this);
        this.state = {
            speed: 50
        }
    }

    _onChange(v) {
        this.setState({
            speed:v
        })
    }

    render() {
        return (
            <Slider value={this.state.speed} orientation="horizontal" onChange={this._onChange}/>
        );
    }
}