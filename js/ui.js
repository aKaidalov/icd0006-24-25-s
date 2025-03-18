import {logBoardClick} from "./helpers/helpers.js";
import {GRID_STARTING_SQUARES, TOTAL_SQUARES} from "./helpers/constants.js";

let title = null; //Ensures only one <h1> is created, preventing duplicates.

export function setUpBaseUiElements(mode) {
    document.getElementById('app-container')?.remove();

    let appContainer = document.createElement('div');
    appContainer.id = 'app-container';

    document.body.appendChild(appContainer);

    appContainer.append(
        createTitleElement(),
        createSubheadings(mode),
        createBoard(),
        createEndMessage(),
        createEndGame()
    );

    return appContainer;
}

export function createLandingPage() {
    const landingPage = createLandingPageElement();
    const title = createTitleElement();
    const modeSelection = createModeSelectionElement();
    const pvpButton = createButton('pvp-button', 'PvP');
    const pveButton = createButton('pve-button', 'PvE');

    modeSelection.appendChild(pvpButton);
    modeSelection.appendChild(pveButton);
    landingPage.appendChild(title);
    landingPage.appendChild(modeSelection);
    document.body.appendChild(landingPage);

    return { pvpButton, pveButton };
}

function createLandingPageElement() {
    const landingPage = document.createElement('div');
    landingPage.id = 'landing-page';
    return landingPage;
}

function createTitleElement(){
    if (!title){
        title = document.createElement('h1');
        title.id = 'title';
        title.textContent = 'TicTacTwo';
    }
    return title;
}

function createModeSelectionElement() {
    const modeSelection = document.createElement('div');
    modeSelection.id = 'mode-selection';
    return modeSelection;
}

function createButton(id, text) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    return button;
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