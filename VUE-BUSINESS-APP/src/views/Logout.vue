<template>
  <main role="main" class="pb-3">
    <div class="row">
      <div class="col-md-4 offset-md-4">

        <h1>Log out</h1>

        <p>Are you sure you want to log out?</p>

        <div class="d-grid gap-2">
          <button class="btn btn-danger" @click="doLogout">Logout</button>
          <RouterLink to="/" class="btn btn-outline-secondary">Cancel</RouterLink>
        </div>

      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import {useUserDataStore} from "../stores/userDataStore.ts";
import {useRouter} from "vue-router";

const userStore = useUserDataStore();
const router = useRouter();

const doLogout = () => {
  userStore.logout();
  router.push({name: 'Login'});
};
</script>
