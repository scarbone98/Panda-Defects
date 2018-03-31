import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {FirebaseInstance} from "../index";
import {load as loadEmojis, parse} from "gh-emoji";
import ReactHtmlParser from 'react-html-parser';
class HistoryEntry extends Component {
    constructor(props) {
        super(props);
        HistoryEntry.propTypes = {
            data: PropTypes.object.isRequired
        };
        this.data = this.props.data;
        this.state = {
            imageUrl: null,
            postContent: 'Loading...'
        };
        this.storage = FirebaseInstance.firebaseApp.storage().ref();
    }
    componentWillMount(){
        this.renderPostContent();
    }
    renderPostContent(){
        loadEmojis().then(()=>{
            this.setState({postContent: parse(this.data.content)})
        }).catch(()=>{
            this.setState({postContent: this.data.content})
        })
    }
    render() {
        return (
            <div style={styles.container} className="HistoryLink"
                 onClick={() => {
                     window.location.href = `/comments?id=${this.data.key}`
                 }}>
                <div style={{marginLeft: 25,wordBreak: 'break-word'}} className="PostContent">
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
                    <div>
                        0
                    </div>
                </div>
            </div>
        );
    }
}

let styles = {
    container: {
        display: 'flex',
        flex: 1,
        minWidth: 400,
        minHeight: 100,
        maxWidth: 400,
        backgroundColor: '#3aafa9',
        margin: 10,
        padding: 10,
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    }
};
export default HistoryEntry;