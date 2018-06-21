import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';
let firebase_config = {
    apiKey: "AIzaSyByoHDC40g65tXqm2O3t-ZJkVHKOYNuiQg",
    authDomain: "kkpicker2.firebaseapp.com",
    databaseURL: "https://kkpicker2.firebaseio.com",
    projectId: "kkpicker2",
    storageBucket: "kkpicker2.appspot.com",
    messagingSenderId: "181362656557"
  }
  firebase.initializeApp(firebase_config);
ReactDOM.render(<App firebase={firebase}/>, document.getElementById('root'));
registerServiceWorker();