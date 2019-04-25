import React from "react";
import axios from "axios";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.register = this.register.bind(this);
    }

    register(e) {
        e.preventDefault();
        if (!e.target.checkValidity()) {
            this.setState({ displayErrors: true });
            return;
        }
        this.setState({ displayErrors: false });
        const data = new FormData(e.target);
        console.log("form submission", data);
        axios
            .post("/register", data)
            .then(({ data }) => {
                console.log(data);
            })
            .catch(() => this.setState({ displayErrors: true }));
    }
    //for CSS later .displayErrors input:invalid

    render() {
        const { displayErrors } = this.state;
        return (
            <div>
                <form
                    onSubmit={this.register}
                    noValidate
                    className={displayErrors ? "displayErrors" : ""}
                >
                    <label>
                        First Name:
                        <input type="text" name="firstname" required />
                    </label>
                    <label>
                        Last Name:
                        <input type="text" name="lastname" required />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" required />
                    </label>
                    <label>
                        Password (6-12 characters):
                        <input
                            type="text"
                            name="password"
                            pattern="^.{6,12}$"
                            required
                        />
                    </label>
                    <button type="button">Submit</button>
                    <div>{displayErrors && <p>Form is not valid</p>}</div>
                </form>
            </div>
        );
    }
}
