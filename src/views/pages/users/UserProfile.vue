<template>
  <div class="grid">
    <div class="col-12 md:col-6">
      <Toast />
      <div class="card p-fluid">
        <Avatar :label="userInitials" class="mr-2" size="large" style="background-color: #e9fce9; color: #126116" />
        <h5>User Profile</h5>
        <div class="field">
          <label for="name1">Name</label>
          <InputText v-model="name" id="name1" type="text" />
        </div>
        <div class="field">
          <label for="lastname1">Lastname</label>
          <InputText v-model="lastname" id="lastname1" type="text" />
        </div>
        <div class="field">
          <label for="email1">Email</label>
          <InputText v-model="email" id="email1" type="text" />
        </div>
        <br />
        <Button @click="updateUserData" :loading="isLoadingUpdateProfile" label="Save"></Button>
      </div>

      <div class="card p-fluid">
        <h5>Vertical Grid</h5>
        <div class="formgrid grid">
          <div class="field col">
            <label for="name2">Name</label>
            <InputText id="name2" type="text" />
          </div>
          <div class="field col">
            <label for="email2">Email</label>
            <InputText id="email2" type="text" />
          </div>
        </div>
      </div>
    </div>

    <div class="col-12 md:col-6">
      <div class="card p-fluid">
        <h5>Change Password</h5>
        <div class="field grid">
          <label for="name3" class="col-12 mb-2 md:col-5 md:mb-0">Current Password</label>
          <div class="col-12 md:col-7">
            <InputText v-model="currentPassword" id="name3" type="password" />
          </div>
        </div>
        <div class="field grid">
          <label for="email3" class="col-12 mb-2 md:col-5 md:mb-0">New Password</label>
          <div class="col-12 md:col-7">
            <InputText v-model="newPassword" id="email3" type="password" />
          </div>
        </div>
        <br />
        <Button @click="updateUserPassword" :loading="isLoadingPassword" label="Change"></Button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import { useStore } from "@/store";
import { useToast } from "primevue/usetoast";
import axios from "@/axios";

const store = useStore();
const toast = useToast();

const userInitials = ref('??')
const name = ref('');
const lastname = ref('');
const email = ref('');
const currentPassword = ref('');
const newPassword = ref('');
const isLoadingUpdateProfile = ref(false);
const isLoadingPassword = ref(false);

onMounted(() => {
  const user = store.getUser();
  if (!user) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'User not found' });
    return;
  }

  name.value = user.firstname;
  lastname.value = user.lastname;
  email.value = user.email;
  userInitials.value = user.firstname.charAt(0) + user.lastname.charAt(0);
});

const updateUserData = async () => {
  isLoadingUpdateProfile.value = true;

  const userId = store.getUser()._id;
  const user = {
    firstname: name.value,
    lastname: lastname.value,
    email: email.value
  };

  try {
    const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}`, user);
    if (!response.data) {
      toast.add({ severity: 'error', summary: 'Oops', detail: 'Something went wrong...', life: 3000 });
      return;
    }

    store.setUser(response.data);
    toast.add({ severity: 'success', summary: 'Success', detail: 'User data updated', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Oops', detail: 'Something went wrong...', life: 3000 });
  } finally {
    isLoadingUpdateProfile.value = false;
  }
}

const updateUserPassword = async () => {
  if (!newPassword || newPassword.value.length < 8) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Password must be at least 6 characters long', life: 3000 });
    return;
  }

  isLoadingPassword.value = true;

  const userId = store.getUser()._id;
  const updatePasswordData = {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value
  };

  try {
    const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/${userId}/password`, updatePasswordData);
    if (!response.data) {
      toast.add({ severity: 'error', summary: 'Oops', detail: 'Something went wrong...', life: 3000 });
      return;
    }

    toast.add({ severity: 'success', summary: 'Success', detail: 'Password changed', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Oops', detail: 'Incorrect current password.', life: 3000 });
  } finally {
    currentPassword.value = '';
    newPassword.value = '';
    isLoadingPassword.value = false;
  }
}

</script>
