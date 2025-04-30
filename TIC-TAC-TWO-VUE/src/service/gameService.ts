import { Ref } from 'vue';
import { helpers } from '@/utils/helpers';
import { PLAYERS, AI_DELAY, GAME_MODE, GRID_BOUNDS } from '@/utils/constants';
import { aiService } from './aiService';
import Direction from '@/utils/direction';
import { useGameStore } from '@/store/gameStore';

class GameController {
    startGame(gameMode: string): void {
        const gameState = useGameStore();
        gameState.currentGameMode = gameMode;
    }

    handleClick(index: number, squares: Ref<string[]>, winningSquares: Ref<number[]>, endMessage: Ref<string>): void {

        const gameState = useGameStore();
        if (gameState.gameOver) return;

        // helpers.startTimer();

        if (gameState.isPositionChangeMode) {
            this.handlePositionChange(index, squares, endMessage, winningSquares);
            return;
        }

        if (squares.value[index] !== '') return;

        if (!gameState.isGridMoveMode) {
            if (gameState.currentPlayerPlacedPieces(squares.value) < 4) {
                if (!gameState.isPositionChangeMode && this.clickedSquareWithinGrid(index)) {
                    this.assignSquareValue(index, squares);
                    if (!this.checkTieOrWin(squares, endMessage, winningSquares)) {
                        this.changePlayer(endMessage, squares, winningSquares);
                    }
                }
            }
        }
    }

    enableOtherRules(
        event: KeyboardEvent,
        squares: Ref<string[]>,
        endMessage: Ref<string>,
        winningSquares: Ref<number[]>
    ): void {
        const gameStore = useGameStore();

        if (gameStore.gameOver || !gameStore.otherRulesEnabled) return;

        if (event.key === 'g' && !gameStore.isPositionChangeMode) {
            gameStore.isGridMoveMode = true;
            endMessage.value = `Grid move mode for player: ${gameStore.currentPlayer}!`;
        } else if (gameStore.isGridMoveMode) {
            this.handleGridMove(event.key, squares, endMessage, winningSquares);
        } else if (event.key === 'c' && !gameStore.isGridMoveMode) {
            gameStore.isPositionChangeMode = true;
            endMessage.value = `Position mode for player: ${gameStore.currentPlayer}!`;
        }

        if (!gameStore.isPositionChangeMode) {
            this.checkTieOrWin(squares, endMessage, winningSquares);
        }
    }


    assignSquareValue(index: number, squares: Ref<string[]>): void {
        const gameState = useGameStore();
        squares.value[index] = gameState.currentPlayer;
        gameState.moveCounter++;

        if (gameState.isFourthMove() && !gameState.otherRulesEnabled) {
            gameState.otherRulesEnabled = true;
        }
    }

    handlePositionChange(index: number, squares: Ref<string[]>, endMessage: Ref<string>, winningSquares: Ref<number[]>): void {
        const gameState = useGameStore();
        if (squares.value[index] === gameState.currentPlayer && !gameState.isPreviousElementRemoved) {
            squares.value[index] = '';
            gameState.isPreviousElementRemoved = true;
        } else if (squares.value[index] === '' && gameState.isPreviousElementRemoved && this.clickedSquareWithinGrid(index)) {
            squares.value[index] = gameState.currentPlayer;
            gameState.isPreviousElementRemoved = false;
            gameState.isPositionChangeMode = false;

            if (!this.checkTieOrWin(squares, endMessage, winningSquares)) {
                this.changePlayer(endMessage, squares, winningSquares);
            }
        }
    }

    handleGridMove(
        key: string,
        squares: Ref<string[]>,
        endMessage: Ref<string>,
        winningSquares: Ref<number[]>): void {
        const gameState = useGameStore();
        const direction = Direction.fromKey(key);
        if (!direction) return;

        if (this.move(direction, squares, endMessage, winningSquares)) {
            gameState.isGridMoveMode = false;
        }
    }

    move(
        direction: number,
        squares: Ref<string[]>,
        endMessage: Ref<string>,
        winningSquares: Ref<number[]>): boolean {
        const gameState = useGameStore();
        const currentGrid = this.getCurrentGridBounds();
        const newGrid = currentGrid.map(i => i + direction);
        const newCenter = this.getGridCenter(newGrid);

        if (this.isInBounds(newCenter)) {
            gameState.currentGridCenterSquareIndex = newCenter;
            this.changePlayer(endMessage, squares, winningSquares);
            return true;
        }

        return false;
    }

    checkTieOrWin(squares: Ref<string[]>, endMessage: Ref<string>, winningSquares: Ref<number[]>): boolean {
        const gameState = useGameStore();
        gameState.generateWinningCombinations();
        winningSquares.value = [];

        for (const [a, b, c] of gameState.currentWinningCombinations) {
            if (this.winningCombinationContainsPlayer(squares.value, a, b, c, 0)
                || this.winningCombinationContainsPlayer(squares.value, a, b, c, 1)) {
                winningSquares.value.push(a, b, c);
            }
        }

        if (winningSquares.value.length >= 3) {
            let message = "It's a tie!";
            if (winningSquares.value.length === 3) {
                message = `Game Over! ${squares.value[winningSquares.value[0]]} wins!`;
            }
            endMessage.value = message;
            gameState.gameOver = true;
            helpers.stopTimer();
            return true;
        }

        return false;
    }

    winningCombinationContainsPlayer(squares: string[], a: number, b: number, c: number, playerIndex: number): boolean {
        return squares[a] === PLAYERS[playerIndex]
            && squares[b] === PLAYERS[playerIndex]
            && squares[c] === PLAYERS[playerIndex];
    }

    clickedSquareWithinGrid(index: number): boolean {
        const gameState = useGameStore();
        return gameState.getCurrentGridBounds().includes(index);
    }

    changePlayer(endMessage: Ref<string>, squares: Ref<string[]>, winningSquares: Ref<number[]>): void {
        const gameState = useGameStore();
        gameState.changePlayer();
        endMessage.value = `${gameState.currentPlayer}'s turn!`;

        if (gameState.currentGameMode === GAME_MODE.PVE && gameState.currentPlayer === PLAYERS[1] && !gameState.gameOver) {
            setTimeout(() => aiService.makeAIMove(squares, endMessage, winningSquares), AI_DELAY);
        }
    }

    getCurrentGridBounds(): number[] {
        const gameState = useGameStore();
        return gameState.getCurrentGridBounds();
    }

    getGridCenter(grid: number[]): number {
        return grid[4];
    }

    isInBounds(index: number): boolean {
        return GRID_BOUNDS.includes(index);
    }

    restartGame(squares: Ref<string[]>, winningSquares: Ref<number[]>, endMessage: Ref<string>, resetTimer: () => void, router: any): void {
        const gameState = useGameStore();
        gameState.resetGame();
        squares.value = Array(25).fill('');
        winningSquares.value = [];
        endMessage.value = "X's turn";
        resetTimer();
        router.push('/');
    }
}

export const gameController = new GameController();
