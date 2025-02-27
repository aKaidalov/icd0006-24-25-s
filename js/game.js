import Direction from "./components/direction.js";

const players = ['X', 'O'];
let currentPlayer = players[0];
let gameOver = false;
let isGridMoveMode = false; // Tracks if 'G' was pressed
let gridBounds = [6, 7, 8, 11, 12, 13, 16, 17, 18];
let moveCounter = 0; //TODO: Reset the counter when finished or restart
let currentGridCenterSquareIndex = 12;
let currentWinningCombinations = [];

export function startGame() {
    const board = document.getElementById('board');
    const restartButton = document.getElementById('restart-button');

    restartButton.addEventListener('click', restartGame);

    board.addEventListener('click', (event) => {
        const square = event.target;
        console.log(square);

        if (!square.classList.contains('square') || square.textContent !== '' || gameOver) {
            return;
        }

        if (!isGridMoveMode) {
            assignSquareValue(square);
            moveCounter++;

            // Enable grid movement after 4 moves
            if (moveCounter === 4) { //TODO: make grid independent from click listener?
                enableOtherRules();
            }

            // Check winner immediately after click
            if (checkWin()) { //TODO: Reduce from duplicates
                changeEndMessage(`Game Over! ${currentPlayer} wins!`);
                gameOver = true;
                return;
            }

            changePlayer();
            changeEndMessage(`${currentPlayer}'s turn!`);
        }
    });
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

function checkWin() {
    generateWinningCombinations();
    return currentWinningCombinations.some(([a, b, c]) => {
        const squares = document.querySelectorAll('.square');
        if (squares[a].textContent === currentPlayer &&
            squares[b].textContent === currentPlayer &&
            squares[c].textContent === currentPlayer) {
            squares[a].classList.add('winner');
            squares[b].classList.add('winner');
            squares[c].classList.add('winner');
            return true;
        }
        return false;
    });
}

function enableOtherRules() {
    // Attach keypress listener to the document, not board
    document.addEventListener('keydown', (event) => {
        if (event.key === 'g' && !gameOver) {
            isGridMoveMode = true; // Enable movement mode
            console.log("Grid move mode enabled. Press a movement key.");
        } else if (isGridMoveMode) {
            handleGridMove(event.key);

            // Check winner immediately after grid move
            if (checkWin()) {
                changeEndMessage(`Game Over! ${currentPlayer} wins!`);
                gameOver = true;
            }
        }
    });
}

function assignSquareValue(square) {
    square.textContent = currentPlayer;
}

function changePlayer() {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
}

function changeEndMessage(newMessage) {
    const endMessage = document.getElementById('end-message');
    endMessage.textContent = newMessage;
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

function restartGame() {
    const squares = document.querySelectorAll('.square');
    changeEndMessage(`X's turn!`);
    currentPlayer = players[0];
    gameOver = false;
    isGridMoveMode = false; // Tracks if 'G' was pressed
    gridBounds = [6, 7, 8, 11, 12, 13, 16, 17, 18];
    moveCounter = 0;
    currentGridCenterSquareIndex = 12;
    currentWinningCombinations = [];

    squares.forEach(square => {
        square.textContent = '';
        square.classList.remove('winner');
    });

    deleteOldGrid();
    createNewGridFrom(gridBounds);
}
