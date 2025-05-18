<template>
  <div class="container-fluid">
    <h1 class="h5 my-3">GPS Locations for Session: {{ gpsSessionId }}</h1>

    <div v-if="gpsLocationData.errors" class="alert alert-warning" role="alert">
      {{ gpsLocationData.errors }}
    </div>

    <div class="row">
      <!-- Left Panel -->
      <div class="col-md-4 mb-3" style="max-height: 70vh; overflow-y: auto;">
        <table v-if="gpsLocationData.data" class="table table-sm table-bordered">
          <thead class="table-light">
          <tr>
            <th>#</th>
            <th>Latitude</th>
            <th>Longitude</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="(location, index) in gpsLocationData.data"
              :key="location.id"
              @click="centerMapOn(location)"
              style="cursor: pointer;"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ location.latitude.toFixed(5) }}</td>
            <td>{{ location.longitude.toFixed(5) }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Right Panel (Map) -->
      <div class="col-md-8">
        <div id="map" style="height: 70vh; border: 1px solid #dee2e6;"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { GpsLocationService } from '../service/GpsLocationService'
import type { IGpsLocation } from '../domain/IGpsLocation'
import type { IResultObject } from '../types/IResultObject'
import L from 'leaflet'

const route = useRoute()
const gpsSessionId = route.params.gpsSessionId as string

const gpsLocationService = new GpsLocationService()
const gpsLocationData = reactive<IResultObject<IGpsLocation[]>>({})
const map = ref<L.Map | null>(null)
const markers: L.Marker[] = []

const fetchPageData = async () => {
  try {
    const result = await gpsLocationService.getLocationsBySessionId(gpsSessionId)
    gpsLocationData.data = result.data
    gpsLocationData.errors = result.errors

    if (map.value && result.data) {
      markers.forEach(m => m.remove())
      result.data.forEach(location => {
        const marker = L.marker([location.latitude, location.longitude]).addTo(map.value!)
        marker.bindPopup(`ID: ${location.id}<br>Time: ${location.recordedAt}`)
        markers.push(marker)
      })
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const centerMapOn = (location: IGpsLocation) => {
  if (map.value) {
    map.value.setView([location.latitude, location.longitude], 16)
  }
}

onMounted(async () => {
  map.value = L.map('map').setView([59.437, 24.7535], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)
  await fetchPageData()
})
</script>
