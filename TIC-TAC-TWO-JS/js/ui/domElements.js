export const DOM_ELEMENTS = {
    board: null,
    restartButton: null,
    endMessage: null
};

export function initializeDOMElements() {
    DOM_ELEMENTS.board = document.getElementById('board');
    DOM_ELEMENTS.restartButton = document.getElementById('restart-button');
    DOM_ELEMENTS.endMessage = document.getElementById('end-message');
}

export function changeEndMessage(newMessage) {
    DOM_ELEMENTS.endMessage.textContent = newMessage;
}

export function createNewGridFrom(currentGrid) {
    document.querySelectorAll('.square').forEach((square) => {
        if (currentGrid.includes(Number(square.dataset.index))) {
            square.classList.add('grid');
        }
    });
}

export function deleteOldGrid() {
    document.querySelectorAll('.grid').forEach((square) => {
        square.classList.remove('grid');
    });
}

export function gridPeek(direction) {
    let gridAfterMove = [];
    document.querySelectorAll('.grid').forEach((square) => {
        gridAfterMove.push(Number(square.dataset.index) + direction);
    });
    return gridAfterMove;
}

export function findEmptySquaresWithinGrid() {
    return Array.from(document.querySelectorAll('.grid'))
        .filter(square => square.textContent === ''); // Find empty squares
}

// AI
export function getAllSquares() {
    return document.querySelectorAll('.square');
}