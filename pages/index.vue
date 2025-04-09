<template>
  <div id="home" class="space-y-20">
    <section id="hero" class="relative h-[80vh] 3xl:h-[75vh]">
      <div class="absolute flex w-full h-full">
        <Image
          src="/pages/home/hero-bg.png"
          alt=""
          class="object-cover w-full h-full"
        />
      </div>
      <div
        class="relative flex items-center h-full px-16 md:px-18 md:container lg:px-20 xl:px-24 2xl:px-28 3xl:px-32"
      >
        <div class="relative flex flex-col w-1/2 space-y-5">
          <h1
            class="text-white text-8xl font-bold [text-shadow:4px_4px_0px_rgba(0,0,0,0.75)]"
          >
            Kebun Raya Bundahayati
          </h1>

          <h6
            class="text-xl 3xl:text-2xl text-white [text-shadow:2px_2px_0px_rgba(0,0,0,0.75)]"
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
        <div class="relative w-1/2">
          <Image
            src="/pages/home/hero-img.png"
            alt=""
            class="object-cover w-full h-full"
          />
        </div>
      </div>
    </section>
    <section id="data-lingkungan">
      <div
        class="flex flex-col w-full px-16 space-y-4 md:px-18 md:container lg:px-20 xl:px-24 2xl:px-28 3xl:px-32"
      >
        <div class="text-xl font-semibold">Data Lingkungan Real-Time</div>
        <p>
          Pantau data real-time seperti kualitas udara, suhu, dan kecepatan
          angin di kebun raya.
        </p>
        <BaseButton addClass="px-6 bg-sky-600 ">Lihat Semua Data</BaseButton>

        <div class="flex w-full h-80 bg-sky-600 rounded-3xl"></div>
      </div>
    </section>
    <section id="komitmen-kami">
      <div
        class="flex flex-col w-full px-16 space-y-4 md:px-18 md:container lg:px-20 xl:px-24 2xl:px-28 3xl:px-32"
      >
        <div class="text-xl font-semibold">Komitmen Kami Untuk Alam</div>
        <p>Menjaga dan melestarikan keanekaragaman hayati Kalimantan Utara.</p>
        <BaseButton addClass="px-6 bg-green-700 ">Selengkapnya</BaseButton>

        <div class="flex w-full bg-green-700 h-80 rounded-3xl"></div>
      </div>
    </section>
    <section id="peta-interaktif">
      <div
        class="flex flex-col w-full px-16 space-y-4 md:px-18 md:container lg:px-20 xl:px-24 2xl:px-28 3xl:px-32"
      >
        <div class="text-xl font-semibold">Peta Interaktif Kebun Raya</div>
        <p>
          Gunakan peta interaktif untuk menjelajahi area menarik di Kebun Raya
          Bulungan, mulai dari taman tematik hingga fasilitas umum.
        </p>
        <BaseButton addClass="px-6 bg-yellow-500 "
          >Buka Peta Interaktif</BaseButton
        >

        <div class="flex w-full bg-yellow-500 h-80 rounded-3xl"></div>
      </div>
    </section>
    <section id="acara">
      <div
        class="flex flex-col w-full px-16 space-y-4 md:px-18 md:container lg:px-20 xl:px-24 2xl:px-28 3xl:px-32"
      >
        <div class="text-xl font-semibold">Jangan Lewatkan Acara Kami</div>
        <p>
          Ikuti berbagai acara menarik, mulai dari workshop konservasi hingga
          festival budaya suku lokal.
        </p>
        <BaseButton addClass="px-6 bg-stone-800 "
          >Selengkapnya</BaseButton
        >

        <div class="flex w-full bg-stone-800 h-80 rounded-3xl"></div>
      </div>
    </section>
  </div>
</template>
