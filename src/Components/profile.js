import React from "react";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <h1>{this.props.fullname}</h1>
                {this.props.profilePic}
                {this.props.bioEditor}
            </div>
        );
    }
}
