import {logBoardClick} from "./helpers/helpers.js";

const TOTAL_SQUARES = 25;
const GRID_STARTING_SQUARES = [6, 7, 8, 11, 12, 13, 16, 17, 18];

export function setUpBaseUiElements() {
    const appContainer = document.getElementById('app-container');
    appContainer.append(createTitle(), createBoard(), createEndMessage(), createEndGame());

    return appContainer;
}

function createTitle(){
    const title = document.createElement("div");
    title.id = 'title';

    const titleText = document.createElement("h1");
    titleText.textContent = 'TicTacTwo';
    title.append(titleText);

    return title;
}

function createBoard(){
    const board = document.createElement('div');
    board.id = 'board';

    for (let i = 0; i < TOTAL_SQUARES; i++) {
        const square = document.createElement('div');
        square.classList.add('square');
        if (GRID_STARTING_SQUARES.includes(i)) {
            square.classList.add('grid');
        }
        square.dataset.index = i;
        board.appendChild(square);
    }

    logBoardClick(board);

    board.after(createEndMessage());

    return board;
}

function createEndGame() {
    const endGame = document.createElement('div');
    endGame.id = 'end-game';

    const restartButton = document.createElement('input');
    restartButton.type = 'button';
    restartButton.value = 'Restart';
    restartButton.id = 'restart-button';

    endGame.appendChild(restartButton);

    return endGame;
}

function createEndMessage(message) {
    const endMessage = document.createElement('h2');
    endMessage.id = 'end-message';
    endMessage.textContent = message || `X's turn!`;
    endMessage.style.marginTop = '30px';
    endMessage.style.textAlign = 'center';

    return endMessage;
}