import { helpers } from "../utils/helpers.js";
import { GRID_STARTING_SQUARES, TOTAL_SQUARES } from "../utils/constants.js";

class UIBuilder {
    setUpBaseUiElements(mode: string): HTMLElement {
        document.getElementById('app-container')?.remove();

        const appContainer = this.#createElementWithId('div', 'app-container');
        document.body.appendChild(appContainer);

        appContainer.append(
            this.#createTitleElement(),
            this.#createSubheadings(mode),
            this.#createBoard(),
            this.#createEndMessage(),
            this.#createEndGame()
        );

        return appContainer;
    }

    createLandingPage(): { pvpButton: HTMLButtonElement; pveButton: HTMLButtonElement } {
        const landingPage = this.#createElementWithId('div', 'landing-page');
        const title = this.#createTitleElement();
        const modeSelection = this.#createElementWithId('div', 'mode-selection');

        const pvpButton = this.#createButton('pvp-button', 'PvP');
        const pveButton = this.#createButton('pve-button', 'PvE');

        modeSelection.appendChild(pvpButton);
        modeSelection.appendChild(pveButton);
        landingPage.appendChild(title);
        landingPage.appendChild(modeSelection);
        document.body.appendChild(landingPage);

        return { pvpButton, pveButton };
    }

    #createElementWithId(tag: keyof HTMLElementTagNameMap, id: string): HTMLElement {
        const el = document.createElement(tag);
        el.id = id;
        return el;
    }

    #createTitleElement(): HTMLElement {
        let titleElement = document.querySelector('h1');
        if (!titleElement) {
            titleElement = document.createElement('h1');
            titleElement.textContent = 'TicTacTwo';
        }
        return titleElement;
    }

    #createButton(id: string, text: string): HTMLButtonElement {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = text;
        return button;
    }

    #createSubheadings(mode: string): HTMLElement {
        const subheadings = this.#createElementWithId('h2', 'subheadings');

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

    #createBoard(): HTMLElement {
        const board = document.createElement('div');
        board.id = 'board';

        for (let i = 0; i < TOTAL_SQUARES; i++) {
            const square = document.createElement('div');
            square.classList.add('square');
            if (GRID_STARTING_SQUARES.includes(i)) {
                square.classList.add('grid');
            }
            square.dataset.index = i.toString();
            board.appendChild(square);
        }

        helpers.logBoardClick(board);

        return board;
    }

    #createEndGame(): HTMLElement {
        const endGame = document.createElement('div');
        endGame.id = 'end-game';

        const restartButton = document.createElement('input');
        restartButton.type = 'button';
        restartButton.value = 'Restart';
        restartButton.id = 'restart-button';

        endGame.appendChild(restartButton);

        return endGame;
    }

    #createEndMessage(message?: string): HTMLElement {
        const endMessage = document.createElement('h2');
        endMessage.id = 'end-message';
        endMessage.textContent = message || `X's turn!`;
        endMessage.style.marginTop = '30px';
        endMessage.style.textAlign = 'center';

        return endMessage;
    }
}

export const uiBuilder = new UIBuilder();
