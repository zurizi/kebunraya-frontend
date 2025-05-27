<template>
  <div class="min-h-screen bg-white">
    <AppHeader />
    <main class="pt-24 pb-0 3xl:pt-28">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
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
