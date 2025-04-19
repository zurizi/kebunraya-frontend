<script setup lang="ts">
import { ref, watch } from 'vue'; // Import ref dan watch
import { useNuxtApp, useAsyncData } from "#app";

// Akses instance Axios dan runtime config
const { $api } = useNuxtApp();
const runtimeConfig = useRuntimeConfig();

// State untuk halaman saat ini dan total halaman
const currentPage = ref(1); // Mulai dari halaman 1
const totalPages = ref(1); // Inisialisasi total halaman

// Menggunakan useAsyncData untuk mengambil data
const {
  data: apiResponse,
  pending,
  error,
  refresh // Tambahkan fungsi refresh untuk memicu pengambilan data ulang
} = await useAsyncData(`plants-${currentPage.value}`, async () => { // Kunci useAsyncData dinamis berdasarkan halaman
  try {
    // Panggil API dengan parameter 'page'
    const response = await $api.get('/plants', {
      params: {
        page: currentPage.value, // Kirim halaman saat ini sebagai parameter query
        // limit: 9 // Anda mungkin juga perlu mengirim parameter limit/perPage
      }
    });
    // Periksa struktur respons API untuk metadata paginasi
    if (response.data && response.data.status === 'success' && response.data.data.last_page !== undefined) {
       // Update total halaman dari respons API
      totalPages.value = response.data.data.last_page;
      // Kembalikan array data tanaman
      return response.data; // Kembalikan seluruh objek respons yang berisi data dan metadata
    } else {
       // Tangani jika struktur respons tidak sesuai harapan
      console.error("Unexpected API response structure:", response.data);
      totalPages.value = 1; // Reset total halaman
      return { data: [], status: 'error' }; // Kembalikan struktur respons yang aman
    }

  } catch (err) {
    console.error("Error fetching plants:", err);
    totalPages.value = 1; // Reset total halaman jika ada error
    throw err; // Lempar error
  }
}, {
  watch: [currentPage] // useAsyncData akan otomatis berjalan ulang setiap kali currentPage berubah
});

// Tidak perlu watcher terpisah karena useAsyncData sudah menggunakan `watch: [currentPage]`
// dan kita langsung menggunakan apiResponse.value.data di template.

// Fungsi untuk mengubah halaman yang dipanggil dari komponen pagination
const updatePage = (page: number) => {
  currentPage.value = page;
  // useAsyncData akan otomatis refetch karena `watch: [currentPage]`
};
</script>

<template>
  <div
    class="flex flex-col px-4 py-12 mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8"
  >
    <SearchInput />

    <div v-if="pending">Loading tanaman...</div>

    <div v-else-if="error">Terjadi kesalahan saat mengambil data tanaman.</div>

    <div
      v-else-if="
        apiResponse &&
        apiResponse.status === 'success' &&
        Array.isArray(apiResponse.data.data) && 
        apiResponse.data.data.length > 0
      "
      class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      <nuxt-link
        v-for="plant in apiResponse.data.data" 
        :to="`/konservasi/${plant.id}`"
        :key="plant.id"
        class="flex flex-col overflow-hidden shadow rounded-3xl"
      >
        <img
          :src="
            plant.gambar
              ? `${runtimeConfig.public.imgURL || runtimeConfig.public.imgURL}/${plant.gambar}` 
              : '/placeholder-image.jpg'
          "
          :alt="`Gambar ${plant.nama_lokal || 'Tanaman'}`"
          class="object-cover w-full max-h-64"
        />

        <div class="flex flex-col w-full p-4 space-y-2">
          <div class="flex w-full space-x-2">
            <div class="flex justify-between w-5/12">
              <span>Nama Ilmiah</span>
              <span>:</span>
            </div>
            <div class="flex w-7/12">{{ plant.nama_ilmiah }}</div>
          </div>

          <div class="flex w-full space-x-2">
            <div class="flex justify-between w-5/12">
              <span>Nama Lokal</span>
              <span>:</span>
            </div>
            <div class="flex w-7/12">{{ plant.nama_lokal }}</div>
          </div>

          <div class="flex w-full space-x-2">
            <div class="flex justify-between w-5/12">
              <span>Keluarga</span>
              <span>:</span>
            </div>
            <div class="flex w-7/12">{{ plant.keluarga }}</div>
          </div>

          <div class="flex w-full space-x-2">
            <div class="flex justify-between w-5/12">
              <span>Umur</span>
              <span>:</span>
            </div>
            <div class="flex w-7/12">{{ plant.umur }}</div>
          </div>

          <div class="flex w-full space-x-2">
            <div class="flex justify-between w-5/12">
              <span>Perawakan</span>
              <span>:</span>
            </div>
            <div class="flex w-7/12">{{ plant.perawakan }}</div>
          </div>

          <div class="flex w-full space-x-2" v-if="plant.category">
            <div class="flex justify-between w-5/12">
              <span>Kategori</span>
              <span>:</span>
            </div>
            <div class="flex w-7/12">{{ plant.category.nama_kategori }}</div>
          </div>
        </div>
      </nuxt-link>
    </div>

    <div v-else>Tidak ada data tanaman ditemukan.</div>

     <Pagination
      v-if="apiResponse && apiResponse.data.data && apiResponse.data.data.length > 0 && totalPages > 1"
      v-model:currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="updatePage"
    />

  </div>
</template>