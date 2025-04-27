<template>
  <div class="app-container">
    <h1>TicTacTwo</h1>

    <h2 id="subheadings">
      <span>{{ game.currentGameMode }}</span>
      <span> - </span>
      <span id="game-time">{{ formattedTime }}</span>
    </h2>

    <div id="board">
      <div
          v-for="(square, index) in squares"
          :key="index"
          class="square"
          :class="{ grid: game.getCurrentGridBounds().includes(index), winner: winningSquares.includes(index) }"
          @click="handleClick(index)"
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '@/store/game';
import { gameService } from '@/service/gameService';
import { aiService } from '@/service/aiService';

const game = useGameStore(); //TODO: rename to gameStore
const route = useRoute();
const router = useRouter();

const squares = ref<string[]>(Array(25).fill(''));
const endMessage = ref(`${game.currentPlayer}'s turn`);
const winningSquares = ref<number[]>([]);

const seconds = ref(0);
let timerInterval: number | undefined;

const formattedTime = computed(() => {
  const min = Math.floor(seconds.value / 60).toString().padStart(2, '0');
  const sec = (seconds.value % 60).toString().padStart(2, '0');
  return `${min}:${sec}`;
});

function startTimer() {
  if (timerInterval !== undefined) return;
  timerInterval = setInterval(() => {
    seconds.value++;
  }, 1000);
}

function stopTimer() {
  if (timerInterval !== undefined) {
    clearInterval(timerInterval);
    timerInterval = undefined;
  }
}

function handleClick(index: number) {
  if (game.gameOver) return;

  if (game.isPositionChangeMode) {
    gameService.handlePositionChange(squares.value, index, endMessage);
    if (game.gameOver) stopTimer();
    return;
  }

  if (squares.value[index] !== '') return;

  if (!game.isGridMoveMode) {
    if (gameService.isInBounds(index)) {
      gameService.assignSquareValue(squares.value, index);

      if (gameService.checkTieOrWin(squares.value, endMessage)) {
        stopTimer();
      } else {
        gameService.changePlayerAndEndMessage(endMessage);
      }
    }
  }
}

function restartGame() {
  game.resetGame();
  squares.value = Array(25).fill('');
  endMessage.value = `${game.currentPlayer}'s turn`;
  seconds.value = 0;
  winningSquares.value = [];
  stopTimer();
  router.push('/');
}

onMounted(() => {
  const mode = route.params.mode as string;

  if (!mode || (mode !== 'PvP' && mode !== 'PvE')) {
    router.replace('/');
    return;
  }

  game.currentGameMode = mode;
  startTimer();
});

onBeforeUnmount(() => {
  stopTimer();
});
</script>
