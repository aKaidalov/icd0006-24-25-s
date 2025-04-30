import { useGameStore } from '@/store/gameStore';
import { gameController } from './gameService';
import { GRID_BOUNDS, POSSIBLE_KEYS } from '../utils/constants';
import Direction from '@/utils/direction';
import type { Ref } from 'vue';

export const aiService = {
    makeAIMove(
        squares: Ref<string[]>,
        endMessage: Ref<string>,
        winningSquares: Ref<number[]>
    ): void {
        const gameStore = useGameStore();
        if (gameStore.gameOver) return;

        if (aiService.currentPlayerPlacedPieces(squares.value) < 4) {
            aiService.placeOneOfRemainingPieces(squares, endMessage, winningSquares);
        } else {
            aiService.handleOtherRules(squares, endMessage, winningSquares);
        }
    },

    currentPlayerPlacedPieces(squares: string[]): number {
        const gameStore = useGameStore();
        return squares.filter(square => square === gameStore.currentPlayer).length;
    },

    placeOneOfRemainingPieces(
        squares: Ref<string[]>,
        endMessage: Ref<string>,
        winningSquares: Ref<number[]>
    ): void {
        const gameStore = useGameStore();
        const availableSquares = gameStore.getCurrentGridBounds().filter(index => squares.value[index] === '');

        if (availableSquares.length === 0) return;

        const randomIndex = availableSquares[Math.floor(Math.random() * availableSquares.length)];

        squares.value[randomIndex] = gameStore.currentPlayer;
        gameStore.moveCounter++;

        if (gameStore.isFourthMove() && !gameStore.otherRulesEnabled) {
            gameStore.otherRulesEnabled = true;
        }

        if (!gameController.checkTieOrWin(squares, endMessage, winningSquares)) {
            gameController.changePlayer(endMessage, squares, winningSquares);
        }
    },

    handleOtherRules(
        squares: Ref<string[]>,
        endMessage: Ref<string>,
        winningSquares: Ref<number[]>
    ): void {
        const gameStore = useGameStore();
        const random = Math.random();

        if (random < 0.5) {
            gameStore.isPositionChangeMode = true;
            aiService.aiPositionChangeMove(squares, endMessage, winningSquares);
        } else {
            gameStore.isGridMoveMode = true;
            aiService.aiGridMove(squares, endMessage, winningSquares);
        }
    },

    aiPositionChangeMove(
        squares: Ref<string[]>,
        endMessage: Ref<string>,
        winningSquares: Ref<number[]>
    ): void {
        const gameStore = useGameStore();
        const aiPieces = aiService.findAllAiPieces(squares.value);
        const emptySquares = aiService.findEmptySquaresWithinGrid(squares.value);

        if (aiPieces.length === 0 || emptySquares.length === 0) {
            gameStore.isPositionChangeMode = false;
            gameController.changePlayer(endMessage, squares, winningSquares);
            return;
        }

        const fromIndex = aiPieces[Math.floor(Math.random() * aiPieces.length)];
        const toIndex = emptySquares[Math.floor(Math.random() * emptySquares.length)];

        squares.value[fromIndex] = '';
        squares.value[toIndex] = gameStore.currentPlayer;

        gameStore.isPreviousElementRemoved = false;
        gameStore.isPositionChangeMode = false;

        if (!gameController.checkTieOrWin(squares, endMessage, winningSquares)) {
            gameController.changePlayer(endMessage, squares, winningSquares);
        }
    },

    aiGridMove(
        squares: Ref<string[]>,
        endMessage: Ref<string>,
        winningSquares: Ref<number[]>
    ): void {
        const gameStore = useGameStore();
        let moved = false;

        while (!moved) {
            const direction = aiService.getRandomDirection();
            if (!direction) continue;

            const currentGrid = gameStore.getCurrentGridBounds();
            const newGrid = currentGrid.map(i => i + direction);
            const newCenter = newGrid[4];

            if (GRID_BOUNDS.includes(newCenter)) {
                gameStore.currentGridCenterSquareIndex = newCenter;
                moved = true;
            }
        }

        gameStore.isGridMoveMode = false;

        if (!gameController.checkTieOrWin(squares, endMessage, winningSquares)) {
            gameController.changePlayer(endMessage, squares, winningSquares);
        }
    },

    getRandomDirection(): number | null {
        const randomKey = POSSIBLE_KEYS[Math.floor(Math.random() * POSSIBLE_KEYS.length)];
        return Direction.fromKey(randomKey);
    },

    findAllAiPieces(squares: string[]): number[] {
        const gameStore = useGameStore();
        return gameStore.getCurrentGridBounds().filter(index => squares[index] === gameStore.currentPlayer);
    },

    findEmptySquaresWithinGrid(squares: string[]): number[] {
        const gameStore = useGameStore();
        return gameStore.getCurrentGridBounds().filter(index => squares[index] === '');
    }
};
