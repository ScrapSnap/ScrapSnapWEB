<template>
  <Card>
    <template #title>Add Schedule</template>
    <template #content>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="type" class="font-semibold w-6rem">Type</label>
        <Dropdown v-model="selectedGarbageType" :options="garbageTypes" optionLabel="name" placeholder="Select Type" class="w-full md:w-14rem" style="z-index: 1000;"  />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="type" class="font-semibold w-6rem">Day</label>
        <Dropdown id="day" v-model="selectedDay" :options="days" optionLabel="name" placeholder="Select Day" class="w-full md:w-14rem" style="z-index: 1000;"  />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="type" class="font-semibold w-6rem">Frequency</label>
        <Dropdown id="frequency" v-model="selectedFrequency" :options="frequencies" optionLabel="name" placeholder="Select Frequency" class="w-full md:w-14rem" style="z-index: 1000;"  />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="location" class="font-semibold w-6rem">Location</label>
        <InputText v-model="location" class="flex-auto" />
      </div>
      <div class="flex align-items-center gap-3 mb-3">
        <label for="note" class="font-semibold w-6rem">Note</label>
        <InputText id="note-input" v-model="note" class="flex-auto" />
      </div>
      <div class="flex justify-content-end gap-2">
        <Button type="button" label="Cancel" severity="secondary" @click="goToSchedules"></Button>
        <Button type="button" label="Save" @click="saveSchedule"></Button>
      </div>
    </template>
  </Card>

  <Toast />
</template>

<script setup>
import { ref } from "vue";
import axios from "@/axios";
import { useToast } from "primevue/usetoast";
import router from "@/router";

const toast = useToast();

const emit = defineEmits(['added']);
const location = ref();
const note = ref();
const selectedGarbageType = ref();
const selectedFrequency = ref();
const selectedDay = ref();

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

const days = ref([
  { name: 'Monday', value: 'monday' },
  { name: 'Tuesday', value: 'tuesday' },
  { name: 'Wednesday', value: 'wednesday' },
  { name: 'Thursday', value: 'thursday' },
  { name: 'Friday', value: 'friday' },
  { name: 'Saturday', value: 'saturday' },
  { name: 'Sunday', value: 'sunday' },
]);

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
      date: getDateForSelectedDay(selectedDay.value.value),
    });

    if (!response.data) {
      //toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
      return;
    }

    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Successfully scheduled', life: 3000 });
    emit('added')
  } catch (error) {

    const schedules = JSON.parse(localStorage.getItem('localSchedules'));
    schedules.push({
      _id: Math.random().toString(36).substr(2, 9),
      garbageType: selectedGarbageType.value.value,
      location: location.value,
      footnote: note.value,
      frequency: selectedFrequency.value.value,
      date: getDateForSelectedDay(selectedDay.value.value),
      dateAdded: new Date()
    });

    localStorage.setItem('localSchedules', JSON.stringify(schedules));

    emit('added')

    toast.add({ severity: 'warn', summary: 'Offline', detail: 'You are offline. Saving locally...', life: 3000 });
  } finally {
    goToSchedules()
  }
}

const getDateForSelectedDay = (selectedDay) => {
  const dayMapping = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 0, // Sunday is 0 in JavaScript
  };

  const today = new Date();
  const currentDayOfWeek = today.getDay();

  const targetDay = dayMapping[selectedDay.toLowerCase()];
  const dayDifference = targetDay >= currentDayOfWeek
      ? targetDay - currentDayOfWeek
      : 7 - (currentDayOfWeek - targetDay);

  const resultDate = new Date(today);
  resultDate.setDate(today.getDate() + dayDifference);
  return resultDate;
}

const goToSchedules = () => {
  router.push({ name: 'schedule' });
}
</script>
