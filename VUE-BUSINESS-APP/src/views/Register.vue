<template>
  <main role="main" class="pb-3">
    <div class="row">
      <div class="col-md-4 offset-md-4">

        <h1>Register</h1>

        <div v-if="error" class="alert alert-warning" role="alert">
          {{ error }}
        </div>

        <section>
          <form @submit.prevent="doRegister" id="account" method="post" novalidate="novalidate">
            <div class="form-floating mb-3">
              <input v-model="email" class="form-control" id="Input_Email" autocomplete="username" aria-required="true"
              placeholder="name@example.com" type="email">
              <label class="form-label" for="Input_Email">Email</label>
            </div>
            <div class="form-floating mb-3">
              <input v-model="password" class="form-control" id="Input_Password" autocomplete="current-password" aria-required="true"
              placeholder="password" type="password">
              <label class="form-label" for="Input_Email">Password</label>
            </div>
            <div class="form-floating mb-3">
              <input v-model="firstName" class="form-control" id="Input_FirstName" aria-required="true"
              placeholder="firstName" type="text">
              <label class="form-label" for="Input_FirstName">First Name</label>
            </div>
            <div class="form-floating mb-3">
              <input v-model="lastName" class="form-control" id="Input_LastName" aria-required="true"
              placeholder="lastName" type="text">
              <label class="form-label" for="Input_LastName">Last Name</label>
            </div>
            <div>
              <button id="login-submit" type="submit" class="w-100 btn btn-lg btn-primary">Register</button>
            </div>
          </form>
        </section>

      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {useUserDataStore} from "../stores/userDataStore.ts";
import {IdentityService} from "../service/IdentityService.ts";
import {useRouter} from "vue-router";

const router = useRouter();
const store = useUserDataStore();

// TODO: can create an Interface or smth
const email = ref('');
const password = ref('');
const firstName = ref('');
const lastName = ref('');

const error = ref<string | null>(null);

const doRegister = async () => {
  //do register
  const response = await IdentityService.register(email.value, password.value, firstName.value, lastName.value);
  // store
  if (response.data) {
    store.jwt = response.data.token;
    store.status = response.data.status;
    store.firstName = response.data.firstName;
    store.lastName = response.data.lastName;
    await router.push({name: 'Home'});
  } else {
    error.value = response.errors?.[0] ||"Register failed.";
  }
}
</script>
