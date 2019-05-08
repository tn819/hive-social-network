import React from "react";
import FriendCard from "./friendcard";

export default class Online extends React.component {
    render() {
        const { onlineFriends } = this.props;

        if (!onlineFriends) {
            return null;
        }
        return <FriendCard friends={onlineFriends} />;
    }
}
