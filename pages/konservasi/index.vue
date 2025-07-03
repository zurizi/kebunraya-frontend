<script setup lang="ts">
import { usePlantsStore } from "@/store/plants";
// import { useRuntimeConfig } from "#app"; // No longer directly needed here for image URL construction
import { onMounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useImageUtils } from '~/composables/useImageUtils';

const plantsStore = usePlantsStore();
// const runtimeConfig = useRuntimeConfig(); // No longer directly needed here
const { getFirstImage, parseImageString } = useImageUtils();
// const defaultPlaceholder = '/geometric-placeholder.svg'; // No longer needed

const searchText = ref("");

const handleSearch = (searchValue: string) => {
  plantsStore.setSearchText(searchValue);
};

const getImageCount = (imageString: string | null | undefined): number => {
  return parseImageString(imageString).length;
};

onMounted(() => {
  plantsStore.fetchPlants();
});

onBeforeRouteLeave((to, from, next) => {
  plantsStore.resetCategory();
  next();
});
</script>

<template>
  <div
    class="flex flex-col px-4 py-12 mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8"
  >
    <SearchInput
      v-model="searchText"
      placeholder="Cari Tanaman"
      @search="handleSearch"
    />

    <div v-if="plantsStore.pending">Loading tanaman...</div>
    <div v-else-if="plantsStore.error">
      Terjadi kesalahan saat mengambil data tanaman.
    </div>

    <div
      v-else-if="
        Array.isArray(plantsStore.plantList) && plantsStore.plantList.length > 0
      "
      class="grid w-full grid-cols-2 gap-4 xl:gap-6 3xl:gap-8 lg:grid-cols-3"
    >
      <nuxt-link
        v-for="plant in plantsStore.plantList"
        :to="`/konservasi/${plant.id}`"
        :key="plant.id"
        class="flex flex-col overflow-hidden shadow rounded-3xl relative"
      >
        <div class="w-full aspect-[5/4] bg-gray-200 flex items-center justify-center">
          <img
            v-if="getFirstImage(plant.gambar)"
            :src="getFirstImage(plant.gambar)!"
            :alt="`Gambar ${plant.nama_lokal || 'Tanaman'}`"
            class="object-cover w-full h-full"
          />
          <span v-else class="text-gray-500 text-sm">Belum ada gambar</span>
        </div>
        <div v-if="getImageCount(plant.gambar) > 1"
             class="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          {{ getImageCount(plant.gambar) }}
        </div>

        <div class="flex flex-col w-full p-2 space-y-1 md:space-y-2 md:p-4">
          <div class="flex w-full space-x-2 font-semibold">
            <div class="justify-between hidden w-5/12 lg:flex">
              <span>Nama Ilmiah</span>
              <span>:</span>
            </div>
            <div class="flex w-full lg:w-7/12">{{ plant.nama_ilmiah }}</div>
          </div>

          <div class="flex w-full space-x-2">
            <div class="justify-between hidden w-5/12 lg:flex">
              <span>Nama Lokal</span>
              <span>:</span>
            </div>
            <div class="flex w-full lg:w-7/12">{{ plant.nama_lokal }}</div>
          </div>

          <div class="hidden w-full space-x-2 lg:flex">
            <div class="flex justify-between w-5/12">
              <span>Keluarga</span>
              <span>:</span>
            </div>
            <div class="flex w-7/12">{{ plant.keluarga }}</div>
          </div>

          <div class="hidden w-full space-x-2 lg:flex">
            <div class="flex justify-between w-5/12">
              <span>Umur</span>
              <span>:</span>
            </div>
            <div class="flex w-7/12">{{ plant.umur }}</div>
          </div>

          <div class="hidden w-full space-x-2 lg:flex">
            <div class="flex justify-between w-5/12">
              <span>Perawakan</span>
              <span>:</span>
            </div>
            <div class="flex w-7/12">{{ plant.perawakan }}</div>
          </div>

          <div class="hidden w-full space-x-2 lg:flex" v-if="plant.category">
            <div class="flex justify-between w-5/12">
              <span>Kategori</span>
              <span>:</span>
            </div>
            <div class="flex w-7/12">
              {{ plant.category.nama_kategori }}
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>

    <div v-else>Tidak ada data tanaman ditemukan.</div>

    <Pagination
      v-if="
        Array.isArray(plantsStore.plantList) &&
        plantsStore.plantList.length > 0 &&
        plantsStore.totalPages > 1
      "
      v-model:currentPage="plantsStore.currentPage"
      :totalPages="plantsStore.totalPages"
      @page-change="plantsStore.updatePage"
    />
  </div>
</template>
