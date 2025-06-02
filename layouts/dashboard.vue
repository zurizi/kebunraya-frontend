<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg">
      <div class="px-4 mx-auto max-w-7xl">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <span class="text-xl font-bold">Dashboard Admin</span>
          </div>
          <div class="flex items-center space-x-4">
            <button
              class="text-gray-700 hover:text-gray-900"
              @click="handleLogout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
    <div class="flex">
      <aside class="w-64 h-screen bg-white shadow-lg">
        <div class="p-4">
          <nav class="space-y-2">
            <NuxtLink to="/dashboard" class="sidebar-link">Dashboard</NuxtLink>
          </nav>
        </div>
      </aside>
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { navigateTo } from "#app";
import { useAuthStore } from "@/store/auth";
const authStore = useAuthStore();
import { useNuxtApp } from "#app";

const { $swal } = useNuxtApp();
const handleLogout = async () => {
  console.log("Attempting logout...");

  const result = await $swal.fire({
    title: "Apakah Anda Yakin?",
    text: "Anda akan keluar dari akun Anda.",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ya, Keluar!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    console.log("Confirmed. Logging out...");
    try {
      await authStore.logout();

      await navigateTo("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      $swal.fire("Gagal!", "Terjadi kesalahan saat mencoba keluar.", "error");
    }
  } else {
    console.log("Logout cancelled.");
  }
};
</script>

<style scoped>
.sidebar-link {
  @apply block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg;
}
</style>
