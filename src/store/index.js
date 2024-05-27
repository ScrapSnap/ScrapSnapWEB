import { defineStore } from 'pinia';
import { ref } from "vue";
import axios from "@/axios";

export const useStore = defineStore('app', () => {
    const token = ref(null)
    const user = ref(null)
    const loggedIn = ref(false)
    const userPermissions = ref([])

    // actions
    const login = (newToken, newUser) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('loggedIn', 'true');
        token.value = newToken;
        user.value = newUser;
    }

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('loggedIn');
        localStorage.removeItem('permissions');
        token.value = null;
        user.value = null;
        loggedIn.value = false;
        userPermissions.value = [];
    }

    const setUser = (newUser) => {
        user.value = newUser;
        localStorage.setItem('user', JSON.stringify(newUser));
    }

    const setLoggedIn = (newLoggedIn) => {
        loggedIn.value = newLoggedIn;
        localStorage.setItem('loggedIn', newLoggedIn);
    }

    const updateUserPermissions = async () => {
        await axios.get(`${import.meta.env.VITE_API_BASE_URL}/permissions`)
            .then(response => {
                userPermissions.value = response.data
            })
            .catch(error => {
                console.error(error)
            })
    }

    // getters
    const isAuthenticated = () => token.value !== null

    const getUser = () => user.value

    const getUserPermissions = () => userPermissions.value

    return {
        login,
        logout,
        setUser,
        setLoggedIn,
        updateUserPermissions,
        isAuthenticated,
        getUser,
        getUserPermissions
    }
})
