<template>
  <header>
    <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
      <div class="container">
        <a class="navbar-brand" href="/">Sportmap</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
          <ul class="navbar-nav flex-grow-1">

            <li class="nav-item">
              <RouterLink class="nav-link text-dark" :to="{name: 'Home'}">Home</RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link text-dark" :to="{name: 'Types'}">Types</RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link text-dark" :to="{name: 'GpsSession'}">GpsSessions</RouterLink>
            </li>

            <li class="nav-item">
              <RouterLink class="nav-link text-dark" :to="{name: 'GpsLocation'}">GpsLocations</RouterLink>
            </li>
          </ul>

          <ul v-if="!useStore.jwt" class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link text-dark" :to="{name: 'Register'}">Register</RouterLink>
            </li>
            <li class="mt-2">|</li>
            <li class="nav-item">
              <RouterLink class="nav-link text-dark" :to="{name: 'Login'}">Login</RouterLink>
            </li>
          </ul>
          <ul v-else class="navbar-nav">
            <li class="nav-item">
              <RouterLink class="nav-link text-dark" :to="{name: 'Logout'}">Logout</RouterLink>
            </li>
            <li class="mt-2">|</li>
            <li class="nav-item">
              <RouterLink class="nav-link text-dark" :to="{name: 'Account'}">
                <i class="bi bi-person-circle"></i>
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import {RouterLink} from "vue-router";
import {useUserDataStore} from "../stores/userDataStore.ts";
import GpsLocation from "../views/GpsLocation.vue";

const useStore = useUserDataStore();

</script>
