<template>
  <div class="app-container">
    <h1>TicTacTwo</h1>

    <h2 id="subheadings">
      <span>{{ gameMode }}</span>
      <span> - </span>
      <span id="game-time">{{ formattedTime }}</span>
    </h2>

    <div id="board">
      <div
          v-for="(square, index) in squares"
          :key="index"
          class="square"
          :class="{ grid: currentGridBounds.includes(index), winner: winningSquares.includes(index) }"
          @click="handleSquareClick(index)"
          :data-index="index"
      >
        {{ square }}
      </div>
    </div>

    <h2 id="end-message">{{ endMessage }}</h2>

    <div id="end-game">
      <input type="button" value="Restart" id="restart-button" @click="restartGame" />
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed, onMounted, onUpdated, onUnmounted} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { gameController } from '@/service/gameService';
import { useGameStore } from '@/store/gameStore';

const route = useRoute();
const router = useRouter();

const gameStore = useGameStore();

// State variables
const squares = ref<string[]>(Array(25).fill(''));
const endMessage = ref<string>('X\'s turn');
const winningSquares = ref<number[]>([]);
const gameMode = ref<string>('');

// Timer TODO: Move/replace timer logic to Helpers.
const seconds = ref(0);
let timerInterval: number | undefined;

const formattedTime = computed(() => {
  const min = Math.floor(seconds.value / 60).toString().padStart(2, '0');
  const sec = (seconds.value % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
});

const currentGridBounds = computed(() => gameStore.getCurrentGridBounds());

// Start the timer
function startTimer() {
  if (timerInterval !== undefined) return;
  timerInterval = setInterval(() => {
    seconds.value++;
  }, 1000);
}

// Stop the timer
function stopTimer() {
  if (timerInterval !== undefined) {
    clearInterval(timerInterval);
    timerInterval = undefined;
  }
}

// Handle click on a square
function handleSquareClick(index: number) {
  gameController.handleClick(index, squares, winningSquares, endMessage);
}

// Restart the game
function restartGame() {
  gameController.restartGame(squares, winningSquares, endMessage, stopTimer, router);
}

let keyHandler: (e: KeyboardEvent) => void;

onMounted(() => {
  const mode = route.params.mode as string;

  if (!mode || (mode !== 'PvP' && mode !== 'PvE')) {
    router.replace('/');
    return;
  }

  gameMode.value = mode;
  gameController.startGame(mode);
  startTimer();

  keyHandler = (event: KeyboardEvent) => {
    gameController.enableOtherRules(event, squares, endMessage, winningSquares);
  };

  window.addEventListener('keydown', keyHandler);
});


onUpdated(() => {
  if (gameStore.gameOver) stopTimer();
})

onUnmounted(() => {
  if (keyHandler) {
    window.removeEventListener('keydown', keyHandler);
  }
});
</script>
