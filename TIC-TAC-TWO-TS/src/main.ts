import { createLandingPage, setUpBaseUiElements } from "./ui/ui";
import { startGame } from "./game/game";
import { GAME_MODE, type GameMode } from "./utils/constants";
import { initializeDOMElements } from "./ui/domElements";

document.addEventListener("DOMContentLoaded", () => {
    const { pvpButton, pveButton } = createLandingPage();

    pvpButton.addEventListener("click", () => playGame(GAME_MODE.PVP));
    pveButton.addEventListener("click", () => playGame(GAME_MODE.PVE));
});

function playGame(gameMode: GameMode): void {
    const landingPage = document.getElementById("landing-page") as HTMLElement;
    landingPage.style.display = "none";

    setUpBaseUiElements(gameMode);
    initializeDOMElements();
    startGame(gameMode);
}
