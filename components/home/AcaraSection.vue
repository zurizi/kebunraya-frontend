<template>
  <section id="acara">
    <div
      class="flex flex-col w-full px-8 space-y-4 sm:px-14 md:px-18   lg:px-20 xl:px-24 2xl:px-28 3xl:px-32"
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
          <nuxt-link
            v-for="kegiatan in kegiatanStore.kegiatanList.slice(0, 4)"
            :to="`/kegiatan/${kegiatan.id}`"
            :key="kegiatan.id"
            class="flex flex-col overflow-hidden bg-white shadow rounded-3xl relative"
          >
            <div class="w-full aspect-[5/4] bg-gray-200">
              <Splide
                v-if="getImageCount(kegiatan.gambar) > 1"
                :options="cardSplideOptions"
                :has-track="false"
                aria-label="Kegiatan images"
              >
                <SplideTrack>
                  <SplideSlide v-for="(image, index) in parseImageString(kegiatan.gambar)" :key="index">
                    <img :src="image" :alt="`Gambar ${kegiatan.judul || 'Kegiatan'} ${index + 1}`" class="object-cover w-full h-full" />
                  </SplideSlide>
                </SplideTrack>
                <div class="splide__pagination !bottom-2"></div>
              </Splide>
              <img
                v-else-if="getFirstImage(kegiatan.gambar)"
                :src="getFirstImage(kegiatan.gambar)!"
                :alt="`Gambar ${kegiatan.judul || 'Kegiatan'}`"
                class="object-cover w-full h-full"
              />
              <div v-else class="flex items-center justify-center w-full h-full">
                <span class="text-gray-500 text-sm">Belum ada gambar</span>
              </div>
            </div>
            <!-- Removed multiple image count indicator -->
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
  type: 'fade',
  rewind: true,
  perPage: 1,
  arrows: false,
  pagination: true,
  drag: true,
  // heightRatio: 0.8, // Relying on parent aspect-[5/4] - Ensure this is removed if present. It was commented.
  classes: {
    pagination: 'splide__pagination !bottom-1.5', // Custom class for pagination position
    page: 'splide__pagination__page !w-2 !h-2 !mx-0.5 !bg-gray-400', // Smaller dots
  },
};

onMounted(() => {
  kegiatanStore.fetchKegiatanList();
});
</script>
