var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _App_instances, _App_init, _App_playGame;
import { uiBuilder } from "./ui/ui.js";
import { gameController } from "./game/game.js";
import { GAME_MODE } from "./utils/constants.js";
import { domService } from "./ui/domElements.js";
class App {
    constructor() {
        _App_instances.add(this);
        document.addEventListener("DOMContentLoaded", () => __classPrivateFieldGet(this, _App_instances, "m", _App_init).call(this));
    }
}
_App_instances = new WeakSet(), _App_init = function _App_init() {
    const { pvpButton, pveButton } = uiBuilder.createLandingPage();
    pvpButton.addEventListener('click', () => __classPrivateFieldGet(this, _App_instances, "m", _App_playGame).call(this, GAME_MODE.PVP));
    pveButton.addEventListener('click', () => __classPrivateFieldGet(this, _App_instances, "m", _App_playGame).call(this, GAME_MODE.PVE));
}, _App_playGame = function _App_playGame(gameMode) {
    const landingPage = document.getElementById('landing-page');
    if (landingPage) {
        landingPage.style.display = 'none';
    }
    uiBuilder.setUpBaseUiElements(gameMode);
    domService.initializeDOMElements();
    gameController.startGame(gameMode);
};
new App();
