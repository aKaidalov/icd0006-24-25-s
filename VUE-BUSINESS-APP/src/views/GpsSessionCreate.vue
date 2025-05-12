<template>
  <main role="main" class="pb-3">
    <div class="row">
      <div class="col-md-4 offset-md-4">

        <h1>Create New Session</h1>

        <div v-if="gpsSessionData.errors" class="alert alert-warning" role="alert">
          {{ gpsSessionData.errors }}
        </div>

        <section>
          <form @submit.prevent="doCreate" id="gps-session-create" method="post" novalidate="novalidate">
            <div class="form-floating mb-3">
              <input v-model="gpsSession.name" class="form-control" id="Input_Name" aria-required="true"
                     placeholder="name" type="text">
              <label class="form-label" for="Input_Name">name</label>
            </div>
            <div class="form-floating mb-3">
              <input v-model="gpsSession.description" class="form-control" id="Input_Description" aria-required="true"
                     placeholder="description" type="text">
              <label class="form-label" for="Input_Description">description</label>
            </div>
            <div class="form-floating mb-3">
              <input v-model="gpsSession.gpsSessionTypeId" class="form-control" id="Input_Input_GpsSessionTypeId" aria-required="true"
                     placeholder="gpsSessionTypeId" type="text">
              <label class="form-label" for="Input_GpsSessionTypeId">typeId</label>
            </div>
            <div>
              <button id="create-submit" type="submit" class="w-100 btn btn-lg btn-primary">Create</button>
            </div>

          </form>
        </section>

      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import type {IResultObject} from "../types/IResultObject.ts";
import type {IGpsSession} from "../domain/IGpsSession.ts";
import {GpsSessionService} from "../service/GpsSessionService.ts";
import type {IGpsSessionRequest} from "../domain/IGpsSessionRequest.ts";
import router from "../router";

const requestIsOngoing = ref(false);
const gpsSessionData = reactive<IResultObject<IGpsSession>>({});
const gpsSessionService = new GpsSessionService();

const gpsSession = reactive<IGpsSessionRequest>({
  name: '',
  description: '',
  gpsSessionTypeId: ''
});

const postGpsSession = async () => {
  requestIsOngoing.value = true;
  try{
    const result = await gpsSessionService.addAsync(gpsSession);
    console.log(result.data);

    gpsSessionData.data = result.data;
    gpsSessionData.errors = result.errors;

    // await router.push(`/gps-session-edit/${result.data?.id}`)
    await router.push(`/gps-session-delete/${result.data?.id}`)

  } catch(error){
    console.error('Error fetching data: ', error);
  } finally {
    requestIsOngoing.value = false;
  }
}

const doCreate = async () => {
  await postGpsSession();
}
</script>
