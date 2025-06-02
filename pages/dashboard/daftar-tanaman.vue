<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Daftar Tanaman</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 text-white bg-green-900 rounded-md shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Tambah Tanaman Baru
      </button>
    </div>

    <!-- Search Input -->
    <div class="mb-4">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Cari tanaman (nama lokal atau ilmiah)..."
        class="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:w-1/3"
      />
    </div>

    <!-- Loading State -->
    <div v-if="plantsListPending && !plantList.length" class="py-4 text-center"> <!-- Show only if list is empty -->
      Memuat data tanaman...
    </div>
    <!-- Error State -->
    <div v-else-if="plantsListError" class="py-4 text-center text-red-500">
      Gagal memuat data tanaman: {{ plantsListError.message || plantsListError }}
    </div>
    <!-- Data Table and No Data States -->
    <div v-else>
      <div v-if="plantList && plantList.length > 0">
        <BaseTable
          :columns="tableDisplayColumns"
          :data="plantList"
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

        <div v-if="totalPages > 1" class="flex justify-center mt-6">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @update:currentPage="handlePageChange($event)"
          />
        </div>
      </div>
      <!-- No matching search results -->
      <div v-else-if="plantList.length === 0 && plantsStore.searchText" class="py-4 text-center">
        Tidak ada tanaman yang cocok dengan pencarian "{{ plantsStore.searchText }}".
      </div>
      <!-- No plants available at all -->
      <div v-else class="py-4 text-center">
        Tidak ada tanaman tersedia.
      </div>
    </div>

    <!-- Modal for Creating Plant -->
    <Modal :show="showCreateModal" title="Tambah Tanaman Baru" @update:show="showCreateModal = $event" maxWidth="2xl">
      <PlantForm @submit="handleCreatePlant" @close="showCreateModal = false" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { usePlantsStore } from '~/store/plants';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue'; // Added watch, removed watchDebounced
import BaseTable from '~/components/Table/BaseTable.vue';
import Pagination from '~/components/Pagination.vue';
import { useRuntimeConfig } from "#app";
import Modal from '~/components/Modal.vue';
import PlantForm from '~/components/dashboard/PlantForm.vue';

definePageMeta({
  layout: 'dashboard',
});

const runtimeConfig = useRuntimeConfig();
const plantsStore = usePlantsStore();

// Reactive state from the store
const { plantList, plantsListPending, plantsListError, currentPage, totalPages } = storeToRefs(plantsStore);

// Local state for the search query
const searchQuery = ref(plantsStore.searchText || ''); // Initialize with store's search text
const showCreateModal = ref(false);

const tableDisplayColumns = ['gambar', 'nama_lokal', 'nama_ilmiah', 'category'];

const getFullImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return ''; 
  if (imagePath.startsWith('http')) {
    return imagePath; 
  }
  return `${runtimeConfig.public.imgURL || runtimeConfig.public.imageCDN}/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`;
};

// Fetch initial data when component is mounted
onMounted(() => {
  // If there's an existing search query in the store, respect it, otherwise fetch all.
  // currentPage will also be respected if already set in store (e.g. from previous navigation)
  // plantsStore.currentPage = 1; // Optionally reset to page 1 on every mount
  plantsStore.fetchPlants();
});

// Search functionality
function performSearch() {
  plantsStore.searchText = searchQuery.value;
  plantsStore.currentPage = 1; // Reset to page 1 for new search
  plantsStore.fetchPlants();
}

const debouncedPerformSearch = debounce(performSearch, 500);

// Watch for changes in searchQuery and trigger search with debounce
watch(searchQuery, () => {
  // The debounced function will handle the delay.
  debouncedPerformSearch();
});

// Handle page changes from Pagination component
function handlePageChange(newPage: number) {
  plantsStore.currentPage = newPage;
  plantsStore.fetchPlants();
}

// Custom debounce function
function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null; // Clear timeoutId after function execution
    }, delay);
  };
}

// Handle plant creation
async function handleCreatePlant(formData: any) {
  try {
    await plantsStore.createPlant(formData);
    showCreateModal.value = false;
    alert('Tanaman berhasil ditambahkan!');
    // Fetch plants, which should now include the new one and respect current page/filters
    await plantsStore.fetchPlants(); 
  } catch (error: any) {
    console.error('Gagal menambahkan tanaman:', error.response?.data || error.message || error);
    const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan saat menambahkan tanaman.';
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors;
      const fieldErrors = Object.keys(errors).map(key => `${key}: ${errors[key].join(', ')}`).join('; ');
      alert(`Gagal menambahkan tanaman: ${errorMessage}\nDetails: ${fieldErrors}`);
    } else {
      alert(`Gagal menambahkan tanaman: ${errorMessage}`);
    }
  }
}
</script>

<style scoped>
/* Page-specific styles can be added here */
</style>
