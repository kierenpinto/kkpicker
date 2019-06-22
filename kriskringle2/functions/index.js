/* eslint-disable promise/always-return */
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
    let userRef = db.collection('users').doc(userid)
    let data = {
        newUser: true,
        groups: [],
        alias: userProfile.displayName
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
    return db.runTransaction(t => { // start transaction
        return t.getAll(userdocRef, groupdocRef).then(docs => {
            var userdoc = docs[0]
            var groupdoc = docs[1]
            if (userdoc.exists && groupdoc.exists) {
                // Groups array is in the user's profile document
                let userdata = userdoc.data()
                let groupdata = groupdoc.data()
                let groups_array = ("groups" in userdata) ?  userdata.groups : [] //ensure existance of group array
                groups_array = Array.isArray(groups_array) ? groups_array : [groups_array] // ensure it is of array type
                groups_array.push({ groupid: groupid, admin: admin_user,groupName: groupdata.name})
                // Users array is in the group document
                let users_array = ("users" in groupdata) ? groupdata.users: []
                users_array = Array.isArray(users_array) ? users_array : [users_array]
                users_array.push({ id: userid , username: userdata.alias , admin: admin_user })
                // Update the user and group documents with the added group
                t.update(userdocRef, { 'groups': groups_array })
                t.update(groupdocRef, { 'users': users_array })
                //t.update(groupdocRef, {'testfield':'testvalue'}) 
            }else{
                throw(Error("Either userdoc or groupdoc doesn't exist"));
            }
        }).catch(err =>
            {console.error(err)}
        )
   // }).then(result => {
     //   console.log('Transaction success!');
       // return
    }).catch(err => ('Transaction failure:', err));
}

exports.createGroup = functions.https.onCall((data, context) => {
    // Create Group in Database - called by user
    let userid = context.auth.uid;
    let groupName = data.groupName;
    let g = db.collection('groups').add({ name: groupName }).then(docref => {
        groupid = docref.id;
        return addGroupMembers(groupid, userid, true)
    }).catch((err)=>{        
    console.error("An error occured with createGroup function" + err)}
    );
    return g;
})