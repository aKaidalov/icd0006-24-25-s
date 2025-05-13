<template>
  <div class="container mt-4">
    <div class="card shadow-sm p-4">
      <h2 class="mb-4">My Profile</h2>
      <dl class="row">
        <dt class="col-sm-3">First Name</dt>
        <dd class="col-sm-9">{{ store.firstName }}</dd>

        <dt class="col-sm-3">Last Name</dt>
        <dd class="col-sm-9">{{ store.lastName }}</dd>

        <dt class="col-sm-3">Status</dt>
        <dd class="col-sm-9">{{ status || 'N/A' }}</dd>

        <dt class="col-sm-3">JWT</dt>
        <dd class="col-sm-9 text-break">{{ store.jwt || 'No token' }}</dd>

        <dt class="col-sm-3">Refresh Token</dt>
        <dd class="col-sm-9 text-break">{{ store.refreshToken || 'No refresh token' }}</dd>
      </dl>
    </div>

    <div class="d-flex justify-content-end mt-4 gap-2">
      <RouterLink to="/" class="btn btn-outline-secondary">Cancel</RouterLink>
      <RouterLink to="#" class="btn btn-outline-primary">Edit Profile</RouterLink>
      <button @click="logout" class="btn btn-danger">Logout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserDataStore } from "../stores/userDataStore";
import { useRouter } from "vue-router";
import { computed } from "vue";

const store = useUserDataStore();
const router = useRouter();

const status = computed(() => store.status);

const logout = () => {
  store.logout();
  router.push({name: 'Login'});
}

</script>
