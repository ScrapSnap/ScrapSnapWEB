<template>
  <div>
    <div v-if="garbageData.length > 0">
      <!-- DataCards for summary statistics -->
      <div class="grid">
        <DataCard v-for="(item, index) in summary" :key="index" :type="item.type" :count="item.count"
          :icon="item.icon" />
      </div>

      <!-- Line Chart for visualizing data -->
      <GarbageLineChart :chartData="lineChartData" :chartOptions="lineChartOptions" />

      <!-- Chart for visualizing data -->
      <GarbageChart :chartData="chartData" :chartOptions="chartOptions" />

      <!-- DataTable for detailed garbage collection data -->
      <DataTable :value="garbageData" responsiveLayout="scroll">
        <Column field="type" header="Type"></Column>
        <Column field="total" header="Total (kg)"></Column>
        <Column field="avg" header="Avg (kg)"></Column>
        <Column field="max" header="Max (kg)"></Column>
        <Column field="min" header="Min (kg)"></Column>
      </DataTable>
    </div>
    <div v-else>
      <div class="flex justify-content-center">
        <Button label="Refresh Data" icon="pi pi-refresh" @click="getFreshData" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import DataCard from '../../../components/DataCard.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import GarbageChart from '../../../components/GarbageChart.vue';
import GarbageLineChart from '../../../components/GarbageLineChart.vue';

const summary = ref([]);
const garbageData = ref([]);
const chartData = ref({});
const chartOptions = ref({});
const lineChartData = ref({});
const lineChartOptions = ref({});

function processData(data) {
  summary.value = [
    { type: 'Total', count: Math.round(data.total), icon: 'pi-chart-line' },
    { type: 'Avg', count: Math.round(data.avg), icon: 'pi-arrows-v' },
    { type: 'Max', count: Math.round(data.max), icon: 'pi-arrow-up' },
    { type: 'Min', count: Math.round(data.min), icon: 'pi-arrow-down' },
  ];

  // Prepare detailed data for DataTable
  garbageData.value = [
    { type: 'Glass', total: Math.round(data.totalGlass), avg: Math.round(data.avgGlass), max: Math.round(data.maxGlass), min: Math.round(data.minGlass) },
    { type: 'Metal', total: Math.round(data.totalMetal), avg: Math.round(data.avgMetal), max: Math.round(data.maxMetal), min: Math.round(data.minMetal) },
    { type: 'Organic', total: Math.round(data.totalOrganic), avg: Math.round(data.avgOrganic), max: Math.round(data.maxOrganic), min: Math.round(data.minOrganic) },
    { type: 'Paper', total: Math.round(data.totalPaper), avg: Math.round(data.avgPaper), max: Math.round(data.maxPaper), min: Math.round(data.minPaper) },
    { type: 'Plastic', total: Math.round(data.totalPlastic), avg: Math.round(data.avgPlastic), max: Math.round(data.maxPlastic), min: Math.round(data.minPlastic) },
  ];

  chartData.value = {
    labels: ['Glass', 'Metal', 'Organic', 'Paper', 'Plastic'],
    datasets: [
      {
        label: 'Total',
        backgroundColor: '#42A5F5',
        data: [data.totalGlass, data.totalMetal, data.totalOrganic, data.totalPaper, data.totalPlastic],
      },
      {
        label: 'Avg',
        backgroundColor: '#66BB6A',
        data: [data.avgGlass, data.avgMetal, data.avgOrganic, data.avgPaper, data.avgPlastic],
      },
      {
        label: 'Max',
        backgroundColor: '#FFA726',
        data: [data.maxGlass, data.maxMetal, data.maxOrganic, data.maxPaper, data.maxPlastic],
      },
      {
        label: 'Min',
        backgroundColor: '#FF7043',
        data: [data.minGlass, data.minMetal, data.minOrganic, data.minPaper, data.minPlastic],
      },
    ],
  };

  chartOptions.value = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Garbage Collection Data',
      },
    },
  };

  const labels = data.garbageCollected.map((_, index) => `Entry ${index + 1}`);
  lineChartData.value = {
    labels: labels,
    datasets: [
      {
        label: 'Paper',
        backgroundColor: '#FF6384',
        borderColor: '#FF6384',
        fill: false,
        data: data.garbageCollected.map(entry => entry.paper),
      },
      {
        label: 'Plastic',
        backgroundColor: '#36A2EB',
        borderColor: '#36A2EB',
        fill: false,
        data: data.garbageCollected.map(entry => entry.plastic),
      },
      {
        label: 'Glass',
        backgroundColor: '#FFCE56',
        borderColor: '#FFCE56',
        fill: false,
        data: data.garbageCollected.map(entry => entry.glass),
      },
      {
        label: 'Metal',
        backgroundColor: '#4BC0C0',
        borderColor: '#4BC0C0',
        fill: false,
        data: data.garbageCollected.map(entry => entry.metal),
      },
      {
        label: 'Organic',
        backgroundColor: '#9966FF',
        borderColor: '#9966FF',
        fill: false,
        data: data.garbageCollected.map(entry => entry.organic),
      },
    ],
  };

  lineChartOptions.value = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Garbage Collection Over Time',
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Entries',
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Amount',
        },
      },
    },
  };
}

function loadFromLocalStorage() {
  const data = localStorage.getItem('garbageData');
  if (data) {
    processData(JSON.parse(data));
  } else {
    console.error('No data found in local storage');
  }
}

function sendNotification(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

function setupKeyboardListeners() {
  document.addEventListener('keydown', (e) => {
    if (e.shiftKey && e.key === 'N') {
      setTimeout(() => {
        randomNotification();
      }, 1000);
    }
    if (e.shiftKey && e.key === 'R') {
      setTimeout(() => {
        getFreshData();
        sendNotification('Data Refreshed', 'Data has been refreshed');
      }, 1000);
    }
  });
}

function randomNotification() {
  const randomIndex = Math.floor(Math.random() * summary.value.length);
  const { type, count } = summary.value[randomIndex];
  const title = `Random Stat: ${type}`;
  const body = `Count: ${Math.round(count)}`;
  sendNotification(title, body);
}

async function getFreshData() {
  const user = localStorage.getItem('user');
  const { _id } = JSON.parse(user);
  const token = localStorage.getItem('token');

  if (_id && token) {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/stats/user/${_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //console.log('Data:', response.data);

      const data = response.data[0];
      localStorage.setItem('garbageData', JSON.stringify(data));
      processData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      loadFromLocalStorage();
      sendNotification('You are offline', 'Data may be outdated');
    }
  } else {
    console.error('_id or token not found in local storage');
    loadFromLocalStorage();
  }
}

onMounted(() => {
  setupKeyboardListeners();
  getFreshData();
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', setupKeyboardListeners);
});
</script>

<style scoped>
/* Add any styles specific to this component here */
</style>
