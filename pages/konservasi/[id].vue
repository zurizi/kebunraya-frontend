<template>
  <div class="max-w-5xl px-4 py-12 mx-auto sm:px-6 lg:px-8">
    <div v-if="pending">Loading detail tanaman...</div>

    <div v-else-if="error">
      Terjadi kesalahan saat mengambil detail tanaman.
    </div>

    <div
      v-else-if="plantDetail"
      class="grid grid-cols-1 gap-8 overflow-hidden bg-gray-100 border md:grid-cols-2 rounded-3xl"
    >
      <div class="md:col-span-1">
        <img
          :src="
            plantDetail.gambar
              ? `${runtimeConfig.public.imgURL}/${plantDetail.gambar}`
              : '/placeholder-image.jpg'
          "
          :alt="`Gambar ${plantDetail.nama_lokal || 'Tanaman'}`"
          class="object-cover w-full h-64 md:h-full"
        />
      </div>

      <div class="px-4 py-6 space-y-6 md:col-span-1">
        <h1 class="mb-6 text-3xl font-bold text-green-900">
          {{ plantDetail.nama_lokal }}
        </h1>
        <div class="flex flex-col gap-4 text-sm text-gray-800">
          <div class="flex w-full">
            <div class="w-1/3 font-semibold">Nama Ilmiah</div>
            <div class="w-2/3">: {{ plantDetail.nama_ilmiah }}</div>
          </div>
          <div class="flex w-full">
            <div class="w-1/3 font-semibold">Keluarga</div>
            <div class="w-2/3">: {{ plantDetail.keluarga }}</div>
          </div>
          <div class="flex w-full">
            <div class="w-1/3 font-semibold">Umur</div>
            <div class="w-2/3">: {{ plantDetail.umur }}</div>
          </div>
          <div class="flex w-full">
            <div class="w-1/3 font-semibold">Kategori</div>
            <div class="w-2/3">
              : {{ plantDetail.category?.nama_kategori || "Tidak Diketahui" }}
            </div>
          </div>
          <div class="flex w-full">
            <div class="w-1/3 font-semibold">Perawakan</div>
            <div class="w-2/3">: {{ plantDetail.perawakan }}</div>
          </div>
          <div class="flex w-full">
            <div class="w-1/3 font-semibold">Persebaran</div>
            <div class="w-2/3">: {{ plantDetail.persebaran }}</div>
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
    <div v-else>Detail tanaman tidak ditemukan.</div>
  </div>
</template>

<script lang="ts" setup>
import { createError, useNuxtApp, useRuntimeConfig, useAsyncData } from "#app"; // Import useNuxtApp dan useRuntimeConfig
import { useRoute } from "vue-router"; // Import useAsyncData dari vue-router

// Dapatkan objek route dan runtime config
const route = useRoute();
const runtimeConfig = useRuntimeConfig();

// Akses instance Axios yang disediakan oleh plugin
const { $api } = useNuxtApp();

// Dapatkan ID dari parameter route
const plantId = route.params.id as string; // ID dari route selalu string

// Menggunakan useAsyncData untuk mengambil data detail tanaman
const {
  data: apiResponse,
  pending,
  error,
} = await useAsyncData(`plant-${plantId}`, async () => {
  try {
    // Panggil API detail tanaman berdasarkan ID
    const response = await $api.get(`/plants/${plantId}`);
    // Mengembalikan array data dari respons API (berisi satu objek tanaman)
    // Perhatikan bahwa respon detail Anda memiliki struktur { data: { ...plant } }
    return response.data.data; // Mengakses objek detail tanaman di dalam properti 'data'
  } catch (err) {
    console.error(`Error fetching plant with ID ${plantId}:`, err);
    // Jika API mengembalikan error (misalnya 404), useAsyncData akan menangkapnya
    // Kita bisa melempar error lagi agar Nuxt menampilkannya
    throw err;
  }
});

// `apiResponse` adalah Ref yang berisi objek detail tanaman atau null jika gagal

// Gunakan data dari apiResponse
const plantDetail = apiResponse; // plantDetail sekarang adalah Ref yang menunjuk ke data dari useAsyncData

// Jika setelah loading selesai (pending false) dan tidak ada error, cek apakah data ditemukan
if (!pending.value && !error.value && !plantDetail.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Tanaman tidak ditemukan.",
    fatal: true, // Gunakan fatal: true agar Nuxt menampilkan halaman error secara penuh
  });
}

// Jika terjadi error saat fetch data (misalnya 404 dari API), useAsyncData akan mengisi `error`
// Nuxt secara otomatis akan menampilkan halaman error default jika `error` ada
// Anda bisa menambahkan penanganan error kustom jika perlu
</script>
