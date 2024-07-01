// Importación de archivos
import '../sass/main.scss';
import Game from './class/Game';

// Solicitud de información al usuario para generar un tablero personalizado
let dataBoard = Game.personalizedBoard()

// Creación de instancias
let game = new Game(dataBoard.rows, dataBoard.cols, "board");

// Se añade evento al botón resetButton para que se resetee el juego por completo
document.getElementById("resetButton").addEventListener("click", () => game.resetGame())
