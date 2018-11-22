import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Message from './Message';
import { firestore } from 'firebase';
import { List, Input, Button } from 'antd';
import { connect } from 'react-redux'
import { setChatMessages } from '../actions';
import emojione from 'emojione';
import { sendNotification } from '../util/push-notifications';
import Media from "react-media";
import './Chat.css';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import { i18nEmojiMart } from '../util/strings';

class Chat extends Component {
    inputRef = React.createRef();

    constructor(props) {
        super(props);

        this.state = {
            message: '',
            destToken: '',
            showEmojiPicker: false
        }

        this.sendMessage = this.sendMessage.bind(this)
    }

    componentDidMount() {
        console.log("i am mounted");
        emojione.ascii = true;
        
        this.setupListener()
        this.scrollToBottom();

        let destUserToken = this.props.chatID.replace(this.props.currentUser.uid, '');
        const usersRef = this.props.db.collection('users');
        console.log(destUserToken);

        usersRef.doc(destUserToken).get().then(doc => {
            this.setState({destToken: doc.data().userToken});
        })

    }

    componentWillUnmount() {
        this.unsub();
    }

    componentWillReceiveProps(props) {
        if (this.props.chatID !== props.chatID) {
            this.setupListener()
            this.scrollToBottom();        
        }
        
    }

    handleChange(e) {
        e.preventDefault();
        let value = e.target.value;
        if (value[value.length -1] === ' ')
            value = emojione.shortnameToUnicode(value);

        this.setState({ message: value });
    }

    sendNotification() {
        sendNotification(this.state.destToken, this.props.currentUser.displayName, this.state.message)
            .then(res => console.log('sucesso', res))
            .catch(err => console.log(err))
    }

    sendMessage(e) {
        console.log(e.target.value);

        this.props.db.collection(`chat/${this.props.chatID}/messages`)
            .add({
                author: this.props.currentUser.uid,
                text: e.target.value,
                timestamp: firestore.FieldValue.serverTimestamp()
            })
        this.sendNotification()

        this.setState({ message: '' })

    }

    setupListener() {
        console.log("listener", this.props);
        
        this.unsub = this.props.db.collection(`chat/${this.props.chatID}/messages`)
            .orderBy('timestamp', 'desc')
            .limit(40)
            .onSnapshot(snap => {
                let messages = [];
                    console.log(snap);
                    
                
                snap.forEach(doc => {
                    messages.push(doc.data());

                    if (snap.size === messages.length) {
                        // console.log(snap.size, messages.length);

                        this.props.updateMessages(this.props.chatID, messages.reverse())
                    }
                })
            })
    }

    scrollToBottom() {
        const messagesContainer = ReactDOM.findDOMNode(this.messageList);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    componentDidUpdate() {
        this.scrollToBottom();
    }

    addEmoji(e) {
        this.setState({ message: this.state.message + e.native })
        this.inputRef.current.focus();
    }

    toggleEmojiPicker() {
        
        if (this.state.showEmojiPicker) {
            this.setState({ showEmojiPicker: false });
            this.inputRef.current.focus();
        } else {
            this.setState({ showEmojiPicker: true });
        }
    }

    conditionalyCloseEmojiPicker() {
        console.log("caldo");
        
        if (this.state.showEmojiPicker) {
            this.setState({ showEmojiPicker: false });
            this.inputRef.current.focus();
        }
    }

    render() {
        console.log("render Chat", this.props);
        const { showEmojiPicker } = this.state;
        
        return (
            <div style={{
                height: '100vh',
                paddingBottom: '128px'}}>
                <List
                    onClick={this.conditionalyCloseEmojiPicker.bind(this)}
                    ref={(div) => {
                        this.messageList = div;
                    }}
                    style={{overflowY: 'scroll', height: '100%'}}
                    bordered={false}
                    dataSource={this.props.messages}
                    renderItem={messBody => (
                        <List.Item style={{ borderBottom: 'none', padding: '6px 0px' }}>
                            <Message style={{display: 'inline'}} currUID={this.props.currentUser.uid} message={messBody} />
                        </List.Item>
                    )}
                    />
                <Input
                    ref={this.inputRef}
                    onClick={this.conditionalyCloseEmojiPicker.bind(this)}
                    autoFocus={true}
                    id="send-message" autoComplete="off"
                    value={this.state.message}
                    onChange={this.handleChange.bind(this)}
                    style={{ margin: '1rem', width: '92%', position: 'inherit', bottom: '0', left: '20%' }}
                    onPressEnter={this.sendMessage} placeholder="Escrever mensagem.." />
                 <Media  query="(max-width: 999px)">
                    {matches =>
                        matches ? '' : (
                        <span style={{ position: 'relative' }}>
                            <Button onClick={this.toggleEmojiPicker.bind(this)} shape="circle" icon="smile" />
                            {showEmojiPicker? 
                                    <Picker 
                                        native={true} 
                                        onSelect={this.addEmoji.bind(this)} 
                                        autoFocus={true} 
                                        style={{ position: 'absolute' }} 
                                        title='Selecione um emoji…' 
                                        emoji='point_up'
                                        showPreview={false}
                                        exclude={['recent']}
                                        i18n={i18nEmojiMart} />
                                : ''
                            }
                        </span>
                        )
                    }
                </Media>
            </div>
        )
    }

}

function mapStateToProps(state, props) {    
    return {
        messages: state.app.chatMessages[props.chatID]
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateMessages: (chatID, messageList) => {
            dispatch(setChatMessages(chatID, messageList))
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Chat);
