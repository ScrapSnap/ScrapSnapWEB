<template>
  <Dialog v-model:visible="visible" modal header="New Role" :draggable="false" :style="{ width: '40rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div class="flex align-items-center gap-3 mb-3">
      <label for="name" class="font-semibold w-6rem">Name</label>
      <InputText v-model="name" class="flex-auto" />
    </div>
    <label for="firstname" class="font-semibold">Permissions</label>
    <br>
    <br>
    <div v-for="permission of permissions" :key="permission.key" class="flex align-items-center mt-2 mb-2">
      <Checkbox v-model="selectedPermissions" :inputId="permission.key" name="permission" :value="permission.name" />
      <label class="ml-2" :for="permission.key">{{ permission.name }}</label>
    </div>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="visible = false"></Button>
      <Button type="button" label="Save" @click="saveRole"></Button>
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
const name = ref('');
const selectedPermissions = ref([]);

const emit = defineEmits(['added']);

const permissions = ref([
  { key: '100', name: 'Read Users' },
  { key: '101', name: 'Write Users' },
  { key: '102', name: 'Delete Users' },
  { key: '201', name: 'Write Schedules' },
  { key: '202', name: 'Delete Schedules' },
  { key: '301', name: 'Write Collection Points' },
  { key: '302', name: 'Delete Collection Points' },
  { key: '401', name: 'Read User Statistics' },
  { key: '402', name: 'Write User Statistics' },
  { key: '403', name: 'Delete User Statistics' }
]);

const getPermissionKey = (permission) => {
  const foundPermission = permissions.value.find(p => p.name === permission);
  return foundPermission ? foundPermission.key : null;
};

const saveRole = async () => {
  const permissions = [];
  if (selectedPermissions.value) {
    selectedPermissions.value.forEach(permission => {
      const key = getPermissionKey(permission);
      if (key) {
        permissions.push(key);
      }
    });
  }

  console.log(permissions);

  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/roles`, {
      name: name.value,
      permissions: permissions
    });

    if (!response.data) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 });
      return;
    }

    toast.add({ severity: 'success', summary: 'Success', detail: 'Successfully added', life: 3000 });
    visible.value = false;
    emit('added')
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong...', life: 3000 })
  }
}

const showDialog = () => {
  visible.value = true;
}

defineExpose({
  showDialog
})
</script>

<style scoped lang="scss">

</style>
