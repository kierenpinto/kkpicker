import FirebaseAuth from 'react-firebaseui/FirebaseAuth';
import React, { Component } from 'react';
import * as firebase from 'firebase';

class SignInWidget extends Component {
    uiConfig = {
        // Popup signin flow rather than redirect flow.
        signInFlow: 'popup',
        callbacks: {
            signInSuccessWithAuthResult: () => false
        },
        // We will display Google and Facebook as auth providers.
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ]
    };
    render() {
        let authUI
        if(this.props.visible){
            authUI = <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
        }
        else{authUI = <p>Welcome to Secret Santa! Sign in required.</p>}
        return (
            <div>
                {authUI}
            </div>
        );
    }
}

export default SignInWidget;