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
        <img
          :src="
            kegiatanStore.kegiatanDetail.gambar
              ? `${runtimeConfig.public.imgURL}/${kegiatanStore.kegiatanDetail.gambar}`
              : '/placeholder-image.jpg'
          "
          :alt="`Gambar ${kegiatanStore.kegiatanDetail.judul || 'Kegiatan'}`"
          class="object-cover w-full h-64 md:h-full"
        />
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
import { createError, useRuntimeConfig, onBeforeRouteLeave } from "#app";
import { useRoute } from "vue-router";
import { useKegiatanStore } from "@/store/kegiatan";
import { onMounted } from "vue";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const kegiatanStore = useKegiatanStore();

const kegiatanId = route.params.id as string;

onMounted(() => {
  kegiatanStore.fetchKegiatanDetail(kegiatanId).then(() => {
    if (!kegiatanStore.kegiatanDetail) {
      throw createError({
        statusCode: 404,
        statusMessage: "Kegiatan tidak ditemukan.",
        fatal: true,
      });
    }
  });
});

// onBeforeRouteLeave(() => {
//   kegiatanStore.resetStateDetail();
// });
</script>
