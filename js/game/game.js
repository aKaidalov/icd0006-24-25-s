import Direction from "../utils/direction.js";
import {startTimer, stopTimer} from "../utils/helpers.js";
import {AI_DELAY, FOUR_MOVES, GAME_MODE, GRID_BOUNDS, MAX_MOVES, PLAYERS, } from "../utils/constants.js";
import {DOM_ELEMENTS} from "../ui/domElements.js";
import {gameState} from "./gameState.js";



export function startGame(gameMode) {
    gameState.currentGameMode = gameMode;

    DOM_ELEMENTS.restartButton.addEventListener('click', restartGame);
    DOM_ELEMENTS.board.addEventListener('click', (event) => {
        if (!gameState.gameOver) startTimer();

        const square = event.target;
        console.log(square);

        if ((square.classList.contains('square') && gameState.isPositionChangeMode && !gameState.gameOver)) {
            handlePositionChange(square);
            return;
        } else if (!square.classList.contains('square') || square.textContent !== '' || gameState.gameOver) {
            return;
        }

        if (!gameState.isGridMoveMode) {

            //Originally was without currentPlayerMadeMoves()
            if (gameState.hasMadeFirstFourMoves() && gameState.currentPlayerMadeMoves() < FOUR_MOVES) {
                assignSquareValue(square);
                gameState.moveCounter++;
            } else if (!gameState.hasMadeFirstFourMoves()) {
                assignSquareValueWithinGrid(square);
                if (gameState.isFourthMove()) {
                    changePlayer();
                    enableOtherRules(); // Enable grid movement after 4 moves. Executes only once.
                    console.log("ENABLED");
                }
            }

            console.log(`moveCounter: ${gameState.moveCounter}`);

            //Originally was without playerHasDoneMaxMoves()
            if (!checkTieOrWin() && !gameState.isPositionChangeMode && gameState.hasMadeFirstFourMoves() && gameState.moveCounter < MAX_MOVES) {
                console.log("CHANGE");
                changePlayer();
            } else if (gameState.moveCounter === MAX_MOVES) {  //last change before all possible clicks are made
                changePlayer();
                gameState.moveCounter++; // added just to fix the last possible click and disable changing player after click
            }
        }
    });
}

function makeAIMove() {
    if (gameState.gameOver) return; // Don't move if the game is over

    gameState.moveCounter++;
    if (gameState.isFourthMove()) { // Waits for click. Player clicks on 3rd move -> during tha same click AI handles 4th move.
        enableOtherRules();
    }

    if (gameState.currentPlayerMadeMoves() !== FOUR_MOVES) {
        let selector = gameState.moveCounter > FOUR_MOVES ? '.square' : '.grid';
        const availableSquares = Array.from(document.querySelectorAll(selector))
            .filter(square => square.textContent === ''); // Find empty squares

        if (availableSquares.length === 0) return; // No available moves

        const aiMove = availableSquares[Math.floor(Math.random() * availableSquares.length)]; // Pick random square
        assignSquareValue(aiMove);

        checkTieOrWin();

        if (!gameState.gameOver) {
            changePlayer(); // Switch turn back to the player
        }
    }
}

function enableOtherRules() {
    // Attach keypress listener to the document, not board
    document.addEventListener('keydown', (event) => {
        if (event.key === 'g' && !gameState.gameOver && !gameState.isPositionChangeMode) {
            gameState.isGridMoveMode = true; // Enable movement mode
            changeEndMessage(`Grid move mode for player: ${gameState.currentPlayer}!`);
            console.log("Grid move mode enabled. Press a movement key.");
        } else if (gameState.isGridMoveMode) {
            handleGridMove(event.key);
        } else if (event.key === 'c' && !gameState.gameOver && !gameState.isGridMoveMode) {
            gameState.isPositionChangeMode = true; // Enable changing mode
            changeEndMessage(`Position mode for player: ${gameState.currentPlayer}!`);
            console.log("Position change mode enabled. Click on existing position.");
        }

        checkTieOrWin();
    });
}

function handleGridMove(key) {
    const direction = Direction.fromKey(key);
    if (!direction) {
        console.log("Invalid key! Try again.");
        return;
    }
    if (move(direction)) {
        gameState.isGridMoveMode = false; // Disable movement mode after a move
        console.log(`Moved in direction: ${direction}`);
    }
}

function handlePositionChange(clickedSquare) {
    if (clickedSquare.textContent === gameState.currentPlayer  && !gameState.isPreviousElementRemoved) {
        clickedSquare.textContent = '';
        gameState.isPreviousElementRemoved = true;
    } else if (clickedSquare.textContent === '' && gameState.isPreviousElementRemoved) {
        clickedSquare.textContent = gameState.currentPlayer;
        gameState.isPreviousElementRemoved = false;
        gameState.isPositionChangeMode = false;
        if (!checkTieOrWin()) {
            changePlayer();
        }
    }
}

function move(direction) {
    let currentGrid = gridPeek(direction);
    let gridCenterSquareIndex = getGridCenter(currentGrid)
    if (isInBounds(gridCenterSquareIndex)) {
        deleteOldGrid();
        createNewGridFrom(currentGrid);
        gameState.currentGridCenterSquareIndex = gridCenterSquareIndex;
        console.log(`Grid center: ${gameState.currentGridCenterSquareIndex}`);
        changePlayer();
        changeEndMessage(`${gameState.currentPlayer}'s turn!`);
        return true;
    }
    console.log("Wrong direction! Try again.");
    return false;
}

function checkTieOrWin() {
    if (isBoardFull()) {
        changeEndMessage(`It's a tie!`);
        gameState.gameOver = true;
        stopTimer();
        return true;
    }

    gameState.generateWinningCombinations();

    gameState.currentWinningCombinations.forEach(([a, b, c]) => {
        const squares = document.querySelectorAll('.square');
        if (positionContainsPlayer(squares, a, b, c, 0)
            || positionContainsPlayer(squares, a, b, c, 1)) {
            squares[a].classList.add('winner');
            squares[b].classList.add('winner');
            squares[c].classList.add('winner');
        }
    });

    let winningCombinationsFound = Math.round((document.querySelectorAll('.winner').length) / 3);

    if (winningCombinationsFound >= 1) {
        let message = "It's a tie!";
        if (winningCombinationsFound === 1 || (winningCombinationsFound === 2 && allElementsHaveSameWinner())) {
            message = `Game Over! ${document.querySelector('.winner').textContent} wins!`;
        }

        changeEndMessage(message);
        gameState.gameOver = true;
        stopTimer();
        return true;
    }

    return false;
}

function allElementsHaveSameWinner() {
    const winnerElements = document.querySelectorAll('.winner');
    if (winnerElements.length === 0) return false;
    const player = winnerElements[0].textContent;

    return Array.from(winnerElements).every(el => el.textContent === player);
}

function positionContainsPlayer(squares, a, b, c, playerIndex) {
    return squares[a].textContent === PLAYERS[playerIndex] && squares[b].textContent === PLAYERS[playerIndex] && squares[c].textContent === PLAYERS[playerIndex];
}

function isBoardFull() {
    const squares = document.querySelectorAll('.square');
    const isFull = [...squares].every(square => square.textContent.trim() !== '');

    if (isFull) squares.forEach(square => square.classList.add('winner'));

    return isFull;
}

function assignSquareValue(square) {
    square.textContent = gameState.currentPlayer;
}

function assignSquareValueWithinGrid(square) {
    if (GRID_BOUNDS.includes(Number(square.dataset.index))) {
        assignSquareValue(square);
        gameState.moveCounter++;
        changePlayer();
    }
}

function changePlayer() {
    gameState.currentPlayer = gameState.currentPlayer === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0];
    changeEndMessage(`${gameState.currentPlayer}'s turn!`);
    if (gameState.currentGameMode === GAME_MODE.PVE && gameState.currentPlayer === PLAYERS[1] && !gameState.gameOver) {
        setTimeout(makeAIMove, AI_DELAY); // AI moves automatically
    }
}

function changeEndMessage(newMessage) {
    DOM_ELEMENTS.endMessage.textContent = newMessage;
}

function createNewGridFrom(currentGrid) {
    document.querySelectorAll('.square').forEach((square) => {
        if (currentGrid.includes(Number(square.dataset.index))) {
            square.classList.add('grid');
        }
    });
}

function deleteOldGrid() {
    document.querySelectorAll('.grid').forEach((square) => {
        square.classList.remove('grid');
    });
}

function gridPeek(direction) {
    let gridAfterMove = [];
    document.querySelectorAll('.grid').forEach((square) => {
        gridAfterMove.push(Number(square.dataset.index) + direction);
    });
    return gridAfterMove;
}

function getGridCenter(grid) {
    return grid[4];
}

function isInBounds(gridCenter) {
    return GRID_BOUNDS.includes(gridCenter);
}

function restartGame() {
    location.reload();
}