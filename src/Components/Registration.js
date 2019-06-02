import React from "react";
import axios from "../../utils/axios";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            password: ""
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ displayErrors: false });
        const form = {
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            email: this.state.email,
            password: this.state.password
        };
        axios
            .post("/register", form)
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({ displayErrors: true });
                }
            })
            .catch(() => this.setState({ displayErrors: true }));
    }
    //for CSS later .displayErrors input:invalid

    render() {
        const { displayErrors } = this.state;
        return (
            <div>
                <h2>Register!</h2>
                <form
                    onSubmit={this.handleSubmit}
                    className={displayErrors ? "displayErrors" : ""}
                    noValidate
                >
                    <label>
                        First Name:
                        <br />
                        <input
                            type="text"
                            name="firstname"
                            onChange={this.handleChange}
                            required
                        />
                        <br />
                    </label>
                    <label>
                        Last Name:
                        <br />
                        <input
                            type="text"
                            name="lastname"
                            onChange={this.handleChange}
                            required
                        />
                        <br />
                    </label>
                    <label>
                        Email:
                        <br />
                        <input
                            type="email"
                            name="email"
                            onChange={this.handleChange}
                            required
                        />
                        <br />
                    </label>
                    <label>
                        Password (6-12 characters):
                        <br />
                        <input
                            type="password"
                            name="password"
                            pattern="^.{6,12}$"
                            onChange={this.handleChange}
                            required
                        />
                        <br />
                    </label>
                    <button type="submit">Submit</button>
                    <div>{displayErrors && <p>Form is not valid</p>}</div>
                </form>
            </div>
        );
    }
}
