import { defineStore } from 'pinia';
import { ref } from "vue";

export const useStore = defineStore('app', () => {
    const token = ref(null)
    const user = ref(null)
    const loggedIn = ref(false)

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
        token.value = null;
        user.value = null;
    }

    const setUser = (newUser) => {
        user.value = newUser;
        localStorage.setItem('user', JSON.stringify(newUser));
    }

    const setLoggedIn = (newLoggedIn) => {
        loggedIn.value = newLoggedIn;
        localStorage.setItem('loggedIn', newLoggedIn);
    }

    // getters
    const isAuthenticated = () => token.value !== null

    const getUser = () => user.value

    return {
        login,
        logout,
        setUser,
        setLoggedIn,
        isAuthenticated,
        getUser
    }
})
