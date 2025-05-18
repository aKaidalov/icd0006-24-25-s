<template>
  <div>
    <!-- Errors -->
    <div v-if="gpsLocationData.errors" class="alert alert-warning mt-3">
      {{ gpsLocationData.errors }}
    </div>

    <h1>GPS Locations for Session: {{ gpsSessionId }}</h1>

    <!-- Table -->
    <table v-if="gpsLocationData.data" class="table">

      <thead>
      <tr>
        <th>recordedAt</th>
        <th>latitude</th>
        <th>accuracy</th>
        <th>altitude</th>
        <th>verticalAccuracy</th>
        <th>appUserId</th>
        <th>gpsSessionId</th>
        <th>gpsLocationTypeId</th>
        <th>id</th>
      </tr>
      </thead>

      <tbody>
      <tr v-for="location in gpsLocationData.data" :key="location.id">
        <td>{{ location.recordedAt }}</td>
        <td>{{ location.latitude }}</td>
        <td>{{ location.accuracy }}</td>
        <td>{{ location.altitude }}</td>
        <td>{{ location.verticalAccuracy }}</td>
        <td>{{ location.appUserId }}</td>
        <td>{{ location.gpsSessionId }}</td>
        <td>{{ location.gpsLocationTypeId }}</td>
        <td>{{ location.id }}</td>
      </tr>
      </tbody>

    </table>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import { useRoute } from 'vue-router'
import { GpsLocationService } from '../service/GpsLocationService'
import type { IGpsLocation } from '../domain/IGpsLocation'
import type {IResultObject} from "../types/IResultObject.ts";

const route = useRoute()
const gpsSessionId = route.params.gpsSessionId as string

console.log(gpsSessionId)

const gpsLocationService = new GpsLocationService()
const gpsLocationData = reactive<IResultObject<IGpsLocation[]>>({});
const requestIsOngoing = ref(false);

const fetchPageData = async () => {
  requestIsOngoing.value = true;
  try{
    const result = await gpsLocationService.getLocationsBySessionId(gpsSessionId);
    console.log(result.data);

    gpsLocationData.data = result.data;
    gpsLocationData.errors = result.errors;

  } catch(error){
    console.error('Error fetching data: ', error);
  } finally {
    requestIsOngoing.value = false;
  }
};

onMounted(async () => {
  await fetchPageData();
})
</script>
