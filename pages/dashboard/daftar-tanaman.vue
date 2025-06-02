<template>
  <div>
    <h1 class="mb-4 text-2xl font-semibold">Daftar Tanaman</h1>

    <div v-if="plantsListPending" class="py-4 text-center">
      Memuat data tanaman...
    </div>
    <div v-else-if="plantsListError" class="py-4 text-center text-red-500">
      Gagal memuat data tanaman: {{ plantsListError.message || plantsListError }}
    </div>
    <div v-else-if="plantList && plantList.length > 0">
      <div class="mb-4">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari tanaman..."
          class="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:w-1/3"
        />
      </div>

      <div v-if="filteredPlants.length === 0 && searchQuery" class="py-4 text-center">
        Tidak ada tanaman yang cocok dengan pencarian "{{ searchQuery }}".
      </div>
      <BaseTable
        v-else-if="filteredPlants.length > 0"
        :columns="tableDisplayColumns"
        :data="paginatedPlants"
      >
        <!-- Custom Cell Slots -->
        <template #gambar="{ row }">
          <img
            v-if="row.gambar"
            :src="getFullImageUrl(row.gambar)"
            alt="Tanaman"
            class="object-cover w-20 h-10 rounded"
          />
          <span v-else>Tidak ada gambar</span>
        </template>

        <template #category="{ row }">
          {{ row.category && row.category.nama_kategori ? row.category.nama_kategori : 'N/A' }}
        </template>
      </BaseTable>
      <div v-if="totalPagesLocal > 1" class="flex justify-center mt-6">
        <Pagination
          :current-page="currentPageLocal"
          :total-pages="totalPagesLocal"
          @update:currentPage="newPage => currentPageLocal = newPage"
        />
      </div>

      <!-- Remove old temporary display -->
      <!--
      <p>Total tanaman (awal): {{ plantList.length }}</p>
      <p>Hasil filter: {{ filteredPlants.length }} tanaman ditemukan</p>
      <p>Filter pencarian: {{ searchQuery }}</p>
      <pre>{{ filteredPlants.slice(0, 2) }}</pre>
      -->
    </div>
    <div v-else class="py-4 text-center">
      Tidak ada tanaman tersedia.
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePlantsStore } from '~/store/plants';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed, watch } from 'vue';
import BaseTable from '~/components/Table/BaseTable.vue';
import Pagination from '~/components/Pagination.vue';
import { useRuntimeConfig } from "#app";


definePageMeta({
  layout: 'dashboard',
});

const runtimeConfig = useRuntimeConfig();
const searchQuery = ref('');
const currentPageLocal = ref(1);
const itemsPerPage = ref(10); // Or any default number you prefer

const tableDisplayColumns = ['gambar', 'nama_lokal', 'nama_ilmiah', 'category'];

// Placeholder function - actual implementation might need runtimeConfig or a fixed base path
const getFullImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return ''; // Return empty string or a placeholder image path
  // Assuming imagePath from API is like 'plants/image.png' and needs a base URL
  // For example, if images are in `public/storage/plants/image.png` and served from `/storage/`
  // or if it's a full URL from the API.
  // Let's assume the path provided by `row.gambar` is already a usable URL or relative path from public root.
  // If API provides "plants/xyz.png", and it's in "public/plants/xyz.png", then "/plants/xyz.png" is correct.
  // If API provides "plants/xyz.png" and it's stored in a 'storage' linked folder,
  // it might be "/storage/plants/xyz.png".
  // For now, let's assume the path is relative to the public directory, so prefixing with '/' is a common case if not a full URL.
  if (imagePath.startsWith('http')) {
    return imagePath; // It's already a full URL
  }
  return `${runtimeConfig.public.imgURL || runtimeConfig.public.imageCDN}/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`; // Ensure it's a root-relative path
};


const plantsStore = usePlantsStore();
const { plantList, plantsListPending, plantsListError } = storeToRefs(plantsStore);

const filteredPlants = computed(() => {
  if (!plantList.value) {
    return [];
  }
      const query = searchQuery.value ? searchQuery.value.toLowerCase() : '';
      if (!query) {
    return plantList.value;
  }

  return plantList.value.filter(plant => {
        const namaLokalMatch = plant.nama_lokal &&
                               plant.nama_lokal.toLowerCase().includes(query);
        const namaIlmiahMatch = plant.nama_ilmiah &&
                                plant.nama_ilmiah.toLowerCase().includes(query);
        return namaLokalMatch || namaIlmiahMatch;
  });
});

const totalPagesLocal = computed(() => {
  if (!filteredPlants.value) return 1;
  return Math.ceil(filteredPlants.value.length / itemsPerPage.value);
});

const paginatedPlants = computed(() => {
  if (!filteredPlants.value) return [];
  const start = (currentPageLocal.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredPlants.value.slice(start, end);
});

watch(searchQuery, () => {
  currentPageLocal.value = 1;
});

onMounted(() => {
  // Attempt to fetch all plants.
  // We'll reset current page and search text in the store
  // to ensure we get a broad list.
  // The store's `fetchPlants` handles pagination if the API enforces it.
  // For true client-side filtering of *all* data, this might need
  // enhancement later if API strictly paginates with small numbers.
  plantsStore.currentPage = 1; // Reset to page 1
  plantsStore.searchText = ''; // Clear any search text
  // Potentially set a very large items per page if store/API supported it.
  // For now, rely on default behavior of fetchPlants.
  plantsStore.fetchPlants();
});

// Script section will be populated later
</script>

<style scoped>
/* Page-specific styles can be added here */
</style>
