// stores/plants.ts
import { defineStore } from "pinia";
import { useNuxtApp, useRuntimeConfig } from "#app";
import { ref } from "vue";

export const usePlantsStore = defineStore("plants", () => {
  const { $api } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();

  // State untuk daftar tanaman
  const plantList = ref<any[]>([]);
  const plantsListPending = ref(false);
  const plantsListError = ref(null);
  const currentPage = ref(1);
  const totalPages = ref(1);
  const totalPlantsCount = ref(0);
  const searchText = ref("");
  const categoryId = ref("");

  // State untuk detail tanaman
  const plantDetail = ref<any | null>(null);
  const plantDetailPending = ref(false);
  const plantDetailError = ref(null);

  // State untuk pembuatan tanaman
  const plantCreateError = ref<any | null>(null);

  // State untuk pembaruan tanaman
  const plantUpdateError = ref<any | null>(null);

  // State untuk penghapusan tanaman
  const plantDeleteError = ref<any | null>(null);

  async function fetchPlants() {
    plantsListPending.value = true;
    plantsListError.value = null;
    try {
      const response = await $api.get("/plants", {
        params: {
          page: currentPage.value,
          search: searchText.value,
          category_id: categoryId.value,
        },
      });

      if (
        response.data &&
        response.data.status === "success" &&
        response.data.data
      ) {
        if (
          response.data.data &&
          typeof response.data.data.total === "number"
        ) {
          totalPlantsCount.value = response.data.data.total;
        } else if (
          response.data.meta &&
          typeof response.data.meta.total === "number"
        ) {
          totalPlantsCount.value = response.data.meta.total;
        }
        if (
          Array.isArray(response.data.data.data) &&
          response.data.data.last_page !== undefined
        ) {
          plantList.value = response.data.data.data;
          totalPages.value = response.data.data.last_page;
        } else if (
          Array.isArray(response.data.data) &&
          response.data.last_page !== undefined
        ) {
          plantList.value = response.data.data;
          totalPages.value = response.data.last_page;
        } else {
          console.error(
            "[Plants Store] Struktur respons API daftar tanaman tidak sesuai:",
            response.data.data
          );
          plantList.value = [];
          totalPages.value = 1;
        }
      } else {
        console.error(
          "[Plants Store] Struktur respons API daftar tanaman tidak sesuai atau status bukan sukses:",
          response.data
        );
        plantList.value = [];
        totalPages.value = 1;
      }
    } catch (err: any) {
      console.error("[Plants Store] Gagal mengambil data daftar tanaman:", err);
      plantsListError.value = err;
      plantList.value = [];
      totalPages.value = 1;
      if (err.response && err.response.status === 404) {
        console.log(
          "[Plants Store] 404: Tidak ada tanaman ditemukan untuk kueri saat ini."
        );
        plantList.value = [];
        totalPages.value = 1;
        plantsListError.value = null;
      }
    } finally {
      plantsListPending.value = false;
    }
  }

  async function fetchPlantDetail(id: string) {
    plantDetailPending.value = true;
    plantDetailError.value = null;
    plantDetail.value = null;
    try {
      const response = await $api.get(`/plants/${id}`);
      if (
        response.data &&
        response.data.status === "success" &&
        response.data.data
      ) {
        plantDetail.value = response.data.data;
      } else {
        console.error(
          "[Plants Store] Struktur respons API detail tanaman tidak sesuai:",
          response.data
        );
        plantDetail.value = null;
      }
    } catch (err: any) {
      console.error(
        `[Plants Store] Gagal mengambil detail tanaman dengan ID ${id}:`,
        err
      );
      plantDetailError.value = err;
      plantDetail.value = null;
      if (err.response && err.response.status === 404) {
        console.log(
          `[Plants Store] 404: Detail tanaman dengan ID ${id} tidak ditemukan.`
        );
      }
    } finally {
      plantDetailPending.value = false;
    }
  }

  function updatePage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
      fetchPlants();
    } else {
      console.warn(
        `[Plants Store] Mencoba mengatur halaman di luar batas: ${page}`
      );
    }
  }

  function setSearchText(text: string) {
    searchText.value = text;
    currentPage.value = 1;
    fetchPlants();
  }

  function resetPlantDetail() {
    plantDetail.value = null;
    plantDetailError.value = null;
    plantDetailPending.value = false;
  }

  function resetCategory() {
    categoryId.value = "";
    currentPage.value = 1;
    totalPages.value = 1;
  }

  return {
    plantList,
    plantsListPending,
    plantsListError,
    currentPage,
    totalPages,
    totalPlantsCount,
    searchText,
    fetchPlants,
    updatePage,
    setSearchText,

    // State untuk detail tanaman
    plantDetail,
    plantDetailPending,
    plantDetailError,
    fetchPlantDetail,
    resetPlantDetail,

    // category
    categoryId,
    resetCategory,

    // Create plant
    plantCreateError,
    createPlant,

    // Update plant
    plantUpdateError,
    updatePlant,

    // Delete plant
    plantDeleteError,
    deletePlant,
  };

  async function createPlant(plantData: any) {
    // const { $api } = useNuxtApp(); // $api is already available from the outer scope
    plantCreateError.value = null;

    const formData = new FormData();
    for (const key in plantData) {
      if (plantData.hasOwnProperty(key)) {
        if (key === "gambar" && Array.isArray(plantData[key])) {
          plantData[key].forEach((file: File) => {
            if (file instanceof File) {
              formData.append('gambar[]', file, file.name); // Use gambar[] for arrays
            }
          });
        } else if (
          plantData[key] !== null &&
          plantData[key] !== undefined &&
          plantData[key] !== ""
        ) {
          formData.append(key, plantData[key]);
        }
      }
    }

    try {
      const response = await $api.post("/plants", formData, {
        headers: {
          // $api service should ideally handle this for FormData
          "Content-Type": "multipart/form-data",
        },
      });
      // Optionally, refresh plants list or handle success (e.g., show notification)
      // await fetchPlants(); // Example: uncomment to refresh list after creation
      return response.data;
    } catch (err: any) {
      console.error(
        "[Plants Store] Gagal membuat tanaman:",
        err.response?.data || err.message || err
      );
      plantCreateError.value = err.response?.data || err.message || err;
      throw err; // Rethrow to be caught by the calling component
    }
  }

  async function updatePlant(plantId: string | number, plantData: any) {
    plantUpdateError.value = null;

    const formData = new FormData();

    for (const key in plantData) {
      if (plantData.hasOwnProperty(key)) {
        if (key === "gambar" && Array.isArray(plantData[key])) {
          plantData[key].forEach((file: File) => {
            if (file instanceof File) {
              formData.append('gambar[]', file, file.name); // Use gambar[] for arrays
            }
          });
        } else if (
          plantData[key] !== null &&
          plantData[key] !== undefined &&
          plantData[key] !== ""
        ) {
          if (key === "category_id" && plantData[key] === "") {
            formData.append(key, plantData[key]);
          } else {
            formData.append(key, plantData[key]);
          }
        }
      }
    }

    try {
      const response = await $api.post(`/plants/${plantId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (err: any) {
      console.error(
        `[Plants Store] Failed to update plant ${plantId}:`,
        err.response?.data || err.message || err
      );
      plantUpdateError.value = err.response?.data || err;
      throw err;
    }
  }

  async function deletePlant(plantId: string | number) {
    plantDeleteError.value = null;
    try {
      const response = await $api.delete(`/plants/${plantId}`);
      return response.data;
    } catch (err: any) {
      console.error(
        `[Plants Store] Failed to delete plant ${plantId}:`,
        err.response?.data || err.message || err
      );
      plantDeleteError.value = err.response?.data || err;
      throw err;
    }
  }
});
