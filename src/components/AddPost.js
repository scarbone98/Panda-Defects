import React, {Component} from 'react';
import AddIcon from 'react-icons/lib/io/plus';
import EmojiPicker from 'react-emoji-picker';
import {FirebaseInstance} from "../index";
import PropTypes from 'prop-types';
import "firebase/storage";

const colors = ["red", "blue", "orange", "pink", "gray", "yellow", "black", "brown", "purple", "white"];
const iconNames = ["anchor", "beer", "bicycle", "bolt", "bug", "coffee", "compass", "cut", "diamond", "automobile"];

class AddPost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            addPost: false,
            numberOfChars: 0,
            postContent: '',
            hasImage: false,
            emoji: '',
            emojiToggled: false,
            addEmoji: 'Add Emojois',
            closeEmoji: 'Close Emojis'
        };
        AddPost.propTypes = {
            isComment: PropTypes.bool.isRequired,
            postId: PropTypes.string
        };
        this.firebase = FirebaseInstance.firebaseApp;
        this.storage = FirebaseInstance.firebaseApp.storage().ref();
        this.image = null;
    }

    componentWillMount() {
        FirebaseInstance.firebaseApp.auth().onAuthStateChanged(function (user) {
            if (!user) {
                window.location.href = "/";
            }
        });
    }

    updateText(event) {
        let value = event.target.value;
        if (value.length !== 256) {
            this.setState({numberOfChars: value.length, postContent: value})
        }
    }

    createPost() {
        if (this.state.numberOfChars !== 0) {
            alert('Please enter valid characters (not counting emojis).');
            return;
        }
        let ref = this.firebase.firestore().collection('pictures').doc();
        let icons = [];
        for (let i = 0; i < 10; i++) {
            icons.push({icon: iconNames[i], colors: colors});
        }
        let post = {
            icons: icons,
            content: '',
            user: this.firebase.auth().currentUser.uid,
            commentList: [],
            votes: 0,
            postTime: new Date(),
            key: ref.id,
            image: this.state.hasImage,
            reportCount: 0,
            reportList: [],
            uniqueComments: 0,
            commentUsers: []
        };
        if (this.state.hasImage) {
            this.storage.child(ref.id).put(this.image)
                .catch((err) => {
                    alert(err.message)
                });
        }
        this.firebase.firestore().runTransaction((transaction) => {
            let userPath = this.firebase.firestore().collection('myUsers').doc(FirebaseInstance.userId);
            return transaction.get(userPath).then((snap) => {
                let history = snap.data().postsHistory;
                history.push(ref);
                transaction.update(userPath, {postsHistory: history});
                transaction.set(ref, post);
            }).then(() => {
                this.setState({addPost: false, postContent: ''});
            }).catch((err) => {
                alert(err.message);
            });
        }).catch((error) => alert(error.message));
    }

    createComment() {
        if (this.state.numberOfChars !== 0) {
            alert('Please enter valid characters (not counting emojis).');
            return;
        }
        this.firebase.firestore().runTransaction((transaction) => {
            let postPath = this.firebase.firestore().collection('posts').doc(this.props.postId);
            return transaction.get(postPath).then((snap) => {
                let userId = FirebaseInstance.firebaseApp.auth().currentUser.uid;
                let commentList = snap.data().commentList;
                let commentUsers = snap.data().commentUsers;
                //Check if author of post is commenting
                if (userId === snap.data().user) {
                    let commentObject = {
                        userId: userId,
                        color: '#3aafa9',
                        content: this.state.postContent,
                        icon: 'op',
                        key: snap.data().key + (snap.data().uniqueComments),
                        reportCount: 0,
                        votes: 0,
                        postTime: new Date()
                    };
                    commentList.push(commentObject);
                    return transaction.update(postPath, {
                        commentList: commentList,
                        uniqueComments: snap.data().uniqueComments + 1
                    });
                }

                let icons = snap.data().icons;
                let color = null;
                let icon = null;
                for (let i = 0; i < commentUsers.length; i++) {
                    if (commentUsers[i].userId === userId) {
                        color = commentUsers[i].color;
                        icon = commentUsers[i].icon;
                    }
                }
                if (color && icon) {
                    let commentObject = {
                        userId: userId,
                        color: 'white',
                        content: this.state.postContent,
                        icon: icon,
                        key: snap.data().key + (snap.data().uniqueComments),
                        reportCount: 0,
                        votes: 0,
                        postTime: new Date()
                    };
                    commentList.push(commentObject);
                    return transaction.update(postPath, {
                        commentList: commentList,
                        uniqueComments: snap.data().uniqueComments + 1
                    });
                }
                else {
                    let iLen = icons.length - 1;
                    let indexOfIcon = Math.round(iLen * Math.random());
                    let icon = icons[indexOfIcon];
                    let colorsLen = icon.colors.length - 1;
                    color = icon.colors.splice([Math.round(colorsLen * Math.random())], 1)[0];
                    icons[indexOfIcon] = icon;
                    let commentObject = {
                        userId: userId,
                        color: 'white',
                        content: this.state.postContent,
                        icon: icon.icon,
                        key: snap.data().key + (snap.data().uniqueComments),
                        reportCount: 0,
                        votes: 0,
                        postTime: new Date()
                    };
                    let commentUser = {
                        userId: userId,
                        icon: icon.icon,
                        color: 'white'
                    };
                    commentUsers.push(commentUser);
                    commentList.push(commentObject);
                    return transaction.update(postPath,
                        {
                            commentList: commentList,
                            uniqueComments: snap.data().uniqueComments + 1,
                            commentUsers: commentUsers
                        });
                }
            }).then(() => {
                this.setState({addPost: false, postContent: ''});
            })
        });
    }

    loadImage(event) {
        this.image = event.target.files[0];
        this.setState({hasImage: true});
    }

    grabKeyPress(e) {
        if (e.keyCode === 13) {
            e.preventDefault()
        }
    }

    triggerAddPostOrCommentModal() {
        if (this.props.isComment) {
            return (
                <div style={styles.addModal}>
                    <button onClick={() => this.setState({addPost: false})}>Close</button>
                    <button onClick={() => this.setState({emojiToggled: !this.state.emojiToggled})}>
                        {this.state.emojiToggled ? this.state.closeEmoji : this.state.addEmoji}
                    </button>
                    <div>
                    <textarea style={styles.textInput} value={this.state.postContent}
                              onChange={(event) => this.updateText(event)}/>
                        <br/>
                        {this.state.numberOfChars}/140
                        {this.toggleEmojiPicker()}
                        <button onClick={() => this.createComment()}>Post</button>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div style={styles.addModal}>
                    <button onClick={() => this.setState({addPost: false})}>Close</button>
                    <button onClick={() => this.setState({emojiToggled: !this.state.emojiToggled})}>
                        {this.state.emojiToggled ? this.state.closeEmoji : this.state.addEmoji}
                    </button>
                    {/*Add Post*/}
                    <div>
                        <textarea style={styles.textInput} value={this.state.postContent}
                                  onChange={(event) => this.updateText(event)}
                                  onKeyDown={(e) => this.grabKeyPress(e)}/>
                        <input type="file" style={{display: 'hidden'}} accept="image/*"
                               onChange={(event) => this.loadImage(event)}/>
                        {this.state.numberOfChars}/140
                        {this.toggleEmojiPicker()}
                        <button onClick={() => this.createPost()}>Post</button>
                    </div>
                </div>
            )
        }
    }

    toggleEmojiPicker() {
        if (this.state.emojiToggled && false) {
            return (
                <EmojiPicker
                    style={styles.emojiPickerStyles}
                    onSelect={(emoji) => this.setState({postContent: this.state.postContent + emoji})}
                    query={this.state.emoji}
                />
            )
        }
    }

    toggleModal() {
        this.setState({addPost: !this.state.addPost})
    }

    render() {
        return (
            <div>
                <div style={{position: 'absolute', right: 20, bottom: 20}}>
                    <AddIcon onClick={() => this.toggleModal()} size={40}/>
                </div>
                {this.state.addPost && this.triggerAddPostOrCommentModal()}
            </div>
        );
    }
}

const styles = {
    addModal: {
        borderRadius: 2,
        position: 'absolute',
        height: 400,
        width: 500,
        backgroundColor: '#696969',
        left: 'calc(50vw - 250px)',
        top: 'calc(50vh - 275px)',
        color: 'white',
        textAlign: 'center'
    },
    textInput: {
        width: 450,
        height: 200,
        resize: 'none',
        fontSize: 24,
        fontFamily: 'Avenir'
    },
    emojiPickerStyles: {
        position: 'absolute',
        left: 0, top: '3.9rem',
        backgroundColor: 'white',
        width: '100%',
        padding: '.3em .6em',
        border: '1px solid #0074d9',
        borderTop: 'none',
        zIndex: '2'
    }
};
export default AddPost;