<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <Toast />
        <div class="flex flex-column align-items-center justify-content-center">
            <!--
            <img :src="logoUrl" alt="ScrapSnap Logo" class="mb-5 w-6rem flex-shrink-0" />
            -->
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img :src="logoUrl" alt="Image" height="50" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Welcome back!</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
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
                        <Button label="Sign In" @click="login" class="w-full p-3 text-xl"></Button>
                        <br />
                        <br />
                        <div class="text-center">
                          <a class="font-medium no-underline ml-2 text-right cursor-pointer" @click="goToSignUp" style="color: var(--primary-color)">Don't have account yet? Sign up</a>
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
import {useStore} from "@/store";

const router = useRouter();
const store = useStore();
const toast = useToast();
const { layoutConfig } = useLayout();

const email = ref('');
const password = ref('');
const checked = ref(false);

const logoUrl = computed(() => {
  return `icons/${layoutConfig.darkTheme.value ? 'icon-512x512' : 'icon-512x512'}.png`;
});

const goToSignUp = () => {
  router.push('/auth/register');
}

async function login() {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, {
      email: email.value,
      password: password.value
    });

    if (!response.data.token) {
      toast.add({ severity: 'error', summary: 'Error', detail: 'Wrong email or password', life: 3000 });
      return;
    }

    await store.login(response.data.token, response.data.user);
    await router.push('/');
    toast.add({ severity: 'success', summary: 'Success Message', detail: 'Logged in successfully', life: 3000 });
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'Wrong email or password', life: 3000 })
  }
}

</script>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
