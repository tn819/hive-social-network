import React from "react";

export default class ProfilePic extends React.Component {
    render() {
        return (
            <div onClick={this.props.showModal} className="profile-pic-wrapper">
                <img
                    src={this.props.pic}
                    alt={this.props.altname}
                    className="profile-pic"
                />
            </div>
        );
    }
}
