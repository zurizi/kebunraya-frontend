// stores/monitoring.ts
import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import { ref } from 'vue';

export const useMonitoringStore = defineStore('monitoring', () => {
  const { $api } = useNuxtApp();

  const weeklyDashboardData = ref<any | null>(null);
  const pending = ref(false);
  const error = ref(null);

  async function fetchWeeklyDashboardData() {
    pending.value = true;
    error.value = null;
    weeklyDashboardData.value = null;

    const referenceDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
    const apiUrl = `/environment-data/weekly-dashboard?reference_date=${referenceDate}`;

    try {
      const response = await $api.get(apiUrl);
      if (response.data && response.data.status === 'success' && response.data.data) {
        weeklyDashboardData.value = response.data.data;
      } else {
        console.error('[Monitoring Store] Struktur respons API tidak sesuai:', response.data);
        weeklyDashboardData.value = null;
        error.value = 'Struktur data respons tidak sesuai.';
      }
    } catch (err: any) {
      console.error('[Monitoring Store] Gagal mengambil data dashboard mingguan:', err);
      error.value = 'Gagal mengambil data.';
      weeklyDashboardData.value = null;
      if (err.response && err.response.status === 404) {
        console.log('[Monitoring Store] 404: Data dashboard mingguan tidak ditemukan.');
        error.value = 'Data tidak ditemukan.';
      }
    } finally {
      pending.value = false;
    }
  }

  function resetState() {
    weeklyDashboardData.value = null;
    pending.value = false;
    error.value = null;
  }

  return {
    weeklyDashboardData,
    pending,
    error,
    fetchWeeklyDashboardData,
    resetState,
  };
});