<template>
  <div class="card">
    <h5>Roles</h5>
    <p>Use this page to start from scratch and place your custom content.</p>

    <div class="w-full flex justify-content-end mb-3">
      <Button label="New Role" icon="pi pi-plus" @click="showAddRoleDialog" />
    </div>

    <DataTable :value="schedule" stripedRows>
      <Column field="name" header="Name" style="width: 20%" sortable>
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <span v-else>{{ data.name }}</span>
        </template>
      </Column>
      <Column field="permissions" header="Permissions" style="width: 50%" sortable>
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <div v-else-if="!data.permissions || data.permissions.length === 0">
              <Tag severity="warning" value="No permissions" />
          </div>
          <div v-else>
            <span v-for="(permission, index) in data.permissions" :key="index" class="tag-container">
              <Tag :value="getPermissionLabel(permission)" />
            </span>
          </div>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="{ data }">
          <Skeleton v-if="loading"></Skeleton>
          <Button icon="pi pi-pencil" @click="showEditRoleDialog(data)" severity="warning" class="mr-1" aria-label="Info" />
          <Button icon="pi pi-trash" @click="deleteRole(data)" severity="danger" class="ml-1" aria-label="Delete" />
        </template>
      </Column>
    </DataTable>

    <Toast />
    <AddRole ref="addRoleDialog" @added="loadRoles" />
    <EditRole ref="editRoleDialog" @updated="loadRoles" />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import AddRole from "@/views/pages/roles/AddRole.vue";
import { useToast } from "primevue/usetoast";
import axios from "@/axios";
import { getPermissionLabel } from "@/permissions";
import EditRole from "@/views/pages/roles/EditRole.vue";

const toast = useToast();

const loading = ref(true);
const schedule = ref([]);
const addRoleDialog = ref();
const editRoleDialog = ref();

onMounted(() => {
  loadRoles();
});

const loadRoles = async () => {
  loading.value = true;

  try {
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/roles`);

    if (!response.data) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
      return;
    }

    schedule.value = response.data;
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 })
  } finally {
    loading.value = false;
  }
}

const deleteRole = async (data) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/roles/${data.id}`);

    if (!response) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
      return;
    }

    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Successfully deleted', life: 3000 });
    loadRoles();
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 })
  }
}

const showAddRoleDialog = () => {
  addRoleDialog.value.showDialog();
}

const showEditRoleDialog = (data) => {
  editRoleDialog.value.showDialog(data);
}
</script>
<style scoped>
.tag-container {
  margin-right: 0.5rem; /* Adjust the margin as needed */
  margin-bottom: 0.5rem;
  display: inline-block;
}
</style>
