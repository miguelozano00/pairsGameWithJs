// import Game from './class/Game';

export default class Box {
    // Propiedades ocultas
    #row
    #col
    #color
    #free
    #open

    constructor (row, col, color, free = true, open = false) {
        this.#row = row;
        this.#col = col;
        this.#color = color;
        this.#free = free;
        this.#open = open;
    }
    
    get row(){
        return this.#row;
    }

    get col(){
        return this.#col;
    }

    get color(){
        return this.#color;
    }

    get free(){
        return this.#free;
    }

    get open(){
        return this.#open;
    }

}