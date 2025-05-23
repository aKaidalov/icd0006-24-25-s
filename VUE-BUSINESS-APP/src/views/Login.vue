<template>
  <main role="main" class="pb-3">
    <div class="row">
      <div class="col-md-4 offset-md-4">

        <h1>Log in</h1>

        <div v-if="error" class="alert alert-warning" role="alert">
          {{ error }}
        </div>

        <section>
          <form @submit.prevent="doLogin" id="account" method="post">
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
            <div class="form-floating mt-3">
              <p>
                <a id="forgot-password" href="/Identity/Account/ForgotPassword">Forgot your password?</a>
              </p>
              <p>
                <RouterLink class="btn-link" to="/account/register">Register as a new user</RouterLink>
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
import {RouterLink, useRouter} from "vue-router";

const router = useRouter();
const store = useUserDataStore();

const email = ref('');
const password = ref('');
const error = ref<string | null>(null);

const doLogin = async () => {
  //do login
  const response = await IdentityService.login(email.value, password.value);
  // store
  if (response.data) {
    store.jwt = response.data.token;
    store.status = response.data.status;
    store.firstName = response.data.firstName;
    store.lastName = response.data.lastName;
    await router.push({name: 'Home'});
  } else {
    error.value = response.errors?.[0] ||"Login failed.";
  }
}
</script>
