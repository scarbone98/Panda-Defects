import React, {Component} from 'react';
import AddPost from '../components/AddPost'
import UserOverview from '../components/UserOverview';
import 'firebase/firestore'
import '../App.css';
import '../components/TopBar'
import {FirebaseInstance} from '../index';
import TopBar from "../components/TopBar";
import Comment from "../components/Comment";
import { BounceLoader } from 'react-spinners';
import FaRefresh from 'react-icons/lib/fa/repeat';

class Comments extends Component {
    constructor(props) {
        super(props);
        this.posts = [];
        this.state = {
            posts: [],
            loading:true
        };
        this.firebaseInstance = FirebaseInstance.firebaseApp;
        this.firestore = this.firebaseInstance.firestore();
    }

    componentWillMount() {
        this.loadComments();
    }
    loadComments(){
        let params = (new URL(document.location)).searchParams;
        let id = params.get("id") || 'mockId';
        this.setState({loading:true, posts: []});
        this.firestore.collection('posts').doc(id).get().then((snap) => {
            if(snap.data()) {
                const posts = snap.data().commentList;
                let postsArray = [];
                let postsData = [];
                postsArray.push(<Comment isOP={true} data={snap.data()}/>);
                posts.forEach((child) => {
                    child.user = snap.data().user;
                    postsData.push(child);
                });
                postsData.sort((a, b) => {
                    return Number(a.postTime) - Number(b.postTime);
                });
                for (let i = 0; i < postsData.length; i++) {
                    postsArray.push(<Comment isOP={false} data={postsData[i]}/>)
                }
                this.setState({posts: postsArray, loading:false});
            }
            else{
                this.setState({loading:false});
                alert('Sorry post no longer exists');
                window.location.href = "/newest";
            }
        }).catch((err)=>alert(err.message));
    }
    renderLoading(){
        return(
            <BounceLoader
                color={'#3aafa9'}
                loading={this.state.loading}
                size={60}
            />
        )
    }
    renderRefresh() {
        return (
            <div style={{position:'absolute', right: 20, top: 'calc(8vh)'}}>
                <FaRefresh size={30} onClick={()=>this.loadComments()}/>
            </div>
        )
    }

    render() {
        let params = (new URL(document.location)).searchParams;
        let id = params.get("id");
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
                            {this.state.loading && this.renderLoading()}
                            {this.state.posts}
                        </div>
                    </div>
                </div>
                <AddPost isComment={true} postId={id}/>
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
export default Comments;