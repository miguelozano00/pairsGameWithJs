// Función para barajar los elementos de un array
function shuffleArray(array) {
    let currentIndex = array.length;

    // Mientras que haya elementos para barajar...
    while (currentIndex != 0) {

        let randomIndex = Math.floor(Math.random() * currentIndex);       // Genera un índice aleatorio
        currentIndex--;                                                   // Decrementa en uno el valor de currentIndex

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return(array)
}

export { shuffleArray };