import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserDataStore = defineStore("userData", () => {
    const email = ref('');
    const password = ref('');

    return { email, password };
})
