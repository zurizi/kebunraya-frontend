<template>
    <section id="hero" class="relative h-[80vh] 3xl:h-[75vh]">
      <div class="absolute flex w-full h-full">
        <Image
          src="/pages/home/hero-bg.png"
          alt=""
          class="object-cover w-full h-full"
        />
      </div>
      <div
        class="relative flex items-center h-full px-8 sm:px-14 md:px-18 md:container lg:px-20 xl:px-24 2xl:px-28 3xl:px-32"
      >
        <div class="relative flex flex-col w-full space-y-5 lg:w-1/2">
          <h1
            class="text-white text-6xl lg:text-8xl font-bold [text-shadow:4px_4px_0px_rgba(0,0,0,0.75)]"
          >
            Kebun Raya Bundahayati
          </h1>
  
          <h6
            class="text-lg lg:text-xl 3xl:text-2xl text-white [text-shadow:2px_2px_0px_rgba(0,0,0,0.75)]"
          >
            Selamat datang di Kebun Raya Bulungan, tempat di mana flora endemik,
            budaya lokal, dan konservasi alam bertemu untuk menciptakan masa
            depan yang berkelanjutan.
          </h6>
          <div class="flex space-x-4">
            <BaseButton color="green-900" width="auto" addClass="px-6 ">
              Jelajahi Kebun Raya
            </BaseButton>
            <BaseButton color="green-900" width="auto" addClass="px-6 ">
              Lihat Peta Lokasi
            </BaseButton>
          </div>
        </div>
        <div class="relative hidden w-1/2 lg:block">
          <Image
            src="/pages/home/hero-img.png"
            alt=""
            class="object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  </script>