const express = require("express");
const app = express();
const server = require("http").Server(app);
//include heroku app url to ensure it also works when live (white space separation)

require("dotenv").config();
const db = require("./utils/db");
const path = require("path");

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) =>
        res.sendFile(path.join(__dirname, "bundle.js"))
    );
}

const cookieSession = require("cookie-session");
const cookieSessionMiddleware = cookieSession({
    maxAge: 1000 * 60 * 60 * 24 * 14,
    secret: process.env.secret
});
app.use(cookieSessionMiddleware);
app.use(require("./utils/config"));
app.use(require("./routes"));
//socket stuff

const io = require("socket.io")(server, {
    origins: "localhost:8080 fakesocialnetwork.heroku.com:*"
});

let onlineUsers = {};

io.use((socket, next) =>
    cookieSessionMiddleware(socket.request, socket.request.res, next)
);

io.on("connection", socket => {
    console.log(`socket with the id ${socket.id} is now connected`);
    if (!socket.request.session || !socket.request.session.userid) {
        return socket.disconnect(true);
    }

    socket.emit("onlineUsers", Object.values(onlineUsers));
    const {
        email,
        firstname,
        lastname,
        pic,
        bio,
        userid: id
    } = socket.request.session;
    const onlineUserDetails = {
        email,
        firstname,
        lastname,
        pic,
        bio,
        id
    };

    if (!Object.values(onlineUsers).some(onlineUser => onlineUser.id == id)) {
        socket.broadcast.emit("userJoined", onlineUserDetails);
    }
    onlineUsers[socket.id] = onlineUserDetails;

    db.getMessages()
        .then(({ rows }) => {
            let formattedMessages = db.getFormattedMessages(rows);
            socket.emit("chatHistory", formattedMessages);
        })
        .then(err => console.log(err));

    socket.on("sendChat", chat => {
        console.log("socket receiving chat", chat);
        db.addMessage(id, chat)
            .then(() => db.getMessages())
            .then(({ rows }) => {
                let formattedMessages = db.getFormattedMessages(rows);
                console.log(formattedMessages, "formatted messages");
                socket.emit("chatHistory", formattedMessages);
            })
            .catch(err => console.log(err));
    });

    db.getChatMessages(id)
        .then(({ rows }) => {
            let formattedMessages = db.getFormattedMessages(rows);
            let receiverSortedMessages = formattedMessages.reduce(
                (groupedMessages, message) => {
                    let receiverID =
                        message.id == id ? message.id : message.receiver;
                    if (!groupedMessages[receiverID])
                        groupedMessages[receiverID] = [];
                    groupedMessages[receiverID].push(message);
                    return groupedMessages;
                },
                {}
            );
            socket.emit("userChatHistory", receiverSortedMessages);
        })
        .then(err => console.log(err));
    socket.on("sendUserChat", ({ receiver, comment }) => {
        console.log("socket receiving user chat", receiver, comment);
        db.addMessage(id, receiver, comment)
            .then(() => db.getChatMessages(id))
            .then(({ rows }) => {
                let formattedMessages = db.getFormattedMessages(rows);
                let receiverSortedMessages = formattedMessages.reduce(
                    (groupedMessages, message) => {
                        let receiverID =
                            message.id == id ? message.id : message.receiver;
                        if (!groupedMessages[receiverID])
                            groupedMessages[receiverID] = [];
                        groupedMessages[receiverID].push(message);
                        return groupedMessages;
                    },
                    {}
                );
                socket.emit("chatHistory", receiverSortedMessages);
            })
            .catch(err => console.log(err));
    });

    socket.on("disconnect", () => {
        let disconnectedUser = onlineUsers[socket.id];
        delete onlineUsers[socket.id];
        if (
            Object.values(onlineUsers).some(
                onlineUser => onlineUser.id == disconnectedUser.id
            )
        ) {
            return;
        } else {
            socket.emit("userLeft", disconnectedUser);
        }
    });
});

server.listen(8080, function() {
    console.log("I'm listening this is NODE.");
});
