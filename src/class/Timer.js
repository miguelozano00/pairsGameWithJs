export default class Timer {
    #timeElapsed
    #timerInterval

    constructor(){
        this.#timeElapsed = 0
        this.#timerInterval;
    }

    // Función para iniciar el temporizador
    startTimer() {
        this.#timeElapsed = 0
        document.getElementById('timer').textContent = `Timer: ${this.#timeElapsed} seconds.`;

        // Usa setInterval para incrementar el tiempo cada segundo
        this.#timerInterval = setInterval(() => {
            this.#timeElapsed++;
            document.getElementById('timer').textContent = `Timer: ${this.#timeElapsed} seconds.`;
        }, 1000);
    }

    // Función para detener el temporizador
    stopTimer() {
        clearInterval(this.#timerInterval);
        alert(`It took you ${this.#timeElapsed} seconds to find all the pairs of boxes.`);
    }
}