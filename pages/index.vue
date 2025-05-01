<template>
  <div id="home" class="space-y-20">
    <HomePageHeroSection />
    <HomePageDataLingkunganSection />
    <HomePageKomitmenKamiSection />
    <HomePagePetaInteraktifSection />
    <HomePageAcaraSection />
  </div>
</template>

<script setup>
import HomePageHeroSection from '@/components/home/HeroSection.vue';
import HomePageDataLingkunganSection from '@/components/home/DataLingkunganSection.vue';
import HomePageKomitmenKamiSection from '@/components/home/KomitmenKamiSection.vue';
import HomePagePetaInteraktifSection from '@/components/home/PetaInteraktifSection.vue';
import HomePageAcaraSection from '@/components/home/AcaraSection.vue';
</script>