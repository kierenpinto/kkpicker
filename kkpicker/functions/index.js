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

/* *********** Create Group
Sets up group in backend.  
*/
exports.createGroup = functions.firestore.document('Group/{groupID}').onCreate((event) => {
    let groupID = event.params.groupID;
    var dataref = db.collection('Group').doc(groupID).get().then(
        function (doc) {
            if (!doc.exists) {
                console.warn('No such document!');
            } else {
                db.collection('Group').doc(groupID).collection('Members').get().then(function (querySnapshot) {
                    querySnapshot.forEach(function (doc) {
                        db.collection('users').doc(doc.id).collection("groups").doc(groupID).set({
                            id: groupID
                        });
                    })
                })
                db.collection('Group').doc(groupID).update({ Processing: 'complete' })
            }
        }
    ).catch(err => {
        console.warn('Error getting document', err);
    });

    return true;
})

/* Unfinished
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
*/
/** Add group membership to user profile */
var syncMembers = function (users, groupID) {
    for (user in users) {
        var checkDoc = db.collection('users').doc(users[user]).collection("groups").doc(groupID).get().then(function (doc) {
            if (!doc.exists) {
                var setDoc = db.collection('users').doc(users[user]).collection("groups").doc(groupID).set({
                    id: groupID
                });
            }
        })
    }
}
var assign = function (groupID) {
    db.collection('Group').doc(groupID).collection("Members").get().then(function (querySnapshot) {
        var list = [];
        var assigned = [];
        querySnapshot.forEach(function (doc) {
            list.push(doc.id)
        })
        var list_copy = list.slice(0);
        for (member in list){
            var no = 0;
            while(list_copy[no]==list[member]){
                no = Math.abs(Math.round(Math.random()*list_copy.length-1));
            }
            assigned.push(list_copy[no])
            list_copy.splice(no,1)
        }
        for (member in list){
            db.collection('Group').doc(groupID).collection("Members").doc(list[member]).update({
                'partner_uid': assigned[member]
            })
        }
    })
}
/******** Modification of Groups */
exports.ModifyGroup = functions.firestore.document('Group/{groupID}').onUpdate(function (event) {
    let groupID = event.params.groupID;
    var dataref = db.collection('Group').doc(groupID).get().then(
        function (doc) {
            if (!doc.exists) {
                console.warn('No such document!');
            } else {
                db.collection('Group').doc(groupID).update({ Processing: 'complete' });
                //Check for deletion of group
                if (doc.data().deleted == true) {
                    db.collection('Group').doc(groupID).collection('Members').get().then(function (querySnapshot) {
                        querySnapshot.forEach(function (doc) {
                            delUID = doc.data().uid;
                            db.collection('users').doc(delUID).collection('groups').doc(groupID).delete();
                        })
                    })
                    db.collection('Group').doc(groupID).delete();
                }
                //Check for assignment
                if (doc.data().assign == true) {
                    assign(groupID);
                }
            }
        }
    ).catch(err => {
        console.warn('Error getting document', err);
    });

    return true;
})

/** Add member to group by Group Admin */
exports.addGroupMember = functions.firestore.document('Group/{groupID}/email_addr/{address}').onCreate(function (event) {
    var groupID = event.params.groupID;
    var eaddress = event.params.address;
    var checkDoc = db.collection('Group').doc(groupID).collection("email_addr").doc(eaddress).get().then(function (doc) {
        if (doc.data().processed == false) {
            admin.auth().getUserByEmail(doc.data().email).then(function (userRecord) {
                var userid = userRecord.uid;
                var setDoc = db.collection('Group').doc(groupID)
                setDoc.collection("Members").doc(userid).set({ uid: userid });
            }).catch(function (error) {
                console.warn(error)
                db.collection('Group').doc(groupID).collection("email_addr").doc(eaddress).delete();
            })
        }
    })
})

exports.modGroupMember = functions.firestore.document('Group/{groupID}/Members/{memberID}').onUpdate(function (event) {
    var groupID = event.params.groupID;
    var memberID = event.params.memberID;
    // Check if member is to be removed and then remove member.
    var checkDoc = db.collection('Group').doc(groupID).collection('Members').doc(memberID).get().then(function (doc) {
        if (doc.data().deleted == true) {
            db.collection('users').doc(memberID).collection('groups').doc(groupID).delete();
            db.collection('Group').doc(groupID).collection('Members').doc(memberID).delete();
        }
    })
    return;
})

exports.updateDB = functions.https.onRequest((req, res) => {
    //Look for old database entries and migrate to new entries
    db.collection('Group').get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            var mem_collect = db.collection('Group').doc(doc.id);
            mem_collect.get().then(function (doc) {
                var members = doc.data().Members;
                for (member in members) {
                    mem_collect.collection("Members").doc(members[member]).set({
                        'uid': members[member]
                    });
                }
            })
        })
    })
})
/*
exports.JoinCode = functions.firestore.document('Group/{groupID}/joinCodeActive').onUpdate((event) => {

*/