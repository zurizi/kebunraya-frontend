<template>
  <div class="max-w-5xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
    <div v-if="kegiatanStore.pendingDetail">Loading detail kegiatan...</div>

    <div v-else-if="kegiatanStore.errorDetail">
      Terjadi kesalahan saat mengambil detail kegiatan.
    </div>

    <div
      v-else-if="kegiatanStore.kegiatanDetail"
      class="grid grid-cols-1 gap-8 overflow-hidden bg-gray-100 border md:grid-cols-2 rounded-3xl"
    >
      <div class="md:col-span-1">
        <Splide :options="{ rewind: true, arrows: kegiatanImages.length > 1, pagination: kegiatanImages.length > 1 }" aria-label="Kegiatan Images" v-if="kegiatanImages.length > 0">
          <SplideSlide v-for="(image, index) in kegiatanImages" :key="index">
            <img
              :src="image"
              :alt="`${kegiatanStore.kegiatanDetail.judul || 'Kegiatan'} - Gambar ${index + 1}`"
              class="object-cover w-full h-64 md:h-[500px]"
            />
          </SplideSlide>
        </Splide>
        <div v-else class="flex items-center justify-center w-full h-64 bg-gray-200 md:h-full">
          <img
            :src="defaultPlaceholder"
            alt="Tidak ada gambar"
            class="object-contain w-1/2 h-1/2 opacity-50"
          />
        </div>
      </div>

      <div class="px-4 py-6 space-y-6 md:col-span-1">
        <h1 class="mb-6 text-3xl font-bold text-green-900">
          {{ kegiatanStore.kegiatanDetail.judul }}
        </h1>
        <div class="flex flex-col gap-4 text-sm text-gray-800">
          <div class="flex w-full">
            <div class="w-1/3 font-semibold">Tanggal</div>
            <div class="w-2/3">
              : {{ kegiatanStore.kegiatanDetail.tanggal }}
            </div>
          </div>
          <div class="flex w-full">
            <div class="w-1/3 font-semibold">Lokasi</div>
            <div class="w-2/3">: {{ kegiatanStore.kegiatanDetail.lokasi }}</div>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-900">Deskripsi</h2>
          <p class="mt-2 text-gray-700 whitespace-pre-line">
            {{ kegiatanStore.kegiatanDetail.deskripsi }}
          </p>
        </div>
      </div>
    </div>
    <div v-else>Detail kegiatan tidak ditemukan.</div>
  </div>
</template>

<script lang="ts" setup>
import { createError, useRuntimeConfig } from "#app"; // Removed onBeforeRouteLeave
import { useRoute } from "vue-router";
import { useKegiatanStore } from "@/store/kegiatan";
import { onMounted, computed } from "vue"; // Added computed
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css/core';
import { useImageUtils } from '~/composables/useImageUtils';


const route = useRoute();
const runtimeConfig = useRuntimeConfig(); // Already here
const kegiatanStore = useKegiatanStore();
const { parseImageString } = useImageUtils();

const kegiatanId = route.params.id as string;
const defaultPlaceholder = '/geometric-placeholder.svg';

const kegiatanImages = computed(() => {
  if (kegiatanStore.kegiatanDetail && kegiatanStore.kegiatanDetail.gambar) {
    return parseImageString(kegiatanStore.kegiatanDetail.gambar);
  }
  return [];
});

onMounted(() => {
  // kegiatanStore.resetKegiatanDetail(); // Consider if this is needed if navigating between detail pages
  kegiatanStore.fetchKegiatanDetail(kegiatanId).then(() => {
    if (!kegiatanStore.kegiatanDetail && !kegiatanStore.kegiatanDetailPending) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kegiatan tidak ditemukan.",
        fatal: true,
      });
    }
  });
});

</script>
