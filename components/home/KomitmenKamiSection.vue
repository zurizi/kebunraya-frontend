<template>
  <section id="komitmen-kami">
    <div
      class="flex flex-col w-full px-8 space-y-4 sm:px-14 md:px-18 lg:px-20 xl:px-24 2xl:px-28 3xl:px-32"
    >
      <div class="text-xl font-semibold">Komitmen Kami Untuk Alam</div>
      <p>Menjaga dan melestarikan keanekaragaman hayati Kalimantan Utara.</p>
      <nuxt-link to="/konservasi">
        <BaseButton addClass="px-6 bg-green-600 ">Selengkapnya</BaseButton>
      </nuxt-link>

      <div class="flex w-full p-5 bg-green-600 rounded-3xl">
        <div v-if="plantsStore.pending">Loading tanaman...</div>
        <div v-else-if="plantsStore.error">
          Terjadi kesalahan saat mengambil data tanaman.
        </div>

        <div
          v-else-if="
            Array.isArray(plantsStore.plantList) &&
            plantsStore.plantList.length > 0
          "
          class="grid w-full grid-cols-2 gap-4 xl:gap-6 3xl:gap-8 lg:grid-cols-4"
        >
          <nuxt-link
            v-for="plant in plantsStore.plantList.slice(0, 4)"
            :to="`/konservasi/${plant.id}`"
            :key="plant.id"
            class="flex flex-col overflow-hidden bg-white shadow rounded-3xl"
          >
            <img
              :src="
                plant.gambar
                  ? `${
                      runtimeConfig.public.imgURL ||
                      runtimeConfig.public.imageCDN
                    }/${plant.gambar}`
                  : '/placeholder-image.jpg'
              "
              :alt="`Gambar ${plant.nama_lokal || 'Tanaman'}`"
              class="object-cover w-full max-h-32 sm:max-h-48 xl:max-h-64"
            />

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

              <div
                class="hidden w-full space-x-2 lg:flex"
                v-if="plant.category"
              >
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
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { usePlantsStore } from "@/store/plants";
import { useRuntimeConfig } from "#app";
import { onMounted, ref } from "vue";

const plantsStore = usePlantsStore();
const runtimeConfig = useRuntimeConfig();

onMounted(() => {
  plantsStore.fetchPlants();
});
</script>
