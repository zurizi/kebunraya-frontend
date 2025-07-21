<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useKegiatanStore } from "~/store/kegiatan";
// import { useRuntimeConfig } from "#app";
import { useImageUtils } from '~/composables/useImageUtils';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css'; // Import Splide's default CSS

const kegiatanStore = useKegiatanStore();
const { getFirstImage, parseImageString } = useImageUtils();

const searchText = ref("");

// Re-using the same options object definition as in konservasi/index.vue for consistency
const cardSplideOptions = {
  type: 'slide', // Changed to 'slide'
  rewind: true,
  perPage: 1,
  arrows: false,
  pagination: true, // Enable default pagination
  drag: true,
  padding: '0',
  gap: 0,
  classes: {
    pagination: 'splide__pagination !bottom-1.5',
    page: 'splide__pagination__page !w-2 !h-2 !mx-0.5 !bg-white !opacity-50',
  },
};

const updatePage = (page: number) => {
  kegiatanStore.updatePage(page);
};

const handleSearch = (searchValue: string) => {
  kegiatanStore.setSearchQuery(searchValue);
};

const getImageCount = (imageString: string | null | undefined): number => {
  return parseImageString(imageString).length;
};

onMounted(() => {
  kegiatanStore.fetchKegiatanList();
});

onBeforeUnmount(() => {
  kegiatanStore.resetSearch();
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

    <div v-if="kegiatanStore.kegiatanListPending" class="text-center">
      Loading kegiatan...
    </div>

    <div v-else-if="kegiatanStore.kegiatanListError" class="text-center text-red-500">
      Terjadi kesalahan saat mengambil data kegiatan.
    </div>

    <div
      v-else-if="
        kegiatanStore.kegiatanList && kegiatanStore.kegiatanList.length > 0
      "
      class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      <div
        v-for="kegiatan in kegiatanStore.kegiatanList"
        :key="kegiatan.id"
        class="relative flex flex-col overflow-hidden bg-white shadow rounded-3xl"
      >
        <div class="w-full bg-gray-200 aspect-square">
          <Splide
            v-if="getImageCount(kegiatan.gambar) > 1"
            :options="cardSplideOptions"
            :has-track="false"
            aria-label="Kegiatan images"
            class="w-full h-full"
          >
            <SplideTrack class="w-full h-full ">
              <SplideSlide v-for="(image, index) in parseImageString(kegiatan.gambar)" :key="index">
                <img :src="image" :alt="`Gambar ${kegiatan.judul || 'Kegiatan'} ${index + 1}`" class="object-cover w-full h-full aspect-square" />
              </SplideSlide>
            </SplideTrack>
          </Splide>
          <img
            v-else-if="getFirstImage(kegiatan.gambar)"
            :src="getFirstImage(kegiatan.gambar) || ''"
            :alt="`Gambar ${kegiatan.judul || 'Kegiatan'}`"
            class="object-cover w-full h-full aspect-square"
          />
          <div v-else class="flex items-center justify-center w-full h-full">
            <span class="text-sm text-gray-500">Belum ada gambar</span>
          </div>
        </div>
      <NuxtLink :to="`/kegiatan/${kegiatan.id}`" class="block hover:bg-gray-50">
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
      </NuxtLink>
    </div>
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
      :currentPage="kegiatanStore.currentPage"
      :totalPages="kegiatanStore.totalPages"
      @page-change="updatePage"
    />
  </div>
</template>

<style>
/* Scoped or global styles for Splide pagination active dot if needed */
.splide__pagination__page.is-active {
  background-color: white !important;
  opacity: 1 !important;
  transform: scale(1.2);
}
</style>
