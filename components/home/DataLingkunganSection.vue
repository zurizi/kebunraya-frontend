<template>
  <section id="data-lingkungan">
    <div
      class="flex flex-col w-full px-8 space-y-4 sm:px-14 md:px-18 lg:px-20 xl:px-24 2xl:px-28 3xl:px-32"
    >
      <div class="text-xl font-semibold">Data Lingkungan Real-Time</div>
      <p>
        Pantau data real-time seperti kualitas udara, suhu, dan kecepatan angin
        di kebun raya.
      </p>
      <nuxt-link to="/monitoring">
        <BaseButton addClass="px-6 bg-sky-500 ">Lihat Semua Data</BaseButton>
      </nuxt-link>

      <div class="flex w-full p-5 bg-sky-500 rounded-3xl">
        <Line :data="chartData" :options="chartOptions" height="450" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/store/monitoring";
import { onMounted, ref, computed, watch } from "vue";
import { useRuntimeConfig } from "#app";

const runtimeConfig = useRuntimeConfig();

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "vue-chartjs";
import { color } from "chart.js/helpers";

ChartJS.defaults.font.family = "'Poppins', sans-serif";
ChartJS.defaults.font.size = 12;
ChartJS.defaults.color = "#333";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  LineElement,
  PointElement,
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
            unit = "m/s";
          }

          return unit
            ? `${datasetLabel} : ${formattedVal} ${unit}`
            : `${formattedVal}`;
        },
        title: (context) => context[0].label,
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
          borderColor: "#00587A",
          backgroundColor: "#00587A",
        },
        {
          label: "CO2",
          data: [0, 0, 0, 0, 0, 0, 0],
          borderColor: "#FFD700",
          backgroundColor: "#FFD700",
        },
        {
          label: "Suhu",
          data: [0, 0, 0, 0, 0, 0, 0],
          borderColor: "#3B6E3B",
          backgroundColor: "#3B6E3B",
        },
        {
          label: "Kecepatan Angin",
          data: [0, 0, 0, 0, 0, 0, 0],
          borderColor: "#795548",
          backgroundColor: "#795548",
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
        borderColor: "#00587A",
        backgroundColor: "#00587A",
      },
      {
        label: "CO2",
        data: co2Data,
        borderColor: "#FFD700",
        backgroundColor: "#FFD700",
      },
      {
        label: "Suhu",
        data: temperatureData,
        borderColor: "#3B6E3B",
        backgroundColor: "#3B6E3B",
      },
      {
        label: "Kecepatan Angin",
        data: windspeedData,
        borderColor: "#795548",
        backgroundColor: "#795548",
      },
    ],
  };
};

onMounted(() => {
  monitoringStore.fetchLatestData();
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
</script>
