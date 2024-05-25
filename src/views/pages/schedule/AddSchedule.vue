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
    type: Object,
    default: false
  },
  editScheduleData: {
    type: Object,
    default: null
  }
});

import { ref, watch } from "vue";
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

const dialogHeader = ref('New Schedule');
const dialogButtonLabel = ref('Save');

const showDialog = () => {
  visible.value = true
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

defineExpose({
  showDialog
})
</script>

<style scoped lang="scss"></style>
