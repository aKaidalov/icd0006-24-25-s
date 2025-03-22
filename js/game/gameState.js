import {FOUR_MOVES, GRID_BOUNDS, PLAYERS} from "../utils/constants.js";
import Direction from "../utils/direction.js";

class GameState {
    constructor() {
        this.currentPlayer = PLAYERS[0];
        this.gameOver = false;
        this.isGridMoveMode = false; // Tracks if 'g' was pressed
        this.isPositionChangeMode = false; // Tracks if 'c' was pressed
        this.moveCounter = 0;
        this.currentGridCenterSquareIndex = GRID_BOUNDS[4];
        this.currentWinningCombinations = [];
        this.isPreviousElementRemoved = false;
        this.currentGameMode = null;
    }

    changePlayer() {
        this.currentPlayer = this.currentPlayer === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0];
    }

    currentPlayerMadeMoves() {
        return Array.from(document.querySelectorAll('.square'))
            .filter(square => square.textContent === `${this.currentPlayer}`).length
    }

    playersMadeFirstFourMoves() {
        return this.moveCounter >= FOUR_MOVES;
    }
    isFourthMove() {
        return this.moveCounter === FOUR_MOVES;
    }

    generateWinningCombinations() {
        this.currentWinningCombinations = [
            [this.currentGridCenterSquareIndex + Direction.UP_LEFT, this.currentGridCenterSquareIndex + Direction.UP, this.currentGridCenterSquareIndex + Direction.UP_RIGHT],
            [this.currentGridCenterSquareIndex + Direction.LEFT, this.currentGridCenterSquareIndex, this.currentGridCenterSquareIndex + Direction.RIGHT],
            [this.currentGridCenterSquareIndex + Direction.DOWN_LEFT, this.currentGridCenterSquareIndex + Direction.DOWN, this.currentGridCenterSquareIndex + Direction.DOWN_RIGHT],
            [this.currentGridCenterSquareIndex + Direction.UP_LEFT, this.currentGridCenterSquareIndex + Direction.LEFT, this.currentGridCenterSquareIndex + Direction.DOWN_LEFT],
            [this.currentGridCenterSquareIndex + Direction.UP, this.currentGridCenterSquareIndex, this.currentGridCenterSquareIndex + Direction.DOWN],
            [this.currentGridCenterSquareIndex + Direction.UP_RIGHT, this.currentGridCenterSquareIndex + Direction.RIGHT, this.currentGridCenterSquareIndex + Direction.DOWN_RIGHT],
            [this.currentGridCenterSquareIndex + Direction.UP_LEFT, this.currentGridCenterSquareIndex, this.currentGridCenterSquareIndex + Direction.DOWN_RIGHT],
            [this.currentGridCenterSquareIndex + Direction.UP_RIGHT, this.currentGridCenterSquareIndex, this.currentGridCenterSquareIndex + Direction.DOWN_LEFT]
        ];
    }
}

export const gameState = new GameState();