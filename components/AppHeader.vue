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
              <nuxt-link
                :to="item.to"
                v-if="!item.dropdown"
                class="px-1 pt-2 pb-1 font-semibold"
                :class="{
                  'text-primary border-b-2 border-black':
                    route.path === item.to,
                  'text-font1': route.path !== item.to,
                }"
              >
                {{ item.text }}
              </nuxt-link>
              <div
                v-else
                @mouseenter="showDropdown[index] = true"
                @mouseleave="showDropdown[index] = false"
                class="relative px-1 py-1 font-semibold"
              >
                <button
                  class="flex items-center space-x-1.5 focus:outline-none"
                >
                  <span>{{ item.text }}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4 h-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
                <div
                  v-show="showDropdown[index]"
                  class="absolute left-0 z-50 pt-2 top-full min-w-max"
                >
                  <div
                    class="flex flex-col space-y-1 overflow-hidden bg-white border shadow-lg rounded-2xl"
                  >
                    <div
                      v-for="(subItem, subIndex) in item.dropdown"
                      :key="subIndex"
                    >
                      <nuxt-link
                        :to="subItem.link"
                        class="flex flex-col px-4 py-3 text-sm cursor-pointer hover:bg-gray-100"
                      >
                        <span class="text-font1">{{ subItem.name }}</span>
                      </nuxt-link>
                    </div>
                  </div>
                </div>
              </div>
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
          <nuxt-link
            :to="item.to"
            v-if="!item.dropdown"
            class="hover:translate-x-2"
            :class="{
              'text-primary font-semibold': route.path === item.to,
              'text-font1': route.path !== item.to,
            }"
          >
            {{ item.text }}
          </nuxt-link>
          <div
            class="flex items-center space-x-2"
            v-else
            @click="toggleProduct = !toggleProduct"
          >
            <span>{{ item.text }}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-4 h-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
          <div
            v-if="item.dropdown && toggleProduct"
            class="grid w-full grid-cols-1 gap-4 mt-5 overflow-hidden bg-white"
          >
            <div v-for="(subItem, subIndex) in item.dropdown" :key="subIndex">
              <nuxt-link
                :to="subItem.link"
                class="flex flex-col px-6 py-4 space-y-2 text-sm border rounded-xl border-line-border"
              >
                <div class="flex items-center space-x-2">
                  <div class="flex flex-col space-y-0">
                    <span class="bold-1">{{ subItem.name }}</span>
                  </div>
                </div>
              </nuxt-link>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

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
  { text: "Konservasi", to: "/konservasi" },
  {
    text: "Kegiatan",
    to: "#",
    dropdown: [
      {
        name: "Study Tour",
        link: "/study-tour",
      },
      {
        name: "Acara",
        link: "/kegiatan",
      },
    ],
  },
  { text: "Maps", to: "/maps" },
  { text: "Tentang Kami", to: "/tentang-kami" },
];
</script>

<style scoped></style>
