const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.createGroup = functions.firestore.document('Group/{groupID}').onCreate((event) => {
    let groupID = event.params.groupID;
    var dataref = db.collection('Group').doc(groupID).get().then(
        function(doc){
            if (!doc.exists) {
                console.warn('No such document!');
            } else {
                var group = doc.data();
                var admins = group.Administrators;
                var users = group.Members;
                for (user in users) {
                    var setDoc = db.collection('users').doc(users[user]).collection("groups").doc(groupID).set({
                        id: groupID
                    });
                }
                db.collection('Group').doc(groupID).update({Processing: 'complete'})
            }
        }
    ).catch(err => {
        console.warn('Error getting document', err);
    });

    return true;
})

exports.modifyUser = functions.firestore.document('users/{userID}/groups/{groupID}').onUpdate((event) => {
    const user = event.data;
    let uid = user.uid;
    if (event.params.userId == uid) {
        var data = {
            name: 'Test Group',
            state: 'CA',
            country: 'USA'
        };

    }
})

exports.addModifyGroup = functions.firestore.document('Group/{groupID}').onUpdate(function(event){
let groupID = event.params.groupID;
var dataref = db.collection('Group').doc(groupID).get().then(
    function(doc){
        if (!doc.exists) {
            console.warn('No such document!');
        } else {
            var group = doc.data();
            var users = group.Members;
            for (user in users) {
                var checkDoc = db.collection('users').doc(users[user]).collection("groups").doc(groupID).get().then(function(doc){
                    if (!doc.exists){
                        var setDoc = db.collection('users').doc(users[user]).collection("groups").doc(groupID).set({
                            id: groupID
                        });
                    }
                })
            }
            db.collection('Group').doc(groupID).update({Processing: 'complete'})
        }
    }
).catch(err => {
    console.warn('Error getting document', err);
});

return true;
})

exports.addGroupMember = functions.firestore.document('Group/{groupID}/email_addr/{address}').onCreate(function(event){
    var groupID = event.params.groupID;
    var eaddress = event.params.address;
    var checkDoc = db.collection('Group').doc(groupID).collection("email_addr").doc(eaddress).get().then(function(doc){
        if(doc.data().processed == false){
            admin.auth().getUserByEmail(doc.data().email).then(function(userRecord){
                var userid = userRecord.uid;
                var setDoc = db.collection('Group').doc(groupID)
                setDoc.get().then(function(doc){
                    var members = doc.data().Members;
                    var newmembers = members.push(userid);
                    setDoc.update({
                        Members: members
                    })
                })
            }).catch(function(error){
                console.warn(error)
                db.collection('Group').doc(groupID).collection("email_addr").doc(eaddress).delete();
            })
        }
    })
})
/*
exports.JoinCode = functions.firestore.document('Group/{groupID}/joinCodeActive').onUpdate((event) => {

*/