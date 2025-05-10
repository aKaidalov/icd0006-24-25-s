<template>
  <div class="container mt-4">
    <div v-if="requestIsOngoing">Loading session details...</div>

    <div v-else-if="gpsSessionData.data">
      <h2>Session Details</h2>
      <table class="table table-sm table-bordered">
        <tbody>
        <tr>
          <th>ID</th>
          <td>{{ gpsSessionData.data.id }}</td>
        </tr>
        <tr>
          <th>Name</th>
          <td>{{ gpsSessionData.data.name }}</td>
        </tr>
        <tr>
          <th>Description</th>
          <td>{{ gpsSessionData.data.description }}</td>
        </tr>
        <tr>
          <th>Recorded At</th>
          <td>{{ gpsSessionData.data.recordedAt }}</td>
        </tr>
        <tr>
          <th>Duration</th>
          <td>{{ gpsSessionData.data.duration }}</td>
        </tr>
        <tr>
          <th>Speed</th>
          <td>{{ gpsSessionData.data.speed }}</td>
        </tr>
        <tr>
          <th>Distance</th>
          <td>{{ gpsSessionData.data.distance }}</td>
        </tr>
        <tr>
          <th>Climb</th>
          <td>{{ gpsSessionData.data.climb }}</td>
        </tr>
        <tr>
          <th>Descent</th>
          <td>{{ gpsSessionData.data.descent }}</td>
        </tr>
        <tr>
          <th>Pace (min)</th>
          <td>{{ gpsSessionData.data.paceMin }}</td>
        </tr>
        <tr>
          <th>Pace (max)</th>
          <td>{{ gpsSessionData.data.paceMax }}</td>
        </tr>
        <tr>
          <th>Type</th>
          <td>{{ gpsSessionData.data.gpsSessionType }}</td>
        </tr>
        <tr>
          <th>Location Count</th>
          <td>{{ gpsSessionData.data.gpsLocationsCount }}</td>
        </tr>
        <tr>
          <th>User</th>
          <td>{{ gpsSessionData.data.userFirstLastName }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="gpsSessionData.errors" class="alert alert-danger">
      {{ gpsSessionData.errors }}
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import type {IResultObject} from "../types/IResultObject.ts";
import type {IGpsSession} from "../domain/IGpsSession.ts";
import {GpsSessionService} from "../service/GpsSessionService.ts";
import {useRoute} from "vue-router";

const requestIsOngoing = ref(false);
const gpsSessionData = reactive<IResultObject<IGpsSession>>({});
const gpsSessionService = new GpsSessionService();

const route = useRoute()
const sessionId = route.params.id as string

const fetchPageData = async () => {
  requestIsOngoing.value = true;
  try{
    const result = await gpsSessionService.getByIdAsync(sessionId);
    console.log(result.data);

    gpsSessionData.data = result.data;
    gpsSessionData.errors = result.errors;

  } catch(error){
    console.error('Error fetching data: ', error);
  } finally {
    requestIsOngoing.value = false;
  }
};

onMounted(async () => {
  await fetchPageData();
});
</script>
