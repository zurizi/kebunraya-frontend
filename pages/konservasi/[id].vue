<template>
  <div class="max-w-5xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
    <div class="flex flex-col overflow-hidden bg-white rounded-3xl">
      <Image
        src="/pages/konservasi/contoh tanaman.png"
        class="object-cover w-full h-80"
      />
      <div class="p-6 space-y-6 ">
        <h1 class="mb-6 text-3xl font-bold text-green-900">
          {{ plantDetail.nama_lokal }}
        </h1>
        <div class="grid grid-cols-2 gap-4 text-sm text-gray-800">
          <div class="flex">
            <div class="w-1/3 font-semibold">Nama Ilmiah</div>
            <div class="w-2/3">: {{ plantDetail.nama_ilmiah }}</div>
          </div>
          <div class="flex">
            <div class="w-1/3 font-semibold">Keluarga</div>
            <div class="w-2/3">: {{ plantDetail.keluarga }}</div>
          </div>
          <div class="flex">
            <div class="w-1/3 font-semibold">Umur</div>
            <div class="w-2/3">: {{ plantDetail.umur }}</div>
          </div>
          <div class="flex">
            <div class="w-1/3 font-semibold">Kategori</div>
            <div class="w-2/3">: {{ plantDetail.kategori }}</div>
          </div>
          <div class="flex">
            <div class="w-1/3 font-semibold">Perawakan</div>
            <div class="w-2/3">: {{ plantDetail.perawakan }}</div>
          </div>
          <div class="flex col-span-2">
            <div class="w-1/6 font-semibold">Persebaran</div>
            <div class="w-5/6">: {{ plantDetail.persebaran }}</div>
          </div>
        </div>

        <div>
          <h2 class="text-lg font-semibold text-gray-900">Deskripsi</h2>
          <p class="mt-2 text-gray-700 whitespace-pre-line">
            {{ plantDetail.deskripsi }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createError } from "#app";
import { useRoute } from "vue-router";

const route = useRoute();

const allPlants = [
  {
    id: 1,
    nama_ilmiah: "Canna indica L.",
    nama_lokal: "Bunga tasbeh",
    keluarga: "Cannaceae",
    umur: "10000 tahun",
    kategori: "Herba",
    perawakan: "Herba",
    persebaran: "Tropis dan Subtropis Amerika",
    deskripsi:
      "Canna indica adalah tanaman berbunga yang tahan panas dan sering ditemukan di taman tropis.",
  },
  {
    id: 2,
    nama_ilmiah: "Opuntia ficus-indica",
    nama_lokal: "Kaktus pir berduri",
    keluarga: "Cactaceae",
    umur: "15-20 tahun",
    kategori: "Semak",
    perawakan: "Semak berduri",
    persebaran: "Amerika Tengah dan Selatan",
    deskripsi:
      "Kaktus ini digunakan sebagai tanaman pangan dan tahan terhadap cuaca kering.",
  },
];

// cari berdasarkan id dari URL
const id = parseInt(route.params.id as string);
const plantDetail = allPlants.find((item) => item.id === id);

if (!plantDetail) {
  throw createError({
    statusCode: 404,
    statusMessage: "Tanaman tidak ditemukan.",
  });
}
</script>
