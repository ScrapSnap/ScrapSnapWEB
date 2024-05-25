<template>
  <div class="card">
    <h5>Scheduled Waste Collections</h5>
    <p>Use this page to start from scratch and place your custom content.</p>

    <div class="w-full flex justify-content-end mb-3">
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
          <span v-else>{{ data.frequency }}</span>
        </template>
      </Column>
      <Column field="garbageType" header="Garbage Type" sortable>
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <Tag v-else :value="data.garbageType" :style="{ backgroundColor: getGarbageTypeColor(data.garbageType) }">
          </Tag>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <Button icon="pi pi-pencil" @click="showEditScheduleDialog(data)" severity="warning" class="mr-1"
            aria-label="Info" />
          <Button icon="pi pi-trash" @click="deleteSchedule(data)" severity="danger" class="ml-1" aria-label="Delete" />
        </template>
      </Column>
    </DataTable>

    <Toast />
    <AddSchedule ref="addScheduleDialog" :isEditing="isEditing" :editScheduleData="editScheduleData"
      @added="onlineCheck" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import AddSchedule from "@/views/pages/schedule/AddSchedule.vue";
import {useToast} from "primevue/usetoast";
import axios from "@/axios";

const toast = useToast();

const loading = ref(true);
const schedule = ref([]);
const addScheduleDialog = ref();
const isEditing = ref(false);
const editScheduleData = ref(null);


onMounted(async () => {
  window.addEventListener('online',
    async () => {
      await syncLocalToServer();
    });

  await onlineCheck();
  
});

const onlineCheck = async () => {
  if (navigator.onLine) {
    await loadSchedule();
  } else {
    loadScheduleFromLocalStorage();
  }
}	


const loadSchedule = async () => {
  loading.value = true;
  try {
    
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/schedules`);

    if (!response.data) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
      return;
    }
    schedule.value = response.data;
    
    localStorage.removeItem('localSchedules');
    
    localStorage.setItem('localSchedules', JSON.stringify(response.data));
    
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 })
  }
  finally {
    loading.value = false;
  }
}

const syncLocalToServer = async () => {


  if (localStorage.getItem('localSchedules') === null) {

    await loadSchedule();

  } else {

    const localSchedules = JSON.parse(localStorage.getItem('localSchedules')) || [];

    localSchedules.forEach(schedule => {
      delete schedule._id;
      delete schedule.dateAdded;
    });

    if (localSchedules.length > 0) {
      try {
        schedule.value = [];
        const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/schedules/replace-all`, localSchedules);

        console.log('Sync response', response);

        if (!response.data) {
          toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
          return;
        }

        schedule.value = response.data;

        localStorage.removeItem('localSchedules');

        localStorage.setItem('localSchedules', JSON.stringify(response.data));

      } catch (error) {
        console.error('Sync failed for', localSchedules, error);
      }

    }
  }
};

const loadScheduleFromLocalStorage = async () => {
  loading.value = true;
  const localSchedules = JSON.parse(localStorage.getItem('localSchedules')) || [];
  schedule.value = localSchedules;
  loading.value = false;
};

const deleteSchedule = async (data) => {

  if (!navigator.onLine) {
    let localSchedules = JSON.parse(localStorage.getItem('localSchedules')) || [];
    localSchedules = localSchedules.filter(schedule => schedule._id !== data._id);
    localStorage.setItem('localSchedules', JSON.stringify(localSchedules));

    toast.add({ severity: 'warn', summary: 'Offline', detail: 'Deleted locally, will sync when online', life: 3000 });
    loadScheduleFromLocalStorage();
    return;
  }
  else {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/schedules/${data._id}`);

      if (!response.data) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
        return;
      }

      toast.add({ severity: 'success', summary: 'Success Message', detail: 'Successfully deleted', life: 3000 });
      loadSchedule();
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 })
    }
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options);
}

const showAddScheduleDialog = () => {
  isEditing.value = false;
  editScheduleData.value = null;
  addScheduleDialog.value.showDialog()
}

const showEditScheduleDialog = (data) => {
  isEditing.value = true;
  editScheduleData.value = data;
  addScheduleDialog.value.showDialog()
}
</script>

<style scoped lang="scss">

</style>
