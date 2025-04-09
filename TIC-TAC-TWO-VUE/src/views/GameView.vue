<template>
  <div class="game">
    <h2>GameView works!</h2>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

onMounted(() => {
  const mode = route.query.mode;
  console.log('Game mode:', mode);
});
</script>
