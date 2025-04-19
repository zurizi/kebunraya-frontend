<template>
  <div
    class="flex flex-col px-4 py-12 mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8"
  >
    <!-- <SearchInput /> -->
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <nuxt-link
        v-for="(plant, index) in plantList"
        :to="plant.link"
        :key="index"
        class="flex flex-col overflow-hidden"
      >
        <Image :src="plant.image" class="object-cover w-full max-h-64" />
        <div class="flex flex-col w-full p-4 space-y-2 bg-gray-100">
          <div
            class="flex w-full space-x-2"
            v-for="(item, i) in plant.info"
            :key="i"
          >
            <div class="flex justify-between w-5/12">
              <span>{{ item.label }}</span>
              <span>:</span>
            </div>
            <div class="flex w-7/12">{{ item.value }}</div>
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import SearchInput from "@/components/SearchInput.vue";

const plantList = [
  {
    image: "/pages/kegiatan/contoh tanaman.png",
    link : "/konservasi/1",
    info: [
      { label: "Nama Ilmiah", value: "Canna indica L." },
      { label: "Nama Lokal", value: "Bunga tasbeh" },
      { label: "Perawakan", value: "Herba" },
      { label: "Persebaran", value: "Tropis dan Subtropis America" },
      { label: "Umur", value: "10000 tahun" },
    ],
  },
];
</script>
