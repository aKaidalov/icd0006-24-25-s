<template>
  <h1>GpsSessions</h1>

  <p>
    <RouterLink to="/gps-session-create" class="">Create New</RouterLink>
  </p>
  <table class="table">
    <thead>
    <tr>
      <th>
        Name
      </th>
      <th>
        Description
      </th>
      <th>
        RecordedAt
      </th>
      <th>
        Locations
      </th>
      <th>
        User
      </th>
      <th></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="item in gpsSessionData.data" :key="item.id">
      <td>
        {{ item.name }}
      </td>
      <td>
        {{ item.description }}
      </td>
      <td>
        {{ item.recordedAt }}
      </td>
      <td>
        {{ item.gpsLocationsCount }}
      </td>
      <td>
        {{ item.userFirstLastName }}
      </td>
      <td>
        <RouterLink :to="`/gps-session-edit/${item.id}`" class="">Edit</RouterLink> |
        <RouterLink :to="`/gps-session-details/${item.id}`" class="">Details</RouterLink> |
        <RouterLink :to="`/gps-session-delete/${item.id}`" class="">Delete</RouterLink>
      </td>
    </tr>
    </tbody>
  </table>

  {{gpsSessionData.errors}}
</template>
<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import type {IResultObject} from "../types/IResultObject.ts";
import type {IGpsSession} from "../domain/IGpsSession.ts";
import {GpsSessionService} from "../service/GpsSessionService.ts";

const requestIsOngoing = ref(false);
const gpsSessionData = reactive<IResultObject<IGpsSession[]>>({});
const gpsSessionService = new GpsSessionService();

const fetchPageData = async () => {
  requestIsOngoing.value = true;
  try{
    const result = await gpsSessionService.getAllAsync();
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
