const DisplayGames = Vue.component('DisplayGames', {
    data() {
        return {
            sports: [],
            checkbox: false,
            oldSports: []
        }
    },

    props: {
        authUser: {required: true},
        user: {type: Object},
    },

    computed: {
        loggedIn() {
            return (this.authUser && this.authUser.uid);
        },
    },

    firestore: function() {
        return {
            // return games that are coming up for the specific user
            sports: db.collection('sports').where('uid', '==', this.authUser.uid)
                .where('date', '>', (new Date().getFullYear().toString() + "-" + new Date().getMonth().toString() + "-" + new Date().getDate().toString()).toString())
                .orderBy('date'),

            // return games that are prior to today's date for the specific user
            oldSports: db.collection('sports').where('uid', '==', this.authUser.uid)
                .where('date', '<', (new Date().getFullYear().toString() + "-" + new Date().getMonth().toString() + "-" + new Date().getDate().toString()).toString())
                .orderBy('date'),
        }
    },

    template: `
      <!-- Different views based on the status of the checkbox and user login status-->
      <v-col v-if="sports.length < 1 && loggedIn" :user="authUser" cols="7" class="mr-auto ml-auto mt-5">
          <v-row class="justify-center mb-5">
            <h2>My Games</h2>
          </v-row>
          <v-row class="justify-center">
            <h2><router-link to="/addGames">Add your first game!</router-link></h2><v-icon medium class="ml-1">login</v-icon>
          </v-row>
      </v-col>
      <v-col v-else-if="(checkbox === false) && loggedIn" :user="authUser">
          <v-row class="justify-center mt-2">
            <h2>My Games</h2>
          </v-row>
          <v-row class="justify-center">
            <v-checkbox v-model="checkbox" color="primary">
              <template v-slot:label>
                <span id="checkboxLabel">My Old Games  (Games with dates prior to today)</span>
              </template>
            </v-checkbox>
          </v-row>
          <v-row>
              <v-col v-for="game in sports" :key="game.id" cols="4">
                  <game :game="game"></game>
              </v-col>
          </v-row>
      </v-col>
      <v-col v-else-if="(checkbox === true) && loggedIn && oldSports.length > 0" :user="authUser">
          <v-row class="justify-center mt-2">
            <h2>My Old Games</h2>
          </v-row>
          <v-row class="justify-center">
            <v-checkbox v-model="checkbox" color="primary">
              <template v-slot:label>
                <span id="checkboxLabel">My Old Games (Games with dates prior to today)</span>
              </template>
            </v-checkbox>
          </v-row>
          <v-row>
            <v-col v-for="game in oldSports" :key="game.id" cols="4">
              <game :game="game"></game>
            </v-col>
          </v-row>
      </v-col>
      <v-col v-else-if="(checkbox === true) && loggedIn && oldSports.length < 1" :user="authUser">
      <v-row class="justify-center mt-2">
        <h2>My Old Games</h2>
      </v-row>
      <v-row class="justify-center">
        <v-checkbox v-model="checkbox" color="primary">
          <template v-slot:label>
            <span id="checkboxLabel">My Old Games (Games with dates prior to today)</span>
          </template>
        </v-checkbox>
      </v-row>
      <v-row class="justify-center">
        <h2>No old games to see</h2>
      </v-row>
      </v-col>
      <v-col v-else cols="7" class="mr-auto ml-auto mt-5">
          <v-row class="justify-center">
            <h2><router-link to="/login">Login to see your games</router-link></h2><v-icon medium class="ml-1">login</v-icon>
          </v-row>
      </v-col>
    `
})

Vue.component('navbar', {
    props: {
        authUser: {required: true},
    },

    methods: {
        logout(){
            firebase.auth().signOut();
        },
    },

    computed: {
        loggedIn() {
            return (this.authUser && this.authUser.uid);
        },
    },

    data: () => ({
        drawer: false,
        group: null,
    }),

    template: `
      <!-- Different navbar items are available depending on the logged in status of a user-->
      <v-card>
      <v-app-bar color="primary" dark>
        <v-app-bar-nav-icon @click="drawer = true" color="black"></v-app-bar-nav-icon>
        <v-toolbar-title class="ml-auto mr-auto"><v-icon large>sports_baseball</v-icon><strong id="site-title"> GET READY FOR THE GAME! </strong><v-icon large>sports_football</v-icon></v-toolbar-title>
      </v-app-bar>
      <v-navigation-drawer height="200" v-model="drawer" absolute temporary class="secondary accent-4">
        <v-list nav dense>
          <v-list-item-group v-model="group" active-class="deep-purple--text text--accent-4">
            <v-list-item v-if="loggedIn">
              <v-list-item-title>Hello, {{authUser.email}}</v-list-item-title>
            </v-list-item>
            
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>
              <v-list-item-title><router-link to="/home">My Games</router-link></v-list-item-title>
            </v-list-item>

            <v-list-item v-if="!loggedIn">
              <v-list-item-icon>
                <v-icon>mdi-account</v-icon>
              </v-list-item-icon>
              <v-list-item-title><router-link to="/register">Register</router-link></v-list-item-title>
            </v-list-item>

            <v-list-item v-if="loggedIn">
              <v-list-item-icon>
                <v-icon>sports</v-icon>
              </v-list-item-icon>
              <v-list-item-title><router-link to="/addGames">Add a game</router-link></v-list-item-title>
            </v-list-item>

            <v-list-item v-if="!loggedIn">
              <v-list-item-icon>
                <v-icon>login</v-icon>
              </v-list-item-icon>
              <v-list-item-title><router-link to="/login">Login</router-link></v-list-item-title>
            </v-list-item>

            <v-list-item v-if="authUser && loggedIn">
              <v-list-item-icon>
                <v-icon>logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title><v-btn @click="logout" color="primary" style="color: black;">Logout</v-btn></v-list-item-title>
            </v-list-item>
            
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
      </v-card>
    `
})

const Register = Vue.component('register', {
    data() {
        return {
            email: '',
            password: '',
        }
    },

    methods: {
        register(){
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then(() => {
                    // Send user to login after registering
                    this.$router.push('/login');
                })
                .catch(function(error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode === 'auth/wrong-password') {
                        alert('Wrong password.');
                        this.$router.push('/login');
                    } else {
                        alert(error)
                    }
                    console.log(error);
                });
        }
    },

    template: `
      <v-form>
      <v-row class="justify-center mt-5">
        <h2>Create Account</h2>
      </v-row>
      <v-col cols="5" class="mr-auto ml-auto mt-5">
          <v-row>
            <v-text-field v-model="email" :rules="[v => !!v || 'Email is required']" label="Email address" prepend-icon="mdi-email" clearable outlined solo-inverted required></v-text-field>
          </v-row>
          <v-row>
            <v-text-field v-model="password" :rules="[v => !!v || 'Password is required']" label="Password" prepend-icon="mdi-lock" clearable outlined solo-inverted required></v-text-field>
          </v-row>
          <v-row>
            <v-row justify="center">
              <v-btn @click="register" class="mt-4" color="primary" style="color: black;">Register</v-btn>
            </v-row>
          </v-row>
      </v-col>
      </v-form>
    `
})

const Login = Vue.component('login', {
    methods: {
        login() {
            firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then(() => {
                    // send user to the home page after logging in
                    this.$router.push('/home');
                })
                .catch(error => {
                    alert(error.message);
                });
        },
    },

    data() {
        return {
            email: '',
            password: ''
        }
    },

    template: `
      <v-form>
      <v-row class="justify-center mt-5">
        <h2>Login</h2>
      </v-row>
      <v-col cols="5" class="mr-auto ml-auto mt-5">
          <v-row>
            <v-text-field v-model="email" label="Email address" prepend-icon="mdi-email" clearable outlined solo-inverted required></v-text-field>
          </v-row>
          <v-row>
            <v-text-field v-model="password" label="Password" prepend-icon="mdi-lock" type="password" clearable outlined solo-inverted required></v-text-field>
          </v-row>
          <v-row>
          <v-row justify="center">
            <v-btn @click="login" class="mt-4" color="primary" style="color: black;">Sign In</v-btn>
          </v-row>
          </v-row>
      </v-col>
      <v-col cols="5" class="mr-auto ml-auto mt-10">
        <v-row class="justify-center">
          <h2><router-link to="/register">Register</router-link></h2><v-icon medium class="ml-1">login</v-icon>
        </v-row>
      </v-col>
      </v-form>
    `
})

Vue.component('Game', {
    props: {
        game: Object,
    },

    data: () => ({
        reveal: false,
        item: null,
    }),

    methods: {
        deleteIt(item){
            if (item) {
                // remove item from items arrary
                db.collection('sports').doc(this.game.id).update({
                    items: firebase.firestore.FieldValue.arrayRemove(item)
                })
            }
        },

        remove(){
            // remove entire game from firebase
            storage.child('sports').child(this.game.id).delete();
            db.collection('sports').doc(this.game.id).delete();
        },

        formatDate (date) {
            // format and display date in an easy to read way
            if (!date) return null
            const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
            var d = date.split('-');
            var date1 = new Date(d[0], d[1]-1, d[2]).toLocaleDateString('en-us', options);
            return date1
        },
    },

    template:`
      <v-card color="#a9a9a9" outlined>
          <v-card-title class="animate__animated animate__heartBeat animate__delay-1s animate__slower 3s animate__repeat-3 3 justify-center">{{game.name}}<br>{{formatDate(game.date)}}</v-card-title>
          <v-img class="rounded-lg" :src="game.image"></v-img>
          <v-card-actions class="justify-center">
            <v-btn text color="black" @click="reveal = true">See List <v-icon medium>launch</v-icon></v-btn>
          </v-card-actions>
          <v-btn class="mt-2 mb-3" color="error" @click="remove">Delete Game</v-btn>
            <v-card v-if="reveal" class="transition-fast-in-fast-out v-card--reveal" style="height: 100%;" color="primary">
              <v-card-text style="height: 50%">
                <v-row no-gutters v-for="item in game.items" style="height: 50px" justify="space-around">
                  <v-checkbox color="black">
                    <template v-slot:label>
                      <div>
                        {{item}}<v-btn v-on:click="deleteIt(item)" icon color="red"><v-icon>mdi-close</v-icon></v-btn> <!--Add line through text on box check class="text-decoration-line-through" -->
                      </div>
                    </template>
                  </v-checkbox>
                </v-row>
                <add-game-item :game="game"></add-game-item>
              </v-card-text>
              <v-card-actions class="pt-0 justify-center">
                <v-btn text color="teal accent-4" @click="reveal = false">Close</v-btn>
              </v-card-actions>
            </v-card>
      </v-card>
    `
})

Vue.component('add-game-item', {
    props: {
        game: Object,
    },

    data() {
        return {
            dialog: false,
            name: '',
            rules: {
                required: value => !!value || 'Required.',
            },
        }
    },

    methods: {
        addGameItem() {
            // add game item to its specific list
            if (this.name !== '') {
                db.collection('sports').doc(this.game.id).update({
                    items: firebase.firestore.FieldValue.arrayUnion(this.name)
                })// Check on this....
                this.dialog = false
                this.name = ''
            }
            else {
                this.dialog = true
            }
        },
    },

    template: `
      <v-dialog v-model="dialog" transition="dialog-bottom-transition" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn x-large color="primary" class="mt-10 black--text" dark v-bind="attrs" v-on="on"><v-icon>add</v-icon>Add an item</v-btn>
      </template>
      <v-card color="primary">
        <v-card-title class="justify-center">
          <span class="text-h5"><h2>Add An Item</h2></span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field :rules="[rules.required]" label="Item*" v-model="name" prepend-icon="mdi-plus-thick" clearable outlined solo-inverted required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="addGameItem">Add Item</v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>
    `
})

const AddGames = Vue.component('addGames', {
    data() {
        return {
            game: {
                gameType: new Game(),
                image: null,
            },
        }
    },

    props: {
        authUser: {required: true}
    },

    computed: {
        loggedIn(){
            return (this.authUser && this.authUser.uid)
        },
    },

    methods: {
        addGame(){
            // add game to a specific users collection
            this.game.gameType.uid = this.authUser.uid
            db.collection('sports')
                .add(this.game.gameType)
                .then((docRef) => {
                    this.addImage(docRef.id);
                    this.game.gameType = new Game();
                    this.$router.push('/home');
                })
                .catch((error) => {
                    console.log("Could not add game", error);
                })
        },

        addImage(docId){
            if(!docId || !this.game.image){
                return false;
            }

            var theGame = this.game;
            var images = ['jpg', 'png', 'gif'];
            var extension = theGame.image.name.toLowerCase().split('.').pop()

            if(images.indexOf(extension) < 0){
                console.log("Not a valid file");
                return false;
            }

            storage.child('sports').child(docId)
                .put(this.game.image)
                .then((snapshot) => {
                    this.game.image = null;
                    return snapshot.ref.getDownloadURL()
                })
                .then(url => {
                    db.collection('sports').doc(docId).update({image: url});
                })
                .catch(error => {
                    console.error("image  could not be added", error);
                });
        },

        createItem(){
            // add item to the items array
            this.game.gameType.items.push('');
        },
    },

    template: `
      <v-form>
          <v-row v-if="loggedIn" class="justify-center mt-5">
              <h2>Add a game to your schedule</h2>
          </v-row>
          <v-col cols="5" class="mr-auto ml-auto mt-5" v-if="loggedIn">
              <v-row class="justify-start">
                <v-text-field v-model="game.gameType.name" :rules="[v => !!v || 'Title is required']" label="Enter game name" clearable outlined solo-inverted required></v-text-field>
              </v-row>
              <v-row>
                <v-file-input class="mb-5" v-model="game.image" accept="image/*" label="Image to represent your game" outlined solo-inverted required></v-file-input>
              </v-row>
              <v-row>
                  <v-date-picker class="mb-5" :rules="[v => !!v || 'Date is required']" full-width year-icon="mdi-calendar-blank" prev-icon="mdi-skip-previous" next-icon="mdi-skip-next" elevation="15" v-model="game.gameType.date" required></v-date-picker>
              </v-row>
              <v-row>
                <v-col cols="4">
                  <v-row v-for="(item,i) in game.gameType.items">
                    <v-text-field v-model="game.gameType.items[i]" :key="i" label="Item*" outlined solo-inverted required></v-text-field>
                  </v-row>
                  <v-btn @click="createItem" color="primary" style="color: black;"><v-icon>add</v-icon>Add item</v-btn>
                </v-col>
              </v-row>
              <v-row>
                <p><strong>*Items can be added and removed after you create the game*</strong></p>
              </v-row>
              <v-row>
                <v-row justify="center">
                  <v-btn v-if="game.gameType.name !== '' && game.gameType.date !== ''" @click="addGame" class="mt-4 mb-4">Create Game</v-btn>
                </v-row>
              </v-row>
          </v-col>
          <v-col v-else cols="7" class="mr-auto ml-auto mt-5">
            <v-row class="justify-center">
            <h2><router-link to="/login">Login to add a game</router-link></h2><v-icon medium class="ml-1">login</v-icon>
            </v-row>
          </v-col>
      </v-form>
    `
})
