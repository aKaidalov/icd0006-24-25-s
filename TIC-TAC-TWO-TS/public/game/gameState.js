import { FOUR_MOVES, GRID_BOUNDS, PLAYERS } from "../utils/constants.js";
import Direction from "../utils/direction.js";
class GameState {
    constructor() {
        this.currentPlayer = PLAYERS[0];
        this.gameOver = false;
        this.isGridMoveMode = false;
        this.isPositionChangeMode = false;
        this.moveCounter = 0;
        this.currentGridCenterSquareIndex = GRID_BOUNDS[4];
        this.currentWinningCombinations = [];
        this.isPreviousElementRemoved = false;
        this.currentGameMode = null;
        this.otherRulesEnabled = false;
    }
    changePlayer() {
        this.currentPlayer = this.currentPlayer === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0];
    }
    currentPlayerPlacedPieces() {
        return Array.from(document.querySelectorAll('.square'))
            .filter(square => square.textContent === this.currentPlayer).length;
    }
    isFourthMove() {
        return this.moveCounter === FOUR_MOVES;
    }
    getCurrentGridBounds() {
        const i = this.currentGridCenterSquareIndex;
        return [
            i + Direction.UP_LEFT, i + Direction.UP, i + Direction.UP_RIGHT,
            i + Direction.LEFT, i, i + Direction.RIGHT,
            i + Direction.DOWN_LEFT, i + Direction.DOWN, i + Direction.DOWN_RIGHT
        ];
    }
    generateWinningCombinations() {
        const i = this.currentGridCenterSquareIndex;
        this.currentWinningCombinations = [
            [i + Direction.UP_LEFT, i + Direction.UP, i + Direction.UP_RIGHT],
            [i + Direction.LEFT, i, i + Direction.RIGHT],
            [i + Direction.DOWN_LEFT, i + Direction.DOWN, i + Direction.DOWN_RIGHT],
            [i + Direction.UP_LEFT, i + Direction.LEFT, i + Direction.DOWN_LEFT],
            [i + Direction.UP, i, i + Direction.DOWN],
            [i + Direction.UP_RIGHT, i + Direction.RIGHT, i + Direction.DOWN_RIGHT],
            [i + Direction.UP_LEFT, i, i + Direction.DOWN_RIGHT],
            [i + Direction.UP_RIGHT, i, i + Direction.DOWN_LEFT]
        ];
    }
}
export const gameState = new GameState();
