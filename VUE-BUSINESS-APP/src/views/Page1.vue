<template>
  <div>Request is {{ requestIsOngoing == true ? 'ongoing' : 'done' }}</div>

  <div v-if="data.data">
    <table border="1">
      <tr v-for="(item, index) in data.data" :key="index">
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.description }}</td>
      </tr>
    </table>
  </div>


  {{data.errors}}

</template>

<script setup lang="ts">

import { GpsLocationTypeService } from "../service/GpsLocationTypeService.ts";
import {onMounted, reactive, ref} from "vue";
import type {IResultObject} from "../types/IResultObject.ts";
import type {IGpsLocationType} from "../domain/IGpsLocationType.ts";

const requestIsOngoing = ref(false);
const data = reactive<IResultObject<IGpsLocationType[]>>({});

const fetchPageData = async () => {
  requestIsOngoing.value = true;
  try{
    const result = await GpsLocationTypeService.getAllAsync();
    console.log(result.data);

    data.data = result.data;
    data.errors = result.errors;

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
