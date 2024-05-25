<template>
  <div>
    <Chart type="bar" :data="chartData" :options="chartOptions" class="h-30rem" />
  </div>
</template>

<script>
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  name: 'GarbageChart',
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => ({}),
    },
  },
};
</script>

<style scoped>
/* Add any styles specific to this component here */
</style>
