import React from "react";
import { Link, HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";

export default class Welcome extends React.Component {
    render() {
        return (
            <div className="content-wrapper landing">
                <div>
                    <h1>Hive</h1>
                </div>
                <HashRouter>
                    <div className="login">
                        <Route exact path="/" component={Registration} />
                        <Route path="/login" component={Login} />
                        <Link to="/login">Log-in</Link>
                        <Link to="/">Register</Link>
                    </div>
                </HashRouter>
            </div>
        );
    }
}
