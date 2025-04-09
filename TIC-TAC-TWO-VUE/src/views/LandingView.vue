<template>
  <div class="landing">
    <h1>Tic Tac Two</h1>
    <div id="mode-selection">
      <button @click="startGame('PvP')" id="pvp-button">PvP</button>
      <button @click="startGame('PvE')" id="pve-button">PvE</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function startGame(mode: string) {
  router.push({ name: 'Game', query: { mode } });
}
</script>
