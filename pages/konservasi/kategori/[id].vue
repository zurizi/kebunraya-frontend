<script setup lang="ts">
import { usePlantsStore } from "@/store/plants";
import { useRuntimeConfig } from "#app";
import { onMounted, ref, computed } from "vue";
import { useRoute, onBeforeRouteLeave } from "vue-router";

const route = useRoute();
const categoryId = route.params.id as string;

const plantsStore = usePlantsStore();
const runtimeConfig = useRuntimeConfig();

const categoryList = [
  {
    id: 1,
    name: "Tumbuhan Obat Kalimantan",
    link: "tumbuhan-obat-kalimantan",
  },
  {
    id: 2,
    name: "Tumbuhan Etnobotani Kalimantan",
    link: "tumbuhan-etnobotani-kalimantan",
  },
  {
    id: 3,
    name: "Tumbuhan Buah Kalimantan",
    link: "tumbuhan-buah-kalimantan",
  },
  {
    id: 4,
    name: "Tumbuhan Kayu",
    link: "tumbuhan-kayu",
  },
  {
    id: 5,
    name: "Tumbuhan Hias",
    link: "tumbuhan-hias",
  },
  {
    id: 6,
    name: "Tumbuhan Air",
    link: "tumbuhan-air",
  },
  {
    id: 7,
    name: "Tumbuhan Anggrek Kalimantan",
    link: "tumbuhan-anggrek-kalimantan",
  },
];
const getIdCategory = ref("");

const getCategory = computed(() => {
  const linkToFind = categoryId;

  const foundCategory = categoryList.find(
    (category) => category.link === linkToFind
  );

  if (foundCategory) {
    getIdCategory.value = foundCategory.id.toString();
  }

  return foundCategory ? foundCategory : [];
});

onMounted(() => {
  plantsStore.categoryId = getIdCategory.value;
  plantsStore.fetchPlants();
});

onBeforeRouteLeave((to, from, next) => {
  plantsStore.resetCategory();
  next();
});
</script>

<template>
  <div class="flex flex-col w-full">
    <div class="relative flex w-full p-0 m-0 h-52 sm:h-64 md:h-80">
      <Image
        src="/pages/konservasi/bg-category.png"
        alt=""
        class="relative object-cover w-full h-full"
      />
      <div class="absolute flex items-center justify-center w-full h-full px-10">
        <h1 class="text-2xl font-semibold text-center md:4xl 2xl:5xl 3xl:text-6xl">
          {{ getCategory?.name }}
        </h1>
      </div>
    </div>
    <div
      class="flex flex-col px-4 py-12 mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8"
    >
      <div v-if="plantsStore.pending">Loading tanaman...</div>
      <div v-else-if="plantsStore.error">
        Terjadi kesalahan saat mengambil data tanaman.
      </div>

      <div
        v-else-if="
          Array.isArray(plantsStore.plantList) &&
          plantsStore.plantList.length > 0
        "
        class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        <nuxt-link
          v-for="plant in plantsStore.plantList"
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
          Array.isArray(plantsStore.plantList) &&
          plantsStore.plantList.length > 0 &&
          plantsStore.totalPages > 1
        "
        v-model:currentPage="plantsStore.currentPage"
        :totalPages="plantsStore.totalPages"
        @page-change="plantsStore.updatePage"
      />
    </div>
  </div>
</template>
