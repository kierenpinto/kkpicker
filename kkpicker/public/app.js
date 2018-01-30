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

    // ----------------- Authentication State
    var authState = function () {
        firebase.auth().onAuthStateChanged(function (user) {

            //*************VUE JS */
            dataBindings = {
                loggedIn: false,
                user: user,
                groups_uncomp: [],

                newGroup: {
                    name: null
                },
                profile: {
                    name: null
                },
                newMemberEmail: null
            }
            appInstance = new Vue({
                el: '#app',
                data: dataBindings,
                methods: {
                    signOut: signOut,
                    createGroup: createGroup,
                    delGroup:delGroup,
                    saveProfile: saveProfile,
                    populateGroups: populateGroups,
                    addMember: addMember,
                    openSignIn: openSignIn,
                    delMember: delMember,
                    match: match,
                    unmatch: unmatch
                },
                components: {
                    'loader': {
                        template: '<div class="loader"></div>'
                    }
                },
                watch: {
                    groups_uncomp: {
                        handler: function (groups) {
                            for (groupInd in groups) {
                                if (groups[groupInd].data.assign == true) {
                                    for (member in groups[groupInd].members) {
                                        var part_id = groups[groupInd].members[member].partner_uid;
                                        var partner_name = groups[groupInd].members.find(function (selMem, index) {
                                            return selMem.uid == part_id;
                                        }).name
                                        this.groups_uncomp[groupInd].members[member].pname = partner_name;
                                    }
                                }
                            }
                        },
                        deep: true
                    }
                },
                computed: {
                    groups: function () {
                        if (this.user) {
                            var comp_group_array = []
                            var uncomp = this.groups_uncomp;
                            grporder_arr = this.profile.groupOrder
                            if (grporder_arr) {
                                grporder_arr.forEach(el => {
                                    comp_group_array.push(uncomp.find(x => String(x.id) === String(el)))
                                })
                                return comp_group_array
                            }
                        }
                    },
                    group_ready: function () {
                        var filt = this.groups.filter(el => el == undefined)
                        //console.log(filt[0]==undefined)
                        var returnvar = false;
                        if (filt.length > 0) {
                            returnvar = false;
                        }
                        else {
                            returnvar = true;
                        }
                        return returnvar
                    }
                }
            })

            if (user) {
                dataBindings.loggedIn = true;
                userDBHandle(user);
                appInstance.populateGroups(user);
                currUser = firebase.auth().currentUser;
                db.collection("users").doc(currUser.uid).update({ last_signedIn: new Date })

            }
            else {
                dataBindings.loggedIn = false;
            }
            document.getElementById("app").style.visibility = "visible";
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
        usrdocRef.onSnapshot(function (doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                appInstance.profile = doc.data();
            } else {
                db.collection("users").doc((user.uid)).set({
                    userid: user.uid,
                    email: user.email,
                    name: user.email,
                    joined: new Date
                })
                    .catch(function (error) {
                        console.error("Error adding user document: ", error);
                    });
                console.log("created new user " + String(user.uid));
            }
        })/*.catch(function (error) {
            console.log("Error getting user document:", error);
        });*/
    }
    // View Groups List
    var populateGroups = function (user) {
        var groups = this.groups_uncomp;
        var members = function (doc, loc, assign) {
            var namelist = [];
            loc.collection('Members').onSnapshot(function (querySnapshot) {
                querySnapshot.docChanges.forEach(function (change) {
                    if(change.type == "added"){
                        namelist.push(change.doc.data())
                    }
                    if(change.type =="modified"){
                        var ind=namelist.findIndex((el)=> el.uid == change.doc.data().uid)
                        console.log(namelist, '   ', ind)
                        namelist.splice(ind,1,change.doc.data())
                    }
                    if(change.type =="deleted"){
                        namelist.splice(()=>{return namelist.findIndex((el)=> el.uid == change.doc.data().uid)},1)
                    }
                })
            })
            return namelist;
        }
        //View Groups
        var querygroups = function (doc,index) {
            
            var grp_in_usr = doc.data()
            var loc = db.collection("Group").doc(doc.id);
            loc.onSnapshot(function (doc) {
                if (doc.exists) {
                    var groupData = {
                        data: doc.data(), grpshow: false, members: members(doc, loc, doc.data().assign), id: doc.id
                    }
                    groups.splice(index,1,groupData);
                    //groups.push(groupData)
                    //console.log(groupData)
                }
                else {
                    //throw an exception
                }
            })/*.catch(function (error) { console.log("Error getting documents: ", error); })*/
        }

        var viewGroupRef = db.collection("users").doc(user.uid).collection("groups")
            .onSnapshot(function (querySnapshot) {
                querySnapshot.docChanges.forEach(function (change,index) { 
                    if (change.type ==="added"){
                        querygroups(change.doc,index)
                    }
                })
            })
    }

    //Create Groups--> Call after logged in
    function createGroup() {
        let formParams = this.newGroup;
        //Stuff to Create Groups
        var addGroupRef = db.collection("Group");
        var user = this.user;
        addGroupRef.add({
            Name: formParams.name,
            Administrator: this.user.uid,
            //Members: [this.user.uid],
        }).then(function (docRef) {
            var batch = db.batch();
            batch.set(db.collection("Group").doc(docRef.id).collection("Members").doc(user.uid), { "uid": user.uid });
            batch.set(db.collection("Group").doc(docRef.id).collection("Administrators").doc(user.uid), { "uid": user.uid });
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
            'deleted': true,
            deletedby: this.user.uid
        }).then(function (doc) {
            //Refresh Group or Page
        })
    }

    function delGroup(groupID){
        db.collection("Group").doc(groupID).update({
            'deleted': true,
            deletedby: this.user.uid
        })
    }
    function openSignIn() {
        $('#SignInModal').modal('show');
    }
    function match(groupID) {
        db.collection("Group").doc(groupID).update({ assign: true })
    }

    function unmatch(groupID) {
        db.collection("Group").doc(groupID).update({ assign: false })
    }
    //
    //JS LOAD COMPLETE


});