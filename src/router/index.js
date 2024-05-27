import { createRouter, createWebHashHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import { useStore } from '../store/index';
import AuthService from "@/service/AuthService";
import { checkPermissions, permissions } from "@/permissions";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            component: AppLayout,
            children: [
                {
                    path: "/",
                    name: "dashboard",
                    component: () => import("@/views/pages/stats/Stats.vue"),
                    meta: {
                        requiredAuth: true,
                    },
                },
                {
                    path: '/schedule',
                    name: 'schedule',
                    component: () => import('@/views/pages/schedule/Schedules.vue'),
                    meta: {
                        requiredAuth: true
                    }
                },
                {
                    path: '/inappropriate-disposal',
                    name: 'inappropriate-disposal',
                    component: () => import('@/views/pages/inappropriate-disposal/InappropriateDisposals.vue'),
                    meta: {
                        requiredAuth: true
                    }
                },
                {
                    path: '/inappropriate-disposal/upload',
                    name: 'upload-inappropriate-disposal',
                    component: () => import('@/views/pages/inappropriate-disposal/UploadInappropriateDisposal.vue'),
                    meta: {
                        requiredAuth: true
                    }
                },
                {
                    path: '/users',
                    name: 'users',
                    component: () => import('@/views/pages/users/Users.vue'),
                    meta: {
                        requiredAuth: true,
                        requiredPermissions: [permissions.ReadUsers]
                    }
                },
                {
                    path: '/roles',
                    name: 'roles',
                    component: () => import('@/views/pages/roles/Roles.vue'),
                    meta: {
                        requiredAuth: true,
                        requiredPermissions: [permissions.WriteUsers]
                    }
                },
                {
                    path: '/user-profile',
                    name: 'user',
                    component: () => import('@/views/pages/users/UserProfile.vue'),
                    meta: {
                        requiredAuth: true
                    }
                }
            ]
        },
        {
            path: "/pages/notfound",
            name: "notfound",
            component: () => import("@/views/pages/NotFound.vue"),
        },
        {
            path: "/auth/login",
            name: "login",
            component: () => import("@/views/pages/auth/Login.vue"),
        },
        {
            path: "/auth/register",
            name: "register",
            component: () => import("@/views/pages/auth/Register.vue"),
        },
        {
            path: "/auth/access",
            name: "accessDenied",
            component: () => import("@/views/pages/auth/Access.vue"),
        },
        {
            path: "/auth/error",
            name: "error",
            component: () => import("@/views/pages/auth/Error.vue"),
        },
        {
            path: "/:catchAll(.*)",
            redirect: { name: "notfound" },
        },
    ],
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

    if (to.meta.requiredPermissions && !checkPermissions(to.meta.requiredPermissions)) {
        return next('/auth/access')
    }

    next()
})

export default router;
