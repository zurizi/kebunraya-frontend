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
        <Splide :options="splideOptions" aria-label="Plant Images" v-if="plantImages.length > 0">
          <SplideSlide v-for="(image, index) in plantImages" :key="index">
            <img
              :src="image"
              :alt="`${plantsStore.plantDetail.nama_lokal || 'Tanaman'} - Gambar ${index + 1}`"
              class="object-cover w-full h-full"   કર્મ Corrected to h-full to respect Splide's height option
            />
          </SplideSlide>
        </Splide>
        <div v-else class="flex items-center justify-center w-full h-64 text-gray-500 bg-gray-200 md:h-[500px]">
          <span>Belum ada gambar</span>
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
              : {{ categoryName }}
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
import { createError, useRuntimeConfig } from "#app";
import { useRoute } from "vue-router";
import { onMounted, computed } from "vue";
import { Splide, SplideSlide } from '@splidejs/vue-splide';
import '@splidejs/vue-splide/css';

import { usePlantsStore } from "@/store/plants";
import { useCategoriesStore } from "@/store/categories"; // Import categories store
import { useImageUtils } from '~/composables/useImageUtils';
import { storeToRefs } from 'pinia'; // Import storeToRefs

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const plantsStore = usePlantsStore();
const categoriesStore = useCategoriesStore(); // Initialize categories store
const { categoryList } = storeToRefs(categoriesStore); // Get categoryList reactively
const { parseImageString } = useImageUtils();

const plantId = route.params.id as string;
const defaultPlaceholder = '/geometric-placeholder.svg'; // Will be changed later by another step

const categoryName = computed(() => {
  if (plantsStore.plantDetail?.category_id && categoryList.value.length) {
    const foundCategory = categoryList.value.find(cat => cat.id === plantsStore.plantDetail.category_id);
    return foundCategory ? foundCategory.nama_kategori : "Tidak Diketahui";
  }
  // Fallback if category_id is missing on plantDetail, or if category is an object (older structure)
  if (plantsStore.plantDetail?.category && typeof plantsStore.plantDetail.category === 'object') {
    return plantsStore.plantDetail.category.nama_kategori || "Tidak Diketahui";
  }
  return "Tidak Diketahui";
});

const splideOptions = computed(() => ({
  type: plantImages.value.length > 1 ? 'loop' : 'slide', // Loop only if multiple images
  perPage: 1,
  autoplay: plantImages.value.length > 1, // Autoplay only if multiple images
  interval: 5000,
  rewind: true,
  arrows: plantImages.value.length > 1,
  pagination: plantImages.value.length > 1,
  height: '500px', // Fixed height for the slider area
  // autoHeight: true, // Alternative if content height varies, but for images fixed height is often better
  classes: { // Optional: if custom arrow styling from study-tour.vue is desired
    // arrows: 'splide__arrows your-class-arrows',
    // arrow : 'splide__arrow your-class-arrow',
    // prev  : 'splide__arrow--prev your-class-prev',
    // next  : 'splide__arrow--next your-class-next',
  },
}));

const plantImages = computed(() => {
  if (plantsStore.plantDetail && plantsStore.plantDetail.gambar) {
    return parseImageString(plantsStore.plantDetail.gambar);
  }
  return [];
});

onMounted(() => {
  plantsStore.fetchPlantDetail(plantId).then(() => {
    if (!plantsStore.plantDetail && !plantsStore.plantDetailPending) {
      throw createError({
        statusCode: 404,
        statusMessage: "Tanaman tidak ditemukan.",
        fatal: true,
      });
    }
  });
});

</script>
<style>
/* Replicating study-tour.vue arrow styles - adjust as needed */
.splide__arrow {
  background-color: rgba(245, 245, 249, 0.8); /* Slightly transparent */
  font-size: 12px; /* This might not directly affect SVG icons, size is usually controlled by width/height */
  width: 40px;   /* Adjust as needed */
  height: 50px;  /* Adjust as needed */
  line-height: 50px; /* Vertically center icon if it's a font icon */
  transition: background-color 0.3s ease;
  opacity: 0.7;
}

.splide__arrow:hover {
  background-color: rgba(255, 255, 255, 1); /* White background on hover */
  opacity: 1;
}

.splide__arrow--next {
  right: 0.5em; /* Position from edge */
  border-radius: 8px 0 0 8px; /* Rounded on one side */
}

.splide__arrow--prev {
  left: 0.5em; /* Position from edge */
  border-radius: 0 8px 8px 0; /* Rounded on one side */
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
