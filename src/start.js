import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./components/welcome";
import App from "./components/app";
import "normalize.css";
import "./styles/styles.css";
import { createStore, applyMiddleware } from "redux";
import reduxPromise from "redux-promise";
import reducer from "./reducer";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";

let elem;
const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);
console.log("getting store state", store.getState());

//consider before Mount here
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
