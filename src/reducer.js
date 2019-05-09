export default (
    state = {
        showChat: false,
        chat: [
            {
                id: 0,
                pic: null,
                comment: "get the chat started!",
                firstname: "test",
                lastname: "mctester",
                created_at: "Jan 1, 1970"
            }
        ]
    },
    action
) => {
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
        state = {
            ...state,
            onlineUsers: action.onlineUsers
        };
    }

    if (action.type == "USER_JOINED") {
        if (state.onlineUsers.filter(user => user.id === action.user.id)) {
            return { ...state };
        } else {
            return {
                ...state,
                onlineUsers: [...state.onlineUsers, action.user]
            };
        }
    }
    if (action.type == "USER_LEFT") {
        state = {
            ...state,
            onlineUsers: state.onlineUsers.map(onlineUser => {
                if (onlineUser.id != action.user.id) {
                    return onlineUser;
                }
            })
        };
    }

    if (action.type == "RECEIVE_CHAT") {
        state = {
            ...state,
            chat: action.chat
        };
    }

    if (action.type == "RECEIVE_MESSAGE") {
        state = {
            ...state,
            chat: [...state.chat, action.message]
        };
    }
    if (action.type == "SHOW_CHAT") {
        state = {
            ...state,
            showChat: !state.showChat
        };
    }
    return state;
};
