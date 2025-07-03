<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { useNuxtApp } from '#app'
import { useRoute } from 'vue-router';
import { useNetworkStore } from '~/store/network' // Adjusted path
import { useMonitoringStore } from '~/store/monitoring' // Corrected import path

const { $swal } = useNuxtApp()
const networkStore = useNetworkStore()
const monitoringStore = useMonitoringStore() // Initialize monitoring store
const route = useRoute();

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
  showMonitoringAlert() // Call the new function
})

const showMonitoringAlert = async () => {
  // Do not show the alert on /login or any /dashboard/* routes
  if (route.path === '/login' || route.path.startsWith('/dashboard')) {
    // If a swal is open (e.g. loading), close it before returning
    if ($swal.isVisible()) {
      $swal.close();
    }
    return;
  }
  // Check if no other SweetAlert is visible and the app is online
  if (!$swal.isVisible() && !networkStore.isOffline) {
    $swal.fire({
      title: 'Memuat Data Monitoring...',
      didOpen: () => {
        $swal.showLoading()
      },
      allowOutsideClick: true,
      showConfirmButton: false,
    });

    try {
      await monitoringStore.fetchLatestData();
      $swal.close(); // Close the initial loading alert

      if (monitoringStore.latestError) {
        $swal.fire({ // Use fire for new alert
          title: 'Gagal Memuat Data',
          text: monitoringStore.latestError,
          icon: 'error',
          showConfirmButton: true,
          confirmButtonText: 'Tutup',
          allowOutsideClick: false, // User must explicitly close
        });
      } else {
        const latestData = monitoringStore.latestData;
        const airQualityConditions = monitoringStore.airQualityConditions;

        // Safely access nested properties, providing defaults if necessary
        const coValue = latestData?.co ?? 'N/A';
        const co2Value = latestData?.co2 ?? 'N/A';
        const timeValue = latestData?.time ?? 'N/A';

        const airQualityStatusLabel = monitoringStore.getAirQualityStatus(coValue, co2Value);
        const condition = airQualityConditions.find(
          (c) => c.label.toLowerCase() === airQualityStatusLabel?.toLowerCase()
        );

        const bgColor = condition?.color ? `bg-${condition.color}-500` : 'bg-gray-200'; // Default bg if color undefined
        const emoji = condition?.emoji ?? '❓';
        const label = condition?.label ?? 'Tidak Diketahui';
        const description = condition?.description ?? 'Data kualitas udara tidak tersedia.';

        const htmlContent = `
          <div class="flex flex-col w-full overflow-hidden rounded-3xl">
            <div class="flex flex-col items-center justify-center w-full h-full p-3 sm:p-4 md:p-5 text-black ${bgColor}">
              <div class="text-[50px] sm:text-[60px] md:text-[80px]"> <!-- Responsive text size for emoji -->
                ${emoji}
              </div>
              <div class="mb-2 text-lg sm:text-xl font-semibold"> <!-- Responsive text size for label -->
                ${label}
              </div>
              <p class="mb-2 text-xs sm:text-sm text-center"> <!-- Responsive text size for description -->
                ${description}
              </p>
              <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between w-full mt-3">
                <div class="flex flex-col space-y-0.5 font-semibold text-[10px] sm:text-xs"> <!-- Responsive text size -->
                  <span>CO : ${coValue} ppm</span>
                  <span>CO2 : ${co2Value} ppm</span>
                </div>
                <span class="text-[10px] sm:text-xs mt-1 sm:mt-0"> <!-- Responsive text size -->
                  Diambil Terakhir pada ${timeValue}
                </span>
              </div>
            </div>
          </div>
        `;

        $swal.fire({ // Use fire for new alert
          title: "Kondisi Udara Terkini",
          html: htmlContent,
          showConfirmButton: true,
          confirmButtonText: 'Mengerti',
          allowOutsideClick: false, // User must explicitly close
        });
      }
    } catch (error) {
      // Catch any unexpected errors during fetch or processing
      $swal.close(); // Close the initial loading alert
      $swal.fire({ // Use fire for new alert
        title: 'Terjadi Kesalahan',
        text: 'Tidak dapat memproses permintaan data monitoring.',
        icon: 'error',
        showConfirmButton: true,
        confirmButtonText: 'Tutup',
        allowOutsideClick: false, // User must explicitly close
      });
    }
  }
}

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