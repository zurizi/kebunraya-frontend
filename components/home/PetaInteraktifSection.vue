<template>
  <section id="peta-interaktif">
    <div
      class="flex flex-col w-full px-16 space-y-4 md:px-18 md:container lg:px-20 xl:px-24 2xl:px-28 3xl:px-32"
    >
      <div class="text-xl font-semibold">Peta Interaktif Kebun Raya</div>
      <p>
        Gunakan peta interaktif untuk menjelajahi area menarik di Kebun Raya
        Bulungan, mulai dari taman tematik hingga fasilitas umum.
      </p>
      <nuxt-link to="/maps">
        <BaseButton addClass="px-6 bg-yellow-500 "
          >Buka Peta Interaktif</BaseButton
        >
      </nuxt-link>

      <div class="flex w-full p-5 bg-yellow-500 h-96 rounded-3xl">
        <Image
          src="/pages/maps/map.png"
          alt=""
          class="object-cover w-full h-full rounded-3xl"
        />
      </div>
    </div>
  </section>
</template>

<script setup></script>
