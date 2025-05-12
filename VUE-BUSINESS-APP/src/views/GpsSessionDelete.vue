<template>
  <div v-if="gpsSessionData.errors" class="alert alert-warning" role="alert">
    {{ gpsSessionData.errors }}
  </div>

  <div class="container mt-4">
    <div class="card shadow-sm p-4">
      <h2 class="mb-4">Delete Session</h2>

      <p>Are you sure you want to delete the following session?</p>

      <ul class="list-group mb-4">
        <li class="list-group-item"><strong>Name:</strong> {{ gpsSessionData.data?.name }}</li>
        <li class="list-group-item"><strong>Description:</strong> {{ gpsSessionData.data?.description }}</li>
        <li class="list-group-item"><strong>Recorded At:</strong> {{ gpsSessionData.data?.recordedAt }}</li>
        <li class="list-group-item"><strong>Pace Min:</strong> {{ gpsSessionData.data?.paceMin }}</li>
        <li class="list-group-item"><strong>Pace Max:</strong> {{ gpsSessionData.data?.paceMax }}</li>
      </ul>

      <div class="d-flex justify-content-end">
        <button @click="cancel" class="btn btn-outline-secondary">Cancel</button>
        <button @click="deleteSession" class="btn btn-danger ms-2">Delete</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import router from "../router";
import type { IGpsSession } from "../domain/IGpsSession";
import type { IResultObject } from "../types/IResultObject";
import { GpsSessionService } from "../service/GpsSessionService";

const route = useRoute();
const sessionId = route.params.id as string;
const gpsSessionService = new GpsSessionService();
const gpsSessionData = reactive<IResultObject<IGpsSession>>({});
const requestIsOngoing = ref(false);

async function fetchPageData() {
  requestIsOngoing.value = true;
  try {
    const result = await gpsSessionService.getByIdAsync(sessionId);
    gpsSessionData.data = result.data;
    gpsSessionData.errors = result.errors;
  } catch (error) {
    console.error("Error fetching session data:", error);
  } finally {
    requestIsOngoing.value = false;
  }
}

async function deleteSession() {
  requestIsOngoing.value = true;
  try {
    const result = await gpsSessionService.deleteAsync(sessionId);
    gpsSessionData.errors = result.errors;

    if (!result.errors) {
      returnToSessionsPage();
    }
  } catch (error) {
    console.error("Error deleting session:", error);
  } finally {
    requestIsOngoing.value = false;
  }
}

function returnToSessionsPage(): void {
  router.push('/gps-session');
}

function cancel() {
  returnToSessionsPage();
}

onMounted(() => {
  fetchPageData();
});
</script>
