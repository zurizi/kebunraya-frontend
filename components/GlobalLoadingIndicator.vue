<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-spinner">
      <!-- You can use a simple text or a CSS spinner -->
      <p class="loading-text">Loading...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useLoadingStore } from '~/store/loading'; // Path to be created in next step

const loadingStore = useLoadingStore();
const isLoading = computed(() => loadingStore.isLoading);
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure it's on top */
}

.loading-spinner {
  /* Basic styling for the spinner area */
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.loading-text {
  font-size: 1.2em;
  color: #333;
}
</style>
