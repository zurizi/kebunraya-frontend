<template>
  <div>
    <h1 class="mb-6 text-3xl font-bold text-gray-900">Dashboard</h1>
    
    <div class="bg-white p-8 rounded-xl shadow-lg space-y-8">
      <h2 class="text-2xl font-semibold text-gray-800">
        Selamat Datang di Dashboard Anda!
      </h2>

      <!-- Summary Statistics Section -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <!-- Total Plants Card -->
        <div class="bg-green-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <h3 class="text-lg font-semibold text-green-800 mb-2">Total Tanaman</h3>
          <p class="text-4xl font-bold text-green-900">{{ totalPlants }}</p>
          <NuxtLink to="/dashboard/daftar-tanaman" class="inline-block mt-3 text-sm text-green-700 hover:text-green-900 font-medium">
            Lihat Detail &rarr;
          </NuxtLink>
        </div>

        <!-- Total Categories Card -->
        <div class="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <h3 class="text-lg font-semibold text-blue-800 mb-2">Total Kategori</h3>
          <p class="text-4xl font-bold text-blue-900">{{ totalCategories }}</p>
           <!-- Optional: Link to a categories management page if it exists -->
          <!-- <NuxtLink to="/dashboard/kategori" class="inline-block mt-3 text-sm text-blue-700 hover:text-blue-900 font-medium">
            Lihat Detail &rarr;
          </NuxtLink> -->
        </div>
      </div>

      <!-- Quick Links Section -->
      <div>
        <h3 class="text-xl font-semibold text-gray-800 mb-4">Akses Cepat</h3>
        <div class="flex flex-wrap gap-4">
          <NuxtLink 
            to="/dashboard/daftar-tanaman" 
            class="px-6 py-3 text-sm font-medium text-white bg-green-900 rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 ease-in-out"
          >
            Kelola Daftar Tanaman
          </NuxtLink>
          <!-- Example of another link, could be for adding plant directly if modal can be triggered by URL or other state -->
          <!-- <NuxtLink 
            to="/dashboard/daftar-tanaman?action=add" 
            class="px-6 py-3 text-sm font-medium text-white bg-yellow-500 rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-colors duration-200 ease-in-out"
          >
            Tambah Tanaman Baru
          </NuxtLink> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlantsStore } from '~/store/plants';
import { useCategoriesStore } from '~/store/categories';
import { onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia'; // Import storeToRefs

// Define layout
definePageMeta({
  layout: "dashboard",
});

// Store Instantiation
const plantsStore = usePlantsStore();
const categoriesStore = useCategoriesStore();

// Reactive State with storeToRefs
const { totalPlantsCount } = storeToRefs(plantsStore);
const { totalCategoriesCount } = storeToRefs(categoriesStore);

// Computed Properties for Display
const totalPlants = computed(() => totalPlantsCount.value);
const totalCategories = computed(() => totalCategoriesCount.value);

// onMounted Hook
onMounted(() => {
  plantsStore.fetchPlants(); // Fetches plants (and total count)
  categoriesStore.fetchCategories(); // Fetches categories (and total count)
});
</script>
