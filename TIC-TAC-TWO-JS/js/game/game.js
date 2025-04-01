import Direction from "../utils/direction.js";
import {helpers} from "../utils/helpers.js";
import {AI_DELAY, GAME_MODE, GRID_BOUNDS, PLAYERS, } from "../utils/constants.js";
import {domService} from "../ui/domElements.js";
import {gameState} from "./gameState.js";
import {ai} from "./ai.js";

class GameController {
    startGame(gameMode) {
        gameState.currentGameMode = gameMode;

        domService.DOM_ELEMENTS.restartButton.addEventListener('click', (event) => this.restartGame(event));
        domService.DOM_ELEMENTS.board.addEventListener('click', (event) => this.handleGameLogic(event));
    }

    handleGameLogic(event) {
        console.log("---------------------------------------------------------");

        if (!gameState.gameOver) helpers.startTimer();

        const square = event.target;
        console.log(square);

        if (square.classList.contains('square') && gameState.isPositionChangeMode && !gameState.gameOver) {
            this.handlePositionChange(square);
            return;
        } else if (!square.classList.contains('square') || square.textContent !== '' || gameState.gameOver) {
            return;
        }

        if (!gameState.isGridMoveMode) {

            // Each player has only four pieces/moves
            if (gameState.currentPlayerPlacedPieces() < 4) {
                if(!gameState.isPositionChangeMode && this.clickedSquareWithinGrid(square)) {
                    this.assignSquareValue(square);
                    if (!this.checkTieOrWin()) {
                        this.changePlayer();
                        console.log("CHANGE");
                    }
                }
            }
        }
    }

    assignSquareValue(square) {
        square.textContent = gameState.currentPlayer;
        console.log(`currentPlayerPlacedPieces ${gameState.currentPlayer}: ${gameState.currentPlayerPlacedPieces()}`);
        gameState.moveCounter++; // count as move was made
        console.log(`moveCounter: ${gameState.moveCounter}`);
        if (gameState.isFourthMove() && !gameState.otherRulesEnabled) {
            this.enableOtherRules(); // Enable grid movement and position change after 4 moves. Executes only once.
            console.log("ENABLED");
        }
    }

    enableOtherRules() {
        gameState.otherRulesEnabled = true;
        // Attach keypress listener to the document, not board
        document.addEventListener('keydown', (event) => {
            if (event.key === 'g' && !gameState.gameOver && !gameState.isPositionChangeMode) {
                gameState.isGridMoveMode = true; // Enable movement mode
                domService.changeEndMessage(`Grid move mode for player: ${gameState.currentPlayer}!`);
                console.log("Grid move mode enabled. Press a movement key: r, t, y, f, h, v, b, n.");
            } else if (gameState.isGridMoveMode) {
                this.handleGridMove(event.key);
            } else if (event.key === 'c' && !gameState.gameOver && !gameState.isGridMoveMode) {
                gameState.isPositionChangeMode = true; // Enable changing mode
                domService.changeEndMessage(`Position mode for player: ${gameState.currentPlayer}!`);
                console.log("Position change mode enabled. Click on existing position -> click on a new position.");
            }

            this.checkTieOrWin();
        });
    }

    handleGridMove(key) {
        const direction = Direction.fromKey(key);
        if (!direction) {
            console.log("Invalid key! Try again.");
            return;
        }
        if (this.move(direction)) {
            gameState.isGridMoveMode = false; // Disable movement mode after a move
            console.log(`Moved in direction: ${direction}`);
        }
    }

    handlePositionChange(clickedSquare) {
        if (clickedSquare.textContent === gameState.currentPlayer  && !gameState.isPreviousElementRemoved) {
            clickedSquare.textContent = '';
            gameState.isPreviousElementRemoved = true;
        } else if (clickedSquare.textContent === '' && gameState.isPreviousElementRemoved && this.clickedSquareWithinGrid(clickedSquare)) {
            clickedSquare.textContent = gameState.currentPlayer;
            gameState.isPreviousElementRemoved = false;
            gameState.isPositionChangeMode = false;
            if (!this.checkTieOrWin()) {
                this.changePlayer();
            }
        }
    }

    move(direction) {
        let currentGrid = domService.gridPeek(direction);
        let gridCenterSquareIndex = this.getGridCenter(currentGrid)
        if (this.isInBounds(gridCenterSquareIndex)) {
            domService.deleteOldGrid();
            domService.createNewGridFrom(currentGrid);
            gameState.currentGridCenterSquareIndex = gridCenterSquareIndex;
            console.log(`Grid center: ${gameState.currentGridCenterSquareIndex}`);
            this.changePlayer();
            domService.changeEndMessage(`${gameState.currentPlayer}'s turn!`);
            return true;
        }
        console.log("Wrong direction! Try again.");
        return false;
    }

    checkTieOrWin() {

        gameState.generateWinningCombinations();

        gameState.currentWinningCombinations.forEach(([a, b, c]) => {
            const squares = document.querySelectorAll('.square');
            if (this.winningCombinationContainsPlayer(squares, a, b, c, 0)
                || this.winningCombinationContainsPlayer(squares, a, b, c, 1)) {
                squares[a].classList.add('winner');
                squares[b].classList.add('winner');
                squares[c].classList.add('winner');
            }
        });

        let winningCombinationsFound = Math.round((document.querySelectorAll('.winner').length) / 3);

        if (winningCombinationsFound >= 1) {
            let message = "It's a tie!";
            if (winningCombinationsFound === 1) {
                message = `Game Over! ${document.querySelector('.winner').textContent} wins!`;
            }

            domService.changeEndMessage(message);
            gameState.gameOver = true;
            helpers.stopTimer();
            return true;
        }

        return false;
    }

    winningCombinationContainsPlayer(squares, a, b, c, playerIndex) {
        return squares[a].textContent === PLAYERS[playerIndex] && squares[b].textContent === PLAYERS[playerIndex] && squares[c].textContent === PLAYERS[playerIndex];
    }

    clickedSquareWithinGrid(square) {
        return gameState.getCurrentGridBounds().includes(Number(square.dataset.index));
    }

    changePlayer() {
        this.changePlayerAndEndMessage();
        if (gameState.currentGameMode === GAME_MODE.PVE && gameState.currentPlayer === PLAYERS[1] && !gameState.gameOver) {
            setTimeout(() => ai.makeAIMove(), AI_DELAY); // AI moves automatically
        }
    }

    changePlayerAndEndMessage() {
        gameState.changePlayer();
        domService.changeEndMessage(`${gameState.currentPlayer}'s turn!`);
    }

    getGridCenter(grid) {
        return grid[4];
    }

    isInBounds(gridCenter) {
        return GRID_BOUNDS.includes(gridCenter);
    }

    restartGame() {
        location.reload();
    }
}

export const gameController = new GameController();
