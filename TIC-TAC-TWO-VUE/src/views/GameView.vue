<template>
  <div class="app-container">
    <h1>TicTacTwo</h1>

    <h2 id="subheadings">
      <span>{{game.currentGameMode}}</span>
      <span> - </span>
      <span id="game-time">{{formattedTime}}</span>
    </h2>

    <div id="board">
      <div
        v-for="(square, index) in squares"
        :key="index"
        class="square"
        :class="{grid: game.getCurrentGridBounds().includes(index)}"
        @click="handleClick(index)"
        :data-index="index"
      >
        {{square}}
      </div>
    </div>

    <h2 id="end-message">{{endMessage}}</h2>

    <div id="end-game">
      <input type="button" value="Restart" id="restart-button" @click="restartGame" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '@/store/game';

const game = useGameStore();
const route = useRoute();
const router = useRouter();

const squares = ref<string[]>(Array(25).fill(''));
const endMessage = ref(`${game.currentPlayer}'s turn`);

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

function restartGame() {
  router.push('/');
  location.reload();
}

function handleClick(index: number) {
  console.log('click on index', index);
}

onMounted(() => {
  game.currentGameMode = (route.query.mode as string) || 'PvP';
  startTimer();
});
</script>
