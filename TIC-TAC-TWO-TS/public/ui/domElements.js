class DOMService {
    constructor() {
        this.DOM_ELEMENTS = {
            board: null,
            restartButton: null,
            endMessage: null
        };
    }
    initializeDOMElements() {
        this.DOM_ELEMENTS.board = document.getElementById('board');
        this.DOM_ELEMENTS.restartButton = document.getElementById('restart-button');
        this.DOM_ELEMENTS.endMessage = document.getElementById('end-message');
    }
    changeEndMessage(newMessage) {
        if (this.DOM_ELEMENTS.endMessage) {
            this.DOM_ELEMENTS.endMessage.textContent = newMessage;
        }
    }
    createNewGridFrom(currentGrid) {
        document.querySelectorAll('.square').forEach((square) => {
            const index = Number(square.dataset.index);
            if (currentGrid.includes(index)) {
                square.classList.add('grid');
            }
        });
    }
    deleteOldGrid() {
        document.querySelectorAll('.grid').forEach((square) => {
            square.classList.remove('grid');
        });
    }
    gridPeek(direction) {
        const gridAfterMove = [];
        document.querySelectorAll('.grid').forEach((square) => {
            const index = Number(square.dataset.index);
            gridAfterMove.push(index + direction);
        });
        return gridAfterMove;
    }
    findEmptySquaresWithinGrid() {
        return Array.from(document.querySelectorAll('.grid')).filter((square) => square.textContent === '');
    }
    getAllSquares() {
        return document.querySelectorAll('.square');
    }
}
export const domService = new DOMService();
