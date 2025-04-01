import { gameState } from "./gameState.js";
import { gameController } from "./game.js";
import { domService } from "../ui/domElements.js";
import Direction from "../utils/direction.js";
import { GRID_BOUNDS, POSSIBLE_KEYS } from "../utils/constants.js";

class AI {
    makeAIMove(): void {
        if (gameState.gameOver) return;

        if (gameState.currentPlayerPlacedPieces() < 4) {
            this.#placeOneOfRemainingPieces();
        } else {
            this.#handleOtherRules();
        }

        console.log(`moveCounter after AI move: ${gameState.moveCounter}`);
    }

    #placeOneOfRemainingPieces(): void {
        const availableSquares = domService.findEmptySquaresWithinGrid();
        if (availableSquares.length === 0) {
            throw new Error("AI move failed: no empty grid squares available");
        }
        const aiMove = availableSquares[Math.floor(Math.random() * availableSquares.length)] as HTMLElement;
        gameController.assignSquareValue(aiMove);
        if (!gameController.checkTieOrWin()) {
            gameController.changePlayerAndEndMessage();
        }
    }

    #handleOtherRules(): void {
        const random = Math.random();
        if (random < 0.5) {
            gameState.isPositionChangeMode = true;
            this.#aiPositionChangeMove();
        } else {
            gameState.isGridMoveMode = true;
            this.#aiGridMove();
        }
    }

    #aiPositionChangeMove(): void {
        const squares = domService.getAllSquares();
        const currentGridBounds = gameState.getCurrentGridBounds();
        const aiPieces = this.#findAllAiPieces(squares, currentGridBounds);
        const emptySquaresWithinGrid = this.#findEmptySquaresWithinGridForAi(squares, currentGridBounds);

        if (aiPieces.length === 0 || emptySquaresWithinGrid.length === 0) {
            gameState.isPositionChangeMode = false;
            gameController.changePlayerAndEndMessage();
            return;
        }

        const fromIndex = aiPieces[Math.floor(Math.random() * aiPieces.length)];
        const toIndex = emptySquaresWithinGrid[Math.floor(Math.random() * emptySquaresWithinGrid.length)];
        (squares[fromIndex] as HTMLElement).textContent = '';
        (squares[toIndex] as HTMLElement).textContent = gameState.currentPlayer;
        gameState.isPreviousElementRemoved = false;
        gameState.isPositionChangeMode = false;

        if (!gameController.checkTieOrWin()) {
            gameController.changePlayerAndEndMessage();
        }
    }

    #aiGridMove(): void {
        let moved = false;

        while (!moved) {
            const direction = this.#getRandomDirection();
            if (!direction) continue;
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
    }

    #getRandomDirection(): number | null {
        const randomKey = POSSIBLE_KEYS[Math.floor(Math.random() * POSSIBLE_KEYS.length)];
        return Direction.fromKey(randomKey);
    }

    #findAllAiPieces(squares: NodeListOf<Element>, currentGridBounds: number[]): number[] {
        const aiPieces: number[] = [];
        currentGridBounds.forEach(i => {
            if ((squares[i] as HTMLElement).textContent === gameState.currentPlayer) {
                aiPieces.push(i);
            }
        });
        return aiPieces;
    }

    #findEmptySquaresWithinGridForAi(squares: NodeListOf<Element>, currentGridBounds: number[]): number[] {
        return currentGridBounds.filter(i => (squares[i] as HTMLElement).textContent === '');
    }
}

export const ai = new AI();
