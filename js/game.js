const UP_LEFT = -6;
const UP = -5;
const UP_RIGHT = -4;
const LEFT = -1;
const RIGHT = 1;
const DOWN_LEFT = 4;
const DOWN = 5;
const DOWN_RIGHT = 6;

const squares = document.querySelectorAll('.square');
const players = ['X', 'O'];
let currentPlayer = players[0];
let gameOver = false;
let gridMoveMode = false; // Tracks if 'G' was pressed
let gridBounds = [6, 7, 8, 11, 12, 13, 16, 17, 18];

export function startGame() {
    const board = document.getElementById('board');

    board.addEventListener('click', (event) => {
        const square = event.target;
        console.log(square);

        if (!gridMoveMode) {
            assignSquareValue(square);
            changePlayer();
            changeEndMessage();
        }
    });

    // Attach keypress listener to the document, not board
    document.addEventListener('keydown', (event) => {
        if (event.key === 'g') {
            gridMoveMode = true; // Enable movement mode
            console.log("Grid move mode enabled. Press a movement key.");
        } else if (gridMoveMode) {
            handleGridMove(event.key);
        }
    });
}

function assignSquareValue(square) {
    square.textContent = currentPlayer;
}

function changePlayer() {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
}

function changeEndMessage() {
    const endMessage = document.getElementById('end-message');
    endMessage.textContent = `${currentPlayer}'s turn!`;
}

function handleGridMove(key) {
    let direction = defineDirection(key);

    if (direction !== null) {
        let isValidMove = move(direction);
        if (isValidMove) {
            gridMoveMode = false; // Disable movement mode after a move
            console.log(`Moved in direction: ${direction}`);
        }
    }
}

function defineDirection(key) {
    let direction = null;

    if (key === 'r') direction = UP_LEFT;
    else if (key === 't') direction = UP;
    else if (key === 'y') direction = UP_RIGHT;
    else if (key === 'f') direction = LEFT;
    else if (key === 'h') direction = RIGHT;
    else if (key === 'v') direction = DOWN_LEFT;
    else if (key === 'b') direction = DOWN;
    else if (key === 'n') direction = DOWN_RIGHT;

    return direction;
}

function move(direction) {
    let currentGrid = gridPeek(direction);
    let gridCenterElementIndex = getGridCenter(currentGrid)

    if (isInBounds(gridCenterElementIndex)) {
        deleteOldGrid();
        createCurrentGrid(currentGrid);
        changePlayer();
        changeEndMessage();
        return true;
    }

    console.log("Wrong direction! Try again.");

    return false;
}

function createCurrentGrid(currentGrid) {
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
