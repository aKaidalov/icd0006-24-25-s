import {setUpBaseUiElements} from "./ui.js";
import {startGame} from "./game.js";
import {GameMode} from "./components/gameMode.js";


document.addEventListener("DOMContentLoaded", () => {
    // Create landing page container
    const landingPage = document.createElement('div');
    landingPage.id = 'landing-page';

    // Create the title
    const title = document.createElement('h1');
    title.textContent = 'TicTacTwo';

    // Create mode selection container
    const modeSelection = document.createElement('div');
    modeSelection.id = 'mode-selection';

    // Create the Player vs Player button
    const pvpButton = document.createElement('button');
    pvpButton.id = 'pvp-button';
    pvpButton.textContent = 'PvP';

    // Create the Player vs Environment button
    const pveButton = document.createElement('button');
    pveButton.id = 'pve-button';
    pveButton.textContent = 'PvE';

    // Append the title and buttons to the mode selection container
    modeSelection.appendChild(pvpButton);
    modeSelection.appendChild(pveButton);

    // Append the title and mode selection to the landing page container
    landingPage.appendChild(title);
    landingPage.appendChild(modeSelection);

    // Append the landing page container to the body
    document.body.appendChild(landingPage);

    // Add event listeners for the buttons
    pvpButton.addEventListener('click', () => playGame(GameMode.PVP));
    pveButton.addEventListener('click', () => playGame(GameMode.PVE));
});

function playGame(gameMode){
    const landingPage = document.getElementById('landing-page');
    landingPage.style.display = 'none';

    setUpBaseUiElements(gameMode);
    startGame(gameMode);
}
