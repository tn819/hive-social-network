import React from "react";
import FriendCard from "./friendcard";
import { connect } from "react-redux";
import { receiveFriends } from "../action";

class Friends extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.dispatch(receiveFriends());
    }

    render() {
        console.log("props", this.props);
        const { friends } = this.props;
        if (!friends) {
            return null;
        }
        const currentFriends = friends.filter(friend => friend.requestAccepted);
        const pendingFriends = friends.filter(
            friend => !friend.requestAccepted && !friend.requestSender
        );

        return (
            <div>
                <h2>Friends</h2>

                {pendingFriends.length > 0 && (
                    <div>
                        <h3>Friend Requests({pendingFriends.length})</h3>
                        <FriendCard friends={pendingFriends} />
                    </div>
                )}
                {currentFriends.length > 0 && (
                    <div>
                        <h3>Current Friends({currentFriends.length})</h3>
                        <FriendCard friends={currentFriends} />
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log("mapStateToProps", state);
    return { friends: state.friends };
};

export default connect(mapStateToProps)(Friends);
