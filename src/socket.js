import * as io from "socket.io-client";
import { onlineUsers, userJoined, userLeft } from "./action";

export let socket;

export function init(store) {
    if (!socket) {
        socket = io.connect();
        console.log(store);

        socket.on("onlineUsers", users => {
            store.dispatch(onlineUsers(users));
        });

        socket.on("userJoined", user => {
            console.log(user);
            store.dispatch(userJoined(user));
        });

        socket.on("userLeft", user => {
            store.dispatch(userLeft(user));
        });
    }
}
