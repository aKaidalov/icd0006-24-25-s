import {gameState} from "./gameState.js";
import {assignSquareValue, changePlayer, checkTieOrWin, enableOtherRules} from "./game.js";

export function makeAIMove() {
    if (gameState.gameOver) return; // Don't move if the game is over

    if (gameState.currentPlayerPlacedPieces() < 4) {
        placeOneOfRemainingPieces();
    }

    console.log(`moveCounter after AI move: ${gameState.moveCounter}`);
}

function placeOneOfRemainingPieces() {
    const availableSquares = Array.from(document.querySelectorAll('.grid'))
        .filter(square => square.textContent === ''); // Find empty squares

    if (availableSquares.length === 0) return; // No available moves

    const aiMove = availableSquares[Math.floor(Math.random() * availableSquares.length)]; // Pick random square
    assignSquareValue(aiMove);

    if (!checkTieOrWin()) {
        gameState.changePlayer(); // Need to just switch player and continue in game.js
    }
}