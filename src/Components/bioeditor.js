import React from "react";
import axios from "../../utils/axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleBio: false,
            bio: this.props.bio
        };
        this.handleChange = this.handleChange.bind(this);
        this.postBio = this.postBio.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleChange(e) {
        this.setState({
            bio: e.target.value
        });
    }
    handleBlur(e) {
        e.preventDefault();
        this.setState({
            toggleBio: false
        });
    }

    postBio(e) {
        e.preventDefault();
        this.setState({ displayErrors: false });
        const form = {
            bio: this.state.bio
        };
        console.log(form);
        axios
            .post("/bio", form)
            .then(({ data }) => {
                if (data.bio) {
                    this.props.editBio(data.bio);
                    this.setState({ toggleBio: false });
                } else {
                    this.setState({ displayErrors: true });
                }
            })
            .catch(() => this.setState({ displayErrors: true }));
    }

    render() {
        return (
            <div>
                {!this.state.toggleBio && this.props.bio && (
                    <p>{this.props.bio}</p>
                )}
                {this.state.toggleBio && (
                    <form onSubmit={this.postBio}>
                        <textarea
                            name="bio"
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            defaultValue={
                                this.props.bio ? this.props.bio : null
                            }
                        />
                        <button type="submit">Submit Bio</button>
                    </form>
                )}
                {!this.state.toggleBio && (
                    <button
                        onClick={() => {
                            this.setState({ toggleBio: true });
                        }}
                    >
                        {this.props.bio ? "Edit Bio" : "Write Bio"}
                    </button>
                )}
            </div>
        );
    }
}
//* original bio is in prop
// * flag for editing
// * potentially save bio in state
// * axios route to update user table
//     * change own state to clear text editor
//     * change app state > send up and down to bio editor
//     * propWillUpdate - reflect new component
