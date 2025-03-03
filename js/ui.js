import {logBoardClick} from "./helpers/helpers.js";

const TOTAL_SQUARES = 25;
const GRID_STARTING_SQUARES = [6, 7, 8, 11, 12, 13, 16, 17, 18];

export function createLandingPage() {
    document.getElementById('landing-page')?.remove();
    let landingPage = document.getElementById('div');
    landingPage.id = 'landing-page';


}

export function setUpBaseUiElements(mode) {
    document.getElementById('app-container')?.remove();

    let appContainer = document.createElement('div');
    appContainer.id = 'app-container';

    document.body.appendChild(appContainer);

    appContainer.append(
        createTitle(),
        createSubheadings(mode),
        createBoard(),
        createEndMessage(),
        createEndGame()
    );

    return appContainer;
}

function createTitle(){
    const title = document.createElement('h1');
    title.textContent = 'TicTacTwo';

    return title;
}

function createSubheadings(mode) {
    const subheadings = document.createElement("h2");
    subheadings.id = "subheadings";

    const modeSubheading = document.createElement("span");
    modeSubheading.textContent = mode;

    const elementBetween = document.createElement("span");
    elementBetween.textContent = " - ";

    const timeSubheading = document.createElement("span");
    timeSubheading.id = "game-time";
    timeSubheading.textContent = "00:00";

    subheadings.append(modeSubheading, elementBetween, timeSubheading);

    return subheadings;
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