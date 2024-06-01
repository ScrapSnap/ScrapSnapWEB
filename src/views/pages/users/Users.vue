<template>
  <div class="card">
    <h5>Users</h5>
    <p>Use this page to start from scratch and place your custom content.</p>

    <div v-if="hasPermission(permissions.WriteUsers)" class="w-full flex justify-content-end mb-3">
      <Button label="New User" icon="pi pi-plus" @click="showAddUserDialog" />
    </div>

    <DataTable :value="users" stripedRows>
      <Column field="firstname" header="Name" sortable>
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <span v-else>{{ data.firstname }}</span>
        </template>
      </Column>
      <Column field="lastname" header="Lastname" sortable>
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <span v-else>{{ data.lastname }}</span>
        </template>
      </Column>
      <Column field="location" header="Location" sortable>
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <span v-else>{{ data.location }}</span>
        </template>
      </Column>
      <Column field="email" header="Email" sortable>
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <span v-else>{{ data.email }}</span>
        </template>
      </Column>
      <Column field="createdAt" header="Date Created" sortable>
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <span v-else>{{ formatDate(data.createdAt) }}</span>
        </template>
      </Column>
      <Column field="updatedAt" header="Date Updated" sortable>
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <span v-else>{{ formatDate(data.updatedAt) }}</span>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <Button icon="pi pi-pencil" @click="showEditUserDialog(data)" severity="warning" class="mr-1" aria-label="Info" />
          <Button icon="pi pi-trash" @click="deleteUser(data)" severity="danger" class="ml-1" aria-label="Delete" />
        </template>
      </Column>
    </DataTable>

    <Toast />
    <AddUser ref="addUserDialog" @added="loadUsers" />
    <EditUser ref="editUserDialog" @updated="loadUsers" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import AddUser from "@/views/pages/users/AddUser.vue";
import { useToast } from "primevue/usetoast";
import axios from "@/axios";
import EditUser from "@/views/pages/users/EditUser.vue";
import { hasPermission, permissions } from "@/permissions";

const toast = useToast();

const loading = ref(true);
const users = ref([]);
const addUserDialog = ref();
const editUserDialog = ref();

onMounted(() => {
  loadUsers();
});

const loadUsers = async () => {
  loading.value = true;

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users`);

    if (!response.data) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
      return;
    }

    console.log(response.data);
    users.value = response.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 })
  } finally {
    loading.value = false;
  }
}

const deleteUser = async (data) => {
  try {
    console.log(data);
    const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/users/${data._id}`);

    if (!response.data) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
      return;
    }

    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Successfully deleted', life: 3000 });
    loadUsers();
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 })
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

const showAddUserDialog = () => {
  addUserDialog.value.showDialog();
}

const showEditUserDialog = (data) => {
  console.log(data);
  editUserDialog.value.showDialog(data);
}

</script>

<style scoped lang="scss">

</style>
