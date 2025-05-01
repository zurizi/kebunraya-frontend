import { ref, watch, onBeforeUnmount, computed } from "vue";
import { useNuxtApp, useAsyncData, useRuntimeConfig } from "#app";

/**
 * Composable function to fetch and manage the paginated and searchable list of plants.
 * Each instance of this composable will manage its own pagination and search state.
 */
export const usePlantsList = () => {
  const { $api } = useNuxtApp();
  const runtimeConfig = useRuntimeConfig();

  const currentPage = ref(1);
  const totalPages = ref(1);
  const searchText = ref("");
  const debouncedSearchText = ref("");

  let debounceTimer: NodeJS.Timeout | null = null;
  const debounceDelay = 800;

  watch(searchText, (newValue) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      debouncedSearchText.value = newValue;
      currentPage.value = 1;
    }, debounceDelay);
  });

  const {
    data: apiResponse,
    pending,
    error,
    refresh,
  } = useAsyncData(
    `plants-list-<span class="math-inline">\{currentPage\.value\}\-</span>{debouncedSearchText.value}`,
    async () => {
      console.log(
        `[usePlantsList] Fetching plants - Page: <span class="math-inline">\{currentPage\.value\}, Search\: "</span>{debouncedSearchText.value}"`
      );
      try {
        const response = await $api.get("/plants", {
          params: {
            page: currentPage.value,
            search: debouncedSearchText.value,
          },
        });

        if (
          response.data &&
          response.data.status === "success" &&
          response.data.data
        ) {
          if (
            Array.isArray(response.data.data.data) &&
            response.data.data.last_page !== undefined
          ) {
            totalPages.value = response.data.data.last_page;

            return {
              data: response.data.data.data,
              last_page: response.data.data.last_page,
              status: "success",
            };
          } else if (
            Array.isArray(response.data.data) &&
            response.data.last_page !== undefined
          ) {
            totalPages.value = response.data.last_page;
            return {
              data: response.data.data,
              last_page: response.data.last_page,
              status: "success",
            };
          } else {
            console.error(
              "[usePlantsList] Unexpected paginated API response structure in data.data:",
              response.data.data
            );
            totalPages.value = 1;
            return { data: [], status: "error", last_page: 1 };
          }
        } else {
          console.error(
            "[usePlantsList] Unexpected API response structure or status not success:",
            response.data
          );
          totalPages.value = 1;
          return { data: [], status: "error", last_page: 1 };
        }
      } catch (err: any) {
        console.error("[usePlantsList] Error fetching plants:", err);
        totalPages.value = 1;
        if (err.response && err.response.status === 404) {
          console.log(
            "[usePlantsList] 404: No plants found for current query."
          );
          return { data: [], status: "success", last_page: 1 };
        }

        throw err;
      }
    },
    {
      watch: [currentPage, debouncedSearchText],
    }
  );

  const plantList = computed(() => apiResponse.value?.data || []);

  const updatePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    } else {
      console.warn(
        `[usePlantsList] Attempted to set page out of bounds: ${page}`
      );
    }
  };

  const setSearchText = (text: string) => {
    searchText.value = text;
  };

  onBeforeUnmount(() => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
  });

  return {
    // Data & Status
    plants: apiResponse, // Return the full apiResponse object if needed (e.g., for pagination info)
    plantList, // The array of plants (computed property for easier access)
    pending,
    error,
    refresh, // Method to manually trigger a refetch

    // Pagination State & Methods
    currentPage,
    totalPages,
    updatePage,

    // Search State & Methods
    searchText, // Bind this to your search input v-model
    setSearchText, // Alternative method to update search text programmatically
    debouncedSearchText, // The actual text used in the API call (can be displayed)
  };
};
