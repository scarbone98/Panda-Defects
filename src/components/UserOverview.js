import React, {Component} from 'react';
import HistoryEntry from './HistoryEntry'
import 'firebase/firestore'
import {FirebaseInstance} from "../index";
import {BounceLoader} from 'react-spinners';

class UserOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            help: false,
            history: [],
            userScore: '0',
            loading: true
        };
        this.firebase = FirebaseInstance.firebaseApp;
        this.userId = null;
    }

    initializeListeners() {
        this.firebase.firestore().collection('users').doc(this.userId)
            .onSnapshot((snap) => {
                if (snap.data()) {
                    this.setState({
                        userScore: snap.data().userScore
                    })
                }
            });
    }

    getUserHistory() {
        let instance = this;
        this.firebase.firestore().collection('users').doc(this.firebase.auth().currentUser.uid).get().then((snap) => {
            let history = snap.data().postsHistory;
            let posts = [];
            let UIPosts = [];
            const len = history.length;
            let counter = 0;
            for (let i = 0; i < len; i++) {
                history[i].get().then((snap) => {
                    if (snap.data()) {
                        posts.push(snap.data());
                    } else {
                        history.splice(i, 1);
                    }
                    if (++counter >= len) {
                        posts.sort((a, b) => {
                            return Number(b.postTime) - Number(a.postTime);
                        });
                        for (let j = 0; j < posts.length; j++) {
                            UIPosts.push(<HistoryEntry data={posts[j]}/>)
                        }
                        instance.setState({history: UIPosts, loading: false});
                        instance.firebase.firestore().collection('users').doc(this.firebase.auth().currentUser.uid)
                            .update('postsHistory', history).then(() => {
                        }).catch((err)=>{});
                    }
                }).catch(() => {
                    history.splice(i, 1);
                    if (++counter >= len) {
                        posts.sort((a, b) => {
                            return Number(b.postTime) - Number(a.postTime);
                        });
                        for (let j = 0; j < posts.length; j++) {
                            UIPosts.push(<HistoryEntry data={posts[j]}/>)
                        }
                        instance.setState({history: UIPosts, loading: false});
                        instance.firebase.firestore().collection('users').doc(this.firebase.auth().currentUser.uid)
                            .update('postsHistory', history).then(() => {
                        }).catch((err)=>{});
                    }
                })
            }
            this.setState({loading:false});
        }).catch(() => this.setState({loading: false}));
    }

    componentWillMount() {
        let instance = this;
        this.firebase.auth().onAuthStateChanged(function (user) {
            if (!user) {
                window.location.href = "/";
            }
            else {
                instance.userId = user.uid;
                FirebaseInstance.userId = user.uid;
                instance.initializeListeners();
                instance.getUserHistory();
            }
        });
    }

    renderHelp() {
        return (
            <div style={styles.helpModal}>
                <div style={{position: 'relative', width: '100%', height: '100%'}}>
                    <div style={styles.helpText}>
                        1. Create new posts, like or dislike posts, or comment on posts to increase your user score!
                        <br/>
                        <br/>
                        2. Click on the star next to a post to add it to your favorites,
                           or click on comment to jump to the comment thread for the post!
                        <br/>
                        <br/>
                        3. If you find a post offensive you can report it, or if you really like it you can share it
                        to either facebook, twitter, or reddit!
                        <br/>
                        <br/>
                        4. The Top tab filters posts by their number of likes!
                        <br/>
                        <br/>
                        5. The Newest tab filters posts by the most recently added!
                        <br/>
                        <br/>
                        6. The Favorites tab filters posts by the ones you have favored!
                        <br/>
                        <br/>
                        Happy Posting!
                    </div>
                    <div style={{position: 'absolute', right: 10, bottom: 10}}>
                        <button onClick={() => this.setState({help: false})}>Close</button>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div style={styles.mainContainer}>
                <div style={{position: 'relative', width: '100%', height: '100%'}}>
                    <div style={{position: 'absolute', right: 10, top: 10}}>
                        <button onClick={() => this.setState({help: false})}>Help</button>
                    </div>
                    {this.state.help && this.renderHelp()}
                    <div style={{
                        display: 'flex',
                        flex: 1,
                        alignItems: 'center',
                        flexDirection: 'column',
                        fontFamily: 'Avenir'
                    }}>
                        <div className="overview-header">
                            <h1> My Overview </h1>
                        </div>
                        <h3>Points: {this.state.userScore}</h3>
                        <div className="history-header">
                            <h1>My Post History</h1>
                        </div>
                        <div style={styles.scrollView}>
                            <BounceLoader
                                color={'#3aafa9'}
                                loading={this.state.loading}
                                size={60}
                            />
                            {this.state.history}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let styles = {
    mainContainer: {
        display: 'relative',
        flex: 1,
        minWidth: 300,
        backgroundColor: '#f2f2f2',
        justifyContent: 'center',
        padding: 10
    },
    helpModal: {
        position: 'absolute',
        backgroundColor: 'grey',
        borderRadius: 8,
        left: 'calc(50vw - 250px)',
        top: 'calc(50vh - 300px)',
        height: 600,
        width: 500,
        padding: 10
    },
    helpText: {
        color: 'white',
        fontSize: 18
    },
    scrollView: {
        overflow: 'auto',
        maxHeight: '60vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
};
export default UserOverview