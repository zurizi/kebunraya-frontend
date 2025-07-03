<template>
  <div class="max-w-5xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
    <div v-if="plantsStore.plantDetailPending">Loading detail tanaman...</div>

    <div v-else-if="plantsStore.plantDetailError">
      Terjadi kesalahan saat mengambil detail tanaman.
    </div>

    <div
      v-else-if="plantsStore.plantDetail"
      class="grid grid-cols-1 gap-8 overflow-hidden bg-gray-100 border md:grid-cols-2 rounded-3xl"
    >
      <div class="md:col-span-1">
        <Splide :options="{ rewind: true, arrows: plantImages.length > 1, pagination: plantImages.length > 1 }" aria-label="Plant Images" v-if="plantImages.length > 0">
          <SplideSlide v-for="(image, index) in plantImages" :key="index">
            <img
              :src="image"
              :alt="`${plantsStore.plantDetail.nama_lokal || 'Tanaman'} - Gambar ${index + 1}`"
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
          {{ plantsStore.plantDetail.nama_lokal || plantsStore.plantDetail.nama_ilmiah }}
        </h1>
        <div class="flex flex-col gap-4 text-sm text-gray-800">
          <div class="flex w-full">
            <div class="w-1/3 font-semibold">Nama Ilmiah</div>
            <div class="w-2/3">: {{ plantsStore.plantDetail.nama_ilmiah }}</div>
          </div>
          <div class="flex w-full">
            <div class="w-1/3 font-semibold">Keluarga</div>
            <div class="w-2/3">: {{ plantsStore.plantDetail.keluarga }}</div>
          </div>
          <div class="flex w-full">
            <div class="w-1/3 font-semibold">Umur</div>
            <div class="w-2/3">: {{ plantsStore.plantDetail.umur }}</div>
          </div>
          <div class="flex w-full">
            <div class="w-1/3 font-semibold">Kategori</div>
            <div class="w-2/3">
              :
              {{
                plantsStore.plantDetail.category?.nama_kategori ||
                "Tidak Diketahui"
              }}
            </div>
          </div>
          <div class="flex w-full">
            <div class="w-1/3 font-semibold">Perawakan</div>
            <div class="w-2/3">: {{ plantsStore.plantDetail.perawakan }}</div>
          </div>
          <div class="flex w-full">
            <div class="w-1/3 font-semibold">Persebaran</div>
            <div class="w-2/3">: {{ plantsStore.plantDetail.persebaran }}</div>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-900">Deskripsi</h2>
          <p class="mt-2 text-gray-700 whitespace-pre-line">
            {{ plantsStore.plantDetail.deskripsi }}
          </p>
        </div>
      </div>
    </div>
    <div v-else>Detail tanaman tidak ditemukan.</div>
  </div>
</template>

<script lang="ts" setup>
import { createError, useRuntimeConfig } from "#app"; // Removed onBeforeRouteLeave
import { useRoute } from "vue-router";
import { onMounted, computed } from "vue"; // Added computed
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css/core'; // Using core CSS, can choose other themes if needed

import { usePlantsStore } from "@/store/plants";
import { useImageUtils } from '~/composables/useImageUtils';

const route = useRoute();
const runtimeConfig = useRuntimeConfig(); // Already here
const plantsStore = usePlantsStore();
const { parseImageString } = useImageUtils();

const plantId = route.params.id as string;
const defaultPlaceholder = '/geometric-placeholder.svg';


const plantImages = computed(() => {
  if (plantsStore.plantDetail && plantsStore.plantDetail.gambar) {
    return parseImageString(plantsStore.plantDetail.gambar);
  }
  return [];
});

onMounted(() => {
  plantsStore.fetchPlantDetail(plantId).then(() => {
    if (!plantsStore.plantDetail && !plantsStore.plantDetailPending) { // check pending to avoid premature 404
      throw createError({
        statusCode: 404,
        statusMessage: "Tanaman tidak ditemukan.",
        fatal: true,
      });
    }
  });
});

</script>
