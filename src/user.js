export const addUser = ({
    id,
    firstName,
    lastName,
    pic = "default.jpg",
    bio = ""
}) => ({
    type: "ADD_USER",
    id,
    firstName,
    lastName,
    pic,
    bio
});

export const addPic = ({ pic }) => ({
    type: "ADD_PIC",
    pic
});

export const addBio = ({ bio }) => ({
    type: "ADD_BIO",
    bio
});

const addUser = ({
    id,
    firstName,
    lastName,
    pic = "default.jpg",
    bio = ""
}) => ({
    type: "ADD_USER",
    id,
    firstName,
    lastName,
    pic,
    bio
});

const addPic = ({ pic }) => ({
    type: "ADD_PIC",
    pic
});

const addBio = ({ bio }) => ({
    type: "ADD_BIO",
    bio
});

const userReducer = (state = {}, action) => {
    switch (action.type) {
        case "ADD_USER":
            let user = {
                ...state,
                id: action.id,
                firstName: action.firstName,
                lastName: action.lastName,
                pic: action.pic,
                bio: action.bio
            };
            return { ...state, user };
        case "ADD_PIC":
            user = {
                ...state,
                pic: action.pic
            };
            return { ...state, user };
        case "ADD_BIO":
            user = {
                ...state,
                bio: action.bio
            };
            return { ...state, user };
        default:
            return state;
    }
};
