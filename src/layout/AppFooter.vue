<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
    <div class="layout-footer">
        <img src="/icons/icon-32x32.png" alt="logo" />
        | 
        <span class="font-medium ml-2"><b>ScrapSnap</b></span>
    </div>
</template>
<style lang="scss" scoped></style>
