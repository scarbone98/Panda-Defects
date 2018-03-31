import React, {Component} from 'react';
import 'firebase/firestore'
import '../App.css';
import '../components/TopBar'
import {FirebaseInstance} from '../index';
import TopBar from "../components/TopBar";

class Settings extends Component {
    constructor(props) {
        super(props);
        this.posts = [];
        this.state = {
            posts: [],
            getNotifs: true,
            loading: true
        };
        this.firebaseInstance = FirebaseInstance.firebaseApp;
        this.firestore = this.firebaseInstance.firestore();
        this.firebase = this.firebaseInstance.database();
    }

    componentWillMount() {

    }

    componentDidMount() {
        let instance = this;
        FirebaseInstance.firebaseApp.auth().onAuthStateChanged(function (user) {
            if (!user) {
                window.location.href = "/";
            }
            else {
                instance.firestore.collection('users').doc(user.uid).get().then((snap) => {
                    instance.setState({getNotifs: snap.data().notificationsEnabled, loading: false})
                });
            }
        });
    }

    deleteAccount() {
        if (window.confirm('Are you sure you want to delete your account?')) {
            let userRef = this.firestore.collection('users').doc(FirebaseInstance.firebaseApp.auth().currentUser.uid);
            userRef.delete().then(() => {
                this.firebaseInstance.auth().currentUser.delete().then(() => {
                    window.location.href = "/";
                }).catch(() => {
                    alert('Please re-login to delete account.');
                    this.firebaseInstance.auth().signOut();
                });
            }).catch((error) => alert(error.message));
        }
    }

    requestPermission() {

    }

    toggleNotifications() {
        this.setState({loading: true});
        this.firestore.runTransaction((transaction) => {
            let userRef = this.firestore.collection('users').doc(FirebaseInstance.firebaseApp.auth().currentUser.uid);
            return transaction.get(userRef).then((snap) => {
                transaction.update(userRef, {
                    notificationsEnabled: !snap.data().notificationsEnabled,
                    notificationToken: 'hi'
                });
            });
        }).then(() => {
            this.setState({getNotifs: true, loading: false});
        }).catch((err) => {
            alert(err.message);
            this.setState({loading: false});
        });
    }

    signOut(){
        this.firebaseInstance.auth().signOut();
    }

    render() {
        return (
            <div style={{position: 'relative'}}>
                <TopBar/>
                <div style={styles.container}>
                    <h1>SETTINGS</h1>
                </div>
                <button id="signOut" onClick={() => console.log('sign out')}>SignOut</button>
                <button onClick={() => this.signOut()}>Delete Account</button>
                {this.state.getNotifs ?
                    <button disabled={this.state.loading} onClick={() => this.toggleNotifications()}>Disable
                        Notifications</button>
                    : <button disabled={this.state.loading} onClick={() => this.toggleNotifications()}>Enable
                        Notifications</button>}
            </div>
        );
    }
}

let styles = {
    container: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center'
    }
};
export default Settings;