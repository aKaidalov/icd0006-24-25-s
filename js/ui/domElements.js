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