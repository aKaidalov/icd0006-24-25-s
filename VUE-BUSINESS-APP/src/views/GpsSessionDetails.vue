<template>
  <div class="container mt-4">
    <div v-if="requestIsOngoing">Loading session details...</div>

    <div v-else-if="gpsSessionData.errors" class="alert alert-danger">
      {{ gpsSessionData.errors }}
    </div>

    <div v-else-if="gpsSessionData.data" class="card shadow-sm p-4">
      <h2 class="mb-4">GPS Session Details</h2>
      <dl class="row">
        <dt class="col-sm-3">ID</dt>
        <dd class="col-sm-9">{{ gpsSessionData.data.id }}</dd>

        <dt class="col-sm-3">Name</dt>
        <dd class="col-sm-9">{{ gpsSessionData.data.name }}</dd>

        <dt class="col-sm-3">Description</dt>
        <dd class="col-sm-9">{{ gpsSessionData.data.description }}</dd>

        <dt class="col-sm-3">Recorded At</dt>
        <dd class="col-sm-9">{{ gpsSessionData.data.recordedAt }}</dd>

        <dt class="col-sm-3">Duration</dt>
        <dd class="col-sm-9">{{ gpsSessionData.data.duration }}</dd>

        <dt class="col-sm-3">Speed</dt>
        <dd class="col-sm-9">{{ gpsSessionData.data.speed }}</dd>

        <dt class="col-sm-3">Distance</dt>
        <dd class="col-sm-9">{{ gpsSessionData.data.distance }}</dd>

        <dt class="col-sm-3">Climb</dt>
        <dd class="col-sm-9">{{ gpsSessionData.data.climb }}</dd>

        <dt class="col-sm-3">Descent</dt>
        <dd class="col-sm-9">{{ gpsSessionData.data.descent }}</dd>

        <dt class="col-sm-3">Pace (min)</dt>
        <dd class="col-sm-9">{{ gpsSessionData.data.paceMin }}</dd>

        <dt class="col-sm-3">Pace (max)</dt>
        <dd class="col-sm-9">{{ gpsSessionData.data.paceMax }}</dd>

        <dt class="col-sm-3">Type</dt>
        <dd class="col-sm-9">{{ gpsSessionData.data.gpsSessionType }}</dd>

        <dt class="col-sm-3">Location Count</dt>
        <dd class="col-sm-9">{{ gpsSessionData.data.gpsLocationsCount }}</dd>

        <dt class="col-sm-3">User</dt>
        <dd class="col-sm-9">{{ gpsSessionData.data.userFirstLastName }}</dd>
      </dl>
    </div>

    <div class="d-flex justify-content-end  mt-4">
      <button @click="cancel" class="btn btn-outline-secondary">Cancel</button>
    </div>

  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import type {IResultObject} from "../types/IResultObject.ts";
import type {IGpsSession} from "../domain/IGpsSession.ts";
import {GpsSessionService} from "../service/GpsSessionService.ts";
import {useRoute} from "vue-router";
import router from "../router";

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

function returnToSessionsPage(): void {
  router.push('/gps-session');
}

function cancel() {
  returnToSessionsPage();
}

onMounted(async () => {
  await fetchPageData();
});
</script>
