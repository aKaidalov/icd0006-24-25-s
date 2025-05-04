<template>
  <Header />
  <main class="container">
    <RouterView style="margin-top: 60px;"/>
  </main>
  <Footer />
</template>

<script setup lang="ts">
import Header from './navigation/Header.vue';
import Footer from "./navigation/Footer.vue";
</script>
