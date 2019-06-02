import React from "react";
import axios from "../../utils/axios";
import FriendButton from "./friendbutton";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.profileid || Number(this.props.match.params.id)
        };
    }

    componentDidMount() {
        axios
            .get(`/api/user/${this.state.id}`)
            .then(({ data }) => {
                console.log("initial user get for other app page", data);
                if (data.isLoggedInUser) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        firstname: data.firstname,
                        lastname: data.lastname,
                        bio: data.bio || null,
                        pic: data.pic || "/default.jpg"
                    });
                }
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="profile">
                <h2>{`${this.state.firstname} ${this.state.lastname}`}</h2>
                <div className="profile-bio">
                    <div className="profile-pic-wrapper">
                        <img
                            src={this.state.pic}
                            alt={`${this.state.firstname} ${
                                this.state.lastname
                            }`}
                            className="profile-pic"
                        />
                    </div>
                    <div className="profile-bio">
                        <FriendButton profileid={this.state.id} />
                        <div className="profile-bio">
                            {this.state.bio
                                ? this.state.bio
                                : "No bio provided by user"}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
