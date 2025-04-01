import { FOUR_MOVES, GRID_BOUNDS, PLAYERS } from "../utils/constants.js";
import Direction from "../utils/direction.js";

type Player = typeof PLAYERS[number];
type GameMode = string | null;
type WinningCombination = [number, number, number];

class GameState {
    currentPlayer: Player;
    gameOver: boolean;
    isGridMoveMode: boolean;
    isPositionChangeMode: boolean;
    moveCounter: number;
    currentGridCenterSquareIndex: number;
    currentWinningCombinations: WinningCombination[];
    isPreviousElementRemoved: boolean;
    currentGameMode: GameMode;
    otherRulesEnabled: boolean;

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

    changePlayer(): void {
        this.currentPlayer = this.currentPlayer === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0];
    }

    currentPlayerPlacedPieces(): number {
        return Array.from(document.querySelectorAll('.square'))
            .filter(square => (square as HTMLElement).textContent === this.currentPlayer).length;
    }

    isFourthMove(): boolean {
        return this.moveCounter === FOUR_MOVES;
    }

    getCurrentGridBounds(): number[] {
        const i = this.currentGridCenterSquareIndex;
        return [
            i + Direction.UP_LEFT, i + Direction.UP, i + Direction.UP_RIGHT,
            i + Direction.LEFT, i, i + Direction.RIGHT,
            i + Direction.DOWN_LEFT, i + Direction.DOWN, i + Direction.DOWN_RIGHT
        ];
    }

    generateWinningCombinations(): void {
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
