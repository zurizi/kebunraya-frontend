<template>
  <div class="relative">
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text"
      :placeholder="placeholder"
      class="w-full py-2 pl-12 pr-4 text-sm bg-gray-200 border border-green-900 rounded-lg focus:border-2 border-line focus:outline-none focus:border-green-900"
    />
    <button
      @click="search()" 
      class="absolute inset-y-0 left-0 flex items-center px-4 text-green-900"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-5 h-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SearchInput",
  props: {
    placeholder: {
      type: String,
      default: "Cari...",
    },

    modelValue: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue", "search"], // Memancarkan event update:modelValue dan search
  methods: {
    search() {
      console.log("Searching for:", this.modelValue);
      // Memancarkan nilai saat ini melalui event 'search'
      // Event ini tidak digunakan oleh parent component Anda untuk memicu fetch saat ini
      this.$emit("search", this.modelValue);
    },
  },
});
</script>

<style scoped>
/* Styling for the component */
</style>