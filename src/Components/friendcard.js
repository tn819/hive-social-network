import React from "react";
import FriendButton from "./friendbutton";
import { Link } from "react-router-dom";

const FriendCard = props => (
    <div className="friend-card-wrapper">
        {props.friends.map(friend => (
            <div className="friend-card" key={friend.id}>
                <div className="profile-pic-wrapper">
                    <Link to={`/user/${friend.id}`}>
                        <img src={friend.pic} />
                    </Link>
                </div>
                <FriendButton profileid={friend.id} />
                <h4>{`${friend.firstname} ${friend.lastname}`}</h4>
            </div>
        ))}
    </div>
);

export default FriendCard;
