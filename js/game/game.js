import Direction from "../utils/direction.js";
import {startTimer, stopTimer} from "../utils/helpers.js";
import {AI_DELAY, FOUR_MOVES, GAME_MODE, GRID_BOUNDS, MAX_MOVES, PLAYERS, } from "../utils/constants.js";
import {DOM_ELEMENTS} from "../ui/domElements.js";

let currentPlayer = PLAYERS[0];
let gameOver = false;
let isGridMoveMode = false; // Tracks if 'g' was pressed
let isPositionChangeMode = false; // Tracks if 'c' was pressed
let moveCounter = 0;
let currentGridCenterSquareIndex = GRID_BOUNDS[4];
let currentWinningCombinations = [];
let isPreviousElementRemoved = false;
let currentGameMode;

export function startGame(gameMode) {
    currentGameMode = gameMode;

    DOM_ELEMENTS.restartButton.addEventListener('click', restartGame);
    DOM_ELEMENTS.board.addEventListener('click', (event) => {
        if (!gameOver) startTimer();

        const square = event.target;
        console.log(square);

        if ((square.classList.contains('square') && isPositionChangeMode && !gameOver)) {
            handlePositionChange(square);
            return;
        } else if (!square.classList.contains('square') || square.textContent !== '' || gameOver) {
            return;
        }

        if (!isGridMoveMode) {

            //Originally was without currentPlayerMadeMoves()
            if (hasMadeFirstFourMoves() && currentPlayerMadeMoves() < FOUR_MOVES) {
                assignSquareValue(square);
                moveCounter++;
            } else if (!hasMadeFirstFourMoves()) {
                assignSquareValueWithinGrid(square);
                if (isFourthMove()) {
                    changePlayer();
                    enableOtherRules(); // Enable grid movement after 4 moves. Executes only once.
                    console.log("ENABLED");
                }
            }

            console.log(`moveCounter: ${moveCounter}`);

            //Originally was without playerHasDoneMaxMoves()
            if (!checkTieOrWin() && !isPositionChangeMode && hasMadeFirstFourMoves() && moveCounter < MAX_MOVES) {
                console.log("CHANGE");
                changePlayer();
            } else if (moveCounter === MAX_MOVES) {  //last change before all possible clicks are made
                changePlayer();
                moveCounter++; // added just to fix the last possible click and disable changing player after click
            }
        }
    });
}

function currentPlayerMadeMoves() {
    return Array.from(document.querySelectorAll('.square'))
        .filter(square => square.textContent === `${currentPlayer}`).length
}

function makeAIMove() {
    if (gameOver) return; // Don't move if the game is over

    moveCounter++;
    if (isFourthMove()) { // Waits for click. Player clicks on 3rd move -> during tha same click AI handles 4th move.
        enableOtherRules();
    }

    if (currentPlayerMadeMoves() !== FOUR_MOVES) {
        let selector = moveCounter > FOUR_MOVES ? '.square' : '.grid';
        const availableSquares = Array.from(document.querySelectorAll(selector))
            .filter(square => square.textContent === ''); // Find empty squares

        if (availableSquares.length === 0) return; // No available moves

        const aiMove = availableSquares[Math.floor(Math.random() * availableSquares.length)]; // Pick random square
        assignSquareValue(aiMove);

        checkTieOrWin();

        if (!gameOver) {
            changePlayer(); // Switch turn back to the player
        }
    }
}

function hasMadeFirstFourMoves() {
    return moveCounter >= FOUR_MOVES;
}
function isFourthMove() {
    return moveCounter === FOUR_MOVES;
}

function enableOtherRules() {
    // Attach keypress listener to the document, not board
    document.addEventListener('keydown', (event) => {
        if (event.key === 'g' && !gameOver && !isPositionChangeMode) {
            isGridMoveMode = true; // Enable movement mode
            changeEndMessage(`Grid move mode for player: ${currentPlayer}!`);
            console.log("Grid move mode enabled. Press a movement key.");
        } else if (isGridMoveMode) {
            handleGridMove(event.key);
        } else if (event.key === 'c' && !gameOver && !isGridMoveMode) {
            isPositionChangeMode = true; // Enable changing mode
            changeEndMessage(`Position mode for player: ${currentPlayer}!`);
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
        isGridMoveMode = false; // Disable movement mode after a move
        console.log(`Moved in direction: ${direction}`);
    }
}

function handlePositionChange(clickedSquare) {
    if (clickedSquare.textContent === currentPlayer  && !isPreviousElementRemoved) {
        clickedSquare.textContent = '';
        isPreviousElementRemoved = true;
    } else if (clickedSquare.textContent === '' && isPreviousElementRemoved) {
        clickedSquare.textContent = currentPlayer;
        isPreviousElementRemoved = false;
        isPositionChangeMode = false;
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
        currentGridCenterSquareIndex = gridCenterSquareIndex;
        console.log(`Grid center: ${currentGridCenterSquareIndex}`);
        changePlayer();
        changeEndMessage(`${currentPlayer}'s turn!`);
        return true;
    }
    console.log("Wrong direction! Try again.");
    return false;
}

function generateWinningCombinations() {
    currentWinningCombinations = [
        [currentGridCenterSquareIndex + Direction.UP_LEFT, currentGridCenterSquareIndex + Direction.UP, currentGridCenterSquareIndex + Direction.UP_RIGHT],
        [currentGridCenterSquareIndex + Direction.LEFT, currentGridCenterSquareIndex, currentGridCenterSquareIndex + Direction.RIGHT],
        [currentGridCenterSquareIndex + Direction.DOWN_LEFT, currentGridCenterSquareIndex + Direction.DOWN, currentGridCenterSquareIndex + Direction.DOWN_RIGHT],
        [currentGridCenterSquareIndex + Direction.UP_LEFT, currentGridCenterSquareIndex + Direction.LEFT, currentGridCenterSquareIndex + Direction.DOWN_LEFT],
        [currentGridCenterSquareIndex + Direction.UP, currentGridCenterSquareIndex, currentGridCenterSquareIndex + Direction.DOWN],
        [currentGridCenterSquareIndex + Direction.UP_RIGHT, currentGridCenterSquareIndex + Direction.RIGHT, currentGridCenterSquareIndex + Direction.DOWN_RIGHT],
        [currentGridCenterSquareIndex + Direction.UP_LEFT, currentGridCenterSquareIndex, currentGridCenterSquareIndex + Direction.DOWN_RIGHT],
        [currentGridCenterSquareIndex + Direction.UP_RIGHT, currentGridCenterSquareIndex, currentGridCenterSquareIndex + Direction.DOWN_LEFT]
    ];
}

function checkTieOrWin() {
    if (isBoardFull()) {
        changeEndMessage(`It's a tie!`);
        gameOver = true;
        stopTimer();
        return true;
    }

    generateWinningCombinations();

    currentWinningCombinations.forEach(([a, b, c]) => {
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
        gameOver = true;
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
    square.textContent = currentPlayer;
}

function assignSquareValueWithinGrid(square) {
    if (GRID_BOUNDS.includes(Number(square.dataset.index))) {
        assignSquareValue(square);
        moveCounter++;
        changePlayer();
    }
}

function changePlayer() {
    currentPlayer = currentPlayer === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0];
    changeEndMessage(`${currentPlayer}'s turn!`);
    if (currentGameMode === GAME_MODE.PVE && currentPlayer === PLAYERS[1] && !gameOver) {
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