import React from "react";
import axios from "../../utils/axios";
import { connect } from "react-redux";
import { addFriend, acceptFriend, rejectFriend } from "../action";

class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            requestSent: false,
            requestAccepted: false,
            requestSender: null
        };
        this.updateFriend = this.updateFriend.bind(this);
    }

    componentDidMount() {
        const friend = this.props.friends.filter(
            friend => friend.id === this.props.profileid
        )[0];
        if (!friend) {
            return;
        } else {
            this.setState({
                requestSent: friend.requestSent,
                requestAccepted: friend.requestAccepted,
                requestSender: friend.requestSender
            });
        }
    }

    updateFriend(type) {
        console.log("update friend function", type);
        axios
            .post(`/friendship/${this.props.profileid}`, { type })
            .then(({ data }) => {
                console.log(data);
                this.setState({
                    ...data
                });
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div>
                {this.state.requestSent ? (
                    this.state.requestAccepted ? (
                        <button
                            onClick={e => {
                                e.preventDefault();
                                this.updateFriend("delete");
                            }}
                        >
                            Unfriend
                        </button>
                    ) : this.state.requestSender ? (
                        <div>
                            <button
                                onClick={e => {
                                    e.preventDefault();
                                    this.updateFriend("delete");
                                }}
                            >
                                Pending, Undo Request?
                            </button>
                        </div>
                    ) : (
                        <div>
                            <button
                                onClick={e => {
                                    e.preventDefault();
                                    this.updateFriend("accept");
                                }}
                            >
                                Accept Request
                            </button>
                            <button
                                onClick={e => {
                                    e.preventDefault();
                                    this.updateFriend("delete");
                                }}
                            >
                                Decline Request
                            </button>
                        </div>
                    )
                ) : (
                    <button
                        onClick={e => {
                            e.preventDefault();
                            this.updateFriend("add");
                        }}
                    >
                        Request Friend
                    </button>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log("mapStateToProps", state);
    return { friends: state.friends };
};

export default connect(mapStateToProps)(FriendButton);
