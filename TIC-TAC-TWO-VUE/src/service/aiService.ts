import { useGameStore } from '@/store/gameStore';
import { gameService } from './gameService';
import { PLAYERS, GRID_BOUNDS, POSSIBLE_KEYS } from '../utils/constants';
import Direction from '@/utils/direction';

export const aiService = {
    makeAIMove(squares: string[], endMessage: { value: string }): void {
        const game = useGameStore();
        if (game.gameOver) return;

        if (aiService.currentPlayerPlacedPieces(squares) < 4) {
            aiService.placeOneOfRemainingPieces(squares, endMessage);
        } else {
            aiService.handleOtherRules(squares, endMessage);
        }
    },

    currentPlayerPlacedPieces(squares: string[]): number {
        const game = useGameStore();
        return squares.filter(square => square === game.currentPlayer).length;
    },

    placeOneOfRemainingPieces(squares: string[], endMessage: { value: string }) {
        const game = useGameStore();
        const availableSquares = game.getCurrentGridBounds().filter(index => squares[index] === '');

        if (availableSquares.length === 0) {
            throw new Error("AI move failed: no empty grid squares available");
        }

        const randomIndex = availableSquares[Math.floor(Math.random() * availableSquares.length)];
        gameService.assignSquareValue(squares, randomIndex);

        if (!gameService.checkTieOrWin(squares, endMessage)) {
            gameService.changePlayerAndEndMessage(endMessage);
        }
    },

    handleOtherRules(squares: string[], endMessage: { value: string }) {
        const game = useGameStore();
        const random = Math.random();

        if (random < 0.5) {
            game.isPositionChangeMode = true;
            aiService.aiPositionChangeMove(squares, endMessage);
        } else {
            game.isGridMoveMode = true;
            aiService.aiGridMove(squares, endMessage);
        }
    },

    aiPositionChangeMove(squares: string[], endMessage: { value: string }) {
        const game = useGameStore();
        const aiPieces = aiService.findAllAiPieces(squares);
        const emptySquaresWithinGrid = aiService.findEmptySquaresWithinGrid(squares);

        if (aiPieces.length === 0 || emptySquaresWithinGrid.length === 0) {
            game.isPositionChangeMode = false;
            gameService.changePlayerAndEndMessage(endMessage);
            return;
        }

        const fromIndex = aiPieces[Math.floor(Math.random() * aiPieces.length)];
        const toIndex = emptySquaresWithinGrid[Math.floor(Math.random() * emptySquaresWithinGrid.length)];

        squares[fromIndex] = '';
        squares[toIndex] = game.currentPlayer;

        game.isPreviousElementRemoved = false;
        game.isPositionChangeMode = false;

        if (!gameService.checkTieOrWin(squares, endMessage)) {
            gameService.changePlayerAndEndMessage(endMessage);
        }
    },

    aiGridMove(squares: string[], endMessage: { value: string }) {
        const game = useGameStore();
        let moved = false;

        while (!moved) {
            const direction = aiService.getRandomDirection();
            if (!direction) continue;

            const currentGrid = gameService.getCurrentGridIndices();
            const newGrid = currentGrid.map(i => i + direction);
            const newCenter = gameService.getGridCenter(newGrid);

            if (GRID_BOUNDS.includes(newCenter)) {
                game.currentGridCenterSquareIndex = newCenter;
                moved = true;
            }
        }

        game.isGridMoveMode = false;

        if (!gameService.checkTieOrWin(squares, endMessage)) {
            gameService.changePlayerAndEndMessage(endMessage);
        }
    },

    getRandomDirection(): number | null {
        const randomKey = POSSIBLE_KEYS[Math.floor(Math.random() * POSSIBLE_KEYS.length)];
        return Direction.fromKey(randomKey);
    },

    findAllAiPieces(squares: string[]): number[] {
        const game = useGameStore();
        return game.getCurrentGridBounds().filter(index => squares[index] === game.currentPlayer);
    },

    findEmptySquaresWithinGrid(squares: string[]): number[] {
        const game = useGameStore();
        return game.getCurrentGridBounds().filter(index => squares[index] === '');
    },
};
