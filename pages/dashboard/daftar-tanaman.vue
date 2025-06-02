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
    </div>
    <div v-else class="py-4 text-center">
      Tidak ada tanaman tersedia.
    </div>

    <Modal :show="showCreateModal" title="Tambah Tanaman Baru" @update:show="showCreateModal = $event" maxWidth="2xl">
      <PlantForm @submit="handleCreatePlant" @close="showCreateModal = false" />
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { usePlantsStore } from '~/store/plants';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed, watch } from 'vue';
import BaseTable from '~/components/Table/BaseTable.vue';
import Pagination from '~/components/Pagination.vue';
import { useRuntimeConfig } from "#app";
import Modal from '~/components/Modal.vue';
import PlantForm from '~/components/dashboard/PlantForm.vue';

definePageMeta({
  layout: 'dashboard',
});

const runtimeConfig = useRuntimeConfig();
const searchQuery = ref('');
const currentPageLocal = ref(1);
const itemsPerPage = ref(10); 

const showCreateModal = ref(false);

const tableDisplayColumns = ['gambar', 'nama_lokal', 'nama_ilmiah', 'category'];

const getFullImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return ''; 
  if (imagePath.startsWith('http')) {
    return imagePath; 
  }
  return `${runtimeConfig.public.imgURL || runtimeConfig.public.imageCDN}/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`;
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
    const namaLokalMatch = plant.nama_lokal && plant.nama_lokal.toLowerCase().includes(query);
    const namaIlmiahMatch = plant.nama_ilmiah && plant.nama_ilmiah.toLowerCase().includes(query);
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
  plantsStore.currentPage = 1; 
  plantsStore.searchText = ''; 
  plantsStore.fetchPlants();
});

async function handleCreatePlant(formData: any) {
  try {
    await plantsStore.createPlant(formData);
    showCreateModal.value = false;
    alert('Tanaman berhasil ditambahkan!');
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
