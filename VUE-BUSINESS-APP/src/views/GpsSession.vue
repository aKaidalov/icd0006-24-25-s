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
    <div class="d-flex justify-content-between align-items-center mt-3">

      <div class="col-md-3">
        <select v-model="filters.ownSessionsOnly" class="form-select">
          <option :value="false">All Sessions</option>
          <option v-if="store.jwt" :value="true">My Sessions</option>
        </select>
      </div>

      <div class="d-flex">
        <button class="btn btn-outline-secondary btn-sm me-2" @click="resetFilters">Reset</button>
        <button class="btn btn-primary btn-sm" @click="fetchFilteredData">Filter</button>
      </div>
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
    <tr v-for="item in paginatedData" :key="item.id">
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
          <i class="bi bi-geo-alt"></i>
        </RouterLink>
      </td>
      <td>{{ item.name }}</td>
      <td>{{ item.description }}</td>
      <td>{{ formatDate(item.recordedAt) }}</td>
      <td>{{ item.gpsLocationsCount }}</td>
      <td>{{ item.userFirstLastName }}</td>
      <td class="text-center align-middle">
        <RouterLink v-if="item.userFirstLastName.trim().toLowerCase() === currentUserFullName?.toLowerCase()"
            :to="{path: `/gps-session-edit/${item.id}`, query: route.query}" class="text-warning mx-1">
          <i class="bi bi-pencil"></i>
        </RouterLink>
        <RouterLink :to="{path: `/gps-session-details/${item.id}`, query: route.query}" class="mx-1">
          <i class="bi bi-info-circle"></i>
        </RouterLink>
        <RouterLink v-if="item.userFirstLastName.trim().toLowerCase() === currentUserFullName?.toLowerCase()"
            :to="{path: `/gps-session-delete/${item.id}`, query: route.query}" class="text-danger mx-1">
          <i class="bi bi-trash"></i>
        </RouterLink>
      </td>
    </tr>
    </tbody>
  </table>

  <!-- Pagination -->
  <Pagination
      v-model="currentPage"
      :items-per-page="itemsPerPage"
      :total-items="totalItems"
  />
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from "vue";
import {GpsSessionService} from "../service/GpsSessionService.ts";
import type {IResultObject} from "../types/IResultObject.ts";
import type {IGpsSession} from "../domain/IGpsSession.ts";
import {useRoute, useRouter} from "vue-router";
import {useUserDataStore} from "../stores/userDataStore.ts";
import {jwtDecode} from "jwt-decode";
import Pagination from '../components/Pagination.vue'

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


// Pagination
const paginationFilters = {
  defaultStartPage: 1,
  defaultItemsPerPage: 5
}

const currentPage = ref(paginationFilters.defaultStartPage);
const itemsPerPage = ref(paginationFilters.defaultItemsPerPage);

const paginatedData = computed(() => {
  if (!gpsSessionData.data) return [];
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return gpsSessionData.data.slice(start, end);
})

const totalItems = computed(() => gpsSessionData.data?.length || 0)

watch(currentPage, (newPage) => {
  router.replace({
    query: {
      ...route.query,
      currentPage: newPage.toString()
    }
  });
});

watch(() => route.query.refresh, async (val) => {
  if (val === 'true') {
    await fetchFilteredData();
  }
});


// Page data
async function fetchFilteredData() {
  requestIsOngoing.value = true;
  try {

    await router.push({
      query: {
        ...route.query,
        //Filters
        minLocationsCount: filters.minLocationsCount.toString(),
        minDuration: filters.minDuration.toString(),
        minDistance: filters.minDistance.toString(),
        fromDateTime: filters.fromDateTime,
        toDateTime: filters.toDateTime,
        ownSessionsOnly: filters.ownSessionsOnly.toString(),
        //Pagination
        currentPage: currentPage.value,
        refresh: 'false', //To change when creating session to change url so pagination use updated data
        //Search
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
    gpsSessionData.data = [...(filteredGpsSessions.data ?? [])];
    gpsSessionData.errors = result.errors;

    // filter by user data
    if (filters.ownSessionsOnly && currentUserFullName.value) {
      gpsSessionData.data = gpsSessionData.data.filter(
          s => s.userFirstLastName?.trim().toLowerCase() === currentUserFullName.value?.toLowerCase()
      );
    }

    await handleSearch();
    // clearSearch();

  } catch (error) {
    console.error("Error fetching filtered data", error);
  } finally {
    requestIsOngoing.value = false;
  }
}


// Filter TODO: should be refactored
const getDefaultFilters = () => {
  const toISOStringLocal = (date: Date) => date.toISOString().slice(0, 16);

  return {
    minLocationsCount: 0, //10
    minDuration: 0, //60
    minDistance: 0, //10
    fromDateTime: toISOStringLocal(new Date('2020-01-01T00:00:00.000Z')),
    toDateTime: toISOStringLocal(new Date(Date.now() + 3 * 60 * 60 * 1000)), // UTC+3
    ownSessionsOnly: false,
  };
}

const defaultFilters = getDefaultFilters()

const filters = reactive({
  minLocationsCount: defaultFilters.minLocationsCount,
  minDuration: defaultFilters.minDuration,
  minDistance: defaultFilters.minDistance,
  fromDateTime: defaultFilters.fromDateTime,
  toDateTime: defaultFilters.toDateTime,
  ownSessionsOnly: defaultFilters.ownSessionsOnly,
});

function initFiltersFromQuery() {
  // Filters
  filters.minLocationsCount = route.query.minLocationsCount ? parseInt(route.query.minLocationsCount as string) : defaultFilters.minLocationsCount;
  filters.minDuration = route.query.minDuration ? parseInt(route.query.minDuration as string) : defaultFilters.minDuration;
  filters.minDistance = route.query.minDistance ? parseInt(route.query.minDistance as string) : defaultFilters.minDistance;
  filters.fromDateTime = (route.query.fromDateTime as string) || defaultFilters.fromDateTime;
  filters.toDateTime = (route.query.toDateTime as string) || defaultFilters.toDateTime;
  filters.ownSessionsOnly = route.query.ownSessionsOnly === 'true';

  // Pagination
  currentPage.value = parseInt(route.query.currentPage as string) || paginationFilters.defaultStartPage

  // Search
  if (route.query.search) searchTerm.value = route.query.search as string;
}

function resetFilters() {
  const defaults = getDefaultFilters();

  filters.minLocationsCount = defaults.minLocationsCount;
  filters.minDuration = defaults.minDuration;
  filters.minDistance = defaults.minDistance;
  filters.fromDateTime = defaults.fromDateTime;
  filters.toDateTime = defaults.toDateTime;

  // filters.ownSessionsOnly = defaultFilters.ownSessionsOnly;

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

onMounted(async () => {
  initFiltersFromQuery();
  await fetchFilteredData();
});
</script>
