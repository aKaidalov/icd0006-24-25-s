import Direction from "../utils/direction";
import { startTimer, stopTimer } from "../utils/helpers";
import {
    AI_DELAY,
    GAME_MODE,
    GRID_BOUNDS,
    PLAYERS,
} from "../utils/constants";
import {
    DOM_ELEMENTS,
    changeEndMessage,
    createNewGridFrom,
    deleteOldGrid,
    gridPeek
} from "../ui/domElements";
import { gameState } from "./gameState";
import { makeAIMove } from "./ai";

// Types
type SquareElement = HTMLElement;
type DirectionKey = string;

export function startGame(gameMode: string): void {
    gameState.currentGameMode = gameMode;

    DOM_ELEMENTS.restartButton!.addEventListener("click", restartGame);
    DOM_ELEMENTS.board!.addEventListener("click", (event: MouseEvent) => handleGameLogic(event));
}

function handleGameLogic(event: MouseEvent): void {
    console.log("---------------------------------------------------------");

    if (!gameState.gameOver) startTimer();

    const square = event.target as SquareElement;
    console.log(square);

    if (square.classList.contains("square") && gameState.isPositionChangeMode && !gameState.gameOver) {
        handlePositionChange(square);
        return;
    } else if (!square.classList.contains("square") || square.textContent !== "" || gameState.gameOver) {
        return;
    }

    if (!gameState.isGridMoveMode) {
        if (gameState.currentPlayerPlacedPieces() < 4) {
            if (!gameState.isPositionChangeMode && clickedSquareWithinGrid(square)) {
                assignSquareValue(square);
                if (!checkTieOrWin()) {
                    changePlayer();
                    console.log("CHANGE");
                }
            }
        }
    }
}

export function assignSquareValue(square: SquareElement): void {
    square.textContent = gameState.currentPlayer;
    console.log(`currentPlayerPlacedPieces ${gameState.currentPlayer}: ${gameState.currentPlayerPlacedPieces()}`);
    gameState.moveCounter++;
    console.log(`moveCounter: ${gameState.moveCounter}`);
    if (gameState.isFourthMove() && !gameState.otherRulesEnabled) {
        enableOtherRules();
        console.log("ENABLED");
    }
}

export function enableOtherRules(): void {
    console.log("enableOtherRules()");
    gameState.otherRulesEnabled = true;
    document.addEventListener("keydown", (event: KeyboardEvent) => {
        if (event.key === "g" && !gameState.gameOver && !gameState.isPositionChangeMode) {
            gameState.isGridMoveMode = true;
            changeEndMessage(`Grid move mode for player: ${gameState.currentPlayer}!`);
            console.log("Grid move mode enabled. Press a movement key: r, t, y, f, h, v, b, n.");
        } else if (gameState.isGridMoveMode) {
            handleGridMove(event.key);
        } else if (event.key === "c" && !gameState.gameOver && !gameState.isGridMoveMode) {
            gameState.isPositionChangeMode = true;
            changeEndMessage(`Position mode for player: ${gameState.currentPlayer}!`);
            console.log("Position change mode enabled. Click on existing position -> click on a new position.");
        }

        checkTieOrWin();
    });
}

function handleGridMove(key: DirectionKey): void {
    const direction = Direction.fromKey(key);
    if (!direction) {
        console.log("Invalid key! Try again.");
        return;
    }

    if (move(direction)) {
        gameState.isGridMoveMode = false;
        console.log(`Moved in direction: ${direction}`);
    }
}

function handlePositionChange(clickedSquare: SquareElement): void {
    if (clickedSquare.textContent === gameState.currentPlayer && !gameState.isPreviousElementRemoved) {
        clickedSquare.textContent = "";
        gameState.isPreviousElementRemoved = true;
    } else if (
        clickedSquare.textContent === "" &&
        gameState.isPreviousElementRemoved &&
        clickedSquareWithinGrid(clickedSquare)
    ) {
        clickedSquare.textContent = gameState.currentPlayer;
        gameState.isPreviousElementRemoved = false;
        gameState.isPositionChangeMode = false;
        if (!checkTieOrWin()) {
            changePlayer();
        }
    }
}

function move(direction: number): boolean {
    const currentGrid = gridPeek(direction);
    const gridCenterSquareIndex = getGridCenter(currentGrid);
    if (isInBounds(gridCenterSquareIndex)) {
        deleteOldGrid();
        createNewGridFrom(currentGrid);
        gameState.currentGridCenterSquareIndex = gridCenterSquareIndex;
        console.log(`Grid center: ${gameState.currentGridCenterSquareIndex}`);
        changePlayer();
        changeEndMessage(`${gameState.currentPlayer}'s turn!`);
        return true;
    }
    console.log("Wrong direction! Try again.");
    return false;
}

export function checkTieOrWin(): boolean {
    gameState.generateWinningCombinations();

    gameState.currentWinningCombinations.forEach(([a, b, c]: number[]) => {
        const squares = document.querySelectorAll(".square") as NodeListOf<HTMLElement>;
        if (
            winningCombinationContainsPlayer(squares, a, b, c, 0) ||
            winningCombinationContainsPlayer(squares, a, b, c, 1)
        ) {
            squares[a].classList.add("winner");
            squares[b].classList.add("winner");
            squares[c].classList.add("winner");
        }
    });

    const winningCombinationsFound = Math.round(document.querySelectorAll(".winner").length / 3);

    if (winningCombinationsFound >= 1) {
        let message = "It's a tie!";
        if (winningCombinationsFound === 1) {
            message = `Game Over! ${document.querySelector(".winner")?.textContent} wins!`;
        }

        changeEndMessage(message);
        gameState.gameOver = true;
        stopTimer();
        return true;
    }

    return false;
}

function winningCombinationContainsPlayer(
    squares: NodeListOf<HTMLElement>,
    a: number,
    b: number,
    c: number,
    playerIndex: number
): boolean {
    return (
        squares[a].textContent === PLAYERS[playerIndex] &&
        squares[b].textContent === PLAYERS[playerIndex] &&
        squares[c].textContent === PLAYERS[playerIndex]
    );
}

function clickedSquareWithinGrid(square: SquareElement): boolean {
    return gameState.getCurrentGridBounds().includes(Number(square.dataset.index));
}

export function changePlayer(): void {
    changePlayerAndEndMessage();
    if (
        gameState.currentGameMode === GAME_MODE.PVE &&
        gameState.currentPlayer === PLAYERS[1] &&
        !gameState.gameOver
    ) {
        setTimeout(makeAIMove, AI_DELAY);
    }
}

export function changePlayerAndEndMessage(): void {
    gameState.changePlayer();
    changeEndMessage(`${gameState.currentPlayer}'s turn!`);
}

function getGridCenter(grid: number[]): number {
    return grid[4];
}

function isInBounds(gridCenter: number): boolean {
    return GRID_BOUNDS.includes(gridCenter);
}

function restartGame(): void {
    location.reload();
}
