<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useNuxtApp } from '#app'
import { useNetworkStore } from '~/store/network' // Adjusted path

const { $swal } = useNuxtApp()
const networkStore = useNetworkStore()

const handleOffline = () => {
  networkStore.setOfflineStatus(true)
}

const handleOnline = () => {
  networkStore.setOfflineStatus(false)
}

onMounted(() => {
  // Set initial status
  if (typeof navigator !== 'undefined') {
    networkStore.setOfflineStatus(!navigator.onLine)
  }

  window.addEventListener('offline', handleOffline)
  window.addEventListener('online', handleOnline)

  // Initial alert if starting offline (after store is updated)
  if (networkStore.isOffline) {
     if (!$swal.isVisible()) { // Check if a swal is already visible
        $swal.fire({
          title: 'Anda Sedang Offline',
          text: 'Koneksi internet terputus. Akses ke beberapa fitur mungkin terbatas.',
          icon: 'warning',
          confirmButtonText: 'Mengerti',
          allowOutsideClick: false,
        });
      }
  }
})

onUnmounted(() => {
  window.removeEventListener('offline', handleOffline)
  window.removeEventListener('online', handleOnline)
})

watch(() => networkStore.isOffline, (newVal, oldVal) => {
  // Only proceed if the value has actually changed.
  // This helps prevent issues if events fire multiple times or state is set redundantly.
  if (newVal === oldVal) return;

  if (newVal === true) {
    if (!$swal.isVisible()) { // Check if a swal is already visible
      $swal.fire({
        title: 'Anda Sedang Offline',
        text: 'Koneksi internet terputus. Akses ke beberapa fitur mungkin terbatas.',
        icon: 'warning',
        confirmButtonText: 'Mengerti',
        allowOutsideClick: false,
      });
    }
  } else { // newVal is false, meaning back online
    $swal.close(); // Close the offline alert if it's open
    $swal.fire({
      title: 'Kembali Online',
      text: 'Koneksi internet telah pulih.',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
    });
  }
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>