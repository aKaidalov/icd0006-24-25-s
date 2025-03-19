import {createLandingPage, setUpBaseUiElements} from "./ui.js";
import {startGame} from "./game.js";
import {GAME_MODE} from "./helpers/constants.js";
import {initializeDOMElements} from "./components/domElements.js";


document.addEventListener("DOMContentLoaded", () => {
    const {pvpButton, pveButton } = createLandingPage();
    pvpButton.addEventListener('click', () => playGame(GAME_MODE.PVP));
    pveButton.addEventListener('click', () => playGame(GAME_MODE.PVE));
});

function playGame(gameMode){
    const landingPage = document.getElementById('landing-page');
    landingPage.style.display = 'none';
    setUpBaseUiElements(gameMode);
    initializeDOMElements();
    startGame(gameMode);
}
