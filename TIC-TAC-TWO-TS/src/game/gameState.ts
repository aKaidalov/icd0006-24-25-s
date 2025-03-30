import { FOUR_MOVES, GRID_BOUNDS, PLAYERS } from "../utils/constants";
import Direction from "../utils/direction";

type PlayerSymbol = string;
type GameMode = string | null;

class GameState {
    currentPlayer: PlayerSymbol;
    gameOver: boolean;
    isGridMoveMode: boolean;
    isPositionChangeMode: boolean;
    moveCounter: number;
    currentGridCenterSquareIndex: number;
    currentWinningCombinations: number[][];
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
        const squares = document.querySelectorAll('.square') as NodeListOf<HTMLElement>;
        return Array.from(squares).filter(
            square => square.textContent === this.currentPlayer
        ).length;
    }

    isFourthMove(): boolean {
        return this.moveCounter === FOUR_MOVES;
    }

    getCurrentGridBounds(): number[] {
        const c = this.currentGridCenterSquareIndex;
        return [
            c + Direction.UP_LEFT, c + Direction.UP, c + Direction.UP_RIGHT,
            c + Direction.LEFT, c, c + Direction.RIGHT,
            c + Direction.DOWN_LEFT, c + Direction.DOWN, c + Direction.DOWN_RIGHT
        ];
    }

    generateWinningCombinations(): void {
        const c = this.currentGridCenterSquareIndex;
        this.currentWinningCombinations = [
            [c + Direction.UP_LEFT, c + Direction.UP, c + Direction.UP_RIGHT],
            [c + Direction.LEFT, c, c + Direction.RIGHT],
            [c + Direction.DOWN_LEFT, c + Direction.DOWN, c + Direction.DOWN_RIGHT],
            [c + Direction.UP_LEFT, c + Direction.LEFT, c + Direction.DOWN_LEFT],
            [c + Direction.UP, c, c + Direction.DOWN],
            [c + Direction.UP_RIGHT, c + Direction.RIGHT, c + Direction.DOWN_RIGHT],
            [c + Direction.UP_LEFT, c, c + Direction.DOWN_RIGHT],
            [c + Direction.UP_RIGHT, c, c + Direction.DOWN_LEFT]
        ];
    }
}

export const gameState = new GameState();
