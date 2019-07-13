import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import registerServiceWorker from './registerServiceWorker';
import * as firebase from 'firebase';
require("firebase/functions");
let firebase_config = {
    apiKey: "AIzaSyByoHDC40g65tXqm2O3t-ZJkVHKOYNuiQg",
    authDomain: "kkpicker2.firebaseapp.com",
    databaseURL: "https://kkpicker2.firebaseio.com",
    projectId: "kkpicker2",
    storageBucket: "kkpicker2.appspot.com",
    messagingSenderId: "181362656557"
  }
  //let app =firebase.initializeApp(firebase_config);
  firebase.initializeApp(firebase_config);
  /* TURN OFF FOR PRODUCTION */
  //app.functions().useFunctionsEmulator("http://localhost:5001/")
ReactDOM.render(<App firebase={firebase}/>, document.getElementById('root'));
registerServiceWorker();
