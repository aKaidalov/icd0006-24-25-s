<template>

  <div v-if="gpsSessionData.errors" class="alert alert-warning mt-3">
    {{ gpsSessionData.errors }}
  </div>

  <h1>
    <span>GpsSessions</span>
    <RouterLink v-if="currentUserId" :to="{name: 'GpsSessionCreate', query: route.query}" class="btn btn-success btn-sm ms-2">+</RouterLink>
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
      <button class="btn btn-outline-secondary btn-sm me-2" @click="resetFilters">Reset</button>
      <button class="btn btn-primary btn-sm" @click="fetchFilteredData">Filter</button>
    </div>
  </div>

<!-- Search bar-->
  <div class="mb-4 d-flex align-items-end gap-2">
    <div class="flex-grow-1">
      <input v-model="searchTerm" type="text" class="form-control" placeholder="Search by name, description, locations or user..." />
    </div>
    <button class="btn btn-outline-primary" @click="handleSearch">Search</button>
    <button class="btn btn-outline-secondary" @click="clearAndResetSearch">Clear</button>
  </div>

  <!-- Table -->
  <table class="table">
    <thead>
    <tr>
      <th></th>
      <th @click="sortBy('name')">
        <span v-if="sortState.column === 'name'">
          {{ sortState.ascending ? '↑' : '↓' }}
        </span>
        <span>Name</span>
      </th>

      <th @click="sortBy('description')">
        <span v-if="sortState.column === 'description'">
          {{ sortState.ascending ? '↑' : '↓' }}
        </span>
        <span>Description</span>
      </th>

      <th @click="sortBy('recordedAt')">
        <span v-if="sortState.column === 'recordedAt'">
          {{ sortState.ascending ? '↑' : '↓' }}
        </span>
        <span>Recorded</span>
      </th>

      <th @click="sortBy('gpsLocationsCount')">
        <span v-if="sortState.column === 'gpsLocationsCount'">
          {{ sortState.ascending ? '↑' : '↓' }}
        </span>
        <span>Locations</span>
      </th>

      <th @click="sortBy('userFirstLastName')">
        <span v-if="sortState.column === 'userFirstLastName'">
          {{ sortState.ascending ? '↑' : '↓' }}
        </span>
        <span>User</span>
      </th>
      <th></th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="item in gpsSessionData.data" :key="item.id">
      <td>
        <RouterLink
            :to="{
              name: 'GpsLocationsSession',
              params: { gpsSessionId: item.id },
              query: route.query
            }"
            title="View Locations"
            class="text-primary ms-2"
        >
          <i class="bi bi-geo-alt-fill"></i>
        </RouterLink>
      </td>
      <td>{{ item.name }}</td>
      <td>{{ item.description }}</td>
      <td>{{ formatDate(item.recordedAt) }}</td>
      <td>{{ item.gpsLocationsCount }}</td>
      <td>{{ item.userFirstLastName }}</td>
      <td>
        <RouterLink v-if="item.userFirstLastName.trim().toLowerCase() === currentUserFullName?.toLowerCase()"
            :to="{path: `/gps-session-edit/${item.id}`, query: route.query}" class="text-warning"> Edit |</RouterLink>
        <RouterLink :to="{path: `/gps-session-details/${item.id}`, query: route.query}"> Details </RouterLink>
        <RouterLink v-if="item.userFirstLastName.trim().toLowerCase() === currentUserFullName?.toLowerCase()"
            :to="{path: `/gps-session-delete/${item.id}`, query: route.query}" class="text-danger">| Delete </RouterLink>
      </td>
    </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref} from "vue";
import {GpsSessionService} from "../service/GpsSessionService.ts";
import type {IResultObject} from "../types/IResultObject.ts";
import type {IGpsSession} from "../domain/IGpsSession.ts";
import {useRoute, useRouter} from "vue-router";
import {useUserDataStore} from "../stores/userDataStore.ts";
import {jwtDecode} from "jwt-decode";

const route = useRoute();
const router = useRouter();

const gpsSessionService = new GpsSessionService();
const gpsSessionData = reactive<IResultObject<IGpsSession[]>>({});
const filteredGpsSessions = reactive<IResultObject<IGpsSession[]>>({});
const requestIsOngoing = ref(false);

// Identify User
const store = useUserDataStore()
const currentUserId = computed(() => {
  if (!store.jwt) return null
  const decoded: any = jwtDecode(store.jwt)
  // console.log('Decoded JWT:', decoded)
  return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
})

const currentUserFullName = computed(() => {
  if (!store.jwt) return null
  const decoded: any = jwtDecode(store.jwt)
  const firstName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"]
  const lastName = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"]
  return `${firstName} ${lastName}`.trim()
})

// console.log("!" + currentUserFullName.value + "!")


async function fetchFilteredData() {
  requestIsOngoing.value = true;
  try {

    await router.push({
      query: {
        ...route.query,
        minLocationsCount: filters.minLocationsCount.toString(),
        minDuration: filters.minDuration.toString(),
        minDistance: filters.minDistance.toString(),
        fromDateTime: filters.fromDateTime,
        toDateTime: filters.toDateTime,
        search: searchTerm.value || undefined,
      }
    });

    const result = await gpsSessionService.getFilteredAsync({
      minLocationsCount: filters.minLocationsCount,
      minDuration: filters.minDuration,
      minDistance: filters.minDistance,
      fromDateTime: filters.fromDateTime,
      toDateTime: filters.toDateTime
    });

    filteredGpsSessions.data = result.data;
    gpsSessionData.data = [...filteredGpsSessions.data];
    gpsSessionData.errors = result.errors;

    await handleSearch();
    // clearSearch();

  } catch (error) {
    console.error("Error fetching filtered data", error);
  } finally {
    requestIsOngoing.value = false;
  }
}


// Filter
const filters = reactive({
  minLocationsCount: 10,
  minDuration: 60,
  minDistance: 10,
  fromDateTime: '',
  toDateTime: ''
});

function initFiltersFromQuery() {
  const toISOStringLocal = (date: Date) => date.toISOString().slice(0, 16);

  const fromDateDefault = toISOStringLocal(new Date('2020-01-01T00:00:00.000Z'));
  const toDateCurrent = toISOStringLocal(new Date(Date.now() + 3 * 60 * 60 * 1000)); // UTC + 3h

  filters.minLocationsCount = route.query.minLocationsCount ? parseInt(route.query.minLocationsCount as string) : 0; //10
  filters.minDuration = route.query.minDuration ? parseInt(route.query.minDuration as string) : 0; //60
  filters.minDistance = route.query.minDistance ? parseInt(route.query.minDistance as string) : 0; //10
  filters.fromDateTime = (route.query.fromDateTime as string) || fromDateDefault;
  filters.toDateTime = (route.query.toDateTime as string) || toDateCurrent;

  if (route.query.search) searchTerm.value = route.query.search as string;
}

function getDefaultFilters() {
  const toISOStringLocal = (date: Date) => date.toISOString().slice(0, 16);

  return {
    minLocationsCount: 10,
    minDuration: 60,
    minDistance: 10,
    fromDateTime: toISOStringLocal(new Date('2020-01-01T00:00:00.000Z')),
    toDateTime: toISOStringLocal(new Date(Date.now() + 3 * 60 * 60 * 1000)) // UTC+3
  };
}

function resetFilters() {
  const defaults = getDefaultFilters();

  filters.minLocationsCount = defaults.minLocationsCount;
  filters.minDuration = defaults.minDuration;
  filters.minDistance = defaults.minDistance;
  filters.fromDateTime = defaults.fromDateTime;
  filters.toDateTime = defaults.toDateTime;

  router.replace({ query: {} });
  fetchFilteredData();
}


// Search
const searchTerm = ref("");
const isNumeric = (term: string): boolean => /^\d+$/.test(term);

async function handleSearch() {
  const term = searchTerm.value.trim();
  if (!term) {
    return;
  }

  // Update path
  await router.push({
    query: {
      ...route.query,
      search: term
    }
  });

  if (isNumeric(term) ) {
    console.log(`HEYYYYYY Search term is numeric: ${term}`);
    const numericValue = Number(term);
    gpsSessionData.data = filteredGpsSessions.data?.filter(item =>
        item.gpsLocationsCount === numericValue ||
        item.name.toLowerCase().includes(term) ||
        item.description?.toLowerCase().includes(term) ||
        item.userFirstLastName?.toLowerCase().includes(term)
    ) ?? []
  } else {
    gpsSessionData.data = filteredGpsSessions.data?.filter(item =>
        item.name.toLowerCase().includes(term.toLowerCase()) ||
        item.description?.toLowerCase().includes(term.toLowerCase()) ||
        item.userFirstLastName?.toLowerCase().includes(term.toLowerCase())
    ) ?? [];
  }
}

function clearSearch() {
  searchTerm.value = '';
}

function clearAndResetSearch() {
  clearSearch();
  fetchFilteredData();
}


// Sorting
const sortState = reactive({
  column: '',
  ascending: true,
});


function sortBy(column: keyof IGpsSession) {
  if (sortState.column === column) {
    sortState.ascending = !sortState.ascending;
  } else {
    sortState.column = column;
    sortState.ascending = true;
  }

  // Black magic
  gpsSessionData.data?.sort((a, b) => {
    const valA = a[column];
    const valB = b[column];

    if (valA == null) return 1;
    if (valB == null) return -1;

    const direction = sortState.ascending ? 1 : -1;

    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * direction;
    }

    return String(valA).localeCompare(String(valB)) * direction;
  })
}

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
  initFiltersFromQuery();
  await fetchFilteredData();
});
</script>
