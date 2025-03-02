import Direction from "./components/direction.js";
import {startTimer, stopTimer} from "./app.js";

const players = ['X', 'O'];
let currentPlayer = players[0];
let gameOver = false;
let isGridMoveMode = false; // Tracks if 'g' was pressed
let isPositionChangeMode = false; // Tracks if 'c' was pressed
let gridBounds = [6, 7, 8, 11, 12, 13, 16, 17, 18];
let moveCounter = 0;
let currentGridCenterSquareIndex = 12;
let currentWinningCombinations = [];
let isPreviousElementRemoved = false;
let clickCounter = 0;

export function startGame() {
    const board = document.getElementById('board');
    const restartButton = document.getElementById('restart-button');

    restartButton.addEventListener('click', restartGame);

    board.addEventListener('click', (event) => {
        console.log(`Click counter: ${++clickCounter}`);
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
            if (hasMadeFirstFourMoves()) {
                assignSquareValue(square);
                console.log("OOOOOOOOOOOO")
                moveCounter++;
            } else {
                assignSquareValueWithinGrid(square);
                if (moveCounter === 4) {
                    changePlayer();
                }
            }

            console.log(`moveCounter: ${moveCounter}`);
            // Enable grid movement after 4 moves. Executes only once.
            if (moveCounter === 4) {
                enableOtherRules();
            }

            if (!checkTieOrWin() && !isPositionChangeMode && hasMadeFirstFourMoves()) {
                console.log("Aaaaaaallllliiiisaaaaaaa");
                changePlayer();
            }
        }
    });
}

function hasMadeFirstFourMoves() {
    return moveCounter >= 4;
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
    return squares[a].textContent === players[playerIndex] && squares[b].textContent === players[playerIndex] && squares[c].textContent === players[playerIndex];
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
    if (gridBounds.includes(Number(square.dataset.index))) {
        assignSquareValue(square);
        moveCounter++;
        changePlayer();
    }
}

function changePlayer() {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
    changeEndMessage(`${currentPlayer}'s turn!`);
}

function changeEndMessage(newMessage) {
    const endMessage = document.getElementById('end-message');
    endMessage.textContent = newMessage;
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
    return gridBounds.includes(gridCenter);
}

function restartGame() { //TODO: Change to reload page
    location.reload();
}