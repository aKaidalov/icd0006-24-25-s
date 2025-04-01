class Helpers {
    private timerInterval: number | null;
    private seconds: number;
    private isTimerRunning: boolean;

    constructor() {
        this.timerInterval = null;
        this.seconds = 0;
        this.isTimerRunning = false;
    }

    startTimer(): void {
        if (this.isTimerRunning) return;
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

    stopTimer(): void {
        if (this.timerInterval !== null) {
            clearInterval(this.timerInterval);
        }
        this.isTimerRunning = false;
        this.seconds = 0;
    }

    logBoardClick(board: HTMLElement): void {
        board.addEventListener('click', (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains('square')) {
                console.log(`Square index: ${target.dataset.index}`);
            }
        });
    }
}

export const helpers = new Helpers();
