import {setUpBaseUiElements} from "./ui.js";
import {startGame} from "./game.js";

const modes = ['PvP', 'PvE'];

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
    pvpButton.textContent = 'Player vs Player';

    // Create the Player vs Environment button
    const pveButton = document.createElement('button');
    pveButton.id = 'pve-button';
    pveButton.textContent = 'Player vs Environment';

    // Append the title and buttons to the mode selection container
    modeSelection.appendChild(pvpButton);
    modeSelection.appendChild(pveButton);

    // Append the title and mode selection to the landing page container
    landingPage.appendChild(title);
    landingPage.appendChild(modeSelection);

    // Append the landing page container to the body
    document.body.appendChild(landingPage);

    // Add event listeners for the buttons
    pvpButton.addEventListener('click', () => playGame(modes[0]));
    pveButton.addEventListener('click', () => playGame(modes[1]));
});

function playGame(mode){
    const landingPage = document.getElementById('landing-page');
    landingPage.style.display = 'none';

    setUpBaseUiElements(mode);
    startGame(mode);
}
