<template>
  <div id="map" class="h-full w-full"></div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import L from 'leaflet'

const map = ref<L.Map | null>(null)

onMounted(() => {
  map.value = L.map('map').setView([59.437, 24.7535], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)
})
</script>

<style>
#map {
  height: 100vh;
  width: 100%;
}
</style>
