<template>
  <header id="header-nav">
    <div
      class="fixed z-50 flex items-center justify-between w-full px-8 py-2 mx-auto bg-white border-b md:px-18 md:container lg:px-20 xl:px-24 2xl:px-28 3xl:px-32"
    >
      <div class="flex items-center justify-between w-full">
        <div class="flex md:hidden">
          <button @click="toggleNav = !toggleNav">
            <svg
              v-if="!toggleNav"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-8 h-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="text-2xl font-bold">
          <nuxt-link to="/" class="flex items-center">
            <Image src="/logo.png" alt="" class="w-20 3xl:w-24" />
          </nuxt-link>
        </div>
        <!-- Desktop navigation -->
        <nav class="hidden md:flex">
          <ul class="flex items-center md:space-x-3 lg:space-x-5 xl:space-x-6">
            <li
              v-for="(item, index) in navItems"
              :key="index"
              class="relative text-font1"
            >
              <nuxt-link :to="item.to" class="px-1 py-2 font-semibold">
                {{ item.text }} 
              </nuxt-link>
            </li>
          </ul>
        </nav>
      </div>
    </div>

    <nav
      v-if="toggleNav"
      class="absolute inset-x-0 z-50 flex flex-col w-full bg-white shadow-lg md:hidden"
    >
      <ul class="flex flex-col items-start w-full p-4 mt-2 mb-8 space-y-4">
        <li
          v-for="(item, index) in navItems"
          :key="index"
          class="w-full pb-4 border-b border-line-border"
          @click="toggleNav = false"
        >
          <nuxt-link :to="item.to" class="hover:translate-x-2">
            {{ item.text }}
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const { login } = defineProps({
  login: {
    type: Boolean,
  },
});

const toggleNav = ref(false);
const toggleProduct = ref(false);
const showDropdown = ref<Record<number, boolean>>({});

const navItems = [
  { text: "Home", to: "/" },
  { text: "Monitoring", to: "/monitoring" },
  { text: "Konservasi", to: "/" },
  { text: "Kegiatan", to: "/kegiatan" },
  { text: "Maps", to: "/maps" },
  { text: "Kegiatan", to: "/" },
];
</script>

<style scoped></style>
