import FirebaseAuth from 'react-firebaseui/FirebaseAuth';
import React, { Component } from 'react';
import * as firebase from 'firebase';
import { withStyles } from '@material-ui/core';

const styles = theme => ({})
class SignIn extends Component {
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
        return (
            <FirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()} />
        );
    }
}

export default withStyles(styles)(SignIn);