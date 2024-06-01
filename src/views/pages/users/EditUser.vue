<template>
  <Dialog v-model:visible="visible" modal header="Edit User" :draggable="false" :style="{ width: '40rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div class="flex align-items-center gap-3 mb-3">
      <label for="type" class="font-semibold w-6rem">Role</label>
      <Dropdown v-model="selectedRole" :options="roles" optionLabel="name" placeholder="Select a Role" class="w-full md:w-14rem" style="z-index: 1000;"  />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="firstname" class="font-semibold w-6rem">Name</label>
      <div class="flex flex-column gap-2">
        <InputText v-model="firstname" class="flex-auto" />
      </div>
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="lastname" class="font-semibold w-6rem">Lastname</label>
      <div class="flex flex-column gap-2">
        <InputText v-model="lastname" class="flex-auto" />
      </div>
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="location" class="font-semibold w-6rem">Location</label>
      <InputText v-model="location" class="flex-auto" />
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="email" class="font-semibold w-6rem">Email</label>
      <div class="flex flex-column gap-2">
        <InputText v-model="email" class="flex-auto" />
      </div>
    </div>
    <div class="flex align-items-center gap-3 mb-3">
      <label for="password" class="font-semibold w-6rem">Password</label>
      <div class="flex flex-column gap-2">
        <InputText v-model="password" type="password" class="flex-auto" />
        <small id="username-help">Empty password means password will not be changed.</small>
      </div>
    </div>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
      <Button type="button" label="Save" @click="updateUser"></Button>
    </div>
  </Dialog>

  <Toast />
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import axios from "@/axios";
import { useToast } from "primevue/usetoast";

const toast = useToast();

const visible = ref(false);
const userId = ref('');
const firstname = ref('');
const lastname = ref('');
const email = ref('');
const location = ref('');
const password = ref('');
const selectedRole = ref();
const roles = ref([]);

const emit = defineEmits(['added']);

const loadRoles = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/roles`);
    roles.value = response.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
  }
}

const updateUser = async () => {
  if (!selectedRole.value) {
    toast.add({ severity: 'info', summary: 'Info', detail: 'Please select a role', life: 3000 });
    return;
  }

  if (!firstname.value || !lastname.value || !email.value) {
    toast.add({ severity: 'info', summary: 'Info', detail: 'Please fill required fields', life: 3000 });
    return;
  }

  try {
    const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/${userId.value}`, {
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      location: location.value,
      password: password.value ? password.value : '',
      roleId: selectedRole.value.id
    });

    if (!response.data) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
      return;
    }

    toast.add({ severity: 'success', summary: 'Success', detail: 'Successfully added', life: 3000 });
    visible.value = false;
    emit('updated')
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 })
  }
}

const showDialog = (user) => {
  userId.value = user._id;
  firstname.value = user.firstname;
  lastname.value = user.lastname;
  email.value = user.email;
  selectedRole.value = roles.value.find(role => role.id === user.roleId);
  visible.value = true;
}

onMounted(() => {
  loadRoles();
})

defineExpose({
  showDialog
})
</script>
