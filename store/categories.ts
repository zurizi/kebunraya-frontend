import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import { ref } from "vue";

// Define the structure of a category item based on the API response
interface Category {
  id: number;
  nama_kategori: string;
  created_at?: string; // Optional fields if not always needed
  updated_at?: string; // Optional fields if not always needed
}

export const useCategoriesStore = defineStore("categories", () => {
  const { $api } = useNuxtApp();

  // State properties
  const categoryList = ref<Category[]>([]);
  const categoryListPending = ref(false);
  const categoryListError = ref<any>(null); // Can be more specific if error structure is known

  // Action to fetch categories
  async function fetchCategories() {
    categoryListPending.value = true;
    categoryListError.value = null;
    try {
      const response = await $api.get("/categories"); // Using $api service

      if (response.data && response.data.status === "success" && Array.isArray(response.data.data)) {
        categoryList.value = response.data.data;
      } else {
        // Handle unexpected response structure
        console.error("[Categories Store] Unexpected API response structure:", response.data);
        categoryList.value = []; // Reset or keep previous state based on desired behavior
        // categoryListError.value = new Error("Unexpected API response structure"); // Optionally set an error
      }
    } catch (err: any) {
      console.error("[Categories Store] Failed to fetch categories:", err);
      categoryListError.value = err;
      categoryList.value = []; // Clear list on error
    } finally {
      categoryListPending.value = false;
    }
  }

  // Expose state and actions
  return {
    categoryList,
    categoryListPending,
    categoryListError,
    fetchCategories,
  };
});
