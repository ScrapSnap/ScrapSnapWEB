import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import { useStore } from '../store/index';
import AuthService from "@/service/AuthService";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/pages/Empty.vue'),
                    meta: {
                        requiredAuth: true
                    }
                },
                {
                    path: '/schedule',
                    name: 'schedule',
                    component: () => import('@/views/pages/schedule/Schedule.vue'),
                    meta: {
                        requiredAuth: true
                    }
                }
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        },
        {
            path: '/:catchAll(.*)',
            redirect: { name: 'notfound' }
        }
    ]
});

router.beforeEach((to, from, next) => {
    const loggedIn = localStorage.getItem('loggedIn')
    const store = useStore();

    if (loggedIn === 'true') {
        store.setLoggedIn(true)
        const user = localStorage.getItem('user')
        if (user && user !== 'undefined') {
            store.setUser(JSON.parse(user))
        }
        if (to.name === 'login') {
            return next('/')
        }
    }

    if (to.meta.requiredAuth && !AuthService.isAuthenticated()) {
        return next('/auth/login')
    }

    next()
})

export default router;
