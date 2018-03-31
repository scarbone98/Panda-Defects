import React from 'react';
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as firebase from 'firebase';
import registerServiceWorker from './registerServiceWorker';
export class FirebaseInstance {
    static firebaseApp = firebase.initializeApp({
        apiKey: "AIzaSyBFjbOqiQmIaSi_7Xu2OMoJl4J00AvpeJc",
        authDomain: "trashpanda-82479.firebaseapp.com",
        databaseURL: "https://trashpanda-82479.firebaseio.com",
        projectId: "trashpanda-82479",
        storageBucket: "trashpanda-82479.appspot.com",
        messagingSenderId: "1027839884385"
    });
    static userId = null;
}
ReactDOM.render(<BrowserRouter>
                     <App />
                </BrowserRouter>, document.getElementById('root') || document.createElement('div'));
registerServiceWorker();