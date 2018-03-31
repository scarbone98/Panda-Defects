import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FirebaseInstance} from "../index";
import UpIcon from 'react-icons/lib/io/chevron-up';
import DownIcon from 'react-icons/lib/io/chevron-down';
import {BounceLoader} from 'react-spinners';
import ReactHtmlParser from 'react-html-parser';

import {
    FaAnchor,
    FaAutomobile,
    FaBeer,
    FaBicycle,
    FaBolt,
    FaBug,
    FaCoffee,
    FaCompass,
    FaCut,
    FaDiamond
} from 'react-icons/lib/fa';
import {load as loadEmojis, parse} from "gh-emoji";

class Comment extends Component {
    constructor(props) {
        super(props);
        Comment.propTypes = {
            isOP: PropTypes.bool.isRequired,
            data: PropTypes.object.isRequired
        };
        this.data = this.props.data;
        this.state = {
            imageUrl: null,
            downVoted: false,
            upVoted: false,
            votes: 0,
            isLoading: false,
            postContent:'Loading...'
        };
        this.storage = FirebaseInstance.firebaseApp.storage().ref();
        this.firebase = FirebaseInstance.firebaseApp.firestore();
        this.userId = FirebaseInstance.firebaseApp.auth().currentUser.uid;
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    componentWillMount() {
        this.renderPostContent();
        let index = this.data.key;
        let params = (new URL(document.location)).searchParams;
        let id = params.get("id");
        if (this.data.image) {
            this.storage.child(index).getDownloadURL().then((url) => {
                this.setState({imageUrl: url});
            }).catch((error) => console.log(error.message));
        }
        this.firebase.collection('users').doc(this.userId).get().then(snap => {
            const dislikedPosts = snap.data().dislikedPosts;
            const likedPosts = snap.data().likedPosts;
            if (dislikedPosts.indexOf(this.data.key) > -1) {
                this.setState({downVoted: true});
            }
            else if (likedPosts.indexOf(this.data.key) > -1) {
                this.setState({upVoted: true});
            }
        });
        this.firebase.collection('posts').doc(id)
            .onSnapshot((snap) => {
                if (this.data.icons !== undefined) {
                    this.setState({
                        votes: snap.data().votes,
                        comments: this.data.commentList.length
                    })
                }
                else {
                    let commentList = snap.data().commentList;
                    for (let i = 0; i < commentList.length; i++) {
                        if (commentList[i].key === this.data.key) {
                            this.setState({
                                votes: commentList[i].votes,
                            });
                            break;
                        }
                    }
                }
            });
    }

    renderImage() {
        return (
            <div style={styles.imageContainer}>
                <img style={{maxWidth: '100%', maxHeight: '100%'}} src={this.state.imageUrl}/>
            </div>
        )
    }

    getIcon(iconName) {
        switch (iconName) {
            case 'anchor':
                return (<FaAnchor size={25} color={'white'}/>);
            case 'automobile':
                return (<FaAutomobile size={25} color={'white'}/>);
            case 'beer':
                return (<FaBeer size={25} color={'white'}/>);
            case 'bicycle':
                return (<FaBicycle size={25} color={'white'}/>);
            case 'bolt':
                return (<FaBolt size={25} color={'white'}/>);
            case 'bug':
                return (<FaBug size={25} color={'white'}/>);
            case 'coffee':
                return (<FaCoffee size={25} color={'white'}/>);
            case 'compass':
                return (<FaCompass size={25} color={'white'}/>);
            case 'cut':
                return (<FaCut size={25} color={'white'}/>);
            case 'diamond':
                return (<FaDiamond size={25} color={'white'}/>);
            case 'op':
                return (<div style={{color: 'white', fontFamily: 'Avenir', fontSize: 20}}>OP</div>);
            default:
                return (<div>No Icon</div>);
        }
    }

    renderUserIcon() {
        let color = this.data.color || '#3aafa9';
        return (
            <div>
                <div style={{
                    display: 'flex',
                    flex: 1,
                    maxWidth: 60,
                    maxHeight: 60,
                    minHeight: 60,
                    minWidth: 60,
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30,
                    borderTopRightRadius: 30,
                    borderTopLeftRadius: 30,
                    backgroundColor: color,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: 25,
                    marginRight: 25
                }}>
                    {this.props.isOP ? <div style={{
                        color: 'white',
                        fontFamily: 'Avenir',
                        fontSize: 20
                    }}>OP</div> : this.getIcon(this.data.icon)}
                </div>
            </div>
        )
    }

    deleteComment() {
        if (window.confirm('Delete comment?')) {
            let params = (new URL(document.location)).searchParams;
            let id = params.get("id");
            let postRef = this.firebase.collection('posts').doc(id);
            this.firebase.runTransaction((transaction) => {
                return transaction.get(postRef).then((snap) => {
                    let commentList = snap.data().commentList;
                    let list = snap.data().commentList;
                    for (let i = 0; i < commentList.length; i++) {
                        if (commentList[i].key === this.data.key) {
                            list.splice(i, 1);
                            break;
                        }
                    }
                    transaction.update(postRef, {commentList: commentList});
                });
            }).catch((err)=>{alert(err.message)});
        }
    }

    renderOPPost() {
        return (
            <div style={styles.mainContainer}>
                {this.data.image && this.renderImage()}
                <div style={styles.OPContainer}>
                    <div style={{marginLeft: 105, marginRight: 10, wordBreak: 'break-word'}} className="PostContent">
                        {ReactHtmlParser(this.state.postContent)}
                    </div>
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        fontSize: 28,
                        marginRight: 25,
                        marginLeft: 25,
                        justifyContent: 'flex-end'
                    }}>
                        <div style={{marginRight: 5}}>
                            {this.state.votes}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    renderLoading() {
        return (
            <BounceLoader
                color={'#3aafa9'}
                loading={this.state.loading}
                size={60}
            />)
    }

    renderLikeDislike() {
        return (
            <div>
                {this.upIconRenderer()}
                <div style={{marginRight: 5}}>
                    {this.state.votes}
                </div>
                {this.downIconRenderer()}
            </div>
        )
    }
    renderPostContent(){
        loadEmojis().then(()=>{
            this.setState({postContent: parse(this.data.content)})
        }).catch(()=>{
            this.setState({postContent: this.data.content})
        })
    }
    renderRegularComment() {
        return (
            <div style={styles.mainContainer}>
                <div style={styles.OPContainer}>
                    {this.renderUserIcon()}
                    <div style={{marginRight: 10, wordBreak: 'break-word'}} className="PostContent">
                        {ReactHtmlParser(this.state.postContent)}
                    </div>
                    <div style={{
                        flex: 1,
                        display: 'flex',
                        fontSize: 28,
                        marginLeft: 25,
                        flexDirection: 'row',
                        justifyContent: 'flex-end',
                        textAlign: 'center'
                    }}>
                        <div style={{marginRight: 10, marginLeft: 10}}>
                            {this.state.isLoading?this.renderLoading():this.renderLikeDislike()}
                        </div>
                    </div>
                </div>
                {this.data.userId === FirebaseInstance.firebaseApp.auth().currentUser.uid
                && <button onClick={() => this.deleteComment()}>Delete</button>}
            </div>
        )
    }

    upIconRenderer() {
        if (this.state.upVoted) {
            return (
                <UpIcon size={40} color='#3aafa9' style={{cursor: 'pointer'}}
                        onClick={() => this.voteOnPost(1)}/>
            );
        }
        else {
            return (
                <UpIcon size={40} color='#d3d3d3' style={{cursor: 'pointer'}}
                        onClick={() => this.voteOnPost(1)}/>
            )
        }
    }

    downIconRenderer() {
        if (this.state.downVoted) {
            return (
                <DownIcon size={40} color='#e60000' style={{cursor: 'pointer'}}
                          onClick={() => this.voteOnPost(-1)}/>
            )
        }
        else {
            return (
                <DownIcon size={40} color='#d3d3d3' style={{cursor: 'pointer'}}
                          onClick={() => this.voteOnPost(-1)}/>
            )
        }
    }

    voteOnPost(voteValue) {
        let params = (new URL(document.location)).searchParams;
        let id = params.get("id");
        const userRef = this.firebase.collection("users").doc(this.userId);
        if (this.state.upVoted && voteValue === 1) return;
        if (this.state.downVoted && voteValue === -1) return;
        this.setState({isLoading:true});
        if (this.state.downVoted !== true && this.state.upVoted !== true) {
            this.firebase.runTransaction((transaction) => {
                return transaction.get(userRef).then(snap => {
                    let points = snap.data().userScore;
                    points += 3;
                    transaction.update(userRef, {userScore: points});
                })
            }).catch((error) => {
                this.setState({isLoading:false});
                console.log(error.message)
            });
        }
        this.firebase.runTransaction((transaction) => {
            return transaction.get(userRef).then(snap => {
                let dislikedPosts = snap.data().dislikedPosts;
                let likedPosts = snap.data().likedPosts;
                if (voteValue === 1) {
                    let index = dislikedPosts.indexOf(this.data.key);
                    if (index > -1) {
                        dislikedPosts.splice(index, 1);
                    }
                    likedPosts.push(this.data.key);
                }
                else {
                    let index = likedPosts.indexOf(this.data.key);
                    if (index > -1) {
                        likedPosts.splice(index, 1);
                    }
                    dislikedPosts.push(this.data.key);
                }
                transaction.update(userRef, {dislikedPosts: dislikedPosts, likedPosts: likedPosts});
            })
        }).catch((error) => {
            this.setState({isLoading:false});
            console.log(error.message)
        });


        this.firebase.runTransaction((transaction => {
            const postRef = this.firebase.collection("posts").doc(id);
            return transaction.get(postRef).then(snap => {
                let commentList = snap.data().commentList;
                let comment;
                for (let i = 0; i < commentList.length; i++) {
                    if (commentList[i].key === this.data.key) {
                        comment = commentList[i];
                        commentList.splice(i, 1);
                    }
                }
                if (this.state.upVoted && voteValue === -1) {
                    comment.votes += 2;
                    commentList.push(comment);
                    transaction.update(postRef, {commentList: commentList});
                }
                else if (this.state.downVoted && voteValue === 1) {
                    comment.votes -= 2;
                    commentList.push(comment);
                    transaction.update(postRef, {commentList: commentList});
                }
                else {
                    comment.votes -= voteValue;
                    commentList.push(comment);
                    transaction.update(postRef, {commentList: commentList});
                }
            });
        })).then(() => {
            if (voteValue === 1) {
                this.setState({upVoted: true, downVoted: false, isLoading:false});
            }
            else {
                this.setState({downVoted: true, upVoted: false, isLoading:false});
            }
        });

    }

    render() {
        return (
            <div>
                {this.props.isOP ? this.renderOPPost() : this.renderRegularComment()}
            </div>
        )
    }
}

let styles = {
    commentContainer: {
        display: 'flex',
        flex: 1,
        minWidth: 500,
        minHeight: 150,
        backgroundColor: '#f2f2f2',
        margin: 10,
        padding: 10,
        color: 'black',
    },
    userIconContainer: {
        flex: 1 / 10,
        display: 'flex',
        justifyContent: 'flex-start',
        alignContent: 'center',
        padding: 0,
        margin: 0
    },
    entryImage: {
        backgroundColor: 'gray',
        width: null,
        overflow: 'hidden',
        borderTopRightRadius: 2,
        borderTopLeftRadius: 2
    },
    comment: {
        position: 'absolute',
        bottom: 0,
        right: 0
    },
    mainContainer: {
        margin: 10,
        borderRadius: 2,
        width: 500,
        minWidth: 500
    },
    OPContainer: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 150,
        backgroundColor: '#f2f2f2',
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
    },
    imageContainer: {
        width: 500,
        height: 500,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        display: 'flex',
        backgroundColor: 'grey',
        borderTopRightRadius: 2,
        borderTopLeftRadius: 2
    },
};
export default Comment;