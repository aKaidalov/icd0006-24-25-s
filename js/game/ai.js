import {gameState} from "./gameState.js";
import {assignSquareValue, changePlayerAndEndMessage, checkTieOrWin} from "./game.js";
import {
    changeEndMessage,
    createNewGridFrom,
    deleteOldGrid,
    findEmptySquaresWithinGrid,
    gridPeek
} from "../ui/domElements.js";
import Direction from "../utils/direction.js";
import {GRID_BOUNDS, POSSIBLE_KEYS} from "../utils/constants.js";

export function makeAIMove() {
    if (gameState.gameOver) return; // Don't move if the game is over

    if (gameState.currentPlayerPlacedPieces() < 4) {
        placeOneOfRemainingPieces();
    }  else {
        handleOtherRules();
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

function handleOtherRules() {
    if (gameState.isPositionChangeMode) {
        aiPositionChangeMove();
    } else if (gameState.isGridMoveMode) {
        aiGridMove();
    } else {
        const random = Math.random();
        if (random < 0.5) {
            gameState.isPositionChangeMode = true;
            changeEndMessage(`AI is moving its piece`);
            aiPositionChangeMove();
        } else {
            gameState.isGridMoveMode = true;
            changeEndMessage(`AI is moving the grid`);
            aiGridMove();
        }
    }
}

function aiPositionChangeMove() {
    const squares = document.querySelectorAll('.square');
    const currentGridBounds = gameState.getCurrentGridBounds();
    const aiPieces = [];

    // Find all AI moves
    currentGridBounds.forEach(i => {
        if (squares[i].textContent === gameState.currentPlayer) {
            aiPieces.push(i);
        }
    });

    const emptySquaresWithinGrid = currentGridBounds.filter(i => squares[i].textContent === '');

    if (aiPieces.length === 0 || emptySquaresWithinGrid.length === 0) {
        gameState.isPositionChangeMode = false;
        changePlayerAndEndMessage();
        return;
    }

    const fromIndex = aiPieces[Math.floor(Math.random() * aiPieces.length)];
    const toIndex = emptySquaresWithinGrid[Math.floor(Math.random() * emptySquaresWithinGrid.length)];

    squares[fromIndex].textContent = '';
    squares[toIndex].textContent = gameState.currentPlayer;

    gameState.isPreviousElementRemoved = false;
    gameState.isPositionChangeMode = false;

    if (!checkTieOrWin()) {
        changePlayerAndEndMessage();
    }
}

function aiGridMove() {
    let moved = false;

    while (!moved){
        let direction = getRandomDirection();

        if (!direction) continue;

        let currentGrid = gridPeek(direction);
        let gridCenterSquareIndex = currentGrid[4];

        if (GRID_BOUNDS.includes(gridCenterSquareIndex)) {
            deleteOldGrid();
            createNewGridFrom(currentGrid);
            gameState.currentGridCenterSquareIndex = gridCenterSquareIndex;
            console.log(`AI moved grid to center index: ${gridCenterSquareIndex}`);
            moved = true;
        }
    }

    gameState.isGridMoveMode = false;
    if (!checkTieOrWin()) {
        changePlayerAndEndMessage();
    }
}

function getRandomDirection() {
    let randomKey = POSSIBLE_KEYS[Math.floor(Math.random() * POSSIBLE_KEYS.length)];
    return Direction.fromKey(randomKey);
}


