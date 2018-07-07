export class GroupsDB {
    constructor(firebase){
        //Establish Connection
        this.firebase = firebase;
        this.db = firebase.firestore();
    }
    sync(){
        console.log('hi')
    }
    create(name,members){
        if (typeof members==='string'){
            members = [members]
        }
    }
    delete(id){
        console.log('hi')
    }

}


export class UserDB {
    constructor(firebase){
        this.firebase = firebase;
        this.db = firebase.firestore();
        this.auth = firebase.auth().onAuthStateChanged(user=>{
            if(user){
                this.user = user;
            }
        })
    }
    sync(){
        this.db.collection('users').document(this.user.uid)
    }
}
