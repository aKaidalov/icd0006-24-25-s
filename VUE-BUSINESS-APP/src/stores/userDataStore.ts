import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserDataStore = defineStore("userData", () => {
    const jwt = ref('');
    const refreshToken = ref('');
    const firstName = ref('');
    const lastName = ref('');

    return { jwt, refreshToken, firstName, lastName };
})
