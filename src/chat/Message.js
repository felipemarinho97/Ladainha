import React, { Component } from 'react';
import { Avatar } from 'antd';
import './Message.css'

class Message extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messageVisibility: 'message-time-hide'
        }
    }

    toggleVisivility() {
        if (this.state.messageVisibility === 'message-time-hide') {
            this.setState({ messageVisibility: '' })

            setTimeout(() => {
                this.setState({ messageVisibility: 'message-time-unhide' })
            }, 1)
        } else {
            this.setState({ messageVisibility: 'message-time-hide' })
        }
    }

    render() {
        if (this.props.currUID === this.props.message.author)
            return (
                <div style={{ width: '100%', padding: '0 1rem'}}>
                    <div className="message message-sent" >
                        {this.props.message.text}
                    </div>
                </div>
            )
        else 
            return (
                <div className="message-container" style={{width: '100%', padding: '0 1rem'}}>
                    {/* <Avatar style={{float: 'left'}} src = { this.props.user.photoURL } size="small" icon="user" /> */}
                    <div onClick={this.toggleVisivility.bind(this)} className="message message-received">
                        {this.props.message.text} 
                    </div>
                    <span className={"message-time " + this.state.messageVisibility}> 
                        {new Intl.DateTimeFormat('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit', hour12: false
                        }).format(this.props.message.timestamp)}
                    </span>
                </div>
            )
    }

}

export default Message;
