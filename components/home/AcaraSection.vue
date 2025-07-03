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
            <div class="w-full aspect-[5/4] bg-gray-200 flex items-center justify-center">
              <img
                v-if="getFirstImage(kegiatan.gambar)"
                :src="getFirstImage(kegiatan.gambar)!"
                :alt="`Gambar ${kegiatan.judul || 'Kegiatan'}`"
                class="object-cover w-full h-full"
              />
              <span v-else class="text-gray-500 text-sm">Belum ada gambar</span>
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
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useKegiatanStore } from "@/store/kegiatan";
// import { useRuntimeConfig } from "#app"; // No longer directly used for image URL
import { useImageUtils } from '~/composables/useImageUtils';

const kegiatanStore = useKegiatanStore();
// const runtimeConfig = useRuntimeConfig(); // No longer directly used
const { getFirstImage, parseImageString } = useImageUtils();
// const defaultPlaceholder = '/geometric-placeholder.svg'; // No longer needed

const getImageCount = (imageString: string | null | undefined): number => {
  return parseImageString(imageString).length;
};

onMounted(() => {
  kegiatanStore.fetchKegiatanList();
});
</script>
