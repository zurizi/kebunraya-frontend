<template>
  <section id="acara">
    <div
      class="flex flex-col w-full px-8 space-y-4 sm:px-14 md:px-18 lg:px-20 xl:px-24 2xl:px-28 3xl:px-32"
    >
      <div class="text-xl font-semibold">Jangan Lewatkan Acara Kami</div>
      <p>
        Ikuti berbagai acara menarik, mulai dari workshop konservasi hingga
        festival budaya suku lokal.
      </p>
      <BaseButton addClass="px-6 bg-stone-500 ">Selengkapnya</BaseButton>

      <div class="flex w-full p-5 bg-stone-500 rounded-3xl">
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
          class="grid w-full grid-cols-2 gap-8 lg:grid-cols-4"
        >
          <div
            v-for="kegiatan in kegiatanStore.kegiatanList.slice(0, 4)"
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
                <SplideTrack class="w-full h-full">
                  <SplideSlide v-for="(image, index) in parseImageString(kegiatan.gambar)" :key="index">
                    <img :src="image" :alt="`Gambar ${kegiatan.judul || 'Kegiatan'} ${index + 1}`" class="object-cover w-full h-full" />
                  </SplideSlide>
                </SplideTrack>
              </Splide>
              <img
                v-else-if="getFirstImage(kegiatan.gambar)"
                :src="getFirstImage(kegiatan.gambar)!"
                :alt="`Gambar ${kegiatan.judul || 'Kegiatan'}`"
                class="object-cover w-full h-full"
              />
              <div v-else class="flex items-center justify-center w-full h-full">
                <span class="text-sm text-gray-500">Belum ada gambar</span>
              </div>
            </div>
            <!-- Removed multiple image count indicator -->
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
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useKegiatanStore } from "@/store/kegiatan";
// import { useRuntimeConfig } from "#app";
import { useImageUtils } from '~/composables/useImageUtils';
import { Splide, SplideSlide, SplideTrack } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css'; // Import Splide's default CSS

const kegiatanStore = useKegiatanStore();
const { getFirstImage, parseImageString } = useImageUtils();

const getImageCount = (imageString: string | null | undefined): number => {
  return parseImageString(imageString).length;
};

// Re-using the same options object definition for consistency
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

onMounted(() => {
  kegiatanStore.fetchKegiatanList();
});
</script>

<style>
/* Scoped or global styles for Splide pagination active dot if needed */
/* Ensure these styles don't conflict if pages/kegiatan/index.vue is also loaded somehow,
   though typically they are separate routes. If they can co-exist (e.g. in a layout for some reason),
   consider more specific selectors or scoping. */
.splide__pagination__page.is-active {
  background-color: white !important;
  opacity: 1 !important;
  transform: scale(1.2);
}
</style>
