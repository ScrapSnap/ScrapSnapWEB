<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h5>Upload Inappropriate Disposal</h5>
        <FileUpload name="demo[]" @uploader="onUpload" :multiple="true" accept="image/*" :maxFileSize="1000000" customUpload />
      </div>
    </div>
  </div>
  <Toast />
</template>
<script setup>
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const onUpload = (event) => {
  const uploadedFiles = event.files;
  console.log(uploadedFiles);
  toast.add({ severity: 'success', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};
</script>
