<template>
  <div v-if="gpsSessionData.errors" class="alert alert-warning" role="alert">
    {{ gpsSessionData.errors }}
  </div>

  <div class="container mt-4">
    <div class="card shadow-sm p-4">
      <h2 class="mb-4">Edit Session</h2>

      <form @submit.prevent="save">
        <div class="row mb-3">
          <label class="col-sm-3 col-form-label fw-bold">Name</label>
          <div class="col-sm-9">
            <input v-model="form.name" type="text" class="form-control" />
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-sm-3 col-form-label fw-bold">Description</label>
          <div class="col-sm-9">
            <textarea v-model="form.description" rows="3" class="form-control" />
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-sm-3 col-form-label fw-bold">Recorded At</label>
          <div class="col-sm-9">
            <input v-model="form.recordedAt" type="text" class="form-control" />
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-sm-3 col-form-label fw-bold">Pace Min</label>
          <div class="col-sm-9">
            <input v-model.number="form.paceMin" type="number" class="form-control" />
          </div>
        </div>

        <div class="row mb-3">
          <label class="col-sm-3 col-form-label fw-bold">Pace Max</label>
          <div class="col-sm-9">
            <input v-model.number="form.paceMax" type="number" class="form-control" />
          </div>
        </div>

        <!--Dropdown-->
        <div class="row mb-4">
          <label class="col-sm-3 col-form-label fw-bold">Session Type</label>
          <div class="col-sm-9">
            <select v-model="form.gpsSessionTypeId" class="form-select">
              <option disabled value="">Please select a session type</option>
              <option v-for="type in gpsSessionTypeData.data" :key="type.id" :value="type.id">
                {{ type.name }}
              </option>
            </select>
          </div>
        </div>


        <div class="row">
          <div class="offset-sm-3 col-sm-9 d-flex justify-content-end">
            <button type="button" @click="cancel" class="btn btn-outline-secondary">Cancel</button>
            <button type="submit" class="btn btn-warning ms-2">Save</button>
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
import {useRoute} from "vue-router";
import router from "../router";
import type {IGpsSessionType} from "../domain/IGpsSessionType.ts";
import {GpsSessionTypeService} from "../service/GpsSessionTypeService.ts";

const requestIsOngoing = ref(false);
const gpsSessionData = reactive<IResultObject<IGpsSession>>({});
const gpsSessionService = new GpsSessionService();

const route = useRoute()
const sessionId = route.params.id as string

// TODO: can create an Interface or smth
const form = ref({
  id: '',
  name: '',
  description: '',
  recordedAt: '',
  paceMin: 0,
  paceMax: 0,
  gpsSessionTypeId: ''
})

// Edit
const fetchPageData = async () => {
  requestIsOngoing.value = true;
  try{
    const result = await gpsSessionService.getByIdAsync(sessionId);
    console.log(result.data);

    gpsSessionData.data = result.data;
    gpsSessionData.errors = result.errors;

    const typeNameObj = JSON.parse(result.data.gpsSessionType);
    const typeName = typeNameObj?.en;

    const matchedType = gpsSessionTypeData.data?.find(type => type.name === typeName);

    if (result.data) {
      form.value = {
        id: sessionId,
        name: result.data.name,
        description: result.data.description,
        recordedAt: result.data.recordedAt,
        paceMin: result.data.paceMin,
        paceMax: result.data.paceMax,
        // gpsSessionType: result.data.gpsSessionType
        gpsSessionTypeId: matchedType?.id?.toString() ?? ''
      };
    }
  } catch(error){
    console.error('Error fetching data: ', error);
  } finally {
    requestIsOngoing.value = false;
  }
};

function returnToSessionsPage(): void {
  router.push('/gps-session')
}

function cancel() {
  returnToSessionsPage()
}

async function save() {
  requestIsOngoing.value = true;
  try{
    const result = await gpsSessionService.updateAsync(sessionId, form.value);
    console.log(result.data);

    gpsSessionData.errors = result.errors;

    console.log('Saving session:', form.value)
    // returnToSessionsPage()

  } catch(error){
    console.error('Error fetching data: ', error);
  } finally {
    requestIsOngoing.value = false;
  }
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
  await Promise.all([
      fetchPageData(),
      fetchSessionTypes()
  ]);
});
</script>
