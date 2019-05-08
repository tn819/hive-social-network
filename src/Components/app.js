import React from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
import axios from "../../utils/axios";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./otherprofile";
import BioEditor from "./bioeditor";
import Friends from "./friends";
import FriendCard from "./friendcard";
import { connect } from "react-redux";
import {
    receiveFriends,
    addFriend,
    acceptFriend,
    rejectFriend
} from "../action";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUpload: false
        };
        this.updatePic = this.updatePic.bind(this);
        this.showModal = this.showModal.bind(this);
        this.editBio = this.editBio.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(receiveFriends());
        axios
            .get("/user")
            .then(({ data }) => {
                console.log("initial user get for app page", data);
                return this.setState({
                    userid: Number(data.userid),
                    email: data.email,
                    firstname: data.firstname,
                    lastname: data.lastname,
                    bio: data.bio || null,
                    pic: data.pic || "/default.jpg"
                });
            })
            .catch(err => console.log(err));
    }

    showModal(e) {
        e.preventDefault();
        this.setState({
            showUpload: true
        });
    }

    editBio(newBio) {
        this.setState({
            bio: newBio
        });
    }

    updatePic(url) {
        this.setState({
            pic: url,
            showUpload: false
        });
    }

    render() {
        if (
            !this.state.userid ||
            !this.props.friends ||
            !this.props.onlineUsers
        ) {
            return <img src="/loading.gif" />;
        }
        return (
            <BrowserRouter>
                <div>
                    <div className="app-menu">
                        <h1>App</h1>
                        <div className="app-menu-submenu">
                            <NavLink exact to="/" activeClassName="is-active">
                                My Profile
                            </NavLink>
                            <NavLink to="/online" activeClassName="is-active">
                                Online{" "}
                                {this.props.onlineUsers && (
                                    <span>
                                        (
                                        {
                                            Object.keys(this.props.onlineUsers)
                                                .length
                                        }
                                        )
                                    </span>
                                )}
                            </NavLink>
                            <NavLink to="/friends" activeClassName="is-active">
                                Friends{" "}
                                {this.props.friends.filter(
                                    friend =>
                                        !friend.requestAccepted &&
                                        !friend.requestSender
                                ).length > 0 && (
                                    <span>
                                        (
                                        {
                                            this.props.friends.filter(
                                                friend =>
                                                    !friend.requestAccepted &&
                                                    !friend.requestSender
                                            ).length
                                        }
                                        )
                                    </span>
                                )}
                            </NavLink>
                            <a href="/logout">Log Out</a>
                            <ProfilePic
                                pic={this.state.pic}
                                altname={`${this.state.firstname} ${
                                    this.state.lastname
                                }`}
                                showModal={this.showModal}
                                className="profile-pic"
                            />
                        </div>
                    </div>
                    {this.state.showUpload && (
                        <Uploader
                            updatePic={this.updatePic}
                            showModal={this.state.showUpload}
                            hideModal={() =>
                                this.setState({ showUpload: false })
                            }
                        />
                    )}
                    <div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    fullname={`${this.state.firstname} ${
                                        this.state.lastname
                                    }`}
                                    profilePic={
                                        <ProfilePic
                                            pic={this.state.pic}
                                            altname={`${this.state.firstname} ${
                                                this.state.lastname
                                            }`}
                                            showModal={this.showModal}
                                        />
                                    }
                                    bioEditor={
                                        <BioEditor
                                            bio={this.state.bio}
                                            editBio={this.editBio}
                                        />
                                    }
                                />
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render={props => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/friends" component={Friends} />
                        <Route
                            path="/online"
                            render={() => (
                                <FriendCard friends={this.props.onlineUsers} />
                            )}
                        />
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = state => {
    console.log("mapStateToProps", state);
    return { friends: state.friends, onlineUsers: state.onlineUsers };
};

export default connect(mapStateToProps)(App);
