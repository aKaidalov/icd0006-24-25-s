<template>
  <main role="main" class="pb-3">
    <div class="row">
      <div class="col-md-4 offset-md-4">

        <h1>Log in</h1>

        <div v-if="error" class="alert alert-warning" role="alert">
          {{ error }}
        </div>

        <section>
          <form @submit.prevent="doLogin" id="account" method="post" novalidate="novalidate">
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
            <div>
              <button id="login-submit" type="submit" class="w-100 btn btn-lg btn-primary">Log in</button>
            </div>
            <div>
              <p>
                <a id="forgot-password" href="/Identity/Account/ForgotPassword">Forgot your password?</a>
              </p>
              <p>
                <a href="/Identity/Account/Register?returnUrl=%2F">Register as a new user</a>
              </p>
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

const store = useUserDataStore;

const error = ref<string | null>(null);
const email = ref('');
const password = ref('');

const doLogin = async () => {
  //do login
  const response = await IdentityService.login(email.value, password.value);
  // store
  console.log(response);
}
</script>
