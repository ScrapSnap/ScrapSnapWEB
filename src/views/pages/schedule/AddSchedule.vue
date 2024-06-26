<template>
  <Dialog v-model:visible="visible" modal header="New Schedule" :draggable="false" :style="{ width: '40rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <!-- <span class="p-text-secondary block mb-5">Fill out information.</span> -->
    <div class="flex align-items-center gap-3 mb-3">
      <label for="type" class="font-semibold w-6rem">Frequency</label>
      <Dropdown v-model="selectedGarbageType" :options="garbageTypes" optionLabel="name" placeholder="Select a Garbage Type" class="w-full md:w-14rem" style="z-index: 1000;"  />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="date" class="font-semibold w-6rem">Date</label>
      <Calendar v-model="date" dateFormat="dd/mm/yy" showIcon iconDisplay="input" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="type" class="font-semibold w-6rem">Type</label>
      <Dropdown v-model="selectedFrequency" :options="frequencies" optionLabel="name" placeholder="Select a Frequency" class="w-full md:w-14rem" style="z-index: 1000;"  />
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
      <Button type="button" label="Save" @click="saveSchedule"></Button>
    </div>
  </Dialog>

  <Toast />
</template>

<script setup>
import { ref } from "vue";
import axios from "@/axios";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const visible = ref(false);
const emit = defineEmits(['added']);
const date = ref();
const location = ref();
const note = ref();
const selectedGarbageType = ref();
const selectedFrequency = ref();

const garbageTypes = ref([
  { name: 'Plastic', value: 'plastic' },
  { name: 'Organic', value: 'organic' },
  { name: 'Metal', value: 'metal' },
  { name: 'Paper', value: 'paper' },
  { name: 'Glass', value: 'glass' }
]);

const frequencies = ref([
  { name: 'Daily', value: 'daily' },
  { name: 'Weekly', value: 'weekly' },
  { name: 'Monthly', value: 'monthly' },
  { name: 'Yearly', value: 'yearly' }
]);

const showDialog = () => {
  date.value = new Date();
  location.value = '';
  note.value = '';
  selectedGarbageType.value = null;
  selectedFrequency.value = null;
  visible.value = true
}

const saveSchedule = async () => {
  if (!selectedGarbageType.value) {
    toast.add({ severity: 'info', summary: 'Info', detail: 'Please select a garbage type', life: 3000 });
    return;
  }

  if (!selectedFrequency.value) {
    toast.add({ severity: 'info', summary: 'Info', detail: 'Please select a frequency', life: 3000 });
    return;
  }

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/schedules`, {
      garbageType: selectedGarbageType.value.value,
      location: location.value,
      footnote: note.value,
      frequency: selectedFrequency.value.value,
      date: date.value,
    });

    if (!response.data) {
      //toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
      return;
    }

    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Successfully scheduled', life: 3000 });
    visible.value = false;
    emit('added')
  } catch (error) {
    
    const schedules = JSON.parse(localStorage.getItem('localSchedules'));
    schedules.push({
      _id: Math.random().toString(36).substr(2, 9),
      garbageType: selectedGarbageType.value.value,
      location: location.value,
      footnote: note.value,
      frequency: selectedFrequency.value.value,
      date: date.value,
      dateAdded: new Date()
    });
    
    localStorage.setItem('localSchedules', JSON.stringify(schedules));
    
    emit('added')

    toast.add({ severity: 'warn', summary: 'Offline', detail: 'You are offline. Saving locally...', life: 3000 });
    
    visible.value = false;
  }
}

defineExpose({
  showDialog
})
</script>
