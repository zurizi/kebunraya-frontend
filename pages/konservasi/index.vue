<script setup lang="ts">
import { usePlantsStore } from "@/store/plants";
import { useRuntimeConfig } from "#app";
import { onMounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const plantsStore = usePlantsStore();
const runtimeConfig = useRuntimeConfig();

const searchText = ref("");

const handleSearch = (searchValue: string) => {
  plantsStore.setSearchText(searchValue);
};

onMounted(() => {
  plantsStore.fetchPlants();
});

onBeforeRouteLeave((to, from, next) => {
  plantsStore.resetCategory();
  next();
});
</script>

<template>
  <div
    class="flex flex-col px-4 py-12 mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8"
  >
    <SearchInput
      v-model="searchText"
      placeholder="Cari Tanaman"
      @search="handleSearch"
    />

    <div v-if="plantsStore.pending">Loading tanaman...</div>
    <div v-else-if="plantsStore.error">
      Terjadi kesalahan saat mengambil data tanaman.
    </div>

    <div
      v-else-if="
        Array.isArray(plantsStore.plantList) && plantsStore.plantList.length > 0
      "
      class="grid w-full grid-cols-2 gap-4 xl:gap-6 3xl:gap-8 lg:grid-cols-3"
    >
      <nuxt-link
        v-for="plant in plantsStore.plantList"
        :to="`/konservasi/${plant.id}`"
        :key="plant.id"
        class="flex flex-col overflow-hidden shadow rounded-3xl"
      >
        <div class="w-full aspect-[5/4] bg-gray-200"> <!-- Aspect ratio container -->
          <img
            :src="
              plant.gambar
                ? `${
                    runtimeConfig.public.imgURL || runtimeConfig.public.imageCDN
                  }/${plant.gambar}`
                : '/placeholder-image.jpg'
            "
            :alt="`Gambar ${plant.nama_lokal || 'Tanaman'}`"
            class="object-cover w-full h-full" <!-- Fill container -->
          />
        </div>

        <div class="flex flex-col w-full p-2 space-y-1 md:space-y-2 md:p-4">
          <div class="flex w-full space-x-2 font-semibold">
            <div class="justify-between hidden w-5/12 lg:flex">
              <span>Nama Ilmiah</span>
              <span>:</span>
            </div>
            <div class="flex w-full lg:w-7/12">{{ plant.nama_ilmiah }}</div>
          </div>

          <div class="flex w-full space-x-2">
            <div class="justify-between hidden w-5/12 lg:flex">
              <span>Nama Lokal</span>
              <span>:</span>
            </div>
            <div class="flex w-full lg:w-7/12">{{ plant.nama_lokal }}</div>
          </div>

          <div class="hidden w-full space-x-2 lg:flex">
            <div class="flex justify-between w-5/12">
              <span>Keluarga</span>
              <span>:</span>
            </div>
            <div class="flex w-7/12">{{ plant.keluarga }}</div>
          </div>

          <div class="hidden w-full space-x-2 lg:flex">
            <div class="flex justify-between w-5/12">
              <span>Umur</span>
              <span>:</span>
            </div>
            <div class="flex w-7/12">{{ plant.umur }}</div>
          </div>

          <div class="hidden w-full space-x-2 lg:flex">
            <div class="flex justify-between w-5/12">
              <span>Perawakan</span>
              <span>:</span>
            </div>
            <div class="flex w-7/12">{{ plant.perawakan }}</div>
          </div>

          <div class="hidden w-full space-x-2 lg:flex" v-if="plant.category">
            <div class="flex justify-between w-5/12">
              <span>Kategori</span>
              <span>:</span>
            </div>
            <div class="flex w-7/12">
              {{ plant.category.nama_kategori }}
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>

    <div v-else>Tidak ada data tanaman ditemukan.</div>

    <Pagination
      v-if="
        Array.isArray(plantsStore.plantList) &&
        plantsStore.plantList.length > 0 &&
        plantsStore.totalPages > 1
      "
      v-model:currentPage="plantsStore.currentPage"
      :totalPages="plantsStore.totalPages"
      @page-change="plantsStore.updatePage"
    />
  </div>
</template>
