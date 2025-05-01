<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useKegiatanStore } from "@/store/kegiatan";
import { useRuntimeConfig } from "#app";

const kegiatanStore = useKegiatanStore();
const runtimeConfig = useRuntimeConfig();

const searchText = ref("");

const updatePage = (page: number) => {
  kegiatanStore.updatePage(page);
};

const handleSearch = (searchValue: string) => {
  kegiatanStore.setSearchText(searchValue);
};

onMounted(() => {
  kegiatanStore.fetchKegiatanList();
});
</script>

<template>
  <div
    class="flex flex-col px-4 py-12 mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8"
  >
    <SearchInput
      v-model="searchText"
      placeholder="Cari Kegiatan"
      @search="handleSearch"
    />

    <div v-if="kegiatanStore.pending" class="text-center">
      Loading kegiatan...
    </div>

    <div v-else-if="kegiatanStore.error" class="text-center text-red-500">
      Terjadi kesalahan saat mengambil data kegiatan.
    </div>

    <div
      v-else-if="
        kegiatanStore.kegiatanList && kegiatanStore.kegiatanList.length > 0
      "
      class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
    >
      <nuxt-link
        v-for="kegiatan in kegiatanStore.kegiatanList"
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
        kegiatanStore.kegiatanList &&
        kegiatanStore.kegiatanList.length > 0 &&
        kegiatanStore.totalPages > 1
      "
      v-model:currentPage="kegiatanStore.currentPage"
      :totalPages="kegiatanStore.totalPages"
      @page-change="updatePage"
    />
  </div>
</template>
