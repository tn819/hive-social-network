import React from "react";
import { connect } from "react-redux";
import { receiveFriends, acceptFriend, rejectFriend } from "../action";

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

        const FriendCard = props => (
            <div className="friend-card-wrapper">
                {props.friends.map(friend => (
                    <div key={friend.id}>
                        <div className="profile-pic-wrapper">
                            <img src={friend.pic} />
                        </div>
                        <h4>{`${friend.firstname} ${friend.lastname}`}</h4>
                    </div>
                ))}
            </div>
        );
        return (
            <div>
                <h2>Friends</h2>
                {currentFriends && (
                    <div>
                        <h3>Current Friends</h3>
                        <FriendCard friends={currentFriends} />
                    </div>
                )}
                {pendingFriends && (
                    <div>
                        <h3>Friend Requests</h3>
                        <FriendCard friends={pendingFriends} />
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
