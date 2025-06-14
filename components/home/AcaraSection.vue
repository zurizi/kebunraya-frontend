<template>
  <section id="acara">
    <div
      class="flex flex-col w-full px-8 space-y-4 sm:px-14 md:px-18   lg:px-20 xl:px-24 2xl:px-28 3xl:px-32"
    >
      <div class="text-xl font-semibold">Jangan Lewatkan Acara Kami</div>
      <p>
        Ikuti berbagai acara menarik, mulai dari workshop konservasi hingga
        festival budaya suku lokal.
      </p>
      <BaseButton addClass="px-6 bg-stone-500 ">Selengkapnya</BaseButton>

      <div class="flex w-full p-5 bg-stone-500 rounded-3xl">
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
          class="grid w-full grid-cols-2 gap-8 lg:grid-cols-3"
        >
          <nuxt-link
            v-for="kegiatan in kegiatanStore.kegiatanList.slice(0, 3)"
            :to="`/kegiatan/${kegiatan.id}`"
            :key="kegiatan.id"
            class="flex flex-col overflow-hidden bg-white shadow rounded-3xl"
          >
            <img
              :src="
                kegiatan.gambar
                  ? `${
                      runtimeConfig.public.imgURL ||
                      runtimeConfig.public.imageCDN
                    }/${kegiatan.gambar}`
                  : '/placeholder-image.jpg'
              "
              :alt="`Gambar ${kegiatan.judul || 'Kegiatan'}`"
              class="object-cover w-full h-32 sm:h-48 xl:h-64"
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
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useKegiatanStore } from "@/store/kegiatan";
import { useRuntimeConfig } from "#app";

const kegiatanStore = useKegiatanStore();
const runtimeConfig = useRuntimeConfig();

onMounted(() => {
  kegiatanStore.fetchKegiatanList();
});
</script>
