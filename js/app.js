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
            active: false,
            active2: false,
            active3: false,
            dialog: false,
            showPackerList: false,
            showBucksList: false,
            showBrewerList: false,

            items: [
                {text: 'Jersey', gameType: 'Packer game'},
                {text: 'Hat', gameType: 'Packer game'},
                {text: 'Cash', gameType: 'Packer game'},
                {text: 'Brats', gameType: 'Packer game'},
            ],
            bucksItems: [
                {text: 'Jersey', gameType: 'Bucks game'},
                {text: 'Hat', gameType: 'Bucks game'},
                {text: 'Cash', gameType: 'Bucks game'},
            ],
            brewerItems: [
                {text: 'Jersey', gameType: 'Brewer game'},
                {text: 'Hat', gameType: 'Brewer game'},
                {text: 'Cash', gameType: 'Brewer game'},
                {text: 'Baseball Glove', gameType: 'Brewer game'},
            ],
        }
    },

    methods: {
        mouseOver: function(){
            this.active = !this.active;
        },

        addIt: function(newItem){
            switch (newItem.gameType) {
                case 'Packer game':
                    this.items.push(newItem)
                    break;
                case 'Bucks game':
                    this.bucksItems.push(newItem)
                    break;
                case 'Brewer game':
                    this.brewerItems.push(newItem)
                    break;
            }
        },
    },
})