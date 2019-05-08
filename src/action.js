import axios from "../utils/axios";

const mapFriends = (loggedInUser, friends) => {
    const mappedFriends = friends.map(
        ({ userid, firstname, lastname, pic, bio, accepted, requester }) => {
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

export async function updateFriend(id, type) {
    console.log("update friend function", id, type);
    return await axios
        .post(`/friendship/${id}`, { type })
        .then(({ data }) => {
            console.log(data);
            this.setState({
                ...data
            });
        })
        .catch(err => console.log(err));
}

export async function receiveFriends() {
    return await axios
        .get("/friendships")
        .then(({ data }) => {
            return {
                type: "RECEIVE_FRIENDS",
                friends: mapFriends(data.id, data.friends)
            };
        })
        .catch(err => console.log("receiveFriends action error", err));
}

export const addFriend = id => ({
    type: "ADD_FRIEND",
    id
});

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

export const onlineUsers = onlineUsers => ({
    type: "ONLINE_USERS",
    onlineUsers: Object.values(onlineUsers)
});

export const userJoined = user => ({
    type: "USER_JOINED",
    user
});

export const userLeft = user => ({
    type: "USER_LEFT",
    user
});
