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
assign = function (groupID) {
    db.collection('Group').doc(groupID).collection("Members").get().then(function (querySnapshot) {
        list = [];
        assigned = [];
        var assigned_ind = [];
        querySnapshot.forEach(function (doc) {
            list.push(doc.id)
        })
        list_copy = list.slice(0);
        var no = 0;
        for (member in list) {
            no = Math.round(Math.random() * (list_copy.length - 1));            
            while (list_copy[no] == list[member]) {
                no = Math.round(Math.random() * (list_copy.length - 1));
                if (list_copy.length == 1) {
                    var temp = assigned.pop();
                    assigned.push(list_copy[no])
                    assigned.push(temp);
                    list_copy.splice(no, 1);
                    break;
                }
            }
            if (list_copy.length > 0) {
                assigned.push(list_copy[no])
                list_copy.splice(no, 1)
            }
        }
        for (member in list) {
            db.collection('Group').doc(groupID).collection("Members").doc(list[member]).update({
                'partner_uid': assigned[member]
            })
        }
        db.collection('Group').doc(groupID).update({assign_complete: true})
    })
}
var un_assign = function (groupID) {
    var FieldValue = require("firebase-admin").firestore.FieldValue;
    db.collection('Group').doc(groupID).collection("Members").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            db.collection('Group').doc(groupID).collection("Members").doc(doc.id).update({
                'partner_uid': FieldValue.delete()
            })
        })
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
                    deleteCollection(db, db.collection('Group').doc(groupID).collection('Members'), 10);
                    deleteCollection(db, db.collection('Group').doc(groupID).collection('Administrators'), 10);
                    deleteCollection(db, db.collection('Group').doc(groupID).collection('email_addr'), 10);
                    db.collection('Group').doc(groupID).delete();
                }
                //Check for assignment
                if (doc.data().assign == true) {
                    assign(groupID);
                };
                if (doc.data().assign == false) {
                    un_assign(groupID);
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
                db.collection('users').doc(userid).collection('groups').doc(groupID).set({ id: groupID });
            }).catch(function (error) {
                console.warn(error)
                db.collection('Group').doc(groupID).collection("email_addr").doc(eaddress).delete();
            })
        }
    })
    return true;
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
function deleteCollection(db, collectionRef, batchSize) {

    var query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
}

function deleteQueryBatch(db, query, batchSize, resolve, reject) {
    query.get()
        .then((snapshot) => {
            // When there are no documents left, we are done
            if (snapshot.size == 0) {
                return 0;
            }

            // Delete documents in a batch
            var batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            return batch.commit().then(() => {
                return snapshot.size;
            });
        }).then((numDeleted) => {
            if (numDeleted === 0) {
                resolve();
                return;
            }

            // Recurse on the next process tick, to avoid
            // exploding the stack.
            process.nextTick(() => {
                deleteQueryBatch(db, query, batchSize, resolve, reject);
            });
        })
        .catch(reject);
}