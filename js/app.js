import {setUpBaseUiElements} from "./ui.js";
import {startGame} from "./game.js";

const modes = ['PvP', 'PvE'];

setUpBaseUiElements(modes[0]);
startGame();
