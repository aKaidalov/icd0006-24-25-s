import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { GRID_BOUNDS, PLAYERS, FOUR_MOVES} from "@/utils/constants";
import Direction from "@/utils/direction";

//TODO: Rename file as gameStore.ts

export const useGameStore = defineStore('game', () => {
    const currentPlayer = ref(PLAYERS[0]);
    const gameOver = ref(false);
    const isGridMoveMode = ref(false);
    const isPositionChangeMode = ref(false);
    const moveCounter = ref(0);
    const currentGridCenterSquareIndex = ref(GRID_BOUNDS[4]);
    const currentWinningCombinations = ref<[number, number, number][]>([]);
    const isPreviousElementRemoved = ref(false);
    const currentGameMode = ref<string | null>(null);
    const otherRulesEnabled = ref(false);

    function changePlayer() {
        currentPlayer.value = currentPlayer.value === PLAYERS[0] ? PLAYERS[1] : PLAYERS[0];
    }

    function isFourthMove(): boolean {
        return moveCounter.value === FOUR_MOVES;
    }

    function getCurrentGridBounds(): number[] {
        const i = currentGridCenterSquareIndex.value;
        return [
            i + Direction.UP_LEFT, i + Direction.UP, i + Direction.UP_RIGHT,
            i + Direction.LEFT, i, i + Direction.RIGHT,
            i + Direction.DOWN_LEFT, i + Direction.DOWN, i + Direction.DOWN_RIGHT
        ];
    }

    function generateWinningCombinations(): void {
        const i = currentGridCenterSquareIndex.value;
        currentWinningCombinations.value = [
            [i + Direction.UP_LEFT, i + Direction.UP, i + Direction.UP_RIGHT],
            [i + Direction.LEFT, i, i + Direction.RIGHT],
            [i + Direction.DOWN_LEFT, i + Direction.DOWN, i + Direction.DOWN_RIGHT],
            [i + Direction.UP_LEFT, i + Direction.LEFT, i + Direction.DOWN_LEFT],
            [i + Direction.UP, i, i + Direction.DOWN],
            [i + Direction.UP_RIGHT, i + Direction.RIGHT, i + Direction.DOWN_RIGHT],
            [i + Direction.UP_LEFT, i, i + Direction.DOWN_RIGHT],
            [i + Direction.UP_RIGHT, i, i + Direction.DOWN_LEFT]
        ];
    }

    function currentPlayerPlacedPieces(squares: string[]): number {
        return squares.filter(square => square === currentPlayer.value).length;
    }


    function resetGame() {
        currentPlayer.value = PLAYERS[0];
        gameOver.value = false;
        isGridMoveMode.value = false;
        isPositionChangeMode.value = false;
        moveCounter.value = 0;
        currentGridCenterSquareIndex.value = GRID_BOUNDS[4];
        currentWinningCombinations.value = [];
        isPreviousElementRemoved.value = false;
        currentGameMode.value = null;
        otherRulesEnabled.value = false;
    }

    //TODO: Make variables to return state and methods.
    return {
        // State
        currentPlayer,
        gameOver,
        isGridMoveMode,
        isPositionChangeMode,
        moveCounter,
        currentGridCenterSquareIndex,
        currentWinningCombinations,
        isPreviousElementRemoved,
        currentGameMode,
        otherRulesEnabled,

        // Methods
        changePlayer,
        isFourthMove,
        getCurrentGridBounds,
        generateWinningCombinations,
        resetGame,
        currentPlayerPlacedPieces,
    };
})
