var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _UIBuilder_instances, _UIBuilder_createElementWithId, _UIBuilder_createTitleElement, _UIBuilder_createButton, _UIBuilder_createSubheadings, _UIBuilder_createBoard, _UIBuilder_createEndGame, _UIBuilder_createEndMessage;
import { helpers } from "../utils/helpers.js";
import { GRID_STARTING_SQUARES, TOTAL_SQUARES } from "../utils/constants.js";
class UIBuilder {
    constructor() {
        _UIBuilder_instances.add(this);
    }
    setUpBaseUiElements(mode) {
        var _a;
        (_a = document.getElementById('app-container')) === null || _a === void 0 ? void 0 : _a.remove();
        const appContainer = __classPrivateFieldGet(this, _UIBuilder_instances, "m", _UIBuilder_createElementWithId).call(this, 'div', 'app-container');
        document.body.appendChild(appContainer);
        appContainer.append(__classPrivateFieldGet(this, _UIBuilder_instances, "m", _UIBuilder_createTitleElement).call(this), __classPrivateFieldGet(this, _UIBuilder_instances, "m", _UIBuilder_createSubheadings).call(this, mode), __classPrivateFieldGet(this, _UIBuilder_instances, "m", _UIBuilder_createBoard).call(this), __classPrivateFieldGet(this, _UIBuilder_instances, "m", _UIBuilder_createEndMessage).call(this), __classPrivateFieldGet(this, _UIBuilder_instances, "m", _UIBuilder_createEndGame).call(this));
        return appContainer;
    }
    createLandingPage() {
        const landingPage = __classPrivateFieldGet(this, _UIBuilder_instances, "m", _UIBuilder_createElementWithId).call(this, 'div', 'landing-page');
        const title = __classPrivateFieldGet(this, _UIBuilder_instances, "m", _UIBuilder_createTitleElement).call(this);
        const modeSelection = __classPrivateFieldGet(this, _UIBuilder_instances, "m", _UIBuilder_createElementWithId).call(this, 'div', 'mode-selection');
        const pvpButton = __classPrivateFieldGet(this, _UIBuilder_instances, "m", _UIBuilder_createButton).call(this, 'pvp-button', 'PvP');
        const pveButton = __classPrivateFieldGet(this, _UIBuilder_instances, "m", _UIBuilder_createButton).call(this, 'pve-button', 'PvE');
        modeSelection.appendChild(pvpButton);
        modeSelection.appendChild(pveButton);
        landingPage.appendChild(title);
        landingPage.appendChild(modeSelection);
        document.body.appendChild(landingPage);
        return { pvpButton, pveButton };
    }
}
_UIBuilder_instances = new WeakSet(), _UIBuilder_createElementWithId = function _UIBuilder_createElementWithId(tag, id) {
    const el = document.createElement(tag);
    el.id = id;
    return el;
}, _UIBuilder_createTitleElement = function _UIBuilder_createTitleElement() {
    let titleElement = document.querySelector('h1');
    if (!titleElement) {
        titleElement = document.createElement('h1');
        titleElement.textContent = 'TicTacTwo';
    }
    return titleElement;
}, _UIBuilder_createButton = function _UIBuilder_createButton(id, text) {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    return button;
}, _UIBuilder_createSubheadings = function _UIBuilder_createSubheadings(mode) {
    const subheadings = __classPrivateFieldGet(this, _UIBuilder_instances, "m", _UIBuilder_createElementWithId).call(this, 'h2', 'subheadings');
    const modeSubheading = document.createElement("span");
    modeSubheading.textContent = mode;
    const elementBetween = document.createElement("span");
    elementBetween.textContent = " - ";
    const timeSubheading = document.createElement("span");
    timeSubheading.id = "game-time";
    timeSubheading.textContent = "00:00";
    subheadings.append(modeSubheading, elementBetween, timeSubheading);
    return subheadings;
}, _UIBuilder_createBoard = function _UIBuilder_createBoard() {
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
}, _UIBuilder_createEndGame = function _UIBuilder_createEndGame() {
    const endGame = document.createElement('div');
    endGame.id = 'end-game';
    const restartButton = document.createElement('input');
    restartButton.type = 'button';
    restartButton.value = 'Restart';
    restartButton.id = 'restart-button';
    endGame.appendChild(restartButton);
    return endGame;
}, _UIBuilder_createEndMessage = function _UIBuilder_createEndMessage(message) {
    const endMessage = document.createElement('h2');
    endMessage.id = 'end-message';
    endMessage.textContent = message || `X's turn!`;
    endMessage.style.marginTop = '30px';
    endMessage.style.textAlign = 'center';
    return endMessage;
};
export const uiBuilder = new UIBuilder();
