import { useGameStore } from '@/store/game';
import Direction from '@/utils/direction';
import { aiService } from './aiService';
import {GRID_BOUNDS, PLAYERS} from "../utils/constants";

export const gameService = {
    assignSquareValue(squares: string[], index: number) {
        const game = useGameStore();
        squares[index] = game.currentPlayer;
        game.moveCounter++;

        if (game.isFourthMove() && !game.otherRulesEnabled) {
            game.otherRulesEnabled = true;
        }
    },

    handlePositionChange(squares: string[], index: number, endMessage: { value: string }) {
        const game = useGameStore();
        const squareContent = squares[index];

        if (squareContent === game.currentPlayer && !game.isPreviousElementRemoved) {
            squares[index] = '';
            game.isPreviousElementRemoved = true;
        } else if (squareContent === '' && game.isPreviousElementRemoved && game.getCurrentGridBounds().includes(index)) {
            squares[index] = game.currentPlayer;
            game.isPreviousElementRemoved = false;
            game.isPositionChangeMode = false;
            this.changePlayerAndEndMessage(endMessage);
        }
    },

    handleGridMove(squares: string[], key: string, endMessage: { value: string }) {
        const game = useGameStore();
        const direction = Direction.fromKey(key);

        if (!direction) {
            console.log("Invalid key! Try again.");
            return;
        }

        if (this.move(squares, direction)) {
            game.isGridMoveMode = false;
            this.changePlayerAndEndMessage(endMessage);
        }
    },

    move(squares: string[], direction: number): boolean {
        const game = useGameStore();
        const currentGrid = this.getCurrentGridIndices();
        const newGrid = currentGrid.map(i => i + direction);
        const newCenter = this.getGridCenter(newGrid);

        if (this.isInBounds(newCenter)) {
            game.currentGridCenterSquareIndex = newCenter;
            return true;
        }
        console.log("Wrong direction! Try again.");
        return false;
    },

    checkTieOrWin(squares: string[], endMessage: { value: string }): boolean {
        const game = useGameStore();
        game.generateWinningCombinations();
        const winners: number[] = [];

        for (const [a, b, c] of game.currentWinningCombinations) {
            if (this.winningCombinationContainsPlayer(squares, a, b, c, PLAYERS[0]) ||
                this.winningCombinationContainsPlayer(squares, a, b, c, PLAYERS[1])) {
                winners.push(a, b, c);
            }
        }

        if (winners.length > 0) {
            game.winningSquares = winners;
            endMessage.value = `Game Over! ${squares[winners[0]]} wins!`;
            game.gameOver = true;
            return true;
        }

        if (squares.every(square => square !== '')) {
            endMessage.value = "It's a tie!";
            game.gameOver = true;
            return true;
        }

        return false;
    },

    winningCombinationContainsPlayer(squares: string[], a: number, b: number, c: number, player: string): boolean {
        return squares[a] === player && squares[b] === player && squares[c] === player;
    },

    changePlayerAndEndMessage(endMessage: { value: string }) {
        const game = useGameStore();
        game.changePlayer();
        endMessage.value = `${game.currentPlayer}'s turn!`;

        // if (game.currentGameMode === GAME_MODE.PVE && game.currentPlayer === PLAYERS[1] && !game.gameOver) {
        //     setTimeout(() => {
        //         aiService.makeAIMove();
        //     }, AI_DELAY);
        // }
    },

    getCurrentGridIndices(): number[] {
        const game = useGameStore();
        const i = game.currentGridCenterSquareIndex;
        return [
            i + Direction.UP_LEFT, i + Direction.UP, i + Direction.UP_RIGHT,
            i + Direction.LEFT, i, i + Direction.RIGHT,
            i + Direction.DOWN_LEFT, i + Direction.DOWN, i + Direction.DOWN_RIGHT
        ];
    },

    getGridCenter(grid: number[]): number {
        return grid[4];
    },

    isInBounds(index: number): boolean {
        return GRID_BOUNDS.includes(index);
    }
};
