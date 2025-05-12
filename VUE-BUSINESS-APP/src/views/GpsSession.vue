<template>

  <div v-if="gpsSessionData.errors" class="alert alert-warning mt-3">
    {{ gpsSessionData.errors }}
  </div>

  <h1>
    <span>GpsSessions</span>
    <RouterLink to="/gps-session-create" class="btn btn-success btn-sm ms-2">+</RouterLink>
  </h1>

  <!-- Filter bar -->
  <div class="card p-3 mb-4 shadow-sm">
    <div class="row g-3 align-items-end">
      <div class="col-md-2">
        <label class="form-label">Min Locations</label>
        <input v-model.number="filters.minLocationsCount" type="number" class="form-control" />
      </div>
      <div class="col-md-2">
        <label class="form-label">Min Duration</label>
        <input v-model.number="filters.minDuration" type="number" class="form-control" />
      </div>
      <div class="col-md-2">
        <label class="form-label">Min Distance</label>
        <input v-model.number="filters.minDistance" type="number" class="form-control" />
      </div>
      <div class="col-md-3">
        <label class="form-label">From Date</label>
        <input v-model="filters.fromDateTime" type="datetime-local" class="form-control" />
      </div>
      <div class="col-md-3">
        <label class="form-label">To Date</label>
        <input v-model="filters.toDateTime" type="datetime-local" class="form-control" />
      </div>
    </div>
    <div class="d-flex justify-content-end mt-3">
      <button class="btn btn-secondary btn-sm me-2" @click="resetFilters">Reset</button>
      <button class="btn btn-primary btn-sm" @click="fetchFilteredData">Filter</button>
    </div>
  </div>

  <!-- Table -->
  <table class="table">
    <thead>
    <tr>
      <th>Name</th>
      <th>Description</th>
      <th>RecordedAt</th>
      <th>Locations</th>
      <th>User</th>
      <th></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="item in gpsSessionData.data" :key="item.id">
      <td>{{ item.name }}</td>
      <td>{{ item.description }}</td>
      <td>{{ formatDate(item.recordedAt) }}</td>
      <td>{{ item.gpsLocationsCount }}</td>
      <td>{{ item.userFirstLastName }}</td>
      <td>
        <RouterLink :to="`/gps-session-edit/${item.id}`" class="text-warning">Edit</RouterLink> |
        <RouterLink :to="`/gps-session-details/${item.id}`">Details</RouterLink> |
        <RouterLink :to="`/gps-session-delete/${item.id}`" class="text-danger">Delete</RouterLink>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {GpsSessionService} from "../service/GpsSessionService.ts";
import type {IResultObject} from "../types/IResultObject.ts";
import type {IGpsSession} from "../domain/IGpsSession.ts";

const gpsSessionService = new GpsSessionService();
const gpsSessionData = reactive<IResultObject<IGpsSession[]>>({});
const requestIsOngoing = ref(false);

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString("et-EE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function getDefaultFilters() {
  const fromDate = new Date('2020-01-01T00:00:00.000Z');
  const toDate = new Date(Date.now() + 3 * 60 * 60 * 1000);

  const toISOStringLocal = (date: Date) => date.toISOString().slice(0, 16);

  return {
    minLocationsCount: 10,
    minDuration: 60,
    minDistance: 10,
    fromDateTime: toISOStringLocal(fromDate),
    toDateTime: toISOStringLocal(toDate)
  };
}


const filters = reactive(getDefaultFilters());

function resetFilters() {
  const defaults = getDefaultFilters();
  filters.minLocationsCount = defaults.minLocationsCount;
  filters.minDuration = defaults.minDuration;
  filters.minDistance = defaults.minDistance;
  filters.fromDateTime = defaults.fromDateTime;
  filters.toDateTime = defaults.toDateTime;

  fetchFilteredData();
}

async function fetchFilteredData() {
  requestIsOngoing.value = true;
  try {
    const result = await gpsSessionService.getFilteredAsync({
      minLocationsCount: filters.minLocationsCount,
      minDuration: filters.minDuration,
      minDistance: filters.minDistance,
      fromDateTime: filters.fromDateTime,
      toDateTime: filters.toDateTime
    });
    gpsSessionData.data = result.data;
    gpsSessionData.errors = result.errors;
  } catch (error) {
    console.error("Error fetching filtered data", error);
  } finally {
    requestIsOngoing.value = false;
  }
}


// const fetchPageData = async () => {
//   requestIsOngoing.value = true;
//   try{
//     const result = await gpsSessionService.getAllAsync();
//     console.log(result.data);
//
//     gpsSessionData.data = result.data;
//     gpsSessionData.errors = result.errors;
//
//   } catch(error){
//     console.error('Error fetching data: ', error);
//   } finally {
//     requestIsOngoing.value = false;
//   }
// };

onMounted(async () => {
  await fetchFilteredData();
});
</script>
