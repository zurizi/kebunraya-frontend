<template>
  <div>
    <h1 class="mb-6 text-3xl font-bold text-gray-900">Dashboard</h1>

    <div class="p-8 space-y-8 bg-white shadow-lg rounded-xl">
      <h2 class="text-2xl font-semibold text-gray-800">
        Selamat Datang di Dashboard Anda!
      </h2>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div
          class="p-6 transition-shadow duration-300 ease-in-out shadow-md bg-green-50 rounded-xl hover:shadow-lg"
        >
          <h3 class="mb-2 text-lg font-semibold text-green-800">
            Total Tanaman
          </h3>
          <p class="text-4xl font-bold text-green-900">{{ totalPlants }}</p>
          <NuxtLink
            to="/dashboard/daftar-tanaman"
            class="inline-block mt-3 text-sm font-medium text-green-700 hover:text-green-900"
          >
            Lihat Detail &rarr;
          </NuxtLink>
        </div>

        <div
          class="p-6 transition-shadow duration-300 ease-in-out shadow-md bg-red-50 rounded-xl hover:shadow-lg"
        >
          <h3 class="mb-2 text-lg font-semibold text-green-800">
            Total Kegiatan
          </h3>
          <p class="text-4xl font-bold text-green-900">{{ totalKegiatan }}</p>
          <NuxtLink
            to="/dashboard/daftar-kegiatan"
            class="inline-block mt-3 text-sm font-medium text-green-700 hover:text-green-900"
          >
            Lihat Detail &rarr;
          </NuxtLink>
        </div>

        <div
          class="p-6 transition-shadow duration-300 ease-in-out shadow-md bg-blue-50 rounded-xl hover:shadow-lg"
        >
          <h3 class="mb-2 text-lg font-semibold text-blue-800">
            Total Kategori Tanaman
          </h3>
          <p class="text-4xl font-bold text-blue-900">{{ totalCategories }}</p>
        </div>
      </div>

      <div>
        <h3 class="mb-4 text-xl font-semibold text-gray-800">Akses Cepat</h3>
        <div class="flex flex-wrap gap-4">
          <NuxtLink
            to="/dashboard/daftar-tanaman"
            class="px-6 py-3 text-sm font-medium text-white transition-colors duration-200 ease-in-out bg-green-900 rounded-lg shadow-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Kelola Daftar Tanaman
          </NuxtLink>
          <NuxtLink
            to="/dashboard/daftar-kegiatan"
            class="px-6 py-3 text-sm font-medium text-white transition-colors duration-200 ease-in-out bg-yellow-500 rounded-lg shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2"
          >
            Kelola Daftar Kegiatan
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlantsStore } from "~/store/plants";
import { useCategoriesStore } from "~/store/categories";
import { useKegiatanStore } from "~/store/kegiatan"; // Import kegiatan store
import { onMounted, computed } from "vue";
import { storeToRefs } from "pinia"; // Import storeToRefs

// Define layout
definePageMeta({
  layout: "dashboard",
});

// Store Instantiation
const plantsStore = usePlantsStore();
const categoriesStore = useCategoriesStore();
const kegiatanStore = useKegiatanStore(); // Instantiate kegiatan store

// Reactive State with storeToRefs
const { totalPlantsCount } = storeToRefs(plantsStore);
const { totalCategoriesCount } = storeToRefs(categoriesStore);
const { totalKegiatanCount } = storeToRefs(kegiatanStore); // Add totalKegiatanCount

// Computed Properties for Display
const totalPlants = computed(() => totalPlantsCount.value);
const totalCategories = computed(() => totalCategoriesCount.value);
const totalKegiatan = computed(() => totalKegiatanCount.value); // Add totalKegiatan computed

// onMounted Hook
onMounted(() => {
  plantsStore.fetchPlants(); // Fetches plants (and total count)
  categoriesStore.fetchCategories(); // Fetches categories (and total count)
  kegiatanStore.fetchKegiatanList(); // Fetch kegiatan list
});
</script>
