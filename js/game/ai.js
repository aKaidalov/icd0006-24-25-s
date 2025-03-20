import {gameState} from "./gameState.js";
import {FOUR_MOVES} from "../utils/constants.js";
import {assignSquareValue, changePlayer, checkTieOrWin, enableOtherRules} from "./game.js";

export function makeAIMove() {
    if (gameState.gameOver) return; // Don't move if the game is over

    gameState.moveCounter++;
    if (gameState.isFourthMove()) { // Waits for click. Player clicks on 3rd move -> during tha same click AI handles 4th move.
        enableOtherRules();
    }

    if (gameState.currentPlayerMadeMoves() !== FOUR_MOVES) {
        let selector = gameState.moveCounter > FOUR_MOVES ? '.square' : '.grid';
        const availableSquares = Array.from(document.querySelectorAll(selector))
            .filter(square => square.textContent === ''); // Find empty squares

        if (availableSquares.length === 0) return; // No available moves

        const aiMove = availableSquares[Math.floor(Math.random() * availableSquares.length)]; // Pick random square
        assignSquareValue(aiMove);

        checkTieOrWin();

        if (!gameState.gameOver) {
            changePlayer(); // Switch turn back to the player
        }
    }
}