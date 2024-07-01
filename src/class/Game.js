import { shuffleArray } from '../utils/utils';
import Box from './Box';
import Timer from './Timer';

export default class Game {
    // Propiedades
    #rows
    #cols
    #boxes
    stateBoxes
    board
    #timer

    constructor(rows, cols, idElement = "board") {
        this.#rows = rows
        this.#cols = cols
        this.board = document.getElementById(idElement)
        this.#timer = new Timer
        this.#boxes = []
        this.stateBoxes = []
        this.createBoxes()
        this.cssPropertiesBoard()
        this.paintBoxes()
        this.timerButton()
    }

    get boxes() {
        return this.#boxes
    }

    // Función que genera colores aleatorios
    createRandomColors() {
        // Array que almacenará todos los colores
        let randomColors = []
        // Bucle for para almacenar 15 colores aleatorios en un array
        for (let i = 0; i < this.#cols * this.#rows / 2; i++) {
            // Se genera color aleatorio
            let randomR = Math.floor(Math.random() * 255);
            let randomG = Math.floor(Math.random() * 255);
            let randomB = Math.floor(Math.random() * 255);
            let randomColor = `rgb(${randomR}, ${randomG}, ${randomB})`
            // Se añade el color generado al array randomColors
            randomColors.push(randomColor)
        }
        // Duplicando el array de colores para que haya el mismo número de elementos en el array de colores como número de cajas
        randomColors = [...randomColors, ...randomColors]
        // Se baraja el array de colores aleatorios
        randomColors = shuffleArray(randomColors)
        return randomColors
    }

    // Función que crea las cajas
    createBoxes() {
        // Condicional que revisa si ya hay almacenados en localStorage registros de cajas
        if (localStorage.getItem("boxes") !== null) {
            // Se convierte la info de localStorage de nuevo a un array
            let localStorageBoxes = JSON.parse(localStorage.getItem("boxes"))
            // Se recorre el array recogido en localStorage
            localStorageBoxes.map(box => {
                // Se crea un objeto de tipo box con cada una de las propiedades de todas las cajas ya almacenadas en localStorage
                let newBox = new Box(box.row, box.col, box.color, box.free, box.open)
                // Se añade el nuevo objeto al array de #boxes
                this.#boxes.push(newBox)
            })
        }
        else {
            // Se generan colores aleatorios
            let randomColors = this.createRandomColors()
            // Bucles anidados for para crear todas las cajas
            for (let row = 0; row < this.#rows; row++) {
                for (let col = 0; col < this.#cols; col++) {
                    // Se almacena el color seleccionado y se elimina del array randomColors
                    let color = randomColors.shift()
                    // Se crea una caja
                    let newBox = new Box(row, col, color)
                    // Se almacena la caja
                    this.#boxes.push(newBox)
                }
            }
            // Se llama a la función storeInfo para almacenar todas las cajas creadas en localStorage
            this.storeInfo()
        }
    }

    // Función para almacenar las cajas en localStorage
    storeInfo() {
        // Se recorre el array de this.#boxes y se almacena en una nueva variable
        let arrayBoxesToLocalStorage = this.#boxes.map(box => {
            // Se devuelve objetos con las claves-valor necesarias
            return {
                'row': box.row,
                'col': box.col,
                'color': box.color,
                'backgroundColor': box.backgroundColor,
                'free' : box.free,
                'open' : box.open,
            }
        });
        // Se almacena el array de objetos en localStorage
        localStorage.setItem("boxes",JSON.stringify(arrayBoxesToLocalStorage))
    }

    // Función que pinta las cajas
    paintBoxes() {
        this.#boxes.map((box) => {
            let newBoxDiv = document.createElement("div")
            newBoxDiv.classList.add("box")
            newBoxDiv.dataset.row = box.row
            newBoxDiv.dataset.col = box.col
            newBoxDiv.dataset.color = box.color
            newBoxDiv.dataset.free = box.free
            newBoxDiv.dataset.open = box.open
            // Si el atributo free de la caja es falso
            if (box.free === false){
                newBoxDiv.style.backgroundColor = box.color
            }
            else {
                newBoxDiv.addEventListener('click', (event) => this.testColor(event))
            }
            // newBoxDiv.addEventListener('click', (event) => this.testColor(event))
            // Se añade el elemento al section con id "board"
            this.board.appendChild(newBoxDiv)
        })
    }

    // Función que comprueba si los colores de las parejas seleccionadas coinciden
    testColor(event) {
        // Se asigna de color de fondo el color almacenado en el atributo data-color
        event.target.style.backgroundColor = event.target.dataset.color
        // Se crea un nuevo atributo para conocer si el elemento se ha pulsado o no
        event.target.dataset.open = true
        // Se almacena en una variable las cajas abiertas
        let boxesOpened = document.querySelectorAll('[data-open="true"]')

        // Estructura condicional que se ejecutará en el caso de que se hayan abierto dos cajas
        if (boxesOpened.length === 2) {
            // Estructura condicional que se ejecutará en el caso de que ambos colores sean iguales
            if (boxesOpened[0].dataset.color === boxesOpened[1].dataset.color) {
                let localStorageBoxes = JSON.parse(localStorage.getItem("boxes"))

                // Eliminamos los eventos de las cajas a las que ya se les ha encontrado pareja
                boxesOpened[0].removeEventListener('click', (event) => this.testColor(event));
                boxesOpened[1].removeEventListener('click', (event) => this.testColor(event));

                // Se modifican los parámetros de open y de free
                boxesOpened[0].dataset.open = false;
                boxesOpened[1].dataset.open = false;
                boxesOpened[0].dataset.free = false;
                boxesOpened[1].dataset.free = false;

                // Localizar los elementos que se han modificado. Para eso, buscar por su color
                localStorageBoxes.map((element) => {
                    // Si el color del elemento coincide con el color de las cajas que se han dado la vuelta
                    if (element.color === boxesOpened[0].dataset.color){
                        // El atributo free se iguala a false
                        element.free = false
                    }
                })
                localStorage.setItem("boxes",JSON.stringify(localStorageBoxes))
                // Almacenamos la cantidad de cajas a las que ya se le han encontrado pareja
                let nBoxesFree = document.querySelectorAll('[data-free="false"]')
                
                // Si todas las cajas ya han sido emparejadas
                if (nBoxesFree.length == this.#rows * this.#cols) {
                    // Se espera medio segundo tras terminar la partida
                    setTimeout(() => {
                        // Se ejecuta el método que para el tiempo de la instancia del objeto Timer
                        this.#timer.stopTimer()
                        // Se pregunta al usuario si desea volver a jugar
                        let decission = (prompt(`¿Do you want to restart the game? Answer yes or no`)).toLowerCase()
                        // Se analiza la respuesta del usuario
                        if (decission === "yes") {
                            // Si dice que sí se resetea el juego
                            this.resetGame()
                            // this.#timer.stopTimer()
                        }
                        // Si el usuario dice que no quiere jugar otra partida
                        else if (decission === "no"){
                            // Se imprime un mensaje de información
                            alert("Ok. If you want to play again, please click on 'Restart game' button.")
                        }
                        else {
                            console.error("The prompt value is null.")
                        }
                    }, 500)

                }
                
            }
            // Si las cajas abiertas no coinciden en color
            else {
                // Se espera medio segundo
                setTimeout(() => {
                    // Se vuelven a colorear de negro
                    boxesOpened[0].style.backgroundColor = 'black';
                    boxesOpened[1].style.backgroundColor = 'black';
                    // Se vuelven a igualar los parámetros de open a false
                    boxesOpened[0].dataset.open = false;
                    boxesOpened[1].dataset.open = false;
                }, 500)
            }
            
        }
        
    }
    
    // Función que asigna evento al botón que inicializa el temporizador
    timerButton(){
        let startButton = document.getElementById('startButton')
        startButton.addEventListener('click', () => {
            console.log("Se pulsa el botón")
            this.#timer.startTimer();
        });
    }

    // Función que modifica la hoja de estilos según las columnas indicadas por el usuario
    cssPropertiesBoard() {
        this.board.style.gridTemplateColumns = `repeat(${this.#cols}, 1fr)`
    }

    resetGame() {
        localStorage.removeItem("cols")
        localStorage.removeItem("rows")
        localStorage.removeItem("boxes")
        localStorage.removeItem("boxsSelected")
        location.reload()
    }

    static personalizedBoard() {
        let rowsUser, colsUser
        // Se revisa si hay alguna clave definida
        if (localStorage.getItem("rows") !== null && localStorage.getItem("cols") !== null) {
            // Si ya existen en localStorage las filas y columnas, se almacenan ambas en sus variables correspondientes
            rowsUser = parseInt(localStorage.getItem("rows"))
            colsUser = parseInt(localStorage.getItem("cols"))
        }
        // Si no hay claves almacenadas con el valor de las filas y las columnas, se le pide al usuario
        else {
            rowsUser = parseInt(prompt("Enter the number of rows you want on the game board: "))
            colsUser = parseInt(prompt("Enter the number of columns you want on the game board: "))
            // Si el número total de cajas elegido por el usuario es impar, se vuelve a preguntar. El total de cajas debe ser para para poder dividir por parejas
            while ((rowsUser * colsUser) % 2 !== 0 || (rowsUser * colsUser) === 0) {
                alert("Please enter values ​​so that the total number of cells must be different than 0 and even.")
                rowsUser = parseInt(prompt("Enter the number of rows you want on the game board: "))
                colsUser = parseInt(prompt("Enter the number of columns you want on the game board: "))
            }
            // Se almacenan los valores de filas y columnas en localStorage
            localStorage.setItem("rows", rowsUser)
            localStorage.setItem("cols", colsUser)
        }

        // Se devuelven los valores
        return {
            rows: rowsUser,
            cols: colsUser,
        };
    }
}

