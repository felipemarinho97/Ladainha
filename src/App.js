import React, { Component } from 'react';
import './App.css';
import firebase from 'firebase';
import { Route, Link } from 'react-router-dom';
import Media from 'react-media';
import Login from './login/Login';
import Chats from './chat/Chats';
import { Layout, Menu, Icon } from 'antd';
import { sendTokenToServer } from './util/push-notifications';

const config = {
  apiKey: "AIzaSyDkFgHQOqyqKhUsa6GR0eY5noMUPGmLp_0",
  authDomain: "aladainha.firebaseapp.com",
  databaseURL: "https://aladainha.firebaseio.com",
  projectId: "aladainha",
  storageBucket: "aladainha.appspot.com",
  messagingSenderId: "1002674233120"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

messaging.usePublicVapidKey("BEKZ7lF15xrQZD_W465bSrzMREKVn6opcY01R2jjEtnf4C5l5fQbdLgaOGtR9_syZkTnEu3pZ3EIqcfHSAuE7Bw");

messaging.onTokenRefresh(function () {
    messaging.getToken().then(function (refreshedToken) {
        console.log('Token refreshed.');
        sendTokenToServer(refreshedToken);
    }).catch(function (err) {
        console.log('Unable to retrieve refreshed token ', err);
    });
});

firebase.auth().useDeviceLanguage();

const { Header, Content } = Layout;


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isSignedIn: false
    }
  }

  componentDidMount() {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
      (user) => this.setState({ isSignedIn: !!user })
    );
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  render() {
    return (
        <Layout className="App">
          <Header className="App-header">
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={['1']}
              style={{ lineHeight: '60px', display: 'contents'}}
            >
            <Menu.Item style={{ lineHeight: '64px', top: '0px' }} key="1">
              <Link to="/login"><span className="title">Ladainha!</span></Link>
            </Menu.Item>
            <Menu.Item style={{ float: 'right', lineHeight: '64px'}} key="2">
                <Link to="/messages">
                  <Media query="(max-width : 420px)">{
                    matches => 
                      matches ? (<Icon style={{fontSize: 20, marginRight: '0px'}} type="message" />) : (<span>Mensagens</span>)
                  }</Media>
                </Link>
              </Menu.Item>
            </Menu>
          </Header>
          <Content>
            <Route path="/messages" component={() => (<Chats isSignedIn={this.state.isSignedIn} />)} />
            <Route path="/login" component={() => (<Login isSignedIn={this.state.isSignedIn}/>)} />
          </Content>
          {/* <Footer style={{ textAlign: 'center' }}>
            Ladainha © 2018 Criado por Felipe Marinho
          </Footer> */}
        </Layout>
    );
  }
}

export default App;
