<template>
  <div class="card">
    <h5>Scheduled Waste Collections</h5>
    <p>Use this page to start from scratch and place your custom content.</p>

    <div v-if="hasWriteSchedulePermission" class="w-full flex justify-content-end mb-3">
      <Button label="New Schedule" icon="pi pi-plus" @click="showAddScheduleDialog" />
    </div>

    <DataTable :value="schedule" stripedRows>
      <Column field="location" header="Location" sortable>
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <span v-else>{{ data.location }}</span>
        </template>
      </Column>
      <Column field="date" header="Date" sortable>
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <span v-else>{{ formatDate(data.date) }}</span>
        </template>
      </Column>
      <Column field="frequency" header="Frequency" sortable>
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <Tag v-else :value="data.frequency" :style="{ backgroundColor: getFrequencyColor(data.frequency) }"></Tag>
        </template>
      </Column>
      <Column field="garbageType" header="Garbage Type" sortable>
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <Tag v-else :value="data.garbageType" :style="{ backgroundColor: getGarbageTypeColor(data.garbageType) }"></Tag>
        </template>
      </Column>
      <Column v-if="hasWriteSchedulePermission" header="Actions">
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <Button icon="pi pi-pencil" @click="showEditScheduleDialog(data)" severity="warning" class="mr-1" aria-label="Info" />
          <Button icon="pi pi-trash" @click="deleteSchedule(data)" severity="danger" class="ml-1" aria-label="Delete" />
        </template>
      </Column>
    </DataTable>

    <Toast />
    <AddSchedule ref="addScheduleDialog" @added="loadSchedule" />
    <EditSchedule ref="editScheduleDialog" @updated="loadSchedule" />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import AddSchedule from "@/views/pages/schedule/AddSchedule.vue";
import EditSchedule from "@/views/pages/schedule/EditSchedule.vue";
import { useToast } from "primevue/usetoast";
import axios from "@/axios";
import { hasPermission, permissions } from "@/permissions";

const hasWriteSchedulePermission = hasPermission(permissions.WriteSchedules);

const toast = useToast();

const loading = ref(true);
const schedule = ref([]);
const addScheduleDialog = ref();
const editScheduleDialog = ref();

onMounted(() => {
    loadSchedule();
    window.addEventListener('online', syncLocalToServer);
});

onUnmounted(() => {
    window.removeEventListener('online', syncLocalToServer);
});

const loadSchedule = async () => {
  loading.value = true;

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/schedules`);

    if (!response.data) {
      //toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
      return;
    }

    localStorage.setItem('localSchedules', JSON.stringify(response.data));   

    schedule.value = response.data;
  } catch (error) {

    const schedules = JSON.parse(localStorage.getItem('localSchedules')) || [];
    
    console.log('Local schedules', schedules);

    toast.add({ severity: 'warn', summary: 'Offline', detail: 'You are offline. Showing local data...', life: 3000 });
    
    schedule.value = schedules;

  } finally {
    loading.value = false;
  }
}

const deleteSchedule = async (data) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/schedules/${data._id}`);

    if (!response.data) {
      //toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
      return;
    }

    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Successfully deleted', life: 3000 });
    loadSchedule();
  } catch (error) {
    
    const schedules = JSON.parse(localStorage.getItem('localSchedules'));
    const index = schedules.findIndex(schedule => schedule._id === data._id);
    schedules.splice(index, 1);
    
    localStorage.setItem('localSchedules', JSON.stringify(schedules));
    
    toast.add({ severity: 'warn', summary: 'Offline', detail: 'You are offline. Deleting locally...', life: 3000 });

    loadSchedule();
  }
}

const getGarbageTypeColor = (garbageType) => {
  switch (garbageType) {
    case 'plastic':
      return '#fdd85d';

    case 'paper':
      return '#adb5bd';

    case 'glass':
      return '#00b4d8';

    case 'metal':
      return '#343a40';

    case 'organic':
      return '#4ad66d';

    default:
      return '#48cae4';
  }
}

const getFrequencyColor = (frequency) => {
  switch (frequency) {
    case 'daily':
      return '#fdd85d';

    case 'weekly':
      return '#adb5bd';

    case 'monthly':
      return '#00b4d8';

    case 'yearly':
      return '#f17b00';

    default:
      return '#48cae4';
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
}

const showAddScheduleDialog = () => {
  addScheduleDialog.value.showDialog()
}

const showEditScheduleDialog = (data) => {
  editScheduleDialog.value.showDialog(data);
}

const syncLocalToServer = async () => {

  if (localStorage.getItem('localSchedules') === null) {

    await loadSchedule();

  } else {

    const localSchedules = JSON.parse(localStorage.getItem('localSchedules')) || [];

    localSchedules.forEach(schedule => {
      delete schedule._id;
    });

    if (localSchedules.length > 0) {
      try {
        schedule.value = [];
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/schedules/replace-all`, localSchedules);

        if (!response.data) {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
          return;
        }

        schedule.value = response.data;

        localStorage.removeItem('localSchedules');

        localStorage.setItem('localSchedules', JSON.stringify(response.data));

        toast.add({ severity: 'success', summary: 'Success Message', detail: 'Successfully synced', life: 3000 });

      } catch (error) {
        console.error('Sync failed for', localSchedules, error);
      }

    }
  }
};

</script>

<style scoped lang="scss">

</style>
