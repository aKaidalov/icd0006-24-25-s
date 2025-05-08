<template>
  <main role="main" class="pb-3">
    <div class="row">
      <div class="col-md-4 offset-md-4">

        <h1>Create New Session</h1>

        <div v-if="error" class="alert alert-warning" role="alert">
          {{ error }}
        </div>

        <section>
          <form @submit.prevent="doCreate" id="gps-session-create" method="post" novalidate="novalidate">
            <div class="form-floating mb-3">
              <input v-model="gpsSessionName" class="form-control" id="Input_Name" aria-required="true"
                     placeholder="name" type="">
              <label class="form-label" for="Input_Name">name</label>
            </div>
            <div class="form-floating mb-3">
              <input v-model="gpsSessionDescription" class="form-control" id="Input_Description" aria-required="true"
                     placeholder="description" type="">
              <label class="form-label" for="Input_Description">description</label>
            </div>
            <div class="form-floating mb-3">
              <input v-model="gpsSessionTypeId" class="form-control" id="Input_Input_GpsSessionTypeId" aria-required="true"
                     placeholder="gpsSessionTypeId" type="">
              <label class="form-label" for="Input_GpsSessionTypeId">TypeId</label>
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

</script>
