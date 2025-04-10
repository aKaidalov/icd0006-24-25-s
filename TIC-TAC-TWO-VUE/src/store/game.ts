import { defineStore } from 'pinia';
import { PLAYERS, GRID_BOUNDS, FOUR_MOVES } from '@/utils/constants';
import Direction from '@/utils/direction';

export const useGameStore = defineStore('game', {
    state: () => ({
        currentPlayer: PLAYERS[0],
        gameOver: false,
        isGridMoveMode: false,
        isPositionChangeMode: false,
        moveCounter: 0,
        currentGridCenterSquareIndex: GRID_BOUNDS[4],
        currentWinningCombinations: [] as [number, number, number][],
        isPreviousElementRemoved: false,
        currentGameMode: null as string | null,
        otherRulesEnabled: false
    }),

    actions: {
        changePlayer() {
            this.currentPlayer = this.currentPlayer === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0];
        },

        currentPlayerPlacedPieces(squares: HTMLElement[]): number {
            return squares.filter(square => square.textContent === this.currentPlayer).length;
        },

        isFourthMove(): boolean {
            return this.moveCounter === FOUR_MOVES;
        },

        getCurrentGridBounds(): number[] {
            const i = this.currentGridCenterSquareIndex;
            return [
                i + Direction.UP_LEFT, i + Direction.UP, i + Direction.UP_RIGHT,
                i + Direction.LEFT, i, i + Direction.RIGHT,
                i + Direction.DOWN_LEFT, i + Direction.DOWN, i + Direction.DOWN_RIGHT
            ];
        },

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
});
