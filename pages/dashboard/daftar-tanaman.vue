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

          <!-- New Slot for Actions -->
          <template #actions="{ row }">
            <div class="flex items-center space-x-2">
              <button
                @click="handleEdit(row.id)"
                class="px-3 py-1 text-xs font-medium text-black bg-yellow-400 rounded shadow-sm hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-1"
              >
                Edit
              </button>
              <button
                @click="handleDelete(row.id)"
                class="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              >
                Hapus
              </button>
            </div>
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

    <!-- Modal for Editing Plant -->
    <Modal 
      :show="showEditModal" 
      title="Edit Tanaman" 
      @update:show="showEditModal = $event" 
      maxWidth="2xl"
    >
      <div v-if="plantDetailPending" class="py-4 text-center">Memuat detail tanaman...</div>
      <PlantForm 
        v-else-if="editingPlant"
        :isEditMode="true" 
        :initialData="editingPlant" 
        @submit="handleUpdatePlant" 
        @close="showEditModal = false" 
      />
      <div v-else-if="plantDetailError" class="py-4 text-center text-red-500">
        Gagal memuat detail tanaman: {{ plantDetailError.message || 'Error tidak diketahui' }}
      </div>
      <div v-else class="py-4 text-center text-gray-500">
        Tidak ada data tanaman untuk diedit atau tanaman tidak ditemukan.
      </div>
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
const { 
  plantList, plantsListPending, plantsListError, 
  currentPage, totalPages, 
  plantDetail, plantDetailPending, plantDetailError,
  // plantUpdatePending, plantUpdateError // These are usually handled within the form or store action, not directly watched by page
} = storeToRefs(plantsStore);

// Local state for the search query
const searchQuery = ref(plantsStore.searchText || ''); // Initialize with store's search text
const showCreateModal = ref(false);

// State for Edit Modal
const showEditModal = ref(false);
const editingPlant = ref<any | null>(null); // Using 'any' for now, ideally a Plant interface

const tableDisplayColumns = [
  { key: 'gambar', label: 'Gambar' },
  { key: 'nama_lokal', label: 'Nama Lokal' },
  { key: 'nama_ilmiah', label: 'Nama Ilmiah' },
  { key: 'category', label: 'Kategori' },
  { key: 'actions', label: 'Aksi' }
];

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

// Placeholder for actual Edit/Delete handlers
async function handleEdit(plantId: number | string) {
  // plantsStore.resetPlantDetail(); // Optional: reset detail state before fetching new one
  try {
    await plantsStore.fetchPlantDetail(plantId); // This action sets plantDetail, plantDetailPending, plantDetailError in store
    
    if (plantDetail.value && !plantDetailError.value) { 
      const plantDataForEdit = { ...plantDetail.value };

      // Check if 'gambar' exists and is a string (potential relative path)
      if (plantDataForEdit.gambar && typeof plantDataForEdit.gambar === 'string') {
        plantDataForEdit.gambar = getFullImageUrl(plantDataForEdit.gambar);
      }
      
      editingPlant.value = plantDataForEdit;
      showEditModal.value = true;
    } else if (plantDetailError.value) {
      // Error is already set in the store by fetchPlantDetail
      console.error(`Error fetching plant detail for ID ${plantId}:`, plantDetailError.value);
      alert(`Gagal mengambil detail tanaman: ${plantDetailError.value.message || 'Error tidak diketahui'}`);
    } else {
      // This case means fetchPlantDetail resolved, but plantDetail is null (e.g., 404 not found)
      alert(`Tanaman dengan ID ${plantId} tidak ditemukan.`);
    }
  } catch (error: any) { 
    // This catch block is for unexpected errors from fetchPlantDetail itself if it re-throws
    console.error(`Gagal memproses permintaan detail tanaman ${plantId}:`, error);
    alert(`Gagal memproses permintaan detail tanaman: ${error.message || 'Error tidak diketahui'}`);
  }
  // plantDetailPending from store can be used directly in the template for loading states
}

async function handleUpdatePlant(formData: any) {
  if (!editingPlant.value?.id) {
    alert('Error: ID tanaman untuk diedit tidak ditemukan.');
    return;
  }
  try {
    // The store's updatePlant action will set its own pending/error states (plantUpdatePending, plantUpdateError)
    await plantsStore.updatePlant(editingPlant.value.id, formData);
    
    showEditModal.value = false;
    alert('Tanaman berhasil diupdate!');
    await plantsStore.fetchPlants(); // Refresh the plant list
    editingPlant.value = null; // Clear editing plant after update
  } catch (error: any) {
    console.error('Gagal mengupdate tanaman:', error.response?.data || error.message || error);
    const errData = error.response?.data;
    let alertMessage = 'Gagal mengupdate tanaman.';
    if (errData && errData.message) {
      alertMessage += ` Pesan: ${errData.message}`;
    }
    if (errData && errData.errors) {
      const fieldErrors = Object.keys(errData.errors).map(key => `${key}: ${errData.errors[key].join(', ')}`).join('; ');
      alertMessage += `\nDetails: ${fieldErrors}`;
    }
    alert(alertMessage);
    // Optionally, do not clear editingPlant.value or close modal if user should retry.
  }
}

const handleDelete = (id: number | string) => {
  console.log('Delete plant with id:', id);
  // Implementation for deleting will go here (e.g., show confirmation, call store action)
  if (confirm(`Apakah Anda yakin ingin menghapus tanaman dengan ID ${id}?`)) {
    alert(`Placeholder: Delete plant ID ${id} confirmed`);
    // plantsStore.deletePlant(id).then(...).catch(...);
  }
};
</script>

<style scoped>
/* Page-specific styles can be added here */
</style>
