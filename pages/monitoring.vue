<template>
  <div
    class="flex flex-col px-4 pt-12 mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8"
  >
    <div v-if="monitoringStore.pending" class="text-center">
      Memuat data monitoring...
    </div>
    <div v-else-if="monitoringStore.error" class="text-center text-red-500">
      Terjadi kesalahan saat memuat data monitoring:
      {{ monitoringStore.error }}
    </div>
    <div v-else-if="monitoringStore.weeklyDashboardData">
      <div class="w-full p-5 mb-8 bg-white shadow rounded-3xl">
        <div class="w-full">
          <Bar :data="chartData" :options="chartOptions" height="450" />
        </div>
        <div class="flex items-center justify-between w-full mt-5">
          <button
            @click="prevWeek"
            :disabled="currentWeek === 1"
            class="px-4 py-2 text-sm text-white bg-green-600 rounded-md disabled:bg-gray-200"
          >
            Minggu Sebelumnya
          </button>
          <div class="text-lg font-semibold">
            Periode {{ currentWeekDateRange.start }} -
            {{ currentWeekDateRange.end }}
          </div>
          <button
            @click="nextWeek"
            :disabled="currentWeek === totalWeeks"
            class="px-4 py-2 text-sm text-white bg-green-800 rounded-md disabled:bg-gray-200"
          >
            Minggu Berikutnya
          </button>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-6">
        <div class="flex flex-col w-full p-5 bg-white shadow rounded-3xl">
          <div class="font-semibold">Kondisi Udara</div>
          <div class="w-full">
            <Doughnut
              :data="doughnutChartData"
              :options="doughnutChartOptions"
            />
          </div>
        </div>
        <div class="flex w-full px-12 py-8 bg-white shadow rounded-3xl">
          Area
        </div>
        <div class="flex w-full px-12 py-8 bg-white shadow rounded-3xl">
          <button class="px-4 py-2 text-white bg-green-500 rounded-md">
            Export Data Excel
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-600">
      Data monitoring tidak tersedia.
    </div>
    {{ monitoringStore.weeklyDashboardData }}
  </div>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/store/monitoring";
import { onMounted, ref, computed, watch } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "vue-chartjs";

ChartJS.defaults.font.family = "'Poppins', sans-serif";
ChartJS.defaults.font.size = 12;
ChartJS.defaults.color = "#333";
const barBorderRadius = 14;

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const monitoringStore = useMonitoringStore();
const currentWeek = ref(4);
const totalWeeks = computed(() =>
  monitoringStore.weeklyDashboardData
    ? Object.keys(monitoringStore.weeklyDashboardData).length
    : 0
);

const chartData = ref({
  labels: [],
  datasets: [],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          family: "'Poppins', sans-serif",
        },
      },
    },
  },
  plugins: {
    title: {
      display: true,
      text: `Data Lingkungan Mingguan`,
      font: {
        family: "'Poppins', sans-serif",
        size: 18,
      },
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const val = context.raw;
          const datasetLabel = context.dataset.label;

          let unit = "";
          const formattedVal = typeof val === "number" ? val.toFixed(1) : val;
          if (datasetLabel === "CO" || datasetLabel === "CO2") {
            unit = "ppm";
          } else if (datasetLabel === "Suhu") {
            unit = "°C";
          } else if (datasetLabel === "Kecepatan Angin") {
            unit = "km/h";
          }

          return unit ? `${datasetLabel} : ${formattedVal} ${unit}` : `${formattedVal}`;
        },
        title: (context: { label: any }[]) => context[0].label,
      },
    },
  },
};

const updateChartData = () => {
  if (
    !monitoringStore.weeklyDashboardData ||
    !monitoringStore.weeklyDashboardData[`minggu-${currentWeek.value}`]
  ) {
    chartData.value = {
      labels: ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"],
      datasets: [
        {
          label: "CO",
          data: [0, 0, 0, 0, 0, 0, 0],
          backgroundColor: "#3490dc",
          borderRadius: barBorderRadius,
        },
        {
          label: "CO2",
          data: [0, 0, 0, 0, 0, 0, 0],
          backgroundColor: "#e3342f",
          borderRadius: barBorderRadius,
        },
        {
          label: "Temperature",
          data: [0, 0, 0, 0, 0, 0, 0],
          backgroundColor: "#f6993f",
          borderRadius: barBorderRadius,
        },
        {
          label: "Wind Speed",
          data: [0, 0, 0, 0, 0, 0, 0],
          backgroundColor: "#38c172",
          borderRadius: barBorderRadius,
        },
      ],
    };
    return;
  }

  const weekData =
    monitoringStore.weeklyDashboardData[`minggu-${currentWeek.value}`];
  const labels = Object.keys(weekData);
  const coData = labels.map((day) => parseFloat(weekData[day]?.co || 0));
  const co2Data = labels.map((day) => parseFloat(weekData[day]?.co2 || 0));
  const temperatureData = labels.map((day) =>
    parseFloat(weekData[day]?.temperature || 0)
  );
  const windspeedData = labels.map((day) =>
    parseFloat(weekData[day]?.windspeed || 0)
  );

  chartData.value = {
    labels: labels,
    datasets: [
      {
        label: "CO",
        data: coData,
        backgroundColor: "#00587A",
        borderRadius: barBorderRadius,
      },
      {
        label: "CO2",
        data: co2Data,
        backgroundColor: "#FFD700",
        borderRadius: barBorderRadius,
      },
      {
        label: "Suhu",
        data: temperatureData,
        backgroundColor: "#3B6E3B",
        borderRadius: barBorderRadius,
      },
      {
        label: "Kecepatan Angin",
        data: windspeedData,
        backgroundColor: "#795548",
        borderRadius: barBorderRadius,
      },
    ],
  };
};

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false, // Allow container to control size
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || "";
          const value = context.raw;
          const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
          return `${label}: ${value.toFixed(1)} ppm (${percentage}%)`;
        },
        title: (context) => context[0].label,
      },
    },
    legend: {
      position: "bottom", // Place legend below the chart
    },
  },
};

const doughnutChartData = computed(() => {
  const weekData =
    monitoringStore.weeklyDashboardData?.[`minggu-${currentWeek.value}`];

  let totalCO = 0;
  let totalCO2 = 0;

  if (weekData) {
    // Sum CO and CO2 across all days in the week
    Object.values(weekData).forEach((dayData) => {
      totalCO += parseFloat(dayData?.co || 0);
      totalCO2 += parseFloat(dayData?.co2 || 0);
    });
  }

  // Return data structure for Doughnut chart
  return {
    labels: ["CO", "CO2"],
    datasets: [
      {
        data: [totalCO, totalCO2],
        backgroundColor: ["#00587A", "#FFD700"], // Use the same colors as the bar chart
        hoverOffset: 4, // Add a slight hover effect
      },
    ],
  };
});

const prevWeek = () => {
  console.log("prev");
  if (currentWeek.value > 1) {
    currentWeek.value--;
    updateChartData();
  }
};

const nextWeek = () => {
  if (currentWeek.value < totalWeeks.value) {
    currentWeek.value++;
    updateChartData();
  }
};
function getWeekDateRange(dateString: string): { start: string; end: string } {
  const dateTimestamp = Date.parse(dateString);
  if (isNaN(dateTimestamp)) {
    console.error("getWeekDateRange GAGAL parse input YYYY-MM-DD:", dateString);

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

const currentWeekDateRange = computed(() => {
  const todayStringYYYYMMDD = new Date().toISOString().slice(0, 10);

  const todayTimestamp = Date.parse(todayStringYYYYMMDD);
  if (isNaN(todayTimestamp)) {
    console.error("Gagal parse tanggal hari ini:", todayStringYYYYMMDD);
    return { start: "Error Tanggal Hari Ini", end: "Error Tanggal Hari Ini" };
  }
  const todayDate = new Date(todayTimestamp);

  const dayOfWeek = todayDate.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const referenceMondayDate = new Date(todayDate);
  referenceMondayDate.setDate(todayDate.getDate() - daysToMonday);

  const weekDifference = currentWeek.value - 4;

  const targetMondayDate = new Date(referenceMondayDate);
  targetMondayDate.setDate(referenceMondayDate.getDate() + weekDifference * 7);

  const formatToYYYYMMDD = (d: Date): string => {
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const targetMondayStringYYYYMMDD = formatToYYYYMMDD(targetMondayDate);

  return getWeekDateRange(targetMondayStringYYYYMMDD);
});

onMounted(() => {
  if (!monitoringStore.weeklyDashboardData) {
    monitoringStore.fetchWeeklyDashboardData().then(() => updateChartData());
  }
});

watch(
  monitoringStore.weeklyDashboardData,
  () => {
    updateChartData();
  },
  { immediate: true }
);

watch(currentWeek, () => {
  updateChartData();
});
</script>
