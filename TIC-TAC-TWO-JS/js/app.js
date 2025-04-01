import {uiBuilder} from "./ui/ui.js";
import {gameController} from "./game/game.js";
import {GAME_MODE} from "./utils/constants.js";
import {domService} from "./ui/domElements.js";

class App {
    constructor() {
        document.addEventListener("DOMContentLoaded", () => this.#init());
    }

    #init() {
        const { pvpButton, pveButton } = uiBuilder.createLandingPage();
        pvpButton.addEventListener('click', () => this.#playGame(GAME_MODE.PVP));
        pveButton.addEventListener('click', () => this.#playGame(GAME_MODE.PVE));
    }

    #playGame(gameMode) {
        const landingPage = document.getElementById('landing-page');
        landingPage.style.display = 'none';
        uiBuilder.setUpBaseUiElements(gameMode);
        domService.initializeDOMElements();
        gameController.startGame(gameMode);
    }
}

new App();