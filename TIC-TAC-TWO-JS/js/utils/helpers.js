class Helpers {
    constructor() {
        this.timerInterval = null;
        this.seconds = 0;
        this.isTimerRunning = false;
    }

    startTimer() {
        if (this.isTimerRunning) return; // Prevent multiple intervals from running
        this.isTimerRunning = true;
        this.seconds = 0;

        this.timerInterval = setInterval(() => {
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
        clearInterval(this.timerInterval); // Stop the timer when the game ends or other conditions are met
        this.isTimerRunning = false;
        this.seconds = 0;
    }

    logBoardClick(board) {
        board.addEventListener('click', (event) => {
            if (event.target.classList.contains('square')) {
                console.log(`Square index: ${event.target.dataset.index}`);
            }
        });
    }
}

export const helpers = new Helpers();


