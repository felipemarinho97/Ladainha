import React, { Component } from 'react';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import './Login.css';
import { requestPermission } from '../util/push-notifications'


const uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            const currentUser = firebase.auth().currentUser;
            const db = firebase.firestore();

            const usersRef = db.collection('users');
            const userToken = requestPermission();

            userToken.then((res) => {                
                usersRef.get(currentUser.uid).then(doc => {
                    if (!doc.exists || doc.get().userToken !== userToken) {
                        usersRef.doc(currentUser.uid).set({
                            displayName: currentUser.displayName,
                            photoURL: currentUser.photoURL,
                            uid: currentUser.uid,
                            email: currentUser.email,
                            userToken: res
                        })
                    }
                })    
            })
            
            // usersRef.where('uid', '==', currentUser.uid)
            //     .limit(1)
            //     .get()
            //     .then(query => {
            //     if (query.empty) {
                    
            //     }
            // })
        
            return false;
        },
        uiShown: function () {
            // The widget is rendered.
            // Hide the loader.
            // document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    // signInFlow: '',
    signInSuccessUrl: '/login',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: '/terms'
};

class Login extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        if (this.props.isSignedIn) {
            return (
                <div style={{textAlign: 'center', margin: '20vh auto'}}>
                    {console.log(firebase.auth().currentUser)
                    }
                <p>Bem-vindo(a) {firebase.auth().currentUser.displayName}! Você agora está logado(a)!</p>
                <a onClick={() => firebase.auth().signOut()}>Sair</a>
                </div>
            );
        }

        return (<StyledFirebaseAuth style={{ textAlign: 'center', margin: '20vh auto' }} uiConfig={uiConfig} firebaseAuth={firebase.auth()} />)
    }

}

export default Login;