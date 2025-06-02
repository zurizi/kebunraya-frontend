<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  columns: Array,
  data: Array,
});
</script>

<template>
  <div class="w-full overflow-x-scroll rounded-xl">
    <table class="min-w-full text-left border-collapse">
      <thead>
        <tr class="text-gray-600 bg-gray-100">
          <th
            v-for="col in columns"
            :key="col"
            class="px-6 py-4 text-sm font-semibold tracking-wider uppercase border-b-lg"
          >
            {{ col }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, index) in data"
          :key="index"
          :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'"
          class="transition-colors hover:bg-softGreen"
        >
          <td
            v-for="col in columns"
            :key="col"
            class="px-6 py-2 text-sm text-black"
          >
            <slot :name="col" v-bind="{ row, index }">{{ row[col] }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
