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
class User {
    constructor(id,userProfile,data,context) {
        //Get User document by ID
        this.id = id;
        this.loaded = false;
        this.user = null;
        this.userProfile = userProfile;
        this.data = data;
        this.context = context;
    }
    load() {
        //Some code to load user
        let userRef = db.collection('users').doc(this.id)
        var getDoc = userRef.get().then(doc => {
            if (doc.exists) {
                this.user = doc.data();
                // Set loaded state to true
                this.loaded = true;
                return true;
            }
            else{
                throw new UserException("Failed to get user");
            }
        }).catch(err => {
            console.log('Error getting userdocument', err)
        })

    }
    create() {
        //Run this on first time - called by onCreate user hook
        let userRef = db.collection('users').doc(this.id)
        let data = {
            newUser: true,
            groups: [],
            alias: this.userProfile.displayName
        }
        userRef.set(data)
        return;
    }
    editUser() {
        if (this.loaded === true) {
            console.log("edit User executed") // Placeholder
        } else {
            console.log('User not loaded')
            return
        }
    }
    deleteUser() {
        if (this.loaded === true) {
            console.log("delete User executed") // Placeholder
        } else {
            console.log('User not loaded')
            return
        }
    }
    syncWithEachGroup() {
        if (this.loaded === true) {
            console.log("sync User executed") // Placeholder
        } else {
            console.log('User not loaded')
            return
        }
    }
    syncWithAGroup(groupID) {
        if (this.loaded === true) {
            console.log("sync User executed") // Placeholder
        } else {
            console.log('User not loaded')
            return
        }
    }
}

class Group {
    constructor(id) {
        //Get group document by ID
        this.id = id
        this.loadGroup(id)
    }
    loadGroup(id) {
        
    }
    addMember(uid) {
        console.log('Group Run')
        //Add a group member
        let transaction = db.runTransaction(t => { // start transaction
            // transaction on user collection
            t.get(userscollection.doc(uid)).then( doc =>{
                if (doc.exists){
                    groups_array = doc.data.groups
                    if (Array.isArray(groups_array))
                    data.groups.push(this.id)
                    else{
                        data.groups = [this.id]
                    }
                }
                return
            }).catch()
            // transaction on group collection
            t.get(groupscollection.doc(this.id)).then(doc => {
                if (doc.exists){
                    users_array = doc.data.users
                    if (Array.isArray(users_array)){
                        data.groups.push ({id: uid})
                    }else{
                        data.groups = [uid]
                    }
                }
                return
            }).catch()
        }).then(result => {
            console.log('Transaction success!');
            return
        }).catch(err => ('Transaction failure:',err));
    }
    deleteMember() {
        console.log('Group Run')
        //Delete User
    }
    editMember() {
        console.log('Group Run')
        //Edit User
    }
    syncWithEachMember() {
        console.log('Group Run')
    }
    syncWithAMember() {
        console.log('Group Run')
    }
    assignPartner() {
        console.log('Group Run')
    }
    unassignPartner() {
        console.log('Group Run')
    }
}

exports.createUser = functions.auth.user().onCreate((userProfile) => {
    userid = userProfile.uid
    user = new User(userid,userProfile,null,null)
    user.create()
    return true;
})

exports.editUser = functions.https.onCall((data, context) => {
    userid = context.auth.uid;
    user = new User(userid);
    user.load();
    user.edit()
    return true;
})

exports.createGroup = functions.https.onCall((data,context)=>{
    userid = context.auth.uid;
    db.collection('groups').add({}).then(docref => {
        groupid = docref.id
        group = new Group(groupid)
        return true;
    }).catch(
        console.log("An error occured with createGroup function")
    );
    return true;
})