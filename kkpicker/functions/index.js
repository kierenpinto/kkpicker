const functions = require('firebase-functions');
const admin = require('firebase-admin');
const randomstring = require('randomstring'); // https://www.npmjs.com/package/randomstring
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


//************************************************ Dependancy CODE
function deleteCollection(db, collectionRef, batchSize) {

    var query = collectionRef.orderBy('__name__').limit(batchSize);

    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
        return;
    });
}
function generateJoinCode(){
    var code = randomstring.generate({
        length: 8,
        charset: 'alphanumeric'
      });
    return code
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
                return;
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
                return;
            });
        })
        .catch(reject);
}
assign = function (groupID) {
    db.collection('Group').doc(groupID).collection("Members").get().then(function (querySnapshot) {
        list = [];
        assigned = [];
        var assigned_ind = [];
        querySnapshot.forEach(function (doc) {
            list.push(doc.id)
            return;
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
        db.collection('Group').doc(groupID).update({ assign_complete: 'assigned' })
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
        db.collection('Group').doc(groupID).update({ assign_complete: 'un-assigned' })
    })
}
function syncGroupOrder(userID) {
    var dbref = db.collection('users').doc(userID)
    dbref.get().then(function (doc) {
        if (doc.data().groupOrder) {
            var groupOrder = doc.data().groupOrder;
        } else {
            var groupOrder = []
        }
        var testGroup = []
        dbref.collection('groups').get().then(function (queryset) {
            queryset.forEach(function (doc) {
                if (!groupOrder.find(x => x == doc.data().id)) {
                    groupOrder.push(doc.data().id)
                }
                testGroup.push(doc.data().id)
            })
            var newGroupOrder = []
            groupOrder.forEach((el, ind) => {
                if (testGroup.includes(el)) {
                    newGroupOrder.push(el)
                }
            })
            groupOrder = newGroupOrder;
            dbref.update({ groupOrder: groupOrder })
        })
    })
}
/** Add group membership to user profile **UN-USED ** */
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
/* ************************************************ Create Group
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
                        var userid = doc.id
                        db.collection('users').doc(doc.id).collection("groups").doc(groupID).set({
                            id: groupID
                        }).then(function(){
                            syncGroupOrder(userid)
                        })
                        db.collection('users').doc(doc.id).get().then(function (doc) {
                            db.collection('Group').doc(groupID).collection('Members').doc(doc.id).update({ name: doc.data().name })
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

//********************************************Modification of Groups
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
                if(doc.data().joinCodeEnable == true){
                    db.collection('Group').doc(groupID).update({joinCode: generateJoinCode()})    
                }
            }
        }
    ).catch(err => {
        console.warn('Error getting document', err);
    });

    return true;
})

// Add member to group by email address (Group Admin)
exports.addGroupMember = functions.firestore.document('Group/{groupID}/email_addr/{address}').onCreate(function (event) {
    var groupID = event.params.groupID;
    var eaddress = event.params.address;
        if (event.data.data().processed == false) {
            admin.auth().getUserByEmail(event.data.data().email).then(function (userRecord) {
                var userid = userRecord.uid;
                var setDoc = db.collection('Group').doc(groupID)
                db.collection('users').doc(userid).get().then(function(doc) {
                    setDoc.collection("Members").doc(userid).set({ uid: userid, name: doc.data().name });
                    return;
                })
                db.collection('users').doc(userid).collection('groups').doc(groupID).set({ id: groupID }).then(function(){
                    syncGroupOrder(userid)
                });
                db.collection('Group').doc(groupID).collection("email_addr").doc(eaddress).update({processed: true});
            }).catch(function (error) {
                console.warn(error)
                db.collection('Group').doc(groupID).collection("email_addr").doc(eaddress).delete();
            })
        }
    return true;
})
// Modify Group Membership
exports.modGroupMember = functions.firestore.document('Group/{groupID}/Members/{memberID}').onUpdate(function (event) {
    var groupID = event.params.groupID;
    var memberID = event.params.memberID;
    // Check if member is to be removed and then remove member.
    var checkDoc = db.collection('Group').doc(groupID).collection('Members').doc(memberID).get().then(function (doc) {
        if (doc.data().deleted == true) {
            if(doc.data().deletedby != memberID){
                db.collection('users').doc(memberID).collection('groups').doc(groupID).delete();
                db.collection('Group').doc(groupID).collection('Members').doc(memberID).delete();
            }
            else{
                db.collection('Group').doc(groupID).collection('Members').doc(memberID).update({deleted:false, deleteError: 'You cannot remove yourself'})
            }
        }
    })
    return true;
})
//******************************************** Users Modification
//Propagate User Profile Changes Across Application (ie name changes)
exports.modifyUser = functions.firestore.document('users/{userID}').onUpdate((event) => {
    var newData = event.data;
    var oldData = event.data.previous;
    var userid = event.params.userID
    //Changing Name Function
    function changeName(name) {
        db.collection('users').doc(userid).collection('groups').get().then(function (querySet) {
            querySet.forEach(function (doc) {
                db.collection('Group').doc(doc.id).collection('Members').doc(userid).update({ name: name })
                return;
            })
            return;
        })
    }
    //If the name has changed then run changeName Function
    if (newData.data().name != oldData.data().name) {
        changeName(newData.data().name);
    }
    if (Date.parse(newData.data().last_signedIn) > 1516278198000) {
        var dbRef = db.collection("users").doc(userid).collection('groups')
        dbRef.get().then(function (doc) {
            doc.forEach(function (doc) {
                var id = doc.id;
                dbRef.doc(id).update({ id: id })
                return;
            })
            return;
        })
    }
    if (newData.data().last_signedIn !== oldData.data().last_signedIn) {
        syncGroupOrder(userid);
    }
    if (!newData.data().groupOrder) {
        syncGroupOrder(userid);
    }
    return true;
})


exports.modifyUserGroupMembership = functions.firestore.document('users/{userID}/groups/{groupID}').onUpdate((event) => {
    var userID = event.params.userID;
    var groupID = event.params.groupID;
    var groupCustData = event.data.data();
    var groupOrder = []
    var docRef = db.collection('users').doc(userID)
    db.runTransaction(function (transaction) {
        return transaction.get(docRef).then(function (doc) {
            if (doc.data().groupOrder) {
                groupOrder = doc.data().groupOrder;
            }
            if (!groupOrder.find((x) => { return x == groupCustData.id })) {
                groupOrder.push(groupCustData.id)
            }
            transaction.update(docRef, { groupOrder: groupOrder })
        })
    })
    return;
})

exports.deleteUserGroupMembership = functions.firestore.document('users/{userID}/groups/{groupID}').onDelete((event) => {
    var userID = event.params.userID;
    var groupID = event.params.groupID;
    var groupCustData = event.data.previous.data();
    var groupOrder = []
    var docRef = db.collection('users').doc(userID)
    db.runTransaction(function (transaction) {
        return transaction.get(docRef).then(function (doc) {
            if (doc.data().groupOrder) {
                groupOrder = doc.data().groupOrder;
                var new_groupOrder = groupOrder.filter(function (x) { return x != groupCustData.id });
                transaction.update(docRef, { groupOrder: new_groupOrder })
            }
        })
    })
    return true;
})


// *************************************** HTTP Functions
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


