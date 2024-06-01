<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <Toast />
        <div class="flex flex-column align-items-center justify-content-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img :src="logoUrl" alt="Image" height="50" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Welcome!</div>
                        <span class="text-600 font-medium">Sign up to continue</span>
                    </div>

                    <div>
                        <label for="firstname" class="block text-900 text-xl font-medium mb-2">Firstname</label>
                        <InputText id="firstname" type="text" placeholder="Firstname" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="firstname" />

                        <label for="lastname" class="block text-900 text-xl font-medium mb-2">Lastname</label>
                        <InputText id="lastname" type="text" placeholder="Lastname" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="lastname" />

                        <label for="location" class="block text-900 text-xl font-medium mb-2">Location</label>
                        <InputText id="location" type="text" placeholder="Location" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="location" />

                      <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div>
                        <Button label="Sign Up" @click="register" class="w-full p-3 text-xl"></Button>
                        <br />
                        <br />
                        <div class="text-center">
                          <a class="font-medium no-underline ml-2 text-right cursor-pointer" @click="goToSignIn" style="color: var(--primary-color)">Already have an account? Sign in</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import axios from "axios";
import { useToast } from "primevue/usetoast";
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const { layoutConfig } = useLayout();

const firstname = ref('');
const lastname = ref('');
const email = ref('');
const location = ref('');
const password = ref('');
const checked = ref(false);

const logoUrl = computed(() => {
  return `icons/${layoutConfig.darkTheme.value ? 'icon-512x512' : 'icon-512x512'}.png`;
});

const goToSignIn = () => {
  router.push('/auth/login');
}

async function register() {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, {
      firstname: firstname.value,
      lastname: lastname.value,
      email: email.value,
      location: location.value,
      password: password.value,
      roleId: '',
    });

    if (!response.data) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 });
      return;
    }

    await router.push('/auth/login');
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Sing up successfull', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong', life: 3000 })
  }
}

</script>
