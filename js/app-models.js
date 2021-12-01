// function GameList() {
//     this.__proto__ = [];
//
//     this.addItem = function (item) {
//         this.push(item);
//
//         return this
//     }
// }

const User = function(firebaseUser){
    let u = {
        email: '',
        password: '',
        uid: '',
    }

    if(firebaseUser){
        u.email = firebaseUser.email ? firebaseUser.email : '';
        u.password = firebaseUser.password ? firebaseUser.password : '';
        u.uid = firebaseUser.uid ? firebaseUser.uid : '';
    }

    return u;
}

 var Game = function(){
     return {
         name: '',
         image: null,
         items: [],
         date: '',
         uid: '',
     }
};

var Item = function(){
    return {
        itemName: '',
        done: false
    }
}

const firebaseConfig = {
    apiKey: "AIzaSyDzISphLA3cbgN_Llpc_T4Wy34gng8OBS8",
    authDomain: "sports-9009e.firebaseapp.com",
    projectId: "sports-9009e",
    storageBucket: "sports-9009e.appspot.com",
    messagingSenderId: "1002394765026",
    appId: "1:1002394765026:web:744ba6e8f35ac1fa7640bb"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage().ref();