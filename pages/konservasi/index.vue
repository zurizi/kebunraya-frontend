<script setup lang="ts">
import { usePlantsStore } from "@/store/plants";
// import { useRuntimeConfig } from "#app"; // No longer directly needed here for image URL construction
import { onMounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { useImageUtils } from '~/composables/useImageUtils';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css'; // Import Splide's default CSS

const plantsStore = usePlantsStore();
const { getFirstImage, parseImageString } = useImageUtils();

const searchText = ref("");

const cardSplideOptions = {
  type: 'slide', // Changed to 'slide' for robust behavior on cards
  rewind: true,
  perPage: 1,
  arrows: false,
  pagination: true, // Enable default pagination
  drag: true,
  padding: '0', // No padding around the track/slides
  gap: 0,       // No gap between slides
  // Removed classes for pagination, will rely on default or style globally if needed
  // Ensure Splide root element takes full height of its aspect-square parent.
  // The default Splide CSS usually makes .splide { position: relative; }
  // and .splide__track { height: 100%; }
  // This should work with parent aspect-ratio.
  classes: {
    pagination: 'splide__pagination !bottom-1.5', // Position pagination at bottom
    page: 'splide__pagination__page !w-2 !h-2 !mx-0.5 !bg-white !opacity-50', // Style for inactive dots
    // Active dot styling is often controlled by .is-active class applied by Splide
    // We can add specific style for .splide__pagination__page.is-active in <style> if needed
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
      <div
        v-for="plant in plantsStore.plantList"
        :key="plant.id"
        class="flex flex-col overflow-hidden shadow rounded-3xl relative bg-white"
      >
        {/* Image/Slider Area - Not linked by default, or could have its own separate link/action if desired */}
        <div class="w-full aspect-square bg-gray-200">
          <Splide
            v-if="getImageCount(plant.gambar) > 1"
            :options="cardSplideOptions"
            :has-track="false"
            aria-label="Plant images"
            class="w-full h-full"
          >
            <SplideTrack class="w-full h-full">
              <SplideSlide v-for="(image, index) in parseImageString(plant.gambar)" :key="index">
                <img :src="image" :alt="`Gambar ${plant.nama_lokal || 'Tanaman'} ${index + 1}`" class="object-cover w-full h-full" />
              </SplideSlide>
            </SplideTrack>
            {/* Splide will auto-generate pagination based on options */}
          </Splide>
          <img
            v-else-if="getFirstImage(plant.gambar)"
            :src="getFirstImage(plant.gambar)!"
            :alt="`Gambar ${plant.nama_lokal || 'Tanaman'}`"
            class="object-cover w-full h-full"
          />
          <div v-else class="flex items-center justify-center w-full h-full">
            <span class="text-gray-500 text-sm">Belum ada gambar</span>
          </div>
        </div>
        <!-- Removed multiple image count indicator as slider handles this -->

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
      </nuxt-link>  --> {/* End of NuxtLink (commented out as it's being restructured) */}
      {/* New NuxtLink wrapping text content */}
      <NuxtLink :to="`/konservasi/${plant.id}`" class="block hover:bg-gray-50">
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
      v-model:currentPage="plantsStore.currentPage"
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
