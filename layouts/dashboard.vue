<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg">
      <div class="px-4 mx-auto max-w-7xl">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <!-- Hamburger button -->
            <button
              @click="toggleSidebar"
              class="px-2 py-1 mr-2 text-gray-700 border border-gray-300 rounded lg:hidden hover:text-gray-900 hover:bg-gray-100"
              aria-label="Open sidebar"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
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
      <!-- Sidebar -->
      <div
        class="fixed inset-0 z-20 bg-black bg-opacity-25 lg:hidden"
        v-show="isSidebarOpen"
        @click="isSidebarOpen = false"
      ></div>
      <aside
        class="fixed inset-y-0 left-0 z-30 w-64 h-screen overflow-y-auto transition duration-300 ease-in-out transform bg-white shadow-lg lg:static lg:inset-auto lg:translate-x-0"
        :class="{ 'translate-x-0': isSidebarOpen, '-translate-x-full': !isSidebarOpen }"
      >
        <div class="p-4">
          <nav class="space-y-2">
            <NuxtLink to="/dashboard" class="sidebar-link" @click="isSidebarOpen = false">Dashboard</NuxtLink>
            <NuxtLink to="/dashboard/daftar-tanaman" class="sidebar-link" @click="isSidebarOpen = false">Daftar Tanaman</NuxtLink>
          </nav>
        </div>
      </aside>
      <main class="flex-1 p-4 sm:p-6 lg:p-8">
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
import { ref } from 'vue';

const isSidebarOpen = ref(false); // Default to closed on mobile

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

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
