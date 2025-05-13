<template>
  <div v-if="requestIsOngoing">Request is {{ requestIsOngoing == true ? 'ongoing' : 'done' }}</div>

  <div v-if="locationTypeData.data">
    <h2>GpsLocationTypes</h2>
    <table class="table">
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>description</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in locationTypeData.data" :key="index">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="sessionTypeData.data">
    <h2>GpsLocationTypes</h2>
    <table class="table">
      <thead>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>description</th>
          <th>paceMin</th>
          <th>paceMax</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in sessionTypeData.data" :key="index">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.paceMin }}</td>
          <td>{{ item.paceMax }}</td>
        </tr>
      </tbody>
    </table>
  </div>


  {{locationTypeData.errors}}
  {{sessionTypeData.errors}}

</template>

<script setup lang="ts">
import { GpsLocationTypeService } from "../service/GpsLocationTypeService.ts";
import {onMounted, reactive, ref} from "vue";
import type {IResultObject} from "../types/IResultObject.ts";
import type {IGpsLocationType} from "../domain/IGpsLocationType.ts";
import type {IGpsSessionType} from "../domain/IGpsSessionType.ts";
import {GpsSessionTypeService} from "../service/GpsSessionTypeService.ts";

const requestIsOngoing = ref(false);

// Location
const locationTypeData = reactive<IResultObject<IGpsLocationType[]>>({});
const gpsLocationTypeService = new GpsLocationTypeService();

// Session
const sessionTypeData = reactive<IResultObject<IGpsSessionType[]>>({});
const gpsSessionTypeService = new GpsSessionTypeService();

const fetchPageData = async () => {
  requestIsOngoing.value = true;
  try{
    // Location
    const locationTypeServiceResult = await gpsLocationTypeService.getAllAsync();
    console.log(locationTypeServiceResult.data);

    locationTypeData.data = locationTypeServiceResult.data;
    locationTypeData.errors = locationTypeServiceResult.errors;

    // Session
    const sessionTypeServiceResult = await gpsSessionTypeService.getAllAsync();
    console.log(locationTypeServiceResult.data);

    sessionTypeData.data = sessionTypeServiceResult.data;
    sessionTypeData.errors = sessionTypeServiceResult.errors;

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

<style scoped></style>
