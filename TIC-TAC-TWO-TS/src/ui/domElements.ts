class DOMService {
    DOM_ELEMENTS: {
        board: HTMLElement | null,
        restartButton: HTMLInputElement | null,
        endMessage: HTMLElement | null
    } = {
        board: null,
        restartButton: null,
        endMessage: null
    };

    initializeDOMElements(): void {
        this.DOM_ELEMENTS.board = document.getElementById('board');
        this.DOM_ELEMENTS.restartButton = document.getElementById('restart-button') as HTMLInputElement;
        this.DOM_ELEMENTS.endMessage = document.getElementById('end-message');
    }

    changeEndMessage(newMessage: string): void {
        if (this.DOM_ELEMENTS.endMessage) {
            this.DOM_ELEMENTS.endMessage.textContent = newMessage;
        }
    }

    createNewGridFrom(currentGrid: number[]): void {
        document.querySelectorAll('.square').forEach((square) => {
            const index = Number((square as HTMLElement).dataset.index);
            if (currentGrid.includes(index)) {
                square.classList.add('grid');
            }
        });
    }

    deleteOldGrid(): void {
        document.querySelectorAll('.grid').forEach((square) => {
            square.classList.remove('grid');
        });
    }

    gridPeek(direction: number): number[] {
        const gridAfterMove: number[] = [];
        document.querySelectorAll('.grid').forEach((square) => {
            const index = Number((square as HTMLElement).dataset.index);
            gridAfterMove.push(index + direction);
        });
        return gridAfterMove;
    }

    findEmptySquaresWithinGrid(): HTMLElement[] {
        return Array.from(document.querySelectorAll('.grid')).filter(
            (square) => (square as HTMLElement).textContent === ''
        ) as HTMLElement[];
    }

    getAllSquares(): NodeListOf<HTMLElement> {
        return document.querySelectorAll('.square');
    }
}

export const domService = new DOMService();
