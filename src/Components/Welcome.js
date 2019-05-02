import React from "react";
import { Link, HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";

export default class Welcome extends React.Component {
    render() {
        return (
            <div>
                <h1>HiveLearn</h1>
                <HashRouter>
                    <div>
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                        <Link to="/login">Click here to Log in!</Link>
                    </div>
                </HashRouter>
                <img src="/hive.jpg" />
            </div>
        );
    }
}
