<script setup lang="ts">
import { ref, watch } from "vue";
import { useNuxtApp, useAsyncData, useRuntimeConfig } from "#app";

const { $api } = useNuxtApp();
const runtimeConfig = useRuntimeConfig();

const currentPage = ref(1);
const totalPages = ref(1);
const searchText = ref("");

const debouncedSearchText = ref("");

let debounceTimer: NodeJS.Timeout | null = null;
const debounceDelay = 2000;

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
} = await useAsyncData(
  `kegiatan-${currentPage.value}-${debouncedSearchText.value}`,
  async () => {
    console.log(
      `Workspaceing kegiatans - Page: ${currentPage.value}, Search: ${debouncedSearchText.value}`
    );
    try {
      const response = await $api.get("/kegiatan", {
        params: {
          page: currentPage.value,
          search: debouncedSearchText.value,
        },
      });
      if (
        response.data &&
        response.data.status === "success" &&
        Array.isArray(response.data.data.data) &&
        response.data.data.last_page !== undefined
      ) {
        totalPages.value = response.data.data.last_page;

        return response.data;
      } else {
        console.error("Unexpected API response structure:", response.data);
        totalPages.value = 1;

        return { data: [], status: "error", last_page: 1 };
      }
    } catch (err: any) {
      console.error("Error fetching kegiatans:", err);
      totalPages.value = 1;
      if (err.response && err.response.status === 404) {
        return { data: [], status: "success", last_page: 1 };
      }
      throw err;
    }
  },
  {
    watch: [currentPage, debouncedSearchText],
  }
);

const updatePage = (page: number) => {
  currentPage.value = page;
};

const handleSearch = () => {
  console.log("Search button clicked (fetch triggered by debounce watcher)");
};

import { onBeforeUnmount } from "vue";
onBeforeUnmount(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});
</script>

<template>
  <div
    class="flex flex-col px-4 py-12 mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8"
  >
    <SearchInput v-model="searchText" placeholder="Cari Kegiatan" />

    <div v-if="pending" class="text-center">Loading kegiatan...</div>

    <div v-else-if="error" class="text-center text-red-500">
      Terjadi kesalahan saat mengambil data kegiatan.
    </div>

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
        v-for="kegiatan in apiResponse.data.data"
        :to="`/kegiatan/${kegiatan.id}`"
        :key="kegiatan.id"
        class="flex flex-col overflow-hidden shadow rounded-3xl"
      >
        <img
          :src="
            kegiatan.gambar
              ? `${
                  runtimeConfig.public.imgURL || runtimeConfig.public.imageCDN
                }/${kegiatan.gambar}`
              : '/placeholder-image.jpg'
          "
          :alt="`Gambar ${kegiatan.judul || 'Kegiatan'}`"
          class="object-cover w-full max-h-64"
        />

        <div class="flex flex-col w-full p-4 space-y-2">
          <div
            class="flex items-center justify-center w-full text-2xl font-semibold text-center"
          >
            {{ kegiatan.judul }}
          </div>

          <div
            class="flex items-center justify-center w-full text-sm text-center"
          >
            {{ kegiatan.tanggal }}
          </div>

          <div
            class="flex items-center justify-center w-full text-sm text-center"
          >
            {{ kegiatan.lokasi }}
          </div>
        </div>
      </nuxt-link>
    </div>

    <div v-else class="text-center text-gray-600">
      Tidak ada data kegiatan ditemukan.
    </div>

    <Pagination
      v-if="
        apiResponse &&
        apiResponse.data.data &&
        apiResponse.data.data.length > 0 &&
        totalPages > 1
      "
      v-model:currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="updatePage"
    />
  </div>
</template>
