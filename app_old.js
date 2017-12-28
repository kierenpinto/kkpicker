

//WINDOW LISTENER
document.addEventListener('DOMContentLoaded', function () {
    //----------------------------Authentication Listener:------------------------------------------//
    //----------------- Sign Out 
    signOut = function () {
        firebase.auth().signOut().then(function () { location.reload(true) }).catch(function () { console.error('logout failed') });
    }
    // ----------------- Authentication State
    var authState = function () {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                //Signed In- Enable Sign Out
                /*
                document.getElementById("logout").addEventListener("click", signOut);
                let loggedIn = document.getElementsByClassName("loggedOn");
                for (key = 0; key < loggedIn.length; key++) {
                    loggedIn[key].style.visibility = "visible";
                }
                let loggedOut = document.getElementsByClassName("loggedOff");
                for (key = 0; key < loggedOut.length; key++) {
                    loggedOut[key].style.visibility = "collapse";
                }
                */
                dataBindings.loggedIn = true;
                userDBHandle(user);
            }
            else {
                //Signed Out- Enable Sign In
                /*
                loggedIn = document.getElementsByClassName("loggedOn");
                for (key = 0; key < loggedIn.length; key++) {
                    loggedIn[key].style.visibility = "collapse";
     
                }
                loggedOff = document.getElementsByClassName("loggedOff");
                for (key = 0; key < loggedOff.length; key++) {
                    loggedOff[key].style.visibility = "visible";
                }
                */
                dataBindings.loggedIn = false;
            }
        }, function (error) {
            console.log(error);
        });
    };
    window.addEventListener('load', function () {
        authState()
    });
    //------------------ Authentication Initialization
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
    //Firestore: 
    let db = firebase.firestore();
    //Handle Users:
    function userDBHandle(user) {
        var docRef = db.collection("users").doc(user.uid);
        docRef.get().then(function (doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
            } else {
                db.collection("users").doc((user.uid)).set({
                    userid: user.uid,
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
    //*************VUE JS */
    var dataBindings = {
        loggedIn: false,
        user: null,
    }
    var appInstance = new Vue({
        el: '#app',
        data: dataBindings,
        methods: {
            signOut: signOut
        }
    })
});


