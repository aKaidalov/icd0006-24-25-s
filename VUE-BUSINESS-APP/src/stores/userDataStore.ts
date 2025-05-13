import { ref } from "vue";
import { defineStore } from "pinia";

export const useUserDataStore = defineStore("userData", () => {
    const jwt = ref('');
    const refreshToken = ref('');
    const status = ref('');
    const firstName = ref('');
    const lastName = ref('');

    const logout = () => {
        jwt.value = '';
        refreshToken.value = '';
        status.value = '';
        firstName.value = '';
        lastName.value = '';
    }

    return { jwt, refreshToken, status, firstName, lastName, logout };
})
