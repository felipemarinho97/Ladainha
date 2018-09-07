import React, { Component } from 'react';
import { Row, Col, Menu, Avatar, Icon } from 'antd';
import firebase from 'firebase';
import Chat from './Chat';
import './Chats.css';
import { Redirect } from 'react-router-dom';
import Swipeable from 'react-swipeable'

class Chats extends Component {
    constructor(props) {
        super(props);

        this.state = {
            collapsed: false,
            users: [],
            activeChat: null,
            menuVisibility: 'menu-open',
            menuSize: 20
        }

    }

    componentDidMount() {
        this.db = firebase.firestore();
        this.currentUser = firebase.auth().currentUser;

        let users = []

        this.db.collection('users').get().then(snapshot => {
            console.log("chamada", snapshot.size);
            
            snapshot.forEach(doc => {
                
                users.push(doc.data());
                console.log(users.length, snapshot.size);


                if (snapshot.size === users.length) {

                    this.setState({ users });
                    console.log(this.state);
                    
                }
            })
        })

    }

    setCurrentChat(uid) {
        let uids = [this.currentUser.uid, uid].sort();
        this.setState({ activeChat: `${uids[0]}${uids[1]}` });
    }

    handleSwipeRight() {
        this.setState({ menuVisibility: 'menu-closing' })

        setTimeout(() => {
            this.setState({ menuSize: 20, menuVisibility: 'menu-open' });
        }, 1);
    }

    handleSwipeLeft() {
        this.setState({ menuVisibility: 'menu-closing' })

        setTimeout(() => {
            this.setState({ menuSize: 0, menuVisibility: 'menu-closing menu-closed' });
        }, 300);
    }

    render() {
        if (!this.props.isSignedIn) {
            return (<Redirect to="/login"/>)
        }

        const createUsers = () => { 
            let users = [];

            this.state.users.forEach(user =>  {
                let inner = [];

                inner.push(<Avatar key={1} src={user.photoURL} />);
                inner.push(<span style={{paddingLeft: '1rem'}} key={2}>{user.displayName}</span>);

                users.push(<Menu.Item style={{paddingLeft: '1rem !important'}} key={user.uid} onClick={() => this.setCurrentChat(user.uid)}>{inner}</Menu.Item>);

            });

            return users
        }

        const RenderChat = ({activeChat}) => 
            this.state.activeChat ?
            (<Chat chatID={this.state.activeChat} currentUser={this.currentUser} db={this.db} />)
            :
            (<div style={{ textAlign: 'center', margin: '20vh auto' }}>
                <Icon style={{ fontSize: '60px', padding: '1rem' }} type="message" /><br />Selecione algum chat!
            </div>)
        

        return (
                <Row style={{height: '100vh'}}>
                    <Col span={6} style={{ maxWidth: `${this.state.menuSize}%`, height: '100%' }}>
                    <Swipeable 
                        style={{width: '20%', height:'100%', position:"fixed", zIndex: '1'}}
                        onSwipedLeft={this.handleSwipeLeft.bind(this)} 
                        onSwipedRight={this.handleSwipeRight.bind(this)}>
                        <Menu
                            className={"users-drawer " + this.state.menuVisibility} 
                            style={{height: '100%'}}
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            mode="inline"
                            theme="dark"
                            inlineCollapsed={this.state.collapsed} >
                            {createUsers()}
                        </Menu>
                    </Swipeable>
                    </Col>
                    <Col span={18} style={{ width: `${100 - this.state.menuSize}%`}}>
                        <RenderChat activeChat={this.state.activeChat} />
                    </Col>
                </Row>

        )
    }

}

export default Chats;
