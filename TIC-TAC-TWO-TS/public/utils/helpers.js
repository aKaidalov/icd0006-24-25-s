class Helpers {
    constructor() {
        this.timerInterval = null;
        this.seconds = 0;
        this.isTimerRunning = false;
    }
    startTimer() {
        if (this.isTimerRunning)
            return;
        this.isTimerRunning = true;
        this.seconds = 0;
        this.timerInterval = window.setInterval(() => {
            this.seconds++;
            const minutes = Math.floor(this.seconds / 60);
            const sec = this.seconds % 60;
            const formattedTime = `${String(minutes).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
            const timerElement = document.getElementById("game-time");
            if (timerElement) {
                timerElement.textContent = formattedTime;
            }
        }, 1000);
    }
    stopTimer() {
        if (this.timerInterval !== null) {
            clearInterval(this.timerInterval);
        }
        this.isTimerRunning = false;
        this.seconds = 0;
    }
    logBoardClick(board) {
        board.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('square')) {
                console.log(`Square index: ${target.dataset.index}`);
            }
        });
    }
}
export const helpers = new Helpers();
