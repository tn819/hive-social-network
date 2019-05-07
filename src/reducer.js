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

    return state;
};
