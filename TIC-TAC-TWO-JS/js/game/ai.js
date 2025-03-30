import {gameState} from "./gameState.js";
import {assignSquareValue, changePlayerAndEndMessage, checkTieOrWin} from "./game.js";
import {
    createNewGridFrom,
    deleteOldGrid,
    findEmptySquaresWithinGrid,
    getAllSquares,
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
    const random = Math.random();
    if (random < 0.5) {
        gameState.isPositionChangeMode = true;
        aiPositionChangeMove();
    } else {
        gameState.isGridMoveMode = true;
        aiGridMove();
    }
}

function aiPositionChangeMove() {
    const squares = getAllSquares();
    const currentGridBounds = gameState.getCurrentGridBounds();
    const aiPieces = findAllAiPieces(squares, currentGridBounds);
    const emptySquaresWithinGrid = findEmptySquaresWithinGridForAi(squares, currentGridBounds);

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

// Helpers
function getRandomDirection() {
    let randomKey = POSSIBLE_KEYS[Math.floor(Math.random() * POSSIBLE_KEYS.length)];
    return Direction.fromKey(randomKey);
}

function findAllAiPieces(squares, currentGridBounds) {
    const aiPieces = [];
    currentGridBounds.forEach(i => {
        if (squares[i].textContent === gameState.currentPlayer) {
            aiPieces.push(i);
        }
    });
    return aiPieces;
}

function findEmptySquaresWithinGridForAi(squares, currentGridBounds) {
    return currentGridBounds.filter(i => squares[i].textContent === '')
}

