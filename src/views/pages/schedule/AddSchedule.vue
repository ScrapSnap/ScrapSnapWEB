<template>
  <Dialog v-model:visible="visible" modal :header="dialogHeader" :draggable="false" :style="{ width: '40rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <!-- <span class="p-text-secondary block mb-5">Fill out information.</span> -->
    <div class="flex align-items-center gap-3 mb-3">
      <label for="type" class="font-semibold w-6rem">Type</label>
      <Dropdown v-model="selectedGarbageType" :options="garbageTypes" optionLabel="name"
        placeholder="Select a Garbage Type" class="w-full md:w-14rem" style="z-index: 1000;" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="date" class="font-semibold w-6rem">Date</label>
      <Calendar v-model="date" dateFormat="dd/mm/yy" showIcon iconDisplay="input" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="location" class="font-semibold w-6rem">Location</label>
      <InputText v-model="location" class="flex-auto" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="note" class="font-semibold w-6rem">Note</label>
      <InputText v-model="note" class="flex-auto" />
    </div>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
      <Button type="button" :label="dialogButtonLabel" @click="saveSchedule"></Button>
    </div>
  </Dialog>

  <Toast />
</template>

<script setup>
const props = defineProps({
  isEditing: {
    type: Boolean,
    default: false
  },
  editScheduleData: {
    type: Object,
    default: null
  }
});

import { ref, watch, computed } from "vue";
import axios from "@/axios";
import { useToast } from "primevue/usetoast";

const toast = useToast();

watch(props, (newProps, oldProps) => {
  if (newProps.isEditing && newProps.editScheduleData) {
    isEditing.value = newProps.isEditing;
    date.value = newProps.editScheduleData.date;
    location.value = newProps.editScheduleData.location;
    note.value = newProps.editScheduleData.footnote;
    selectedGarbageType.value = garbageTypes.value.find(type => type.value === newProps.editScheduleData.garbageType);
  }
});

const visible = ref(false);
const isEditing = ref(false);
const date = ref();
const location = ref();
const note = ref();
const selectedGarbageType = ref();
const garbageTypes = ref([
  { name: 'Plastic', value: 'plastic' },
  { name: 'Organic', value: 'organic' },
  { name: 'Metal', value: 'metal' },
  { name: 'Paper', value: 'paper' },
  { name: 'Glass', value: 'glass' }
]);

const emit = defineEmits(['added']);

let dialogHeader = ref('Add Schedule')
let dialogButtonLabel = ref('Save')

const showDialog = () => {
  visible.value = true
}
/*
const saveSchedule = async () => {
  const newSchedule = {
    garbageType: selectedGarbageType.value,
    location: location.value,
    footnote: note.value,
    frequency: 'monthly',
    date: date.value,
  };

  if (navigator.onLine) {
    try {
      let response;


      console.log(isEditing.value)
      console.log(editScheduleData.value)


      if (isEditing.value) {
        response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/schedules/${editScheduleData._id}`, newSchedule);
      } else {
        response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/schedules`, newSchedule);
      }

      if (!response.data) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
        return;
      }

      toast.add({ severity: 'success', summary: 'Success Message', detail: isEditing ? 'Successfully updated' : 'Successfully scheduled', life: 3000 });
      emit('added');
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
      console.error(error)
    }
  } else {
    if (isEditing.value) {
      const localSchedules = JSON.parse(localStorage.getItem('localSchedules')) || [];
      const index = localSchedules.findIndex(schedule => schedule._id === editScheduleData._id);
      localSchedules[index] = newSchedule;
      localStorage.setItem('localSchedules', JSON.stringify(localSchedules));
      toast.add({ severity: 'warn', summary: 'Offline', detail: 'Updated locally, will sync when online', life: 3000 });
    } else {
      const localSchedules = JSON.parse(localStorage.getItem('localSchedules')) || [];
      localSchedules.push(newSchedule);
      localStorage.setItem('localSchedules', JSON.stringify(localSchedules));
      toast.add({ severity: 'warn', summary: 'Offline', detail: 'Saved locally, will sync when online', life: 3000 });
    }
  }

  visible.value = false;
}
*/


const saveSchedule = async () => {

  if (!selectedGarbageType.value || !date.value || !location.value) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Please fill out all fields', life: 3000 });
    return;
  }

  if (navigator.onLine) {
    saveOnline();
  } else {
    saveOffline();
  }

}

const saveOnline = async () => {

  try {
    //console.log(props.isEditing)
    //console.log(props.editScheduleData)
    //console.log(props.editScheduleData._id)
    let response;
    if (isEditing.value) {
      const scheduleId = props.editScheduleData._id;
      response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/schedules/${scheduleId}`, {
        garbageType: selectedGarbageType.value.value,
        location: location.value,
        footnote: note.value,
        frequency: 'monthly',
        date: date.value,
      });
    } else {
      response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/schedules`, {
        garbageType: selectedGarbageType.value.value,
        location: location.value,
        footnote: note.value,
        frequency: 'monthly',
        date: date.value,
      });
    }

    if (!response.data) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
      return;
    }

    toast.add({ severity: 'success', summary: 'Success Message', detail: isEditing === true ? 'Successfully updated' : 'Successfully scheduled', life: 3000 });
    visible.value = false;
    emit('added')
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 })
    console.error(error)
  }
}

const saveOffline = async () => {
  const newSchedule = {
    garbageType: selectedGarbageType.value.value,
    location: location.value,
    footnote: note.value,
    frequency: 'monthly',
    date: date.value,
    _id: Math.random().toString(36).substr(2, 9)
  }

  if (isEditing.value) {
    const localSchedules = JSON.parse(localStorage.getItem('localSchedules')) || [];
    const index = localSchedules.findIndex(schedule => schedule._id === editScheduleData._id);
    localSchedules[index] = newSchedule;
    localStorage.setItem('localSchedules', JSON.stringify(localSchedules));
    toast.add({ severity: 'warn', summary: 'Offline', detail: 'Updated locally, will sync when online', life: 3000 });
  } else {
    const localSchedules = JSON.parse(localStorage.getItem('localSchedules')) || [];
    localSchedules.push(newSchedule);
    localStorage.setItem('localSchedules', JSON.stringify(localSchedules));
    toast.add({ severity: 'warn', summary: 'Offline', detail: 'Saved locally, will sync when online', life: 3000 });
  }
  emit('added');
  visible.value = false;
}


/*
//rewrite saveSchedule function to use localstorage and sync when online
const saveSchedule = async () => {
  const newSchedule = {
    garbageType: selectedGarbageType.value.value,
    location: location.value,
    footnote: note.value,
    frequency: 'monthly',
    date: date.value,
  };

  if (navigator.onLine) {
    try {
      let response;
      if (isEditing) {
        response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/schedules/${editScheduleData._id}`, newSchedule);
      } else {
        response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/schedules`, newSchedule);
      }

      if (!response.data) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
        return;
      }

      toast.add({ severity: 'success', summary: 'Success Message', detail: isEditing ? 'Successfully updated' : 'Successfully scheduled', life: 3000 });
      emit('added');
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
    }
  } else {
    if (isEditing) {
      const localSchedules = JSON.parse(localStorage.getItem('localSchedules')) || [];
      const index = localSchedules.findIndex(schedule => schedule._id === editScheduleData._id);
      localSchedules[index] = newSchedule;
      localStorage.setItem('localSchedules', JSON.stringify(localSchedules));
      toast.add({ severity: 'warn', summary: 'Offline', detail: 'Updated locally, will sync when online', life: 3000 });
    } else {
      const localSchedules = JSON.parse(localStorage.getItem('localSchedules')) || [];
      localSchedules.push(newSchedule);
      localStorage.setItem('localSchedules', JSON.stringify(localSchedules));
      toast.add({ severity: 'warn', summary: 'Offline', detail: 'Saved locally, will sync when online', life: 3000 });
    }
  }

  visible.value = false;
}


const saveSchedule = async () => {
  try {
    console.log(props.isEditing)
    console.log(props.editScheduleData)
    console.log(props.editScheduleData._id)
    let response;
    if (isEditing.value) {
      const scheduleId = props.editScheduleData._id;
      response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/schedules/${scheduleId}`, {
        garbageType: selectedGarbageType.value.value,
        location: location.value,
        footnote: note.value,
        frequency: 'monthly',
        date: date.value,
      });
    } else {
      response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/schedules`, {
        garbageType: selectedGarbageType.value.value,
        location: location.value,
        footnote: note.value,
        frequency: 'monthly',
        date: date.value,
      });
    }

    if (!response.data) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
      return;
    }

    toast.add({ severity: 'success', summary: 'Success Message', detail: isEditing === true ? 'Successfully updated' : 'Successfully scheduled', life: 3000 });
    visible.value = false;
    emit('added')
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 })
  }
}
*/


////////////////

/*
const saveSchedule = async () => {
  try {
    console.log(props.isEditing)
    console.log(props.editScheduleData)
    console.log(props.editScheduleData._id)
    let response;
    if (isEditing.value) {
      const scheduleId = props.editScheduleData._id;
      response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/schedules/${scheduleId}`, {
        garbageType: selectedGarbageType.value.value,
        location: location.value,
        footnote: note.value,
        frequency: 'monthly',
        date: date.value,
      });
    } else {
      response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/schedules`, {
        garbageType: selectedGarbageType.value.value,
        location: location.value,
        footnote: note.value,
        frequency: 'monthly',
        date: date.value,
      });
    }

    if (!response.data) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
      return;
    }

    toast.add({ severity: 'success', summary: 'Success Message', detail: isEditing === true ? 'Successfully updated' : 'Successfully scheduled', life: 3000 });
    visible.value = false;
    emit('added')
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 })
  }
}
*

/*
const saveSchedule = async () => {
  const newSchedule = {
    garbageType: selectedGarbageType.value.value,
    location: location.value,
    footnote: note.value,
    frequency: 'monthly',
    date: date.value,
  };

  if (navigator.onLine) {  // Modified this part
    try {
      let response;
      if (isEditing) {
        response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/schedules/${editScheduleData._id}`, newSchedule);
      } else {
        response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/schedules`, newSchedule);
      }

      if (!response.data) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
        return;
      }

      toast.add({ severity: 'success', summary: 'Success Message', detail: isEditing ? 'Successfully updated' : 'Successfully scheduled', life: 3000 });
      emit('added');
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
    }
  } else {
    // Save to local storage when offline
    const localSchedules = JSON.parse(localStorage.getItem('localSchedules')) || [];  // Added this part
    localSchedules.push(newSchedule);
    localStorage.setItem('localSchedules', JSON.stringify(localSchedules));
    toast.add({ severity: 'warn', summary: 'Offline', detail: 'Saved locally, will sync when online', life: 3000 });
  }

  visible.value = false;
}
*/

defineExpose({
  showDialog
})
</script>

<style scoped lang="scss"></style>
