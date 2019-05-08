export default (state = {}, action) => {
    if (action.type == "RECEIVE_FRIENDS") {
        console.log("in receive_friends reducer");
        state = { ...state, friends: action.friends };
    }

    if (action.type == "ACCEPT_FRIEND") {
        state = {
            ...state,
            friends: state.friends.map(friend => {
                console.log("friend in state.friends", friend);
                if (friend.id != action.id) {
                    return friend;
                }
                return {
                    ...friend,
                    requestAccepted: true
                };
            })
        };
    }
    if (action.type == "REJECT_FRIEND" || action.type == "UNREQUEST_FRIEND") {
        state = {
            ...state,
            friends: state.friends.map(friend => {
                if (friend.id != action.id) {
                    return friend;
                }
            })
        };
    }
    if (action.type == "ONLINE_USERS") {
        console.log("in online users action", action.onlineUsers);
        state = {
            ...state,
            onlineUsers: action.onlineUsers
        };
    }

    if (action.type == "USER_JOINED") {
        state = {
            ...state,
            onlineUsers: [...state.onlineUsers, action.user]
        };
    }
    if (action.type == "USER_LEFT") {
        let socketKey = Object.keys(action.user)[0];
        let onlineUsers = { ...state.onlineUsers };
        delete onlineUsers[socketKey];
        state = {
            ...state,
            onlineUsers: onlineUsers
        };
    }

    return state;
};
