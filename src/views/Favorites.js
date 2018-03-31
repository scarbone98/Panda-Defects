import React, {Component} from 'react';
import Post from '../components/Post';
import UserOverview from '../components/UserOverview';
import 'firebase/firestore'
import '../App.css';
import '../components/TopBar'
import {FirebaseInstance} from '../index';
import TopBar from "../components/TopBar";

class Favorites extends Component {
    constructor(props) {
        super(props);
        this.posts = [];
        this.state = {
            posts: []
        };
        this.firebaseInstance = FirebaseInstance.firebaseApp;
        this.firestore = this.firebaseInstance.firestore();
        this.userId = FirebaseInstance.userId;
    }

    componentWillMount() {
        let instance = this;
        this.firebaseInstance.auth().onAuthStateChanged(function (user) {
            if (!user) {
                window.location.href = "/";
            }
            else {
                instance.getFavorites(user);
            }
        });
    }
    getFavorites(user){
        this.firestore.collection('users').doc(user.uid).get().then((snap) => {
            let favorites = snap.data().favoritePosts;
            const len = favorites.length;
            let counter = 0;
            for (let i = 0; i < len; i++) {
                this.firestore.collection('posts').doc(favorites[i]).get().then((snap) => {
                    if(snap.data()) {
                        this.posts.push(<Post data={snap.data()}/>);
                    }
                    else{
                        let index = favorites.indexOf(favorites[i]);
                        favorites.splice(index,1);
                    }
                    if (++counter >= len - 1) {
                        this.setState({posts: this.posts});
                        this.firestore.collection('users').doc(user.uid)
                            .update('favoritePosts',favorites).then(()=>{})
                    }
                }).catch(() => {
                    let index = favorites.indexOf(favorites[i]);
                    favorites.splice(index,1);
                    if (++counter >= len - 1) {
                        this.setState({posts: this.posts});
                        this.firestore.collection('users').doc(user.uid)
                            .update('favoritePosts',favorites).then(()=>{})
                    }
                })
            }
        }).catch((err)=>{alert(err.message)});
    }
    render() {
        return (
            <div>
                <TopBar/>
                <div style={{flex: 1, flexDirection: 'row', display: 'flex'}}>
                    <div style={{display: 'flex', flex: 1 / 2, minHeight: '92.5vh', margin: 0}}>
                        <UserOverview/>
                    </div>
                    <div style={{flex: 1, alignItems: 'center'}}>
                        <div style={styles.scrollView}>
                            {this.state.posts}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let styles = {
    scrollView: {
        overflow: 'auto',
        maxHeight: '92.5vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    }
};
export default Favorites;
