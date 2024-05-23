<template>
  <div class="col-12 lg:col-6 xl:col-3">
    <div class="card mb-0">
      <div class="flex justify-content-between mb-3">
        <div>
          <span class="block text-500 font-medium mb-3">{{ type }}</span>
          <div class="text-900 font-medium text-xl">{{ count }} kg</div>
        </div>
        <div
            class="flex align-items-center justify-content-center bg-blue-100 border-round"
            :style="{ width: '2.5rem', height: '2.5rem' }"
        >
            <i :class="['pi', icon, 'text-blue-500', 'text-xl']"></i>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DataCard',
  props: {
    type: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
    icon: {
      type: String,
      default: 'pi-shopping-cart', // Default icon if none is provided
    },
  },
};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>
