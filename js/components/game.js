const DisplayGames = Vue.component('DisplayGames', {
    data() {
        return {
            sports: [],
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
            sports: db.collection('sports').where('uid', '==', this.authUser.uid)
                // .where('date', '<', Date.now().toLocaleString())
                .orderBy('date')
        }
    },

    template: `
      <v-col v-if="sports.length < 1 && loggedIn" :user="authUser" cols="7" class="mr-auto ml-auto mt-5">
          <v-row class="justify-center">
            <h2><router-link to="/addGames">Add your first game!</router-link></h2><v-icon medium class="ml-1">login</v-icon>
          </v-row>
      </v-col>
      <v-row v-else-if="loggedIn" :user="authUser">
          <v-col v-for="game in sports" :key="game.id" cols="4">
              <game :game="game"></game>
          </v-col>
      </v-row>
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
      <v-card>
      <v-app-bar color="primary" dark>
        <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
        <v-toolbar-title class="ml-auto mr-auto"><v-icon large>sports_baseball</v-icon><strong id="site-title"> GET READY FOR THE GAME! </strong><v-icon large>sports_football</v-icon></v-toolbar-title>
      </v-app-bar>
      <v-navigation-drawer height="280" v-model="drawer" absolute temporary class="secondary accent-4">
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

            <v-list-item v-if="authUser">
              <v-list-item-icon>
                <v-icon>logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title><v-btn @click="logout">Logout</v-btn></v-list-item-title>
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
            // u: new User
            email: '',
            password: ''
        }
    },

    methods: {
        register(){
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then(() => {
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
                        alert(errorMessage);
                    }
                    console.log(error);
                });
        }
    },

    template: `
      <v-form>
      <v-row class="justify-center mt-5">
        <h2>Create an account</h2>
      </v-row>
      <v-col cols="5" class="mr-auto ml-auto mt-5">
          <v-row>
            <v-text-field v-model="email" :rules="[v => !!v || 'Email is required']" label="Email address" outlined solo-inverted required></v-text-field>
          </v-row>
          <v-row>
            <v-text-field v-model="password" :rules="[v => !!v || 'Password is required']" label="Password" outlined solo-inverted required></v-text-field>
          </v-row>
          <v-row>
            <v-row justify="center">
              <v-btn @click="register" class="mt-4">Register</v-btn>
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
                    this.$router.push('/home');
                })
                .catch(error => {
                    alert(error.message);
                });
        },
    },

    data() {
        return {
            // u: new User
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
            <v-text-field v-model="email" label="Email address" outlined solo-inverted required></v-text-field>
          </v-row>
          <v-row>
            <v-text-field v-model="password" label="Password" outlined solo-inverted required></v-text-field>
          </v-row>
          <v-row>
          <v-row justify="center">
            <v-btn @click="login" class="mt-4">Sign In</v-btn>
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
                db.collection('sports').doc(this.game.id).update({
                    items: firebase.firestore.FieldValue.arrayRemove(item)
                })
            }
        },

        remove(){
            storage.child('sports').child(this.game.id).delete();
            db.collection('sports').doc(this.game.id).delete();
        },

        formatDate (date) {
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
          <v-expand-transition>
            <v-card v-if="reveal"  class="transition-fast-in-fast-out v-card--reveal" style="height: 100%;" color="primary">
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
          </v-expand-transition>
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
          <span class="text-h5">Add an item</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field :rules="[rules.required]" label="Item*" v-model="name" required></v-text-field>
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
            this.game.gameType.items.push('');
        },
    },

    template: `
      <v-form>
          <v-row v-if="loggedIn" class="justify-center mt-5">
              <h2>Add a game to your schedule</h2>
          </v-row>
          <v-col cols="4" class="mr-auto ml-auto mt-5" v-if="loggedIn">
              <v-row class="justify-start">
                <v-text-field v-model="game.gameType.name" :rules="[v => !!v || 'Title is required']" label="Enter game name" outlined solo-inverted required></v-text-field>
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
                    <v-text-field v-model="game.gameType.items[i]" :key="i" label="Item for the game*" outlined solo-inverted required></v-text-field>
                  </v-row>
                  <v-btn @click="createItem" color="primary">Add item</v-btn>
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
