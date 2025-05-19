<template>
  <div class="container-fluid position-relative">
    <h1 class="h2 mb-2">
      <span>GPS Locations for Session:</span><br />
      <span class="h5">{{ gpsSessionId }}</span>
    </h1>

    <div v-if="gpsLocationData.errors" class="alert alert-warning" role="alert">
      {{ gpsLocationData.errors }}
    </div>

    <!-- Add Location Button -->
    <button
        v-if="gpsLocationData.data?.[0].appUserId === currentUserId"
        class="btn btn-success position-absolute"
        style="top: 15px; right: 15px; z-index: 1000"
        @click="enableAddMode"
    >
      +
    </button>

    <!-- Modal -->
    <div class="modal fade show" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5)" v-if="showModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="submitLocationFromMap">
            <div class="modal-header">
              <h5 class="modal-title">Add New Location</h5>
              <button type="button" class="btn-close" @click="showModal = false"></button>
            </div>
            <div class="modal-body">
              <p><strong>Latitude:</strong> {{ tempLatLng?.[0].toFixed(5) }}</p>
              <p><strong>Longitude:</strong> {{ tempLatLng?.[1].toFixed(5) }}</p>
              <div class="mb-2">
                <label class="form-label">Recorded At</label>
                <input v-model="newLocation.recordedAt" type="datetime-local" class="form-control" required />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Table and Map -->
    <div class="row">
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

      <div class="col-md-8">
        <div id="map" style="height: 70vh; border: 1px solid #dee2e6;"></div>
      </div>
    </div>
  </div>

  <!-- Cancel -->
  <div class="row">
    <div class="offset-sm-3 col-sm-9 d-flex">
      <button type="button" class="btn btn-outline-secondary" @click="cancel">Cancel</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from 'vue'
import { useRoute } from 'vue-router'
import { GpsLocationService } from '../service/GpsLocationService'
import type { IGpsLocation } from '../domain/IGpsLocation'
import type { IResultObject } from '../types/IResultObject'
import L from 'leaflet'
import { jwtDecode } from 'jwt-decode'

import {useUserDataStore} from "../stores/userDataStore.ts";
import router from "../router";

const route = useRoute()
const gpsSessionId = route.params.gpsSessionId as string

const gpsLocationService = new GpsLocationService()
const gpsLocationData = reactive<IResultObject<IGpsLocation[]>>({})
const map = ref<L.Map | null>(null)
const markers: L.Marker[] = []

const isAddMode = ref(false)
const tempLatLng = ref<[number, number] | null>(null)
const showModal = ref(false)

// Cancel
function returnToSessionsPage(): void {
  router.push({name: 'GpsSession', query: route.query});
}

function cancel() {
  returnToSessionsPage();
}


// Identify User
const store = useUserDataStore()
const currentUserId = computed(() => {
  if (!store.jwt) return null
  const decoded: any = jwtDecode(store.jwt)
  return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
})

// Add Location
const newLocation = reactive({
  recordedAt: new Date().toISOString().slice(0, 16),
  latitude: 0,
  longitude: 0,
  accuracy: 0,
  altitude: 0,
  verticalAccuracy: 0,
  gpsLocationTypeId: '00000000-0000-0000-0000-000000000001' //TODO: implement dropdown
})

const enableAddMode = () => {
  isAddMode.value = true
  alert('Click on the map to choose a location')
}

const submitLocationFromMap = async () => {
  if (!tempLatLng.value) return

  const [lat, lng] = tempLatLng.value

  const payload = {
    ...newLocation,
    recordedAt: new Date(newLocation.recordedAt).toISOString(),
    latitude: lat,
    longitude: lng
  }

  const result = await gpsLocationService.addLocationAsync(payload, gpsSessionId)

  if (result.errors) {
    alert('Failed to add location: ' + result.errors.join(', '))
    return
  }

  alert('Location successfully added.')
  showModal.value = false
  tempLatLng.value = null
  await fetchPageData()
}

// Show data
// Black magic 2
const fetchPageData = async () => {
  try {
    const result = await gpsLocationService.getLocationsBySessionId(gpsSessionId)
    gpsLocationData.data = result.data
    gpsLocationData.errors = result.errors

    if (map.value && result.data) {
      markers.forEach(m => m.remove())
      markers.length = 0

      result.data.forEach(location => {
        const marker = L.marker([location.latitude, location.longitude], { draggable: true }).addTo(map.value!)

        let popupContent = `
          <div>
            <strong>Recorded At:</strong> ${location.recordedAt}<br>
            <strong>Latitude:</strong> ${location.latitude}<br>
            <strong>Longitude:</strong> ${location.longitude}<br>
            <strong>Accuracy:</strong> ${location.accuracy}<br>
            <strong>Altitude:</strong> ${location.altitude}<br>
            <strong>Vertical Accuracy:</strong> ${location.verticalAccuracy}<br>
            <strong>App User ID:</strong> ${location.appUserId}<br>
            <strong>Session ID:</strong> ${location.gpsSessionId}<br>
            <strong>Type ID:</strong> ${location.gpsLocationTypeId}<br>
            <strong>ID:</strong> ${location.id}<br><br>
        `

        if (location.appUserId === currentUserId.value) {
          popupContent += `
            <div class="row">
                <div class="d-flex justify-content-center">
                  <button type="submit" class="btn btn-outline-danger ms-2" onclick="window.deleteLocation('${location.id}')">Delete</button>
                </div>
              </div>
            </div>`
        } else {
          popupContent += `
          </div>`
        }

        marker.bindPopup(popupContent)
        marker.on('click', () => marker.openPopup())

        // Handle marker move
        marker.on('dragend', async (e) => {
          const newLatLng = e.target.getLatLng()
          const updatedLocation = {
            ...location,
            latitude: newLatLng.lat,
            longitude: newLatLng.lng
          }

          const result = await gpsLocationService.updateAsync(location.id, updatedLocation)

          if (result.errors) {
            alert('Failed to update location: ' + result.errors.join(', '))
            // return marker to previous place
            marker.setLatLng([location.latitude, location.longitude])
            return
          }

          alert('Location successfully updated.')
          await fetchPageData()
        })

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

// Delete
(window as any).deleteLocation = async (id: string) => {
  if (!confirm('Are you sure you want to delete this location?')) return

  const result = await gpsLocationService.deleteAsync(id)

  if (result.errors) {
    alert('Failed to delete location: ' + result.errors.join(', '))
    return
  }

  alert('Location deleted.')
  await fetchPageData()
}


onMounted(async () => {
  map.value = L.map('map').setView([59.437, 24.7535], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)

  map.value.on('click', (e: L.LeafletMouseEvent) => {
    if (!isAddMode.value) return
    const { lat, lng } = e.latlng
    tempLatLng.value = [lat, lng]
    isAddMode.value = false
    showModal.value = true
  })

  await fetchPageData()
})
</script>
