let timerInterval: ReturnType<typeof setInterval>;
let seconds: number = 0;
let isTimerRunning: boolean = false;

export function startTimer(): void {
    if (isTimerRunning) return; // Prevent multiple intervals from running
    isTimerRunning = true;
    let seconds = 0;

    timerInterval = setInterval(() => {
        seconds++;
        const minutes = Math.floor(seconds / 60);
        const sec = seconds % 60;
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

        const timerElement = document.getElementById("game-time");
        if (timerElement) {
            timerElement.textContent = formattedTime;
        }
    }, 1000);
}

export function stopTimer(): void {
    clearInterval(timerInterval);
    isTimerRunning = false;
    seconds = 0;
}

export function logBoardClick(board: HTMLElement): void {
    board.addEventListener("click", (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains("square")) {
            console.log(`Square index: ${target.dataset.index}`);
        }
    });
}
