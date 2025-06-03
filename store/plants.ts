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
  const totalPlantsCount = ref(0); // New state for total plants
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
        // Update total plants count
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
        // Removed the 'else if Array.isArray(response.data.data)' for totalPlantsCount
        // as it's less reliable if pagination is always expected to provide a 'total'.
        // If no specific total field is found, totalPlantsCount will remain its previous value or 0.

        // Process plant list and total pages for pagination
        if (
          Array.isArray(response.data.data.data) &&
          response.data.data.last_page !== undefined
        ) {
          plantList.value = response.data.data.data;
          totalPages.value = response.data.data.last_page;
        } else if (
          Array.isArray(response.data.data) && // Fallback for structures where data is direct array and last_page is sibling
          response.data.last_page !== undefined
        ) {
          plantList.value = response.data.data;
          totalPages.value = response.data.last_page;
        } else {
          // This case suggests an unexpected structure for paginated data itself.
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
    // State untuk daftar tanaman
    plantList,
    plantsListPending,
    plantsListError,
    currentPage,
    totalPages,
    totalPlantsCount, // Expose totalPlantsCount
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
        if (key === "gambar" && plantData[key] instanceof File) {
          formData.append(key, plantData[key], plantData[key].name);
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
        headers: { // $api service should ideally handle this for FormData
          'Content-Type': 'multipart/form-data',
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
        if (key === "gambar") {
          if (plantData.gambar instanceof File) {
            formData.append("gambar", plantData.gambar);
          }
        } else if (
          plantData[key] !== null &&
          plantData[key] !== undefined &&
          plantData[key] !== ""
        ) {
          // Ensure category_id is not empty string, convert to null if it is, or handle as needed by backend
          if (key === "category_id" && plantData[key] === "") {
            // If backend expects null for empty category_id, or if it should be omitted
            // formData.append(key, null); // This might not work as expected with FormData
            // Or simply don't append if backend handles omitted field as no change or error
            // For now, let's assume empty string is not a valid ID and should not be sent,
            // or backend handles it. If it must be null, specific handling is needed.
            // The provided snippet appends if not null/undefined, so empty string would pass.
            // Let's refine to not send empty string for category_id if it's meant to be optional or cleared.
            // However, the PlantForm requires category_id, so it shouldn't be empty during update
            // unless the requirement changes. Sticking to provided logic:
            formData.append(key, plantData[key]);
          } else {
            formData.append(key, plantData[key]);
          }
        }
      }
    }

    // Backend might expect PUT for updates, but many PHP frameworks (like Laravel)
    // listen for POST with a _method field to simulate PUT for FormData.
    // formData.append('_method', 'PUT'); // Uncomment if backend (e.g. Laravel) needs this for FormData updates

    try {
      const response = await $api.post(`/plants/${plantId}`, formData, {
        headers: {
          // $api service should ideally handle this for FormData
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
      return response.data; // Return response data on success
    } catch (err: any) {
      console.error(
        `[Plants Store] Failed to delete plant ${plantId}:`,
        err.response?.data || err.message || err
      );
      plantDeleteError.value = err.response?.data || err;
      throw err; // Rethrow to be caught by the calling component
    }
  }
});
