import {gameState} from "./gameState.js";
import {assignSquareValue, changePlayerAndEndMessage, checkTieOrWin} from "./game.js";
import {findEmptySquaresWithinGrid} from "../ui/domElements.js";

export function makeAIMove() {
    if (gameState.gameOver) return; // Don't move if the game is over

    if (gameState.currentPlayerPlacedPieces() < 4) {
        placeOneOfRemainingPieces();
    }

    console.log(`moveCounter after AI move: ${gameState.moveCounter}`);
}

function placeOneOfRemainingPieces() {
    const availableSquares = findEmptySquaresWithinGrid();

    if (availableSquares.length === 0) {
        throw new Error("AI move failed: no empty grid squares available");
    }

    const aiMove = availableSquares[Math.floor(Math.random() * availableSquares.length)]; // Pick random square
    assignSquareValue(aiMove);

    if (!checkTieOrWin()) {
        changePlayerAndEndMessage();
    }
}