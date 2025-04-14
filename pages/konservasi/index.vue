<template>
  <div
    class="flex flex-col px-4 py-12 mx-auto space-y-4 max-w-7xl sm:px-6 lg:px-8"
  >
    <SearchInput />
    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="(plant, index) in plantList"
        :key="index"
        class="flex flex-col overflow-hidden shadow rounded-3xl"
      >
        <Image :src="plant.image" class="object-cover w-full max-h-64" />
        <div class="flex flex-col w-full p-4 space-y-2">
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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import SearchInput from "@/components/SearchInput.vue";

const plantList = [
  {
    image: "/pages/konservasi/contoh tanaman.png",
    info: [
      { label: "Nama Ilmiah", value: "Canna indica L." },
      { label: "Nama Lokal", value: "Bunga tasbeh" },
      { label: "Perawakan", value: "Herba" },
      { label: "Persebaran", value: "Tropis dan Subtropis America" },
      { label: "Umur", value: "10000 tahun" },
    ],
  },
  {
    image: "/pages/konservasi/contoh tanaman.png",
    info: [
      { label: "Nama Ilmiah", value: "Canna indica L." },
      { label: "Nama Lokal", value: "Bunga tasbeh" },
      { label: "Perawakan", value: "Herba" },
      { label: "Persebaran", value: "Tropis dan Subtropis America" },
      { label: "Umur", value: "10000 tahun" },
    ],
  },
  {
    image: "/pages/konservasi/contoh tanaman.png",
    info: [
      { label: "Nama Ilmiah", value: "Opuntia ficus-indica" },
      { label: "Nama Lokal", value: "Kaktus pir berduri" },
      { label: "Perawakan", value: "Semak berduri" },
      { label: "Persebaran", value: "Amerika Tengah dan Selatan" },
      { label: "Umur", value: "15-20 tahun" },
    ],
  },
  {
    image: "/pages/konservasi/contoh tanaman.png",
    info: [
      { label: "Nama Ilmiah", value: "Cyathea contaminans" },
      { label: "Nama Lokal", value: "Pakis haji" },
      { label: "Perawakan", value: "Pohon pakis" },
      { label: "Persebaran", value: "Asia Tenggara, Pasifik" },
      { label: "Umur", value: "100 tahun" },
    ],
  },
];
</script>
