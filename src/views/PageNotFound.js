import React, {Component} from 'react';
import UserOverview from '../components/UserOverview';
import 'firebase/firestore'
import '../App.css';
import '../components/TopBar'
import {FirebaseInstance} from '../index';
import TopBar from "../components/TopBar";

class PageNotFound extends Component {
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


    render() {
        return (
            <div>
                <TopBar/>
                <div style={{flex: 1, flexDirection: 'row', display: 'flex'}}>
                    <div style={{display: 'flex', flex: 1 / 2, minHeight: '92.5vh', margin: 0}}>
                        <UserOverview/>
                    </div>
                    <div style={{
                        flex: 1,
                        alignItems: 'center',
                        textAlign: 'center',
                        fontFamily: 'Avenir'
                    }}>
                        <div style={{fontSize:50, color: '#3aafa9'}}>
                            404
                        </div>
                        <div style={{fontSize:30}}>
                            Page not found
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}



export default PageNotFound;
