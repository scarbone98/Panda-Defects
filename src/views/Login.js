import React, {Component} from 'react';
import 'firebase/firestore';
// import '../App.css';
import {FirebaseInstance} from '../index';

class Login extends Component {
    constructor(props) {
        super(props);
        this.email = '';
        this.password = '';
        this.posts = [];
        this.state = {
            error: false,
            errorMessage: ""
        };
        this.firebase = FirebaseInstance.firebaseApp;
    }

    componentWillMount() {
        let listener = this.firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                window.location.href = "newest";
            }
            else {
                //Disable listener if no user is logged in.
                listener();
            }
        });
    }

    updatePassword(evt) {
        this.password = evt.target.value;
    }

    updateEmail(evt) {
        this.email = evt.target.value;
    }

    registerUser() {
        let instance = this;
        this.firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((user) => {

            if (user) {
                let userModel = {
                    userScore: 0,
                    postsHistory: [],
                    likedPosts: [],
                    dislikedPosts: [],
                    favoritePosts: [],
                    notificationsEnabled: false,
                    notificationToken: ''
                };
                this.firebase.firestore().collection('users').doc(user.uid).set(userModel).then(() => {
                    window.location.href = "newest";
                });
            }

        }).catch((error) => {
            instance.setState({
                errorMessage: error.message,
                error: true
            });
        });
    }

    signInUser() {
        let instance = this;
        this.firebase.auth().signInWithEmailAndPassword(this.email, this.password).then((user) => {

            if (user) {
                window.location.href = "newest";
            }

        }).catch((error) => {
            instance.setState({
                errorMessage: error.message,
                error: true
            });
        });
    }

    renderError() {
        return (
            <div style={styles.errorContainer}>
                {this.state.errorMessage}
            </div>
        )
    }

    render() {
        return (
            <div style={styles.container} className="background">
                <div className="login-box">
                        <div className="welcome-sign">
                            Welcome to ChatPanda!
                        </div>
                        <div className="emailInput">
                            <input placeholder="Email" onChange={evt => this.updateEmail(evt)}/>
                        </div>
                        <div className="passwordInput">
                            <input placeholder="Password" type="password" onChange={evt => this.updatePassword(evt)}/>
                        </div>
                        <button className="signup-btn" onClick={this.registerUser.bind(this)}>Sign Up</button>
                        <button className="login-btn" onClick={this.signInUser.bind(this)}>Login</button>
                        {this.state.error && this.renderError()}
                </div>
            </div>
        );
    }
}

let styles = {

    container: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        textAlign: 'center',
        alignContent: 'center',
        width: '100%',
        height: '100%'
    },

    errorContainer: {
        color: 'grey',
        backgroundColor: 'white'
    }
};
export default Login;
