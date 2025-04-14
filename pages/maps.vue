<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { panZoom } from 'vue-panzoom'

const panzoom = ref(null) // Create a ref for the panzoom container

const resetZoom = () => {
  panzoom.value?.reset() // Reset the zoom level
}

onMounted(() => {
  if (panzoom.value) {
    // Initialize panzoom when the component is mounted, optionally set initial zoom level
    panzoom.value.setScale(1)
  }
})
</script>

<template>
  <div class="relative w-full h-[600px] overflow-hidden border rounded-xl bg-gray-100">
    <!-- Tombol kontrol -->
    <div class="absolute z-10 flex space-x-2 top-4 right-4">
      <button @click="panzoom.value?.zoomIn()" class="p-2 bg-white rounded shadow hover:bg-gray-100">+</button>
      <button @click="panzoom.value?.zoomOut()" class="p-2 bg-white rounded shadow hover:bg-gray-100">-</button>
      <button @click="resetZoom" class="p-2 bg-white rounded shadow hover:bg-gray-100">Reset</button>
    </div>

    <!-- Gambar yang bisa di-drag dan zoom -->
    <!-- <div ref="panzoom" class="w-full h-full panzoom-container" style="overflow: hidden"> -->
      <panZoom>

      <img
        src="/pages/maps/map.png"
        alt="Map"
        class="pointer-events-none select-none max-w-none"
      />
      </panZoom>

    <!-- </div> -->
  </div>
</template>

<style scoped>
/* Optional styles to add panzoom container */
.panzoom-container {
  position: relative;
  cursor: grab;
}
</style>
