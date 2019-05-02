import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./components/welcome";
import App from "./components/app";
import "normalize.css";
import "./styles/styles.css";

let elem;

//consider before Mount here
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = <App />;
}

ReactDOM.render(elem, document.querySelector("main"));
