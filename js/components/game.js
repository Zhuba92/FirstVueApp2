Vue.component('DisplayGameItems', {
    props: {
        gameItems: Object
    },

    template: `
      <v-row>
          <v-col v-for="game in gameItems" cols="4">
              <game :game="game"></game>
          </v-col>
      </v-row>
    `
})

Vue.component('Game', {
    props: {
        game: Object
    },

    methods: {
        deleteIt: function(item){
            this.game.items.splice(this.game.items.indexOf(item), 1);
        },
    },

    data: () => ({
        reveal: false,
    }),

    template:`
      <v-card color="#a9a9a9" outlined>
      <v-card-title class="justify-center">{{game.name}}</v-card-title>
      <v-img class="rounded-lg" :src="game.image"></v-img>
      <v-card-actions class="justify-center">
        <v-btn text color="black" @click="reveal = true">See List <v-icon medium>launch</v-icon></v-btn>
      </v-card-actions>
      <v-expand-transition>
        <v-card v-if="reveal" color="primary" class="transition-fast-in-fast-out v-card--reveal" style="height: 100%;">
          <v-card-text>
            <v-list-item-content>
              <v-list-item-title v-for="item in game.items">{{item}}<v-btn v-on:click="deleteIt(item)" icon color="red"><v-icon>mdi-close</v-icon></v-btn></v-list-item-title>
            </v-list-item-content>
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
        game: Object
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
                this.game.items.push(this.name);
                this.dialog = false
                this.name = ''
            }
            else {
                this.dialog = true
            }
        }
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
