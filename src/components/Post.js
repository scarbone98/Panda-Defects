import React, {Component} from 'react';
import UpIcon from 'react-icons/lib/io/chevron-up';
import DownIcon from 'react-icons/lib/io/chevron-down';
import Star from 'react-icons/lib/io/star';
import PropTypes from 'prop-types';
import {FirebaseInstance} from "../index";
import {Link} from "react-router-dom";
import {load as loadEmojis, parse} from'gh-emoji';
import ReactHtmlParser from 'react-html-parser';
import {BounceLoader} from 'react-spinners';
import "firebase/storage";
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    RedditShareButton,
    RedditIcon

} from 'react-share';

class Post extends Component {
    constructor(props) {
        super(props);
        Post.propTypes = {
            data: PropTypes.object.isRequired
        };
        this.data = this.props.data;
        this.state = {
            imageUrl: null,
            downVoted: false,
            upVoted: false,
            isFavorite: false,
            votes: this.data.votes,
            comments: this.data.commentList.length,
            shareClicked: false,
            isLoading: false,
            postContent:'Loading...'
        };
        this.firestore = FirebaseInstance.firebaseApp.firestore();
        this.storage = FirebaseInstance.firebaseApp.storage().ref();
        this.userId = FirebaseInstance.userId;
    }

    componentWillMount() {
        this.renderPostContent();
        let index = this.data.key;
        this.firestore.collection('users').doc(this.userId || 'lol').get().then(snap => {
            const favorites = snap.data().favoritePosts;
            const dislikedPosts = snap.data().dislikedPosts;
            const likedPosts = snap.data().likedPosts;
            if (favorites.indexOf(this.data.key) > -1) {
                this.setState({isFavorite: true});
            }
            if (dislikedPosts.indexOf(this.data.key) > -1) {
                this.setState({downVoted: true});
            }
            else if (likedPosts.indexOf(this.data.key) > -1) {
                this.setState({upVoted: true});
            }
        });
        this.firestore.collection('posts').doc(this.data.key)
            .onSnapshot((snap) => {
                if (snap.data()) {
                    this.setState({
                        votes: snap.data().votes,
                        comments: this.data.commentList.length
                    })
                }
            });
        if (this.data.image) {
            this.storage.child(index).getDownloadURL().then((url) => {
                this.setState({imageUrl: url});
            }).catch((error) => console.log(error.message));
        }
    }

    renderImage() {
        return (
            <div style={styles.imageContainer}>
                <img style={{maxWidth: '100%', maxHeight: '100%'}} src={this.state.imageUrl}/>
            </div>
        )
    }

    /** Logic that goes into the database and adds the post to the current user's favotite **/
    favoritePost() {
        const userRef = this.firestore.collection("currentUser").doc(this.userId);
        if (!this.state.isFavorite) {
            this.firestore.runTransaction(transaction => {
                return transaction.get(userRef).then(snap => {
                    const favorites = snap.data().favoritePosts;
                    favorites.push(this.data.key);
                    transaction.update(userRef, {favoritePosts: favorites});
                })
            }).then(() => {
                this.setState({
                    isFavorite: true
                });
            }).catch((error) => {
                console.log(error.message)
            })
        } else {
            this.firestore.runTransaction(transaction => {
                return transaction.get(userRef).then(snap => {
                    let favorites = snap.data().favoritePosts;
                    let index = favorites.indexOf(this.data.key);
                    if (index > -1) {
                        favorites.splice(index, 1);
                    }
                    transaction.update(userRef, {favoritePosts: favorites});
                })
            }).then(() => {
                this.setState({
                    isFavorite: false
                });
            }).catch((error) => {
                console.log(error.message)
            })
        }
    }

    /** Favorite button renderer that updates the UI **/
    favoriteIconRenderer() {
        if (this.state.isFavorite) {
            return (
                <Star onClick={() => this.favoritePost()} color="#FFFF33" size={40}/>
            )
        } else {
            return (
                <Star onClick={() => this.favoritePost()} color="#d3d3d3" size={40}/>
            )
        }
    }

    /** Actual functionality of button(Where all of the database logic should go)**/
    voteOnPost(voteValue) {
        const userRef = this.firestore.collection("users").doc(this.userId);
        if (this.state.upVoted && voteValue === 1) return;
        if (this.state.downVoted && voteValue === -1) return;
        this.setState({isLoading:true});
        if (this.state.downVoted !== true && this.state.upVoted !== true) {
            this.firestore.runTransaction((transaction) => {
                return transaction.get(userRef).then(snap => {
                    let points = snap.data().userScore;
                    points -= 3;
                    transaction.update(userRef, {userScore: points});
                })
            }).catch((error) => {
                console.log(error.message)
            });
        }
        this.firestore.runTransaction((transaction) => {
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
            console.log(error.message)
        });


        this.firestore.runTransaction((transaction => {
            const postRef = this.firestore.collection("posts").doc(this.data.key);
            return transaction.get(postRef).then(snap => {
                if (snap.data()) {
                    let votes = snap.data().votes;
                    if (this.state.upVoted && voteValue === -1) {
                        transaction.update(postRef, {votes: votes + 2});
                    }
                    else if (this.state.downVoted && voteValue === 1) {
                        transaction.update(postRef, {votes: votes - 2});
                    }
                    else {
                        transaction.update(postRef, {votes: votes - voteValue});
                    }
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

    /** Just UI renderer for upvote and downvote based on the state of the component **/
    upIconRenderer() {
        if (this.state.upVoted) {
            return (
                <UpIcon size={40} color='#3aafa9' style={{cursor: 'pointer'}}
                        onClick={() => this.voteOnPost(1)}/>
            )
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

    reportPost() {
        this.firestore.runTransaction((transaction) => {
            const postRef = this.firestore.collection("posts").doc(this.data.key);
            return transaction.get(postRef).then((snap) => {
                if (snap.data()) {
                    let reportList = snap.data().reportList;
                    let index = reportList.indexOf(FirebaseInstance.firebaseApp.auth().currentUser.uid);
                    if (index <= -1) {
                        reportList.push(FirebaseInstance.firebaseApp.auth().currentUser.uid);
                        transaction.update(postRef, {reportCount: snap.data().reportCount + 1, reportList: reportList});
                        alert('Successfully reported post.');
                    }
                }
                else {
                    alert('Error, please try again.');
                }
            });
        });
    }

    shareRenderer() {
        return (
            <div style={{flex: 1, flexDirection: 'row', display: 'flex'}}>

                <FacebookShareButton url={window.location.origin + `/comments?id=${this.data.key}`}>
                    <FacebookIcon/>
                </FacebookShareButton>

                <TwitterShareButton url={window.location.origin + `/comments?id=${this.data.key}`}>
                    <TwitterIcon/>
                </TwitterShareButton>

                <RedditShareButton url={window.location.origin + `/comments?id=${this.data.key}`}>
                    <RedditIcon/>
                </RedditShareButton>

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
    sharePost(){
        this.setState({shareClicked: false});
    }
    render() {
        let hasImage = this.data.image;
        let showShare = this.state.shareClicked;
        return (
            <div style={styles.mainContainer}>
                {showShare && this.shareRenderer()}
                {hasImage && this.renderImage()}
                <div style={styles.contentContainer}>
                    <div style={styles.postText} className="PostContent">
                        {ReactHtmlParser(this.state.postContent)}
                    </div>
                    <div style={styles.votesText}>
                        {this.state.isLoading ? this.renderLoading() : this.renderLikeDislike()}
                        <div style={{fontSize: 12}}>
                            <div id="sharePost" onClick={() => this.sharePost()}
                                 className="ShareLabel">
                                Share
                            </div>
                            <div id="reportPost" onClick={() => this.reportPost()}
                                 className="ShareLabel">
                                Report
                            </div>
                            <Link to={`/comments?id=${this.data.key}`} className="CommentsLink">
                                Comments(0)
                            </Link>
                            {this.favoriteIconRenderer()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

let styles = {
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
    contentContainer: {
        display: 'flex',
        flex: 1,
        minHeight: 150,
        backgroundColor: '#f2f2f2',
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
    },
    postText: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 50,
        wordBreak: 'break-word'
    },
    votesText: {
        fontSize: 25,
        display: 'flex',
        alignItems: 'center',
        marginRight: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center'
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
    }
};
export default Post;