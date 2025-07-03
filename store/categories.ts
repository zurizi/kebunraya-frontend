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
  const totalCategoriesCount = ref(0); // New state for total categories
  const hasFetched = ref(false); // Flag to ensure fetch only happens once unless forced

  // Action to fetch categories
  async function fetchCategories(force = false) {
    // If categories are already loaded and not forcing, or if a fetch is pending, return
    if ((hasFetched.value && !force) || categoryListPending.value) {
      return;
    }

    categoryListPending.value = true;
    categoryListError.value = null;
    try {
      const response = await $api.get("/categories"); // Using $api service

      if (response.data && response.data.status === "success" && Array.isArray(response.data.data)) {
        categoryList.value = response.data.data;
        
        // Attempt to get total count.
        // Option 1: If API sends a total in metadata (e.g., response.data.meta.total)
        if (response.data.meta && typeof response.data.meta.total === 'number') {
          totalCategoriesCount.value = response.data.meta.total;
        } 
        // Option 2: If the '/api/categories' endpoint always returns ALL categories (not paginated)
        // then the length of the array is the total count.
        else if (Array.isArray(response.data.data)) { // This check is redundant if the outer if already confirmed it
          totalCategoriesCount.value = response.data.data.length;
        }
        // If categories are paginated and total is in a different field like response.data.data.total (similar to plants)
        else if (response.data.data && typeof response.data.data.total === 'number') {
            totalCategoriesCount.value = response.data.data.total;
        }
        // else {
          // If no total count information is found, totalCategoriesCount will retain previous value or 0
        // }
        hasFetched.value = true; // Successfully fetched
      } else {
        // Handle unexpected response structure
        console.error("[Categories Store] Unexpected API response structure:", response.data);
        categoryList.value = []; 
        totalCategoriesCount.value = 0; // Reset on error or bad structure
        // categoryListError.value = new Error("Unexpected API response structure"); // Optionally set an error
        // Do not set hasFetched to true here, to allow retries
      }
    } catch (err: any) {
      console.error("[Categories Store] Failed to fetch categories:", err);
      categoryListError.value = err;
      categoryList.value = []; 
      totalCategoriesCount.value = 0; // Reset on error
      // Do not set hasFetched to true here, to allow retries
    } finally {
      categoryListPending.value = false;
    }
  }

  // Expose state and actions
  return {
    categoryList,
    categoryListPending,
    categoryListError,
    totalCategoriesCount, // Expose totalCategoriesCount
    fetchCategories,
  };
});
