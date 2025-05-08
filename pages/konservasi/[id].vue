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
        <img
          :src="
            plantsStore.plantDetail.gambar
              ? `${runtimeConfig.public.imgURL}/${plantsStore.plantDetail.gambar}`
              : '/placeholder-image.jpg'
          "
          :alt="`Gambar ${plantsStore.plantDetail.nama_lokal || 'Tanaman'}`"
          class="object-cover w-full h-64 md:h-full"
        />
      </div>

      <div class="px-4 py-6 space-y-6 md:col-span-1">
        <h1 class="mb-6 text-3xl font-bold text-green-900">
          {{ plantsStore.plantDetail.nama_lokal }}
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
import { createError, useRuntimeConfig, onBeforeRouteLeave } from "#app";
import { useRoute } from "vue-router";
import { onMounted } from "vue";

import { usePlantsStore } from "@/store/plants";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const plantsStore = usePlantsStore();

const plantId = route.params.id as string;

onMounted(() => {
  plantsStore.fetchPlantDetail(plantId).then(() => {
    if ( !plantsStore.plantDetail) {
      throw createError({
        statusCode: 404,
        statusMessage: "Tanaman tidak ditemukan.",
        fatal: true,
      });
    }
  });
});

</script>
