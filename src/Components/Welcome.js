import React from "react";
import Registration from "./Registration";

export default class Welcome extends React.Component {
    render() {
        return (
            <div>
                <h1>HiveLearn</h1>
                <img src="../public/hive.jpg" />
                <Registration />
            </div>
        );
    }
}
