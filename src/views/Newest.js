import React, {Component} from 'react';
import Post from '../components/Post';
import UserOverview from '../components/UserOverview';
import 'firebase/firestore'
import '../App.css';
import '../components/TopBar'
import {FirebaseInstance} from '../index';
import AddPost from '../components/AddPost';
import TopBar from "../components/TopBar";
import {BounceLoader} from 'react-spinners';
import FaRefresh from 'react-icons/lib/fa/repeat';

class Newest extends Component {
    constructor(props) {
        super(props);
        this.posts = [];
        this.state = {
            posts: [],
            loading: false
        };
        this.firebaseInstance = FirebaseInstance.firebaseApp;
        this.firestore = this.firebaseInstance.firestore();
    }

    componentWillMount() {
        FirebaseInstance.firebaseApp.auth().onAuthStateChanged(function (user) {
            if (!user) {
                window.location.href = "/";
            }
        });
    }

    loadPosts() {
        this.setState({loading: true, posts: []});
        this.posts = [];
        this.firestore.collection('posts').orderBy('postTime', 'asc').get().then((snap) => {
            snap.forEach((child) => {
                this.posts.push(<Post data={child.data()}/>)
            });
            this.setState({posts: this.posts, loading: true});
        }).catch((err)=>alert(err.message));
    }

    renderRefresh() {
        return (
            <div style={{position:'absolute', right: 20, top: 'calc(8vh)'}}>
                <FaRefresh size={30} onClick={()=>this.loadPosts()}/>
            </div>
        )
    }

    componentDidMount() {
        this.loadPosts();
    }

    render() {
        return (
            <div>
                <TopBar/>
                {this.renderRefresh()}
                <div style={{flex: 1, flexDirection: 'row', display: 'flex'}}>
                    <div style={{display: 'flex', flex: 1 / 2, minHeight: '92.5vh', margin: 0}}>
                        <UserOverview/>
                    </div>
                    <div style={{flex: 1, alignItems: 'center'}}>
                        <div style={styles.scrollView}>
                            <BounceLoader
                                color={'#3aafa9'}
                                loading={this.state.loading}
                                size={60}
                            />
                            {this.state.posts}
                        </div>
                    </div>
                </div>
                <AddPost isComment={false}/>
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
export default Newest;
