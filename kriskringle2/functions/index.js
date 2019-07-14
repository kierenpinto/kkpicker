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
                let userdata = userdoc.data();
                let groupdata = groupdoc.data();
                let group_map = { groupid: groupid, admin: admin_user,groupName: groupdata.name};
                let user_map = { id: userid ,username: userdata.alias , admin: admin_user };
                let user_ref = 'groups.' + groupid;
                let group_ref = 'users.' + userid;
                // Update the user and group documents with the added group
                t.update(userdocRef, { [user_ref] : group_map })
                t.update(groupdocRef, { [group_ref] : user_map })


            }else{
                throw(Error("Either userdoc or groupdoc doesn't exist"));
            }
        }).catch(err =>
            {console.error(err)}
        )
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

exports.addGroupMember = functions.https.onCall((data,context) =>
{
    let session_uid = context.auth.uid;
    let group_id = data.groupid;
    let member_uid = data.member_uid
})

exports.removeGroupMember = functions.https.onCall((data,context) =>
{
    let session_uid = context.auth.uid;
    let group_id = data.groupid;
    let member_uid = data.member_uid;
    //Check for admin privileges
    //Disable pair groupings - delete pairs
    //Remove user
    //Enable pair groupings - new pairs
})

exports.renameGroup = functions.https.onCall((data,context) => {
    let session_uid = context.auth.uid;
    let group_id = data.groupid;
    //Check for admin privileges
    //Change Group Name in Group doc
    // let g = db.collection('groups').get(group_id).then((doc)=> {
    //     if (doc.exists){
    //         //Iterate over all users and change group name
    //         let users = doc.data().users;
    //         users.forEach(user => {
    //             db.collection('users').get(user.id)
    //         });
    //     }
    // })
    // return g;
})

exports.pairGroup = functions.https.onCall((data,context) => {
    let session_uid = context.auth.uid;
    let group_id = data.groupid;
    let member_uid = data.member_uid;
    //Check for admin privileges
    //Change Group Name in Group doc
    //Iterate over all users and change group name
})