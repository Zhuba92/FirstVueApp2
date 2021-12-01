Vue.use(Vuetify);
Vue.use(Vuefire);

const router = new VueRouter({
    routes: [
        {path: '/', component: DisplayGames},
        {name: 'home', path: '/home', component: DisplayGames},
        {name: 'addGames', path: '/addGames', component: AddGames},
        {name: 'register', path: '/register', component: Register},
        {name: 'login', path: '/login', component: Login},
    ],

});

const app = new Vue({
    el: '#app',
    router,
    vuetify: new Vuetify({
        theme: {
            themes:{
                light: {
                    primary: '#A5D6A7',
                    secondary: '#a4a9ad',
                }
            }
        }
    }),

    data() {
        return {
            dialog: false,
            reveal: false,
            authUser: {uid: ''},
        }
    },

    methods: {

    },

    created: function(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user){
                console.log('Signed in as ', user);
                this.authUser = new User(user);
            } else {
                console.log('Not signed in');
                this.authUser = {uid: ''};
            }
        })
    }

})