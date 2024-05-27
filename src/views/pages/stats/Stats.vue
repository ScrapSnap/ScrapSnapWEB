<template>
  <div>
    <!-- DataCards for summary statistics -->
    <div class="grid">
      <DataCard
        v-for="(item, index) in summary"
        :key="index"
        :type="item.type"
        :count="item.count"
        :icon="item.icon"
      />
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
</template>

<script>
import axios from 'axios';
import DataCard from '../../../components/DataCard.vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import GarbageChart from '../../../components/GarbageChart.vue';
import GarbageLineChart from '../../../components/GarbageLineChart.vue';

export default {
  components: {
    DataCard,
    DataTable,
    Column,
    GarbageChart,
  },
  data() {
    return {
      summary: [],
      garbageData: [],
      chartData: {},
      chartOptions: {},
        lineChartData: {},
        lineChartOptions: {},
    };
  },
  async mounted() {
    this.setupKeyboardListeners();
    this.getFreshData();
  },
  methods: {
    processData(data) {
         this.summary = [
            { type: 'Total', count: data.total, icon: 'pi-chart-line' },
            { type: 'Avg', count: data.avg, icon: 'pi-arrows-v' },
            { type: 'Max', count: data.max, icon: 'pi-arrow-up' },
            { type: 'Min', count: data.min, icon: 'pi-arrow-down' },
            //{ type: 'Count', count: data.count, icon: 'pi-chart-line' },
        ];
        
        // Prepare detailed data for DataTable
        this.garbageData = [
          { type: 'Glass', total: data.totalGlass, avg: data.avgGlass, max: data.maxGlass, min: data.minGlass },
          { type: 'Metal', total: data.totalMetal, avg: data.avgMetal, max: data.maxMetal, min: data.minMetal },
          { type: 'Organic', total: data.totalOrganic, avg: data.avgOrganic, max: data.maxOrganic, min: data.minOrganic },
          { type: 'Paper', total: data.totalPaper, avg: data.avgPaper, max: data.maxPaper, min: data.minPaper },
          { type: 'Plastic', total: data.totalPlastic, avg: data.avgPlastic, max: data.maxPlastic, min: data.minPlastic },
        ];

        this.chartData = {
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

        // Chart options
        this.chartOptions = {
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

        
        // Prepare data for line chart
        const labels = data.garbageCollected.map((_, index) => `Entry ${index + 1}`); // Labels for each entry in garbageCollected
        this.lineChartData = {
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

        // Chart options
        this.lineChartOptions = {
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
    },
    loadFromLocalStorage() {
      const data = localStorage.getItem('garbageData');
      if (data) {
        this.processData(JSON.parse(data));
      } else {
        console.error('No data found in local storage');
      }
    },
    sendNotification(title, body) {
        if (Notification.permission === "granted") {
            new Notification(title, { body });
        }
    },
    setupKeyboardListeners() {
      document.addEventListener('keydown', (e) => {
        if (e.shiftKey && e.key === 'N') {
          this.randomNotification();
        }
        if (e.shiftKey && e.key === 'R') {
          this.getFreshData();
          this.sendNotification('Data Refreshed', 'Data has been refreshed');
        }
      });
    },
    async getFreshData() {
     const user = localStorage.getItem('user')
    const { _id } = JSON.parse(user);
    const token = localStorage.getItem('token');

    if (_id && token) {
      try {

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/stats/user/${_id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        });

        console.log('Data:', response.data);
  
        // Extracting data from response
        const data = response.data[0]
  
        // Save data to local storage
        localStorage.setItem('garbageData', JSON.stringify(data));

        this.processData(data);

      } catch (error) {
        console.error('Error fetching data:', error);
        this.loadFromLocalStorage();
        this.sendNotification('Your are offline', 'Data may be outdated');
      }
    } else {
      console.error('_id or token not found in local storage');
      this.loadFromLocalStorage();
    }
    },
    randomNotification() {
      // get a random stat from the summary
      const randomIndex = Math.floor(Math.random() * this.summary.length);
      const { type, count } = this.summary[randomIndex];
      const title = `Random Stat: ${type}`;
      const body = `Count: ${count}`;
      this.sendNotification(title, body);
    },
  },
};
</script>

<style scoped>
/* Add any styles specific to this component here */
</style>
