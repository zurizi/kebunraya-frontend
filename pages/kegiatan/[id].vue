<template>
  <div class="max-w-5xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
    <div v-if="pending">Loading detail tanaman...</div>

    <div v-else-if="error">
      Terjadi kesalahan saat mengambil detail tanaman.
    </div>

    <div
      v-else-if="kegiatanDetail"
      class="grid grid-cols-1 gap-8 overflow-hidden bg-gray-100 border md:grid-cols-2 rounded-3xl"
    >
      <div class="md:col-span-1">
        <img
          :src="
            kegiatanDetail.gambar
              ? `${runtimeConfig.public.imgURL}/${kegiatanDetail.gambar}`
              : '/placeholder-image.jpg'
          "
          :alt="`Gambar ${kegiatanDetail.judul || 'Tanaman'}`"
          class="object-cover w-full h-64 md:h-full"
        />
      </div>

      <div class="px-4 py-6 space-y-6 md:col-span-1">
        <h1 class="mb-6 text-3xl font-bold text-green-900">
          {{ kegiatanDetail.judul }}
        </h1>
        <div class="flex flex-col gap-4 text-sm text-gray-800">
          <div class="flex w-full">
            <div class="w-1/3 font-semibold">Tanggal</div>
            <div class="w-2/3">: {{ kegiatanDetail.tanggal }}</div>
          </div>
          <div class="flex w-full">
            <div class="w-1/3 font-semibold">Lokasi</div>
            <div class="w-2/3">: {{ kegiatanDetail.lokasi }}</div>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-900">Deskripsi</h2>
          <p class="mt-2 text-gray-700 whitespace-pre-line">
            {{ kegiatanDetail.deskripsi }}
          </p>
        </div>
      </div>
    </div>
    <div v-else>Detail tanaman tidak ditemukan.</div>
  </div>
</template>

<script lang="ts" setup>
import { createError, useNuxtApp, useRuntimeConfig, useAsyncData } from "#app";
import { useRoute } from "vue-router";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();

const { $api } = useNuxtApp();

const kegiatanId = route.params.id as string;

const {
  data: apiResponse,
  pending,
  error,
} = await useAsyncData(`kegiatan-${kegiatanId}`, async () => {
  try {
    const response = await $api.get(`/kegiatan/${kegiatanId}`);

    return response.data.data;
  } catch (err) {
    console.error(`Error fetching kegiatan with ID ${kegiatanId}:`, err);

    throw err;
  }
});

const kegiatanDetail = apiResponse;

if (!pending.value && !error.value && !kegiatanDetail.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Kegiatan tidak ditemukan.",
    fatal: true,
  });
}
</script>
