<template>
  <div
    class="flex flex-col px-4 py-12 mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8"
  >
    <SearchInput v-model="searchText" placeholder="Cari Tanaman" />
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
              ? `${
                  runtimeConfig.public.imgURL || runtimeConfig.public.imageCDN
                }/${plant.gambar}`
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
const debounceDelay = 2000; // 2 detik

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
  `plants-${currentPage.value}-${debouncedSearchText.value}`,
  async () => {
    console.log(
      `Workspaceing plants - Page: ${currentPage.value}, Search: ${debouncedSearchText.value}`
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
        response.data.data &&
        response.data.data.last_page !== undefined
      ) {
        totalPages.value = response.data.data.last_page;

        return response.data;
      } else if (
        response.data &&
        response.data.status === "success" &&
        Array.isArray(response.data.data) &&
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
      console.error("Error fetching plants:", err);
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

import { onBeforeUnmount } from "vue";
onBeforeUnmount(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
});
</script>
