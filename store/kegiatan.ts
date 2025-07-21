// store/kegiatan.ts
import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import { ref } from "vue";
import { useLoadingStore } from "./loading";

export const useKegiatanStore = defineStore("kegiatan", () => {
  const { $api } = useNuxtApp();
  const loadingStore = useLoadingStore();

  const kegiatanList = ref<any[]>([]);
  const kegiatanListPending = ref(false);
  const kegiatanListError = ref<any | null>(null);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const totalKegiatanCount = ref(0);
  const searchText = ref("");

  const kegiatanDetail = ref<any | null>(null);
  const kegiatanDetailPending = ref(false);
  const kegiatanDetailError = ref<any | null>(null);

  const kegiatanCreateError = ref<any | null>(null);
  const kegiatanUpdateError = ref<any | null>(null);
  const kegiatanDeleteError = ref<any | null>(null);

  async function fetchKegiatanList() {
    kegiatanListPending.value = true;
    kegiatanListError.value = null;
    loadingStore.show();
    try {
      const response = await $api.get("/kegiatan", {
        params: {
          page: currentPage.value,
          search: searchText.value,
        },
      });

      if (response.data && response.data.status === "success" && response.data.data) {
        const responseData = response.data.data;
        if (Array.isArray(responseData.data) && responseData.last_page !== undefined) {
          kegiatanList.value = responseData.data;
          totalPages.value = responseData.last_page;
          totalKegiatanCount.value = responseData.total || 0;
        } else {
          console.error("[Kegiatan Store] Invalid API response structure for list:", responseData);
          kegiatanList.value = [];
          totalPages.value = 1;
          totalKegiatanCount.value = 0;
        }
      } else {
        console.error("[Kegiatan Store] API request failed or invalid structure:", response.data);
        kegiatanList.value = [];
        totalPages.value = 1;
        totalKegiatanCount.value = 0;
      }
    } catch (err: any) {
      console.error("[Kegiatan Store] Failed to fetch list:", err);
      kegiatanListError.value = err;
      kegiatanList.value = [];
      totalPages.value = 1;
      totalKegiatanCount.value = 0;
      if (err.response && err.response.status === 404) {
        kegiatanListError.value = null; // Treat 404 as empty list
      }
    } finally {
      kegiatanListPending.value = false;
      loadingStore.hide();
    }
  }

  async function fetchKegiatanDetail(id: string | number) {
    kegiatanDetailPending.value = true;
    kegiatanDetailError.value = null;
    kegiatanDetail.value = null;
    try {
      const response = await $api.get(`/kegiatan/${id}`);
      if (response.data && response.data.status === "success" && response.data.data) {
        kegiatanDetail.value = response.data.data;
      } else {
        console.error("[Kegiatan Store] Invalid API response structure for detail:", response.data);
      }
    } catch (err: any) {
      console.error(`[Kegiatan Store] Failed to fetch detail for ID ${id}:`, err);
      kegiatanDetailError.value = err;
      if (err.response && err.response.status === 404) {
         kegiatanDetailError.value = { message: `Kegiatan with ID ${id} not found.`, status: 404 };
      }
    } finally {
      kegiatanDetailPending.value = false;
    }
  }

  function resetKegiatanDetail() {
    kegiatanDetail.value = null;
    kegiatanDetailError.value = null;
    kegiatanDetailPending.value = false;
  }

  async function createKegiatan(kegiatanData: FormData) {
    kegiatanCreateError.value = null;
    try {
      const response = await $api.post("/kegiatan", kegiatanData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err: any) {
      console.error("[Kegiatan Store] Failed to create kegiatan:", err.response?.data || err.message || err);
      kegiatanCreateError.value = err.response?.data || { message: err.message };
      throw err;
    }
  }

  async function updateKegiatan(id: string | number, kegiatanData: FormData) {
    kegiatanUpdateError.value = null;
    try {
      const response = await $api.post(`/kegiatan/${id}`, kegiatanData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err: any) {
      console.error(`[Kegiatan Store] Failed to update kegiatan ${id}:`, err.response?.data || err.message || err);
      kegiatanUpdateError.value = err.response?.data || { message: err.message };
      throw err;
    }
  }

  async function deleteKegiatan(id: string | number) {
    kegiatanDeleteError.value = null;
    try {
      const response = await $api.delete(`/kegiatan/${id}`);
      return response.data;
    } catch (err: any) {
      console.error(`[Kegiatan Store] Failed to delete kegiatan ${id}:`, err.response?.data || err.message || err);
      kegiatanDeleteError.value = err.response?.data || { message: err.message };
      throw err;
    }
  }

  function updatePage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      fetchKegiatanList();
    }
  }

  function setSearchQuery(query: string) {
    searchText.value = query;
    currentPage.value = 1;
    fetchKegiatanList();
  }

  function resetSearch() {
    searchText.value = "";
    currentPage.value = 1;
  }

  return {
    kegiatanList,
    kegiatanListPending,
    kegiatanListError,
    currentPage,
    totalPages,
    totalKegiatanCount,
    searchText,
    fetchKegiatanList,
    updatePage,
    setSearchQuery,
    resetSearch,

    kegiatanDetail,
    kegiatanDetailPending,
    kegiatanDetailError,
    fetchKegiatanDetail,
    resetKegiatanDetail,

    createKegiatan,
    kegiatanCreateError,
    updateKegiatan,
    kegiatanUpdateError,
    deleteKegiatan,
    kegiatanDeleteError,
  };
});