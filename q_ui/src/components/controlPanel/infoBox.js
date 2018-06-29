import React, { Component } from "react";

export default class InfoBox extends Component {
    render() {
        return (
            <div className="info_box">
                <p className="data">{this.props.data}</p>
                <p className="title">{this.props.title}</p>
            </div>
        );
    }
}