import React, { Component } from "react";

export default class InfoBox extends Component {
    constructor(props) {
        super(props);
        this._getContent = this._getContent.bind(this);
    }

    _getContent() {
        if (this.props.type === 1) {
            return (
                <div>
                <input className="data_in"/>
                </div>
            )
        }
        else {
            return (
                <p className="data">{this.props.data}</p>
            )
        }
    }
    render() {
        return (
            <div className="info_box">
                {this._getContent()}
                <p className="title">{this.props.title}</p>
            </div>
        );
    }
}