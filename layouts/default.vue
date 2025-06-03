<template>
  <div class="min-h-screen bg-white">
    <AppHeader />
    <main class="pt-24 pb-0 3xl:pt-28">
      <slot />
    </main>
    <Footer />
    <GlobalLoadingIndicator /> <!-- Add this line -->
  </div>
</template>

<script setup lang="ts">
import AppHeader from '~/components/AppHeader.vue';
import Footer from '~/components/Footer.vue';
import GlobalLoadingIndicator from '~/components/GlobalLoadingIndicator.vue'; // Add this import
import { onMounted, ref } from "vue";
import { useNuxtApp } from "#app";

const { $swal } = useNuxtApp();

onMounted(() => {});
</script>

<style scoped>
/* Gaya nav-link Anda tetap di sini */
.nav-link {
  @apply inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-gray-900;
}
</style>
