import axios from "../utils/axios";

const mapFriends = (loggedInUser, friends) => {
    const mappedFriends = friends.map(
        ({ userid, firstname, lastname, pic, bio, accepted, requester }) => {
            console.log("friends", userid, accepted);
            return {
                id: userid,
                firstname,
                lastname,
                pic,
                bio,
                requestSent: true,
                requestAccepted: accepted,
                requestSender: loggedInUser === requester
            };
        }
    );
    return mappedFriends;
};

export async function receiveFriends() {
    console.log("in receive friends function");
    return await axios
        .get("/friendships")
        .then(({ data }) => {
            console.log("friendships data back from axios", data);
            return {
                type: "RECEIVE_FRIENDS",
                friends: mapFriends(data.id, data.friends)
            };
        })
        .catch(err => console.log("receiveFriends action error", err));
}

export const acceptFriend = id => ({
    type: "ACCEPT_FRIEND",
    id
});

export const rejectFriend = id => ({
    type: "REJECT_FRIEND",
    id
});

export const unrequestFriend = id => ({
    type: "UNREQUEST_FRIEND",
    id
});
