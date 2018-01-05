//WINDOW LISTENER
document.addEventListener('DOMContentLoaded', function () {
    //----------------------------Authentication Listener:------------------------------------------//
    //----------------- Sign Out 
    let signOut = function () {
        firebase.auth().signOut().then(function () { location.reload(true) }).catch(function () { console.error('logout failed') });
    }
    //Firestore: 
    var db = firebase.firestore();
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
                grpshow : grpshow,
                groupIds: groupIds
            }
            appInstance = new Vue({
                el: '#app',
                data: dataBindings,
                methods: {
                    signOut: signOut,
                    viewGroup: viewGroup,
                    createGroup: createGroup,
                    saveProfile: saveProfile,
                    addMember: addMember,
                    openSignIn:openSignIn
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
        var members = function(doc){
            var namelist = []
            for (member in doc.data().Members){
                var mems = db.collection("users").doc(doc.data().Members[member]).get().then(function(doc){
                    if (doc.data().name) {
                        namelist.push(doc.data().name);
                    }
                    else {
                        namelist.push("un-named user: " + doc.data().userid);
                    }
                }) 
            }
            return namelist;  
        }
        //View Groups
        var querygroups = function (doc) {
            db.collection("Group").doc(doc.id).get()
                .then(function (doc) {
                    if (doc.exists) {
                        groups.push({data:doc.data(),grpshow:false,members:members(doc)});
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
    // View Group Details --> Call after logged in
    var viewGroup = function (index) {
        var max_index = groups.length - 1;
        if (index <= max_index) {
            var selectedGroup = groups[index];
            var groupID = groupIds[index];
            var namelist = [];
            for (member in selectedGroup.data.Members) {
                db.collection("users").doc(selectedGroup.data.Members[member]).onSnapshot(function (doc) {
                    var name = doc.data().name;
                    if (name) {
                        namelist.push(name);
                    }
                    else {
                        namelist.push("un-named user: " + doc.data().userid);
                    }
                })
            }
            this.editBody = { selectedGroup, namelist:namelist, groupID: groupIds[index] };
            this.groupSel = index;
            $('#EditModal').modal('show');
            return;
        }
    }
    //Create Groups--> Call after logged in
    function createGroup() {
        let formParams = this.newGroup;
        //Stuff to Create Groups
        var addGroupRef = db.collection("Group").doc();
        addGroupRef.set({
            Name: formParams.name,
            Administrator: this.user.uid,
            Members: [this.user.uid],
        }).then(function (doc) {
            $('#addModal').modal('hide');
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

    function openSignIn() {
        $('#SignInModal').modal('show');
    }
    //
    //JS LOAD COMPLETE
    document.getElementById("app").style.visibility = "visible";
});