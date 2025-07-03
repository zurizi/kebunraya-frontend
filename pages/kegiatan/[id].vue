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
        <Splide :options="splideOptions" aria-label="Kegiatan Images" v-if="kegiatanImages.length > 0">
          <SplideSlide v-for="(image, index) in kegiatanImages" :key="index">
            <img
              :src="image"
              :alt="`${kegiatanStore.kegiatanDetail.judul || 'Kegiatan'} - Gambar ${index + 1}`"
              class="object-cover w-full h-full"
            />
          </SplideSlide>
        </Splide>
        <div v-else class="flex items-center justify-center w-full h-64 text-gray-500 bg-gray-200 md:h-[500px]">
          <span>Belum ada gambar</span>
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
import { createError, useRuntimeConfig } from "#app";
import { useRoute } from "vue-router";
import { useKegiatanStore } from "@/store/kegiatan";
import { onMounted, computed } from "vue";
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css'; // Changed to default theme CSS
import { useImageUtils } from '~/composables/useImageUtils';


const route = useRoute();
const runtimeConfig = useRuntimeConfig(); // Already here
const kegiatanStore = useKegiatanStore();
const { parseImageString } = useImageUtils();

const kegiatanId = route.params.id as string;
const defaultPlaceholder = '/geometric-placeholder.svg'; // Will be changed later

const splideOptions = computed(() => ({
  type: kegiatanImages.value.length > 1 ? 'loop' : 'slide',
  perPage: 1,
  autoplay: kegiatanImages.value.length > 1,
  interval: 5000,
  rewind: true,
  arrows: kegiatanImages.value.length > 1,
  pagination: kegiatanImages.value.length > 1,
  height: '500px',
}));

const kegiatanImages = computed(() => {
  if (kegiatanStore.kegiatanDetail && kegiatanStore.kegiatanDetail.gambar) {
    return parseImageString(kegiatanStore.kegiatanDetail.gambar);
  }
  return [];
});

onMounted(() => {
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
<style>
/* Mirroring styles from konservasi page for consistency */
.splide__arrow {
  background-color: rgba(245, 245, 249, 0.8);
  width: 40px;
  height: 50px;
  transition: background-color 0.3s ease;
  opacity: 0.7;
}

.splide__arrow:hover {
  background-color: rgba(255, 255, 255, 1);
  opacity: 1;
}

.splide__arrow--next {
  right: 0.5em;
  border-radius: 8px 0 0 8px;
}

.splide__arrow--prev {
  left: 0.5em;
  border-radius: 0 8px 8px 0;
}

.splide__pagination__page {
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(0,0,0,0.2);
  opacity: 0.8;
}
.splide__pagination__page.is-active {
  background: #ffffff;
  transform: scale(1.2);
  opacity: 1;
  border: 1px solid rgba(0,0,0,0.4);
}
</style>
