// stores/kegiatan.ts
import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import { ref } from 'vue';

export const useKegiatanStore = defineStore('kegiatan', () => {
  const { $api } = useNuxtApp();

  // State untuk daftar kegiatan
  const kegiatanList = ref<any[]>([]);
  const pendingList = ref(false);
  const errorList = ref(null);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const searchText = ref('');

  // State untuk detail kegiatan
  const kegiatanDetail = ref<any | null>(null);
  const pendingDetail = ref(false);
  const errorDetail = ref(null);

  async function fetchKegiatanList() {
    pendingList.value = true;
    errorList.value = null;
    try {
      const response = await $api.get('/kegiatan', {
        params: {
          page: currentPage.value,
          search: searchText.value,
        },
      });

      if (
        response.data &&
        response.data.status === 'success' &&
        Array.isArray(response.data.data.data) &&
        response.data.data.last_page !== undefined
      ) {
        kegiatanList.value = response.data.data.data;
        totalPages.value = response.data.data.last_page;
      } else {
        console.error('[Kegiatan Store] Struktur respons API daftar kegiatan tidak sesuai:', response.data);
        kegiatanList.value = [];
        totalPages.value = 1;
      }
    } catch (err: any) {
      console.error('[Kegiatan Store] Gagal mengambil data daftar kegiatan:', err);
      errorList.value = err;
      kegiatanList.value = [];
      totalPages.value = 1;
      if (err.response && err.response.status === 404) {
        console.log('[Kegiatan Store] 404: Tidak ada kegiatan ditemukan untuk kueri saat ini.');
        kegiatanList.value = [];
        totalPages.value = 1;
        errorList.value = null; // Reset error untuk kasus tidak ada data
      }
    } finally {
      pendingList.value = false;
    }
  }

  async function fetchKegiatanDetail(id: string) {
    pendingDetail.value = true;
    errorDetail.value = null;
    kegiatanDetail.value = null; // Reset detail sebelum fetching baru
    try {
      const response = await $api.get(`/kegiatan/${id}`);
      if (response.data && response.data.status === 'success' && response.data.data) {
        kegiatanDetail.value = response.data.data;
      } else {
        console.error('[Kegiatan Store] Struktur respons API detail kegiatan tidak sesuai:', response.data);
        kegiatanDetail.value = null;
      }
    } catch (err: any) {
      console.error(`[Kegiatan Store] Gagal mengambil detail kegiatan dengan ID ${id}:`, err);
      errorDetail.value = err;
      kegiatanDetail.value = null;
      if (err.response && err.response.status === 404) {
        console.log(`[Kegiatan Store] 404: Detail kegiatan dengan ID ${id} tidak ditemukan.`);
      }
    } finally {
      pendingDetail.value = false;
    }
  }

  function updatePage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      fetchKegiatanList();
    } else {
      console.warn(`[Kegiatan Store] Mencoba mengatur halaman di luar batas: ${page}`);
    }
  }

  function setSearchText(text: string) {
    searchText.value = text;
    currentPage.value = 1; // Reset ke halaman pertama saat mencari
    fetchKegiatanList();
  }

  function resetStateList() {
    currentPage.value = 1;
    searchText.value = '';
    kegiatanList.value = [];
    totalPages.value = 1;
    pendingList.value = false;
    errorList.value = null;
  }

  function resetStateDetail() {
    kegiatanDetail.value = null;
    pendingDetail.value = false;
    errorDetail.value = null;
  }

  return {
    // State dan actions untuk daftar kegiatan
    kegiatanList,
    pendingList,
    errorList,
    currentPage,
    totalPages,
    searchText,
    fetchKegiatanList,
    updatePage,
    setSearchText,
    resetStateList,

    // State dan actions untuk detail kegiatan
    kegiatanDetail,
    pendingDetail,
    errorDetail,
    fetchKegiatanDetail,
    resetStateDetail,
  };
});