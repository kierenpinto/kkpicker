const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase);
var db = admin.firestore();
var userscollection = db.collection('users');
var groupscollection = db.collection('groups');

exports.createUser = functions.auth.user().onCreate((userProfile) => {
    userid = userProfile.uid
    //Run this on first time - called by onCreate user hook
    let userRef = db.collection('users').doc(this.id)
    let data = {
        newUser: true,
        groups: [],
        alias: this.userProfile.displayName
    }
    return userRef.set(data);
})

exports.editUser = functions.https.onCall((data, context) => {
    // Function to edit a user - called by user -

    //!! Incomplete - may be redundant
    userid = context.auth.uid;
    user = new User(userid);
    user.load();
    user.edit()
    return true;
})

function addGroupMembers(groupid, userid, admin_user) {
    // (String, String, Boolean)
    // Add a group member
    userdocRef = userscollection.doc(userid)
    groupdocRef = groupscollection.doc(groupid)
    let transaction = db.runTransaction(t => { // start transaction
        t.getAll(userdocRef, groupdocRef).then(docs => {
            var userdoc = docs[0]
            var groupdoc = docs[1]
            if (userdoc.exists && groupdoc.exists) {
                let groups_array = userdoc.data.groups !== "undefined" ? userdoc.data.groups : [] //ensure existance
                groups_array = Array.isArray(groups_array) ? groups_array : [groups_array] // ensure array
                groups_array.push({ groupid: groupid })

                let users_array = groupdoc.data.users !== "undefined" ? groupdoc.data.users : []
                users_array = Array.isArray(users_array) ? users_array : [users_array]
                users_array.push({ id: uid, groupName: groupname, admin: admin_user })
                t.update(userdocRef, { groups: groups_array })
                t.update(groupdocRef, { users: users_array })
            }
            return
        }).catch()
    }).then(result => {
        console.log('Transaction success!');
        return
    }).catch(err => ('Transaction failure:', err));
}

exports.createGroup = functions.https.onCall((data, context) => {
    // Create Group in Database - called by user
    let userid = context.auth.uid;
    let groupName = data.groupName;
    let g = db.collection('groups').add({ name: groupName }).then(docref => {
        groupid = docref.id;
        addGroupMembers(groupid, userid, true)
        return true
    }).catch(
        console.log("An error occured with createGroup function")
    );
    return g;
})