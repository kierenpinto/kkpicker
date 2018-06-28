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
    }
    loadGroup() {
        console.log('Group Run')
    }
    addMember() {
        console.log('Group Run')
        //Add user
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
    userid = context.auth.uid
    user = new User(userid)
    return true;
})