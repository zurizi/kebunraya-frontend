<script setup lang="ts">
import { ref } from "vue";

import { useAuthStore } from "@/store/auth";

import { navigateTo } from "#imports";

import { storeToRefs } from "pinia";

const authStore = useAuthStore();

const email = ref<string>("admin@kebunraya.com");

const password = ref<string>("admin@kebunraya.com!");

const {
  isLoading: storeIsLoading,
  error: storeError,
  isAuthenticated,
  token,
} = storeToRefs(authStore);

const handleLogin = async () => {
  await authStore.login({
    email: email.value,
    password: password.value,
  });

  if (isAuthenticated.value) {
    await navigateTo("/dashboard");
  }
};
</script>

<template>
  <div
    class="flex items-center justify-center min-h-[85vh] px-4 py-12 bg-gray-50 sm:px-6 lg:px-8"
  >
    <div class="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-xl">
      <div>
        <h2 class="mt-6 text-3xl font-extrabold text-center text-gray-900">
          Login
        </h2>
        <p class="mt-2 text-sm text-center text-gray-600">Masuk ke akun Anda</p>
      </div>

      {{ token }}

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div v-if="storeError" class="text-sm text-center text-red-600">
          Periksa Email dan password yang anda masukkan
        </div>

        <div>
          <label for="email" class="sr-only">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
            v-model="email"
            class="block w-full px-5 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-full focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            placeholder="Alamat Email"
          />
        </div>
        <div>
          <label for="password" class="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autocomplete="current-password"
            required
            v-model="password"
            class="block w-full px-5 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-full focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
            placeholder="Password"
          />
        </div>

        <div>
          <button
            type="submit"
            class="relative flex justify-center w-full px-4 py-3 text-base font-medium text-white bg-green-900 border border-transparent rounded-full group hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="storeIsLoading"
          >
            <span class="absolute inset-y-0 left-0 flex items-center pl-3">
            </span>
            <span v-if="storeIsLoading">Loading...</span>
            <span v-else>Masuk</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
