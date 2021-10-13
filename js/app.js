Vue.use(Vuetify);

const app = new Vue({
    el: '#app',
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

    data: function() {
        return {
            list: new GameList()
                .addItem(new GameType('Packer Game', "images/packers-logo-packers-funny.png", ['Jersey', 'Hat', 'Cash', 'Brats']))
                .addItem(new GameType('Bucks Game', "images/bucks.png", ['Jersey', 'Hat', 'Cash']))
                .addItem(new GameType('Brewer Game', "images/brewers-logo-2020-2.jpg", ['Jersey', 'Hat', 'Cash', 'Baseball Glove'])),

            dialog: false,
            reveal: false,
        }
    },
})