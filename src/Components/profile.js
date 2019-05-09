import React from "react";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="profile">
                <h2>{this.props.fullname}</h2>
                {this.props.profilePic}
                <div className="profile-bio">{this.props.bioEditor}</div>
            </div>
        );
    }
}
