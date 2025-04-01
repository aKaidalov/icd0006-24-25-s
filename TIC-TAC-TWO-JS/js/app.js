import {uiBuilder} from "./ui/ui.js";
import {startGame} from "./game/game.js";
import {GAME_MODE} from "./utils/constants.js";
import {initializeDOMElements} from "./ui/domElements.js";


document.addEventListener("DOMContentLoaded", () => {
    const {pvpButton, pveButton } = uiBuilder.createLandingPage();
    pvpButton.addEventListener('click', () => playGame(GAME_MODE.PVP));
    pveButton.addEventListener('click', () => playGame(GAME_MODE.PVE));
});

function playGame(gameMode){
    const landingPage = document.getElementById('landing-page');
    landingPage.style.display = 'none';
    uiBuilder.setUpBaseUiElements(gameMode);
    initializeDOMElements();
    startGame(gameMode);
}
