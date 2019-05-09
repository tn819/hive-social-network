import React from "react";
import ChatPopUp from "./chatpopup";
import { connect } from "react-redux";
import { showChat } from "../action";
import { socket } from "../socket";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.handleChat = this.handleChat.bind(this);
        this.chatInput = React.createRef();
    }

    componentDidUpdate() {
        //scrollTop each time new chat message
    }
    handleChat(e) {
        console.log("handling chat", this.chatInput.current.value);
        socket.emit("sendChat", this.chatInput.current.value);
        e.preventDefault();
        this.chatInput.current.value = "";
    }

    render() {
        if (!this.props.chat) {
            return null;
        }
        return (
            <div className="chatPopUp">
                <div className="chatEntry">
                    <form onSubmit={this.handleChat}>
                        <input type="textarea" ref={this.chatInput} />
                    </form>
                    <div>
                        <img
                            src="/minimize.png"
                            onClick={() => this.props.dispatch(showChat())}
                        />
                    </div>
                </div>
                <ChatPopUp comments={this.props.chat} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        chat: state.chat
    };
};

export default connect(mapStateToProps)(Chat);
