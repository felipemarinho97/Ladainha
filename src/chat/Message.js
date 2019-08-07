import React, { Component } from "react";
import "./Message.css";
import { Twemoji } from "react-emoji-render";
import Linkify from "../Linkify/components/Linkify";

class Message extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messageVisibility: "message-time-hide"
    };
  }

  toggleVisivility() {
    if (this.state.messageVisibility === "message-time-hide") {
      this.setState({ messageVisibility: "" });

      setTimeout(() => {
        this.setState({ messageVisibility: "message-time-unhide" });
      }, 1);
    } else {
      this.setState({ messageVisibility: "message-time-hide" });
    }
  }

  render() {
    const { message, currUID } = this.props;
    // const componentDecorator = (href, text, key) => (
    //   <a href={href} key={key} target="_blank">
    //     {text}
    //   </a>
    // );

    const textDecorator = text => (
      <Twemoji
        className="normal-text"
        onlyEmojiClassName="make-emojis-large"
        text={text}
      />
    );

    return (
      <div
        className="message-container"
        style={{ width: "100%", padding: "0 1rem" }}
      >
        <div
          onClick={this.toggleVisivility.bind(this)}
          className={`message message-decoration ${
            currUID === message.author ? "message-sent" : "message-received"
          }`}
        >
          <Linkify notMatchDecorator={textDecorator}>{message.text}</Linkify>
        </div>
        <span
          className={
            "message-time " +
            this.state.messageVisibility +
            (currUID === message.author ? " message-time-sent" : "")
          }
        >
          {new Intl.DateTimeFormat("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
          }).format(message.timestamp)}
        </span>
      </div>
    );
  }
}

export default Message;
