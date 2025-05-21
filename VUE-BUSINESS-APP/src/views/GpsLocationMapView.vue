<template>
  <div class="container-fluid position-relative">
<!--    <h1 class="h1 mb-2">-->
<!--      <span>{{ gpsSessionData.data?.name }}</span>-->
<!--    </h1>-->

    <!-- Header + Buttons -->
    <div class="d-flex justify-content-between align-items-center mb-2">
      <h1 class="h1 mb-0">
        <span>{{ gpsSessionData.data?.name }}</span>
      </h1>
      <div v-if="verifyUserByFullName()" class="btn-group">
        <button v-if="mode === 'idle'" class="btn btn-outline-success" @click="startTrackAdding">
          Create Track
        </button>
        <template v-else class="btn-group offset-sm-3 col-sm-9 d-flex">
          <button class="btn btn-outline-success" @click="openTypeSelectionModal">Save</button>
          <button class="btn btn-outline-secondary" @click="discardTrack">Discard</button>
        </template>
      </div>
    </div>

    <div v-if="gpsLocationData.errors" class="alert alert-warning" role="alert">
      {{ gpsLocationData.errors }}
    </div>

    <!-- Type selection modal -->
    <div class="modal fade show" tabindex="-1" style="display: block; background-color: rgba(0,0,0,0.5)" v-if="showTypeModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <form @submit.prevent="confirmSave">
            <div class="modal-header">
              <h5 class="modal-title">Choose location type</h5>
              <button type="button" class="btn-close" @click="showTypeModal = false"></button>
            </div>
            <div class="modal-body">
              <label class="form-label">Location Type</label>
              <select class="form-select" v-model="selectedTypeId" required>
                <option value="00000000-0000-0000-0000-000000000001">Default</option>
                <option value="00000000-0000-0000-0000-000000000002">Checkpoint</option>
              </select>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" @click="showTypeModal = false">Cancel</button>
              <button type="submit" class="btn btn-outline-success">Confirm Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Table and Map -->
    <div class="row">
      <div class="col-md-4" style="max-height: 70vh; overflow-y: auto;">
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
        <div class="d-flex flex-column justify-content-between" style="height: 70vh;">
          <!-- Map -->
          <div id="map" style="flex-grow: 1; border: 1px solid #dee2e6;"></div>

          <!-- Cancel -->
          <div class="text-center mt-3">
            <button type="button" class="btn btn-outline-secondary" @click="cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive, computed, onMounted, onBeforeUnmount} from 'vue'
import { useRoute } from 'vue-router'
import L from 'leaflet'
import { jwtDecode } from 'jwt-decode'

import { useUserDataStore } from '../stores/userDataStore'
import router from '../router'
import { GpsLocationService } from '../service/GpsLocationService'
import { GpsSessionService } from '../service/GpsSessionService'
import type { IGpsLocation } from '../domain/IGpsLocation'
import type { IGpsSession } from '../domain/IGpsSession'
import type { IResultObject } from '../types/IResultObject'

const gpsLocationService = new GpsLocationService()
const gpsSessionService = new GpsSessionService()
const route = useRoute()
const gpsSessionId = route.params.gpsSessionId as string

const map = ref<L.Map | null>(null)
const markers: L.Marker[] = []
const tempMarkers: L.Marker[] = []


const mode = ref<'idle' | 'adding'>('idle')
const bulkLocations = ref<Partial<IGpsLocation>[]>([])
const showTypeModal = ref(false)
const selectedTypeId = ref('00000000-0000-0000-0000-000000000001')

const gpsLocationData = reactive<IResultObject<IGpsLocation[]>>({})
const gpsSessionData = reactive<IResultObject<IGpsSession>>({})
const requestIsOngoing = ref(false)

const store = useUserDataStore()

const lastCenter = ref<L.LatLngExpression>([59.437, 24.7535])
const lastZoom = ref<number>(12)

const polyline = ref<L.Polyline | null>(null)

const intervalId = ref<number | null>(null)


// Identification
const currentUserFullName = computed(() => {
  if (!store.jwt) return null
  const decoded: any = jwtDecode(store.jwt)
  const firstName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"]
  const lastName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"]
  return `${firstName} ${lastName}`.trim()
})

const verifyUserByFullName = () => {
  console.log(`|${currentUserFullName.value}| - |${gpsSessionData.data?.userFirstLastName}|`)
  return currentUserFullName.value === gpsSessionData.data?.userFirstLastName;
}


// Cancel
const cancel = () => {
  router.push({name: 'GpsSession', query: route.query});
}

const startTrackAdding = () => {
  mode.value = 'adding'
  bulkLocations.value = []
}

const discardTrack = () => {
  if (confirm('Discard all added locations?')) {
    mode.value = 'idle'
    bulkLocations.value = []
    fetchPageData()
  }
}

const openTypeSelectionModal = () => {
  if (bulkLocations.value.length === 0) {
    alert('No locations to save.')
    return
  }
  showTypeModal.value = true
}


const clearTempMarkersData = () => {
  tempMarkers.forEach(m => m.remove())
  tempMarkers.length = 0
}

const confirmSave = async () => {
  const payload = bulkLocations.value.map(loc => ({
    ...loc,
    recordedAt: new Date(loc.recordedAt || new Date()).toISOString(),
    gpsLocationTypeId: selectedTypeId.value,
  }))

  const result = await gpsLocationService.addBulkLocationsAsync(payload, gpsSessionId)

  if (result.errors) {
    alert('Failed to submit: ' + result.errors.join(', '))
    return
  }

  showTypeModal.value = false
  alert(`Saved ${payload.length} locations.`)
  mode.value = 'idle'
  bulkLocations.value = []
  clearTempMarkersData()
  await fetchPageData()
}

const centerMapOn = (location: IGpsLocation) => {
  if (map.value) {
    map.value.setView([location.latitude, location.longitude], 16)
  }
}

const getCurrentSessionData = async () => {
  requestIsOngoing.value = true;
  try{
    const result = await gpsSessionService.getByIdAsync(gpsSessionId);
    console.log(result.data);

    gpsSessionData.data = result.data;
    gpsSessionData.errors = result.errors;

  } catch(error){
    console.error('Error fetching data: ', error);
  } finally {
    requestIsOngoing.value = false;
  }
}

const fetchPageData = async () => {
  requestIsOngoing.value = true;
  await getCurrentSessionData()
  initMap()
  try{

    const result = await gpsLocationService.getLocationsBySessionId(gpsSessionId)
    gpsLocationData.data = result.data
    gpsLocationData.errors = result.errors

    if (map.value && result.data) {
      markers.forEach(m => m.remove())
      markers.length = 0
      clearTempMarkersData()

      // Delete old line
      if (polyline.value) {
        polyline.value.remove()
        polyline.value = null
      }

      const latlngs: L.LatLngExpression[] = []

      // Update
      result.data.forEach(location => {
        const marker = L.marker([location.latitude, location.longitude], {
          draggable: verifyUserByFullName()
        }).addTo(map.value!)

        latlngs.push([location.latitude, location.longitude]) // Add coordinates

        if (verifyUserByFullName()) {
          marker.on('dragend', async (e: L.LeafletEvent) => {
            const latlng = (e.target as L.Marker).getLatLng()
            const updated = {
              ...location,
              latitude: latlng.lat,
              longitude: latlng.lng
            }
            const result = await gpsLocationService.updateAsync(location.id, updated)
            await fetchPageData()
            if (result.errors) {
              alert('Failed to update location: ' + result.errors.join(', '))
              return
            }
          })
        }

        // Marker Data
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

        if (verifyUserByFullName()) {
          popupContent += `
          <button class="btn btn-sm btn-outline-danger" onclick="window.deleteLocation('${location.id}')">Delete</button>
        </div>`
        } else {
          popupContent += `
          </div>`
        }

        marker.bindPopup(popupContent)
        marker.on('click', () => marker.openPopup())
        markers.push(marker)
      })

      // Draw the Track
      if (latlngs.length > 1) {
        polyline.value = L.polyline(latlngs, { color: 'blue' }).addTo(map.value!)
        map.value.fitBounds(polyline.value.getBounds())
      }
    }

  } catch(error){
    console.error('Error fetching data: ', error);
  } finally {
    requestIsOngoing.value = false;
  }
}

const onMapClick = (e: L.LeafletMouseEvent) => {
  if (mode.value !== 'adding') return

  const { lat, lng } = e.latlng
  bulkLocations.value.push({
    latitude: lat,
    longitude: lng,
    recordedAt: new Date().toISOString(),
    accuracy: 0,
    altitude: 0,
    verticalAccuracy: 0
  })

  const yellowIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-yellow.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })

  if (!map.value) return
  const marker = L.marker([lat, lng], { icon: yellowIcon }).addTo(map.value)
  tempMarkers.push(marker)
}

(window as any).deleteLocation = async (id: string) => {
  if (!confirm('Are you sure you want to delete this location?')) return
  const result = await gpsLocationService.deleteAsync(id)
  if (result.errors) {
    alert('Failed to delete location: ' + result.errors.join(', '))
    return
  }
  await fetchPageData()
}

const initMap = () => {
  if (map.value) {
    lastCenter.value = map.value.getCenter()
    lastZoom.value = map.value.getZoom()
    map.value.off() // remove all event listeners
    map.value.remove() // destroy the map instance
    map.value = null
  }

  map.value = L.map('map').setView(lastCenter.value, lastZoom.value)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map.value)
  map.value.on('click', onMapClick)
}

onMounted(async () => {
  initMap()
  await fetchPageData()

  // intervalId.value = window.setInterval(() => {
  //   fetchPageData()
  // }, 2000);
})

onBeforeUnmount(() => {
  if (intervalId.value !== null) clearInterval(intervalId.value)
})
</script>
