//WINDOW LISTENER
document.addEventListener('DOMContentLoaded', function () {
    //----------------------------Authentication Listener:------------------------------------------//
    //----------------- Sign Out 
    let signOut = function () {
        firebase.auth().signOut().then(function () { location.reload(true) }).catch(function () { console.error('logout failed') });
    }
    //Firestore: 
    db = firebase.firestore();
    currUser = firebase.auth().currentUser;
    groups = [];
    groupIds = [];
    editBody = null;
    grpshow = [];

    // ----------------- Authentication State
    var authState = function () {
        firebase.auth().onAuthStateChanged(function (user) {

            //*************VUE JS */
            dataBindings = {
                loggedIn: false,
                user: user,
                groups: groups,
                groupSel: "-1",
                editBody: editBody,
                newGroup: {
                    name: null
                },
                profile: {
                    name: null
                },
                newMemberEmail: null,
                grpshow: grpshow,
                groupIds: groupIds
            }
            appInstance = new Vue({
                el: '#app',
                data: dataBindings,
                methods: {
                    signOut: signOut,
                    createGroup: createGroup,
                    saveProfile: saveProfile,
                    addMember: addMember,
                    openSignIn: openSignIn,
                    delMember: delMember
                }
            })

            if (user) {
                dataBindings.loggedIn = true;
                userDBHandle(user);
                populateGroups(user);
                currUser = firebase.auth().currentUser;

            }
            else {
                dataBindings.loggedIn = false;
            }

        }, function (error) {
            console.log(error);
        });
    };
    window.addEventListener('load', function () {
        authState()
    });

    //------------------ Auth UI Initialization
    const uiConfig = {
        callbacks: {
            signInSuccess: function (currentUser, credential, redirectUrl) {
                document.write("loading...");
                return true;
            }
        },
        signInFlow: 'popup',
        signInSuccessUrl: '/',
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebase.auth.GoogleAuthProvider.PROVIDER_ID
        ]
    };
    const ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', uiConfig);

    //-------------------------------------------------Firebase:--------------------------------------------
    // Firebase has already been initialized from init.js in index.html

    //Handle Users:
    function userDBHandle(user) {
        var usrdocRef = db.collection("users").doc(user.uid);
        usrdocRef.get().then(function (doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                appInstance.profile.name = doc.data().name;
            } else {
                db.collection("users").doc((user.uid)).set({
                    userid: user.uid,
                    email: user.email,
                    name: null,
                    joined: new Date
                })
                    .catch(function (error) {
                        console.error("Error adding user document: ", error);
                    });
                console.log("created new user " + String(user.uid));
            }
        }).catch(function (error) {
            console.log("Error getting user document:", error);
        });
    }
    // View Groups List
    var populateGroups = function (user) {
        var members = function (doc, loc, assign) {
            var namelist = [];
            loc.collection('Members').get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {
                    var data = {}
                    if (assign) {
                        db.collection('users').doc(doc.data().partner_uid).get().then(function (doc) {
                            data.pid = doc.data().userid;
                            if (doc.data().name) {
                                data.pname = doc.data().name;
                            }
                            else {
                                data.pname = "un-named user: " + doc.data().userid;
                            }
                        });
                    }
                    db.collection("users").doc(doc.data().uid).get().then(function (doc) {
                        data.id = doc.id;
                        if (doc.data().name) {
                            data.name = doc.data().name;
                        }
                        else {
                            data.name = "un-named user: " + doc.data().userid;
                        }
                    })
                    namelist.push(data)
                })
            })
            return namelist;
        }
        //View Groups
        var querygroups = function (doc) {
            var loc = db.collection("Group").doc(doc.id);
            loc.get().then(function (doc) {
                if (doc.exists) {
                    groups.push({ data: doc.data(), grpshow: false, members: members(doc, loc, doc.data().assign) });
                    groupIds.push(doc.id);
                }
                else {
                    //throw an exception
                }
            }).catch(function (error) { console.log("Error getting documents: ", error); })
        }

        var viewGroupRef = db.collection("users").doc(user.uid).collection("groups").get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) { querygroups(doc) })
            })
    }

    //Create Groups--> Call after logged in
    function createGroup() {
        let formParams = this.newGroup;
        //Stuff to Create Groups
        var addGroupRef = db.collection("Group");
        var userid = this.user.uid
        addGroupRef.add({
            Name: formParams.name,
            Administrator: this.user.uid,
            //Members: [this.user.uid],
        }).then(function (docRef) {
            var batch = db.batch();
            batch.set(db.collection("Group").doc(docRef.id).collection("Members").doc(userid), { "uid": userid });
            batch.set(db.collection("Group").doc(docRef.id).collection("Administrators").doc(userid), { "uid": userid });
            batch.commit().then(function () {
                //Group Created Message / Action ....
                $('#addModal').modal('hide');
            })
        })
    }

    function saveProfile() {
        let name = this.profile.name
        let profile_ref = db.collection("users").doc(this.user.uid);
        profile_ref.update({ name: name }).then(function () {
            $('#profileModal').modal('hide');
        });
    }

    function addMember(groupID) {
        var email = this.newMemberEmail;
        db.collection("Group").doc(groupID).collection('email_addr').add({
            email: email,
            processed: false
        })
    }

    function delMember(groupID, memberID) {
        console.log("deleted", memberID, "from", groupID);
        db.collection("Group").doc(groupID).collection('Members').doc(memberID).update({
            'deleted': true
        }).then(function (doc) {
            //Refresh Group or Page
        })
    }
    function openSignIn() {
        $('#SignInModal').modal('show');
    }

    //
    //JS LOAD COMPLETE
    document.getElementById("app").style.visibility = "visible";

});