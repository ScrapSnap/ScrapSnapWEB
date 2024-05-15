import dayjs from 'dayjs'

const authService = {
    isAuthenticated() {
        const jwt = localStorage.getItem('token')
        if (!jwt) {
            return false
        }

        const decoded = JSON.parse(atob(jwt.split('.')[1]))

        let stillValid = false
        if (jwt && dayjs().format() < dayjs.unix(decoded.exp).format() && localStorage.getItem('loggedIn') === 'true') {
            stillValid = true
        }

        return stillValid
    }
}

export default authService;
