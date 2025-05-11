<template>
  <Header class="p-3"/>
  <main class="container flex-fill py-4">
    <RouterView />
  </main>
  <Footer class="text-center py-3"/>
</template>

<script setup lang="ts">
import Header from './navigation/Header.vue';
import Footer from "./navigation/Footer.vue";
</script>
