<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Home',
        items: [
            { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' },
            { label: 'Schedule', icon: 'pi pi-fw pi-calendar', to: '/schedule'},
            { label: 'Collection Points', icon: 'pi pi-fw pi-map', to: '/collection-points' }
        ]
    },
    {
        label: 'Inappropriate Disposals',
        items: [
            { label: 'Inappropriate Disposals', icon: 'pi pi-fw pi-trash', to: '/inappropriate-disposal' },
            { label: 'Upload', icon: 'pi pi-fw pi-upload', to: '/inappropriate-disposal/upload' }
        ]
    },
    {
        label: 'User',
        items: [
            { label: 'Users', icon: 'pi pi-fw pi-users', to: '/users' },
            { label: 'Roles', icon: 'pi pi-fw pi-lock', to: '/roles' },
            { label: 'Profile', icon: 'pi pi-users', to: '/user-profile' },
        ]
    }
]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
