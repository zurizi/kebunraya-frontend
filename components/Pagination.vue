<template>
    <div class="flex items-center justify-center space-x-2">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage <= 1"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
  
      <template v-for="page in pagesToShow" :key="page">
        <span v-if="page === '...'" class="px-4 py-2 text-sm font-medium text-gray-700">...</span>
        <button
          v-else
          @click="changePage(page)"
          :class="{
            'bg-green-900 text-white border-green-600': page === currentPage,
            'bg-white text-gray-700 border-gray-300 hover:bg-gray-50': page !== currentPage,
          }"
          class="px-4 py-2 text-sm font-medium border rounded-md shadow-sm"
        >
          {{ page }}
        </button>
      </template>
  
      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage >= totalPages"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  // Definisikan props yang diterima komponen
  const props = defineProps<{
    currentPage: number;
    totalPages: number;
    // Anda bisa menambahkan props lain seperti perPage atau totalItems jika diperlukan
  }>();
  
  // Definisikan event yang akan dipancarkan (emitted)
  const emit = defineEmits(['update:currentPage', 'page-change']); // update:currentPage untuk v-model
  
  // Fungsi untuk mengubah halaman
  const changePage = (page: number) => {
    // Pastikan halaman valid
    if (page >= 1 && page <= props.totalPages && page !== props.currentPage) {
      // Memancarkan event untuk mengupdate halaman di parent component
      emit('update:currentPage', page); // Untuk v-model
      emit('page-change', page); // Event alternatif jika tidak menggunakan v-model
    }
  };
  
  // Hitung halaman yang akan ditampilkan
  // Ini adalah logika sederhana untuk menampilkan halaman di sekitar halaman saat ini
  const pagesToShow = computed(() => {
    const pages: (number | string)[] = [];
    const maxPages = 7; // Maksimal jumlah tombol halaman yang ditampilkan (termasuk '...')
    const { currentPage, totalPages } = props;
  
    if (totalPages <= maxPages) {
      // Tampilkan semua halaman jika jumlahnya sedikit
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logika untuk menampilkan halaman dengan elipsis
      const startPage = Math.max(2, currentPage - Math.floor(maxPages / 2) + 1);
      const endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxPages / 2) - 1);
  
      pages.push(1); // Selalu tambahkan halaman 1
  
      if (startPage > 2) {
        pages.push('...'); // Tambahkan elipsis di awal jika perlu
      }
  
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i); // Tambahkan halaman di sekitar halaman saat ini
      }
  
      if (endPage < totalPages - 1) {
        pages.push('...'); // Tambahkan elipsis di akhir jika perlu
      }
  
      pages.push(totalPages); // Selalu tambahkan halaman terakhir
    }
  
    return pages;
  });
  </script>