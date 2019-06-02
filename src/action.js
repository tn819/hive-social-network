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
            let friends = mapFriends(data.id, data.friends);
            return {
                type: "RECEIVE_FRIENDS",
                friends: friends
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

export const onlineUsers = onlineUsers => {
    let uniqueOnlineUsers = Array.from(
        new Set(Object.values(onlineUsers).map(user => user.id))
    ).map(id => Object.values(onlineUsers).filter(user => user.id == id)[0]);
    return {
        type: "ONLINE_USERS",
        onlineUsers: uniqueOnlineUsers
    };
};

export const userJoined = user => {
    console.log("user joining", user);
    return {
        type: "USER_JOINED",
        user
    };
};

export const userLeft = user => {
    console.log("user leaving", user);
    return {
        type: "USER_LEFT",
        user
    };
};

export const receiveChat = chat => ({
    type: "RECEIVE_CHAT",
    chat
});

export const receiveMessage = message => ({
    type: "RECEIVE_MESSAGE",
    message
});

export const receiveUserChat = userChat => {
    return {
        type: "RECEIVE_USER_CHAT",
        userChat: userChat
    };
};

export const receiveUserMessage = userChatMessage => ({
    type: "RECEIVE_USER_MESSAGE",
    userChatMessage
});

export const showChat = () => ({
    type: "SHOW_CHAT"
});
