import {logBoardClick} from "./helpers.js";

const TOTAL_SQUARES = 25;

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
    // restartButton.addEventListener('click', restartGame);

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