<template>
  <div v-if="gpsSessionData.errors" class="alert alert-warning" role="alert">
    {{ gpsSessionData.errors }}
  </div>

  <div class="container mt-4">
    <div class="card shadow-sm p-4">
      <h2 class="mb-4">Create New GpsSession</h2>

      <form @submit.prevent="doCreate">
        <div class="row mb-3">
          <label for="Input_Name" class="col-sm-3 col-form-label fw-bold">Name</label>
          <div class="col-sm-9">
            <input v-model="gpsSession.name" id="Input_Name" type="text" class="form-control" />
          </div>
        </div>

        <div class="row mb-3">
          <label for="Input_Description" class="col-sm-3 col-form-label fw-bold">Description</label>
          <div class="col-sm-9">
            <input v-model="gpsSession.description" id="Input_Description" type="text" class="form-control" />
          </div>
        </div>

        <!--Dropdown-->
        <div class="row mb-3">
          <label for="Input_GpsSessionTypeId" class="col-sm-3 col-form-label fw-bold">Session Type</label>
          <div class="col-sm-9">
            <select v-model="gpsSession.gpsSessionTypeId" id="Input_GpsSessionTypeId" class="form-select">
              <option disabled value="">Please select a session type</option>
              <option v-for="type in gpsSessionTypeData.data" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>>
            </select>
          </div>
        </div>

        <div class="row mb-3">
          <label for="Input_RecordedAt" class="col-sm-3 col-form-label fw-bold">Recorded At</label>
          <div class="col-sm-9">
            <input v-model="gpsSession.recordedAt" id="Input_RecordedAt" type="datetime-local" class="form-control" />
          </div>
        </div>

        <div class="row mb-3">
          <label for="Input_PaceMin" class="col-sm-3 col-form-label fw-bold">Pace Min</label>
          <div class="col-sm-9">
            <input v-model.number="gpsSession.paceMin" id="Input_PaceMin" type="number" class="form-control" />
          </div>
        </div>

        <div class="row mb-4">
          <label for="Input_PaceMax" class="col-sm-3 col-form-label fw-bold">Pace Max</label>
          <div class="col-sm-9">
            <input v-model.number="gpsSession.paceMax" id="Input_PaceMax" type="number" class="form-control" />
          </div>
        </div>

        <div class="row">
          <div class="offset-sm-3 col-sm-9 d-flex justify-content-end">
            <button type="button" class="btn btn-outline-secondary" @click="cancel">Cancel</button>
            <button type="submit" class="btn btn-success ms-2">Create</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import type {IResultObject} from "../types/IResultObject.ts";
import type {IGpsSession} from "../domain/IGpsSession.ts";
import {GpsSessionService} from "../service/GpsSessionService.ts";
import type {IGpsSessionRequest} from "../domain/IGpsSessionRequest.ts";
import router from "../router";
import type {IGpsSessionType} from "../domain/IGpsSessionType.ts";
import {GpsSessionTypeService} from "../service/GpsSessionTypeService.ts";

const requestIsOngoing = ref(false);
const gpsSessionData = reactive<IResultObject<IGpsSession>>({});
const gpsSessionService = new GpsSessionService();

// TODO: change to IGpsSessionCreateRequest?
const gpsSession = reactive<IGpsSessionRequest>({
  name: '',
  description: '',
  gpsSessionTypeId: '',
  recordedAt: '',
  paceMin: 60,
  paceMax: 61,
});

// POST GpsSession
const postGpsSession = async () => {
  requestIsOngoing.value = true;
  try{
    const result = await gpsSessionService.addAsync(gpsSession);
    console.log(result.data);

    gpsSessionData.data = result.data;
    gpsSessionData.errors = result.errors;

    // await router.push(`/gps-session-edit/${result.data?.id}`)
    // await router.push(`/gps-session-delete/${result.data?.id}`)

    returnToSessionsPage();

  } catch(error){
    console.error('Error fetching data: ', error);
  } finally {
    requestIsOngoing.value = false;
  }
}

const doCreate = async () => {
  await postGpsSession();
}

function returnToSessionsPage(): void {
  router.push({name: 'GpsSession'});
}

function cancel() {
  returnToSessionsPage();
}

// GET GpsSessionTypes
const gpsSessionTypeData = reactive<IResultObject<IGpsSessionType[]>>({});
const gpsSessionTypeService = new GpsSessionTypeService();

const fetchSessionTypes = async () => {
  requestIsOngoing.value = true;
  try {
    const result = await gpsSessionTypeService.getAllAsync();
    gpsSessionTypeData.data = result.data;
    gpsSessionTypeData.errors = result.errors;
  } catch (e) {
    console.error("Error fetching session types:", e);
  } finally {
    requestIsOngoing.value = false;
  }
}

onMounted(async () => {
  await fetchSessionTypes();
})
</script>
