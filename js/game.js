import Direction from "./components/direction.js";

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

    if (key === 'r') direction = Direction.UP_LEFT;
    else if (key === 't') direction = Direction.UP;
    else if (key === 'y') direction = Direction.UP_RIGHT;
    else if (key === 'f') direction = Direction.LEFT;
    else if (key === 'h') direction = Direction.RIGHT;
    else if (key === 'v') direction = Direction.DOWN_LEFT;
    else if (key === 'b') direction = Direction.DOWN;
    else if (key === 'n') direction = Direction.DOWN_RIGHT;

    return direction;
}

function move(direction) {
    let currentGrid = gridPeek(direction);
    let gridCenterSquareIndex = getGridCenter(currentGrid)

    if (isInBounds(gridCenterSquareIndex)) {
        deleteOldGrid();
        createNewGridFrom(currentGrid);
        changePlayer();
        changeEndMessage();
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
