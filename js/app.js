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

    timerInterval = setInterval(() => {
        seconds++;
        const timerElement = document.getElementById("game-time");
        if (timerElement) {
            timerElement.textContent = `${seconds}`;
        }
    }, 1000);
}

export function stopTimer() {
    clearInterval(timerInterval); // Stop the timer when the game ends or other conditions are met
    isTimerRunning = false;
    seconds = 0;
}