<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useKegiatanStore } from "@/store/kegiatan";
// import { useRuntimeConfig } from "#app"; // No longer directly needed
import { useImageUtils } from '~/composables/useImageUtils';

const kegiatanStore = useKegiatanStore();
// const runtimeConfig = useRuntimeConfig(); // No longer directly needed
const { getFirstImage, parseImageString } = useImageUtils();
const defaultPlaceholder = '/geometric-placeholder.svg';


const searchText = ref("");

const updatePage = (page: number) => {
  kegiatanStore.updatePage(page);
};

const handleSearch = (searchValue: string) => {
  kegiatanStore.setSearchText(searchValue);
};

const getImageCount = (imageString: string | null | undefined): number => {
  return parseImageString(imageString).length;
};

onMounted(() => {
  kegiatanStore.fetchKegiatanList();
});
</script>

<template>
  <div
    class="flex flex-col px-4 py-12 mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8"
  >
    <SearchInput
      v-model="searchText"
      placeholder="Cari Kegiatan"
      @search="handleSearch"
    />

    <div v-if="kegiatanStore.pending" class="text-center">
      Loading kegiatan...
    </div>

    <div v-else-if="kegiatanStore.error" class="text-center text-red-500">
      Terjadi kesalahan saat mengambil data kegiatan.
    </div>

    <div
      v-else-if="
        kegiatanStore.kegiatanList && kegiatanStore.kegiatanList.length > 0
      "
      class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      <nuxt-link
        v-for="kegiatan in kegiatanStore.kegiatanList"
        :to="`/kegiatan/${kegiatan.id}`"
        :key="kegiatan.id"
        class="flex flex-col overflow-hidden shadow rounded-3xl relative"
      >
        <div class="w-full aspect-[5/4] bg-gray-200">
          <img
            :src="getFirstImage(kegiatan.gambar) || defaultPlaceholder"
            :alt="`Gambar ${kegiatan.judul || 'Kegiatan'}`"
            class="object-cover w-full h-full"
          />
        </div>
        <div v-if="getImageCount(kegiatan.gambar) > 1"
             class="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {{ getImageCount(kegiatan.gambar) }}
        </div>

        <div class="flex flex-col w-full p-4 space-y-2">
          <div
            class="flex items-center justify-center w-full text-2xl font-semibold text-center"
          >
            {{ kegiatan.judul }}
          </div>

          <div
            class="flex items-center justify-center w-full text-sm text-center"
          >
            {{ kegiatan.tanggal }}
          </div>

          <div
            class="flex items-center justify-center w-full text-sm text-center"
          >
            {{ kegiatan.lokasi }}
          </div>
        </div>
      </nuxt-link>
    </div>

    <div v-else class="text-center text-gray-600">
      Tidak ada data kegiatan ditemukan.
    </div>

    <Pagination
      v-if="
        kegiatanStore.kegiatanList &&
        kegiatanStore.kegiatanList.length > 0 &&
        kegiatanStore.totalPages > 1
      "
      v-model:currentPage="kegiatanStore.currentPage"
      :totalPages="kegiatanStore.totalPages"
      @page-change="updatePage"
    />
  </div>
</template>
