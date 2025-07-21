<script setup lang="ts">
import { usePlantsStore } from "~/store/plants";

import { onMounted, ref, onBeforeUnmount } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useImageUtils } from "~/composables/useImageUtils";
import { Splide, SplideSlide, SplideTrack } from "@splidejs/vue-splide";
import "@splidejs/vue-splide/css";

const plantsStore = usePlantsStore();
const { getFirstImage, parseImageString } = useImageUtils();

const searchText = ref("");

const cardSplideOptions = {
  type: "slide",
  rewind: true,
  perPage: 1,
  arrows: false,
  pagination: true,
  drag: true,
  padding: "0",
  gap: 0,

  classes: {
    pagination: "splide__pagination !bottom-1.5",
    page: "splide__pagination__page !w-2 !h-2 !mx-0.5 !bg-white !opacity-50",
  },
};

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

onBeforeUnmount(() => {
  plantsStore.resetSearch();
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

    <div v-if="plantsStore.plantsListPending">Loading tanaman...</div>
    <div v-else-if="plantsStore.plantsListError">
      Terjadi kesalahan saat mengambil data tanaman.
    </div>

    <div
      v-else-if="
        Array.isArray(plantsStore.plantList) && plantsStore.plantList.length > 0
      "
      class="grid w-full grid-cols-2 gap-4 lg:gap-6 3xl:gap-8 lg:grid-cols-4"
    >
      <div
        v-for="plant in plantsStore.plantList"
        :key="plant.id"
        class="relative flex flex-col overflow-hidden bg-white shadow rounded-3xl"
      >
        <div class="w-full bg-gray-200 aspect-square">
          <Splide
            v-if="getImageCount(plant.gambar) > 1"
            :options="cardSplideOptions"
            :has-track="false"
            aria-label="Plant images"
            class="w-full h-full"
          >
            <SplideTrack class="w-full h-full">
              <SplideSlide
                v-for="(image, index) in parseImageString(plant.gambar)"
                :key="index"
              >
                <img
                  :src="image"
                  :alt="`Gambar ${plant.nama_lokal || 'Tanaman'} ${index + 1}`"
                  class="object-cover w-full h-full"
                />
              </SplideSlide>
            </SplideTrack>
          </Splide>
          <img
            v-else-if="getFirstImage(plant.gambar)"
            :src="getFirstImage(plant.gambar) || ''"
            :alt="`Gambar ${plant.nama_lokal || 'Tanaman'}`"
            class="object-cover w-full h-full"
          />
          <div v-else class="flex items-center justify-center w-full h-full">
            <span class="text-sm text-gray-500">Belum ada gambar</span>
          </div>
        </div>
        <NuxtLink
          :to="`/konservasi/${plant.id}`"
          class="block hover:bg-gray-50"
        >
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
        </NuxtLink>
      </div>
    </div>

    <div v-else>Tidak ada data tanaman ditemukan.</div>

    <Pagination
      v-if="
        Array.isArray(plantsStore.plantList) &&
        plantsStore.plantList.length > 0 &&
        plantsStore.totalPages > 1
      "
      :currentPage="plantsStore.currentPage"
      :totalPages="plantsStore.totalPages"
      @page-change="plantsStore.updatePage"
    />
  </div>
</template>

<style>
/* Scoped or global styles for Splide pagination active dot if needed */
/* Targeting the card sliders' pagination specifically */
.splide__pagination__page.is-active {
  background-color: white !important; /* White background for active dot */
  opacity: 1 !important; /* Full opacity for active dot */
  transform: scale(1.2); /* Slightly larger active dot */
}
</style>
