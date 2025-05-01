import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import { ref } from "vue";

export const useMonitoringStore = defineStore("monitoring", () => {
  const { $api } = useNuxtApp();

  const weeklyDashboardData = ref<any | null>(null);
  const pending = ref(false);
  const error = ref(null);

  const latestData = ref<any | null>(null);
  const latestPending = ref(false);
  const latestError = ref<string | null>(null);

  const airQualityConditions = [
    {
      label: "Aman",
      color: "green",
      emoji: "😊",
      description:
        "Kualitas udara baik. Cocok untuk beraktivitas di luar ruangan tanpa batasan.",
    },
    {
      label: "Sedang",
      color: "yellow",
      emoji: "😐",
      description:
        "Kualitas udara dapat diterima. Bagi sebagian kecil orang yang sangat sensitif, mungkin ada risiko kesehatan jika beraktivitas di luar ruangan dalam jangka waktu lama. Namun, sebagian besar orang dapat beraktivitas di luar ruangan tanpa masalah signifikan.",
    },
    {
      label: "Bahaya",
      color: "red",
      emoji: "🙁",
      description:
        "Kondisi udara sangat buruk, suhu udara sangat dingin, angin bertiup sangat kencang. Hindari untuk beraktifitas pada kebun raya, gunakan masker dan jauhi area pohon tumbang apabila ada keperluan mendadak di lokasi kebun raya",
    },
  ];

  async function fetchWeeklyDashboardData() {
    pending.value = true;
    error.value = null;
    weeklyDashboardData.value = null;

    const referenceDate = new Date().toISOString().slice(0, 10);
    const apiUrl = `/environment-data/weekly-dashboard?reference_date=${referenceDate}`;

    try {
      const response = await $api.get(apiUrl);
      if (
        response.data &&
        response.data.status === "success" &&
        response.data.data
      ) {
        weeklyDashboardData.value = response.data.data;
      } else {
        console.error(
          "[Monitoring Store] Struktur respons API tidak sesuai:",
          response.data
        );
        weeklyDashboardData.value = null;
        error.value = "Struktur data respons tidak sesuai.";
      }
    } catch (err: any) {
      console.error(
        "[Monitoring Store] Gagal mengambil data dashboard mingguan:",
        err
      );
      error.value = "Gagal mengambil data.";
      weeklyDashboardData.value = null;
      if (err.response && err.response.status === 404) {
        console.log(
          "[Monitoring Store] 404: Data dashboard mingguan tidak ditemukan."
        );
        error.value = "Data tidak ditemukan.";
      }
    } finally {
      pending.value = false;
    }
  }

  async function fetchLatestData() {
    latestPending.value = true;
    latestError.value = null;
    latestData.value = null;

    const apiUrl = `/environment-data/last`;

    try {
      const response = await $api.get(apiUrl);

      if (
        response.data &&
        response.data.status === "success" &&
        response.data.data
      ) {
        latestData.value = response.data.data as any;
      } else {
        console.error(
          "[Monitoring Store] Struktur respons API latest tidak sesuai:",
          response.data
        );
        latestData.value = null;
        latestError.value = "Struktur data terbaru tidak sesuai.";
      }
    } catch (err: any) {
      console.error("[Monitoring Store] Gagal mengambil data terbaru:", err);
      latestError.value = "Gagal mengambil data terbaru.";
      latestData.value = null;
      if (err.response && err.response.status === 404) {
        console.log("[Monitoring Store] 404: Data terbaru tidak ditemukan.");
        latestError.value = "Data terbaru tidak ditemukan.";
      } else if (err.message) {
        latestError.value = `Error: ${err.message}`;
      } else {
        latestError.value = "Gagal mengambil data terbaru.";
      }
    } finally {
      latestPending.value = false;
    }
  }

  function getWeekDateRange(dateString: string): {
    start: string;
    end: string;
  } {
    const dateTimestamp = Date.parse(dateString);
    if (isNaN(dateTimestamp)) {
      console.error(
        "getWeekDateRange GAGAL parse input YYYY-MM-DD:",
        dateString
      );

      return { start: "Tanggal Tidak Valid", end: "Tanggal Tidak Valid" };
    }
    const date = new Date(dateTimestamp);

    const dayOfWeek = date.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const monday = new Date(date);
    monday.setDate(date.getDate() - daysToMonday);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const formatOutput = (d: Date): string => {
      const year = d.getFullYear();
      const monthIndex = d.getMonth();
      const day = d.getDate();

      const monthNames = [
        "Januari",
        "Februari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
      ];

      const monthName = monthNames[monthIndex];

      const formattedDay = day.toString().padStart(2, "0");

      return `${formattedDay} ${monthName} ${year}`;
    };

    return {
      start: formatOutput(monday),
      end: formatOutput(sunday),
    };
  }

  function getAirQualityStatus(
    co: number,
    co2: number
  ): "aman" | "sedang" | "bahaya" {
    if (
      typeof co !== "number" ||
      typeof co2 !== "number" ||
      co < 0 ||
      co2 < 0
    ) {
      console.error("Input CO atau CO2 tidak valid.");
    }

    let statusCO: "aman" | "sedang" | "bahaya";
    let statusCO2: "aman" | "sedang" | "bahaya";

    if (co >= 0 && co <= 400) {
      statusCO = "aman";
    } else if (co >= 401 && co <= 1000) {
      statusCO = "sedang";
    } else {
      statusCO = "bahaya";
    }

    if (co2 >= 0 && co2 <= 15000) {
      statusCO2 = "aman";
    } else if (co2 >= 15001 && co2 <= 40000) {
      statusCO2 = "sedang";
    } else {
      statusCO2 = "bahaya";
    }

    if (statusCO === "bahaya" || statusCO2 === "bahaya") {
      return "bahaya";
    } else if (statusCO === "sedang" || statusCO2 === "sedang") {
      return "sedang";
    } else {
      return "aman";
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

    latestData,
    latestPending,
    latestError,
    fetchLatestData,

    getWeekDateRange,
    getAirQualityStatus,
    airQualityConditions,

    resetState,
  };
});
