const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.deletePosts = functions.firestore.document("posts/{post}").onUpdate((event) => {
    if (event.data.data().votes <= -500) {
        event.data.ref.delete();
    }
    if (event.data.data().reportCount >= 3 + (Math.round(event.data.data().votes/10))){
        event.data.ref.delete();
    }
    let commentList = event.data.data().commentList;
    for(let i = 0; i < commentList.length; i++){
        if(commentList[i].votes <= -5){
            commentList.splice(i,1);
        }
    }
    event.data.ref.update({commentList: commentList});
});

// exports.sendNotification = functions.firestore.document("posts/{post}").onUpdate((event) => {
//     let ownerId = event.data.data().user;
//     let currentUps = event.data.data().votes;
//     if(currentUps % 10 === 0 && currentUps > 0){
//
//     }
// });
// exports.sendNotification = functions.firestore.document("posts/{post}").onUpdate((event) => {
//     let usersSubscribed = event.data.data().userTokens;
//     let owner = event.data.data().ownerToken;
//     let currentNumberOfUps = event.data.data().votes;
//     let previousNumberOfUps = event.data.previous.data().votes;
//
//     let previousCommentList = event.data.previous.data().commentList;
//     let currentCommentList = event.data.data().commentList;
//     if (currentNumberOfUps % 10 === 0 && currentNumberOfUps !== previousNumberOfUps && currentNumberOfUps > 0) {
//         let payload = {
//             notification: {
//                 title: 'Post Updates',
//                 body: 'Your post has ' + currentNumberOfUps + ' ups!',
//                 sound: 'default'
//             }
//         };
//         // admin.messaging().sendToDevice(owner, payload).then(() => {
//         // });
//         // for (let i = 0; i < usersSubscribed.length; i++) {
//         //     console.log(usersSubscribed[i]);
//         //     admin.messaging().sendToDevice(usersSubscribed[i], payload).then(() => {
//         //         console.log('Success!');
//         //     }).catch((err)=>{
//         //         console.log(err.message);
//         //     });
//         // }
//     }
//     if (previousCommentList.length < currentCommentList.length) {
//         let payload = {
//             notification: {
//                 title: 'Post Updates',
//                 body: 'There are new comments on your post',
//                 sound: 'default'
//             }
//         };
//         // admin.messaging().sendToDevice(owner, payload).then(() => {
//         // });
//         // for (let i = 0; i < usersSubscribed.length; i++) {
//         //     admin.messaging().sendToDevice(usersSubscribed[i], payload).then(() => {
//         //         console.log('Success!');
//         //     }).catch((err) => {
//         //         console.log(err.message);
//         //     });
//         // }
//     }
// });