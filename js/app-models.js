function GameList() {
    this.__proto__ = [];

    this.addItem = function(item){
        this.push(item);

        return this
    }
}

function GameType(name, image, items){
    this.name = name || 'Things for the game';
    this.image = image || "";
    this.items = items || [];
}
