Vue.component('List', {
    props: {
        item: list
    },

    methods: {
        deleteIt: function(item){
            this.items.splice(this.items.indexOf(item), 1);
        },
    },

    template: `<div>
    <v-card class="mx-auto" max-width="400" color="primary" tile>
      <list-item v-on:delete-item="deleteIt" v-for="(item, i) in list"
                 :item="item"
                 :key="item.name">
        <v-divider inset></v-divider>
      </list-item>
    </v-card>
    </div>`,

})


Vue.component('DisplayGameItems', {
    props: {
        item: list
    },

    template: `<v-list-item-content>
    <div>
      <v-list-item-content>
        <v-list-item-title>{{item.name}}<delete-item @delete-item="$emit('delete-item', item)"></delete-item></v-list-item-title>
      </v-list-item-content>
    </div>
    </v-list-item-content>
    `
})

Vue.component('DisplayPicture', {
    props: {

    },

    template: `<div>
    <h3 v-for="(item, i) in item" :key="item.name">{{item.name}}</h3>
    </div>`,
})

Vue.component('DisplayGameTitle', {
    props: {

    },

    template: `<div>
    
    </div>`,
})

Vue.component('add-game-item', {

    data() {
        return {
            dialog: false,
            name: '',
            gameType: '',
        }
    },

    methods: {
        addGameItem() {
            this.$emit('add-item', {text: this.name, gameType: this.gameType});
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
                <v-text-field label="Item*" v-model="name" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select v-model="gameType"
                          :items="['Packer game', 'Bucks game', 'Brewer game']"
                          label="Which game is this for*"
                          required
                ></v-select>
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

Vue.component('delete-item', {

    methods: {
        removeItem(){
            this.$emit('delete-item');
        }
    },

    template: `
    <v-btn v-on:click="removeItem" icon color="red"><v-icon>mdi-close</v-icon></v-btn>
    `
})