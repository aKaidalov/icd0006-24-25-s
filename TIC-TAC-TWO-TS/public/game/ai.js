var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _AI_instances, _AI_placeOneOfRemainingPieces, _AI_handleOtherRules, _AI_aiPositionChangeMove, _AI_aiGridMove, _AI_getRandomDirection, _AI_findAllAiPieces, _AI_findEmptySquaresWithinGridForAi;
import { gameState } from "./gameState.js";
import { gameController } from "./game.js";
import { domService } from "../ui/domElements.js";
import Direction from "../utils/direction.js";
import { GRID_BOUNDS, POSSIBLE_KEYS } from "../utils/constants.js";
class AI {
    constructor() {
        _AI_instances.add(this);
    }
    makeAIMove() {
        if (gameState.gameOver)
            return;
        if (gameState.currentPlayerPlacedPieces() < 4) {
            __classPrivateFieldGet(this, _AI_instances, "m", _AI_placeOneOfRemainingPieces).call(this);
        }
        else {
            __classPrivateFieldGet(this, _AI_instances, "m", _AI_handleOtherRules).call(this);
        }
        console.log(`moveCounter after AI move: ${gameState.moveCounter}`);
    }
}
_AI_instances = new WeakSet(), _AI_placeOneOfRemainingPieces = function _AI_placeOneOfRemainingPieces() {
    const availableSquares = domService.findEmptySquaresWithinGrid();
    if (availableSquares.length === 0) {
        throw new Error("AI move failed: no empty grid squares available");
    }
    const aiMove = availableSquares[Math.floor(Math.random() * availableSquares.length)];
    gameController.assignSquareValue(aiMove);
    if (!gameController.checkTieOrWin()) {
        gameController.changePlayerAndEndMessage();
    }
}, _AI_handleOtherRules = function _AI_handleOtherRules() {
    const random = Math.random();
    if (random < 0.5) {
        gameState.isPositionChangeMode = true;
        __classPrivateFieldGet(this, _AI_instances, "m", _AI_aiPositionChangeMove).call(this);
    }
    else {
        gameState.isGridMoveMode = true;
        __classPrivateFieldGet(this, _AI_instances, "m", _AI_aiGridMove).call(this);
    }
}, _AI_aiPositionChangeMove = function _AI_aiPositionChangeMove() {
    const squares = domService.getAllSquares();
    const currentGridBounds = gameState.getCurrentGridBounds();
    const aiPieces = __classPrivateFieldGet(this, _AI_instances, "m", _AI_findAllAiPieces).call(this, squares, currentGridBounds);
    const emptySquaresWithinGrid = __classPrivateFieldGet(this, _AI_instances, "m", _AI_findEmptySquaresWithinGridForAi).call(this, squares, currentGridBounds);
    if (aiPieces.length === 0 || emptySquaresWithinGrid.length === 0) {
        gameState.isPositionChangeMode = false;
        gameController.changePlayerAndEndMessage();
        return;
    }
    const fromIndex = aiPieces[Math.floor(Math.random() * aiPieces.length)];
    const toIndex = emptySquaresWithinGrid[Math.floor(Math.random() * emptySquaresWithinGrid.length)];
    squares[fromIndex].textContent = '';
    squares[toIndex].textContent = gameState.currentPlayer;
    gameState.isPreviousElementRemoved = false;
    gameState.isPositionChangeMode = false;
    if (!gameController.checkTieOrWin()) {
        gameController.changePlayerAndEndMessage();
    }
}, _AI_aiGridMove = function _AI_aiGridMove() {
    let moved = false;
    while (!moved) {
        const direction = __classPrivateFieldGet(this, _AI_instances, "m", _AI_getRandomDirection).call(this);
        if (!direction)
            continue;
        const currentGrid = domService.gridPeek(direction);
        const gridCenterSquareIndex = currentGrid[4];
        if (GRID_BOUNDS.includes(gridCenterSquareIndex)) {
            domService.deleteOldGrid();
            domService.createNewGridFrom(currentGrid);
            gameState.currentGridCenterSquareIndex = gridCenterSquareIndex;
            console.log(`AI moved grid to center index: ${gridCenterSquareIndex}`);
            moved = true;
        }
    }
    gameState.isGridMoveMode = false;
    if (!gameController.checkTieOrWin()) {
        gameController.changePlayerAndEndMessage();
    }
}, _AI_getRandomDirection = function _AI_getRandomDirection() {
    const randomKey = POSSIBLE_KEYS[Math.floor(Math.random() * POSSIBLE_KEYS.length)];
    return Direction.fromKey(randomKey);
}, _AI_findAllAiPieces = function _AI_findAllAiPieces(squares, currentGridBounds) {
    const aiPieces = [];
    currentGridBounds.forEach(i => {
        if (squares[i].textContent === gameState.currentPlayer) {
            aiPieces.push(i);
        }
    });
    return aiPieces;
}, _AI_findEmptySquaresWithinGridForAi = function _AI_findEmptySquaresWithinGridForAi(squares, currentGridBounds) {
    return currentGridBounds.filter(i => squares[i].textContent === '');
};
export const ai = new AI();
