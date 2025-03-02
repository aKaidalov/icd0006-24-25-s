import {setUpBaseUiElements} from "./ui.js";
import {startGame} from "./game.js";

const modes = ['PvP', 'PvE'];
let timerInterval;
let seconds = 0;
let isTimerRunning = false;


setUpBaseUiElements(modes[0]);
startGame();


export function startTimer() {
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

export function stopTimer() {
    clearInterval(timerInterval); // Stop the timer when the game ends or other conditions are met
    isTimerRunning = false;
    seconds = 0;
}