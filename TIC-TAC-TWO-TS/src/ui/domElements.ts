export const DOM_ELEMENTS: {
    board: HTMLElement | null;
    restartButton: HTMLElement | null;
    endMessage: HTMLElement | null;
} = {
    board: null,
    restartButton: null,
    endMessage: null,
};

export function initializeDOMElements(): void {
    DOM_ELEMENTS.board = document.getElementById("board");
    DOM_ELEMENTS.restartButton = document.getElementById("restart-button");
    DOM_ELEMENTS.endMessage = document.getElementById("end-message");
}

export function changeEndMessage(newMessage: string): void {
    if (DOM_ELEMENTS.endMessage) {
        DOM_ELEMENTS.endMessage.textContent = newMessage;
    }
}

export function createNewGridFrom(currentGrid: number[]): void {
    document.querySelectorAll(".square").forEach((square) => {
        const index = Number((square as HTMLElement).dataset.index);
        if (currentGrid.includes(index)) {
            square.classList.add("grid");
        }
    });
}

export function deleteOldGrid(): void {
    document.querySelectorAll(".grid").forEach((square) => {
        square.classList.remove("grid");
    });
}

export function gridPeek(direction: number): number[] {
    const gridAfterMove: number[] = [];
    document.querySelectorAll(".grid").forEach((square) => {
        const index = Number((square as HTMLElement).dataset.index);
        gridAfterMove.push(index + direction);
    });
    return gridAfterMove;
}

export function findEmptySquaresWithinGrid(): HTMLElement[] {
    return Array.from(document.querySelectorAll(".grid"))
        .filter((square) => (square as HTMLElement).textContent === "") as HTMLElement[];
}

// AI
export function getAllSquares(): NodeListOf<HTMLElement> {
    return document.querySelectorAll(".square") as NodeListOf<HTMLElement>;
}
