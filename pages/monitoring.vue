<template>
  <div
    class="flex flex-col px-4 pt-8 pb-12 mx-auto space-y-6 sm:pt-12 max-w-7xl sm:px-6 lg:px-8"
  >
    <div v-if="monitoringStore.pending" class="text-center">
      Memuat data monitoring...
    </div>
    <div v-else-if="monitoringStore.error" class="text-center text-red-500">
      Terjadi kesalahan saat memuat data monitoring:
      {{ monitoringStore.error }}
    </div>
    <div v-else-if="monitoringStore.weeklyDashboardData">
      <div
        class="w-full p-5 mb-8 bg-white border border-gray-100 shadow rounded-3xl"
      >
        <div class="w-full">
          <Line :data="chartData" :options="chartOptions" height="450" />
        </div>
        <div class="flex items-center justify-between w-full mt-5 space-x-2">
          <button
            @click="prevWeek"
            :disabled="currentWeek === 1"
            class="px-1 py-2 text-xs text-white bg-green-600 rounded-md md:px-4 md:text-sm disabled:bg-gray-200"
          >
            Minggu Sebelumnya
          </button>
          <div class="text-xs font-semibold md:text-lg">
            Periode {{ currentWeekDateRange.start }} -
            {{ currentWeekDateRange.end }}
          </div>
          <button
            @click="nextWeek"
            :disabled="currentWeek === totalWeeks"
            class="px-1 py-2 text-xs text-white bg-green-800 rounded-md md:px-4 md:text-sm disabled:bg-gray-200"
          >
            Minggu Berikutnya
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div
          class="flex flex-col justify-around w-full p-5 bg-white border border-gray-100 shadow rounded-3xl"
        >
          <div class="font-semibold">Kondisi Udara</div>
          <div class="flex items-center justify-center w-full">
            <Doughnut
              :data="doughnutChartData"
              :options="doughnutChartOptions"
            />
          </div>
        </div>
        <div
          class="flex flex-col w-full overflow-hidden bg-white border border-gray-100 shadow rounded-3xl"
        >
          <div class="p-5 font-semibold">Area 1</div>
          <div
            class="flex flex-col items-center justify-center w-full h-full p-5 text-black"
            :class="`bg-${conditionAir?.color}-500`"
          >
            <div class="text-[100px]">
              {{ conditionAir?.emoji }}
            </div>
            <div class="mb-2 text-2xl font-semibold">
              {{ conditionAir?.label }}
            </div>
            <p class="mb-2 text-sm text-center">
              {{ conditionAir?.description }}
            </p>
            <div class="flex items-end justify-between w-full">
              <div class="flex flex-col space-y-0.5 font-semibold text-xs">
                <span> CO : {{ monitoringStore.latestData?.co }} </span>
                <span> CO2 : {{ monitoringStore.latestData?.co2 }} </span>
              </div>
              <span class="text-xs"
                >Diambil Terakhir pada
                {{ monitoringStore.latestData.time }}</span
              >
            </div>
          </div>
        </div>
        <div
          class="flex flex-col items-start p-4 space-y-4 text-sm bg-white shadow rounded-3xl"
        >
          <div class="font-semibold">Export data</div>

          <div class="flex flex-col items-start w-full space-y-1">
            <label for="periodSelect" class="text-gray-700">Periode:</label>
            <select
              id="periodSelect"
              v-model="selectedPeriod"
              class="w-full px-3 py-2 border rounded-md"
            >
              <option value="thisMonth">Bulan Ini</option>
              <option value="lastMonth">Bulan Lalu</option>
              <option value="custom">Custom</option>
            </select>
          </div>
          <div class="flex justify-between w-full">
            <div class="flex flex-col items-start space-y-1">
              <label for="startDateInput" class="text-gray-700">Dari:</label>
              <input
                type="date"
                id="startDateInput"
                v-model="startDate"
                :disabled="selectedPeriod !== 'custom'"
                class="px-3 py-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div class="flex flex-col items-start space-y-1">
              <label for="endDateInput" class="text-gray-700">Sampai:</label>
              <input
                type="date"
                id="endDateInput"
                v-model="endDate"
                :disabled="selectedPeriod !== 'custom'"
                class="px-3 py-2 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <button
            class="px-4 py-2 text-sm text-white bg-green-500 rounded-md whitespace-nowrap"
            @click="exportExcel"
          >
            Export Data Excel
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-600">
      Data monitoring tidak tersedia.
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/store/monitoring";
import { onMounted, ref, computed, watch } from "vue";
import { useNuxtApp, useRuntimeConfig } from "#app";

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
  type ChartEvent,
  type ActiveElement,
  type Chart,
} from "chart.js";
import { Bar, Doughnut, Line } from "vue-chartjs";

const { $swal } = useNuxtApp();

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
  onClick: (event: ChartEvent, elementsAtEvent: ActiveElement[], chart: Chart) => {
    const clickX = event.x; // X-coordinate of the click relative to the chart canvas
    const clickY = event.y; // Y-coordinate of the click relative to the chart canvas
    const xAxis = chart.scales.x; // The x-axis object
    // const yAxis = chart.scales.y; // The y-axis (mainly for context, not direct use here)

    let clickedTickIndex = -1; // Initialize to -1 (no tick clicked yet)

    // Proceed only if xAxis is defined
    if (xAxis) {
      // Define the vertical clickable area for x-axis labels.
      // This assumes labels are reasonably close to the x-axis line.
      // xAxis.bottom is the bottom pixel of the x-axis scale area.
      // Add a buffer (e.g., 30px) to include area where labels are typically rendered.
      const labelClickableMinY = xAxis.top; // Top of the x-axis scale area
      // Estimate label height based on font size, provide a generous clickable zone below the axis bottom.
      const labelEstimatedHeight = (xAxis.options.ticks?.font?.size || 12) * 2;
      const labelClickableMaxY = xAxis.bottom + labelEstimatedHeight;

      if (clickY >= labelClickableMinY && clickY <= labelClickableMaxY) {
        const ticksCount = xAxis.getTicks().length; // Number of ticks on the x-axis

        for (let i = 0; i < ticksCount; i++) {
          const tickPixelX = xAxis.getPixelForTick(i); // Get x-pixel for the current tick

          // Define the horizontal clickable region for this tick.
          // It's roughly from halfway to the previous tick to halfway to the next tick.
          const prevTickPixelX = (i > 0) ? xAxis.getPixelForTick(i - 1) : xAxis.left;
          const nextTickPixelX = (i < ticksCount - 1) ? xAxis.getPixelForTick(i + 1) : xAxis.right;

          // Calculate midpoints to define the boundary for the current tick's clickable zone
          const regionStart = (i === 0) ? xAxis.left : (tickPixelX + prevTickPixelX) / 2;
          const regionEnd = (i === ticksCount - 1) ? xAxis.right : (tickPixelX + nextTickPixelX) / 2;

          if (clickX >= regionStart && clickX <= regionEnd) {
            clickedTickIndex = i; // Tick `i` was clicked
            break; // Exit loop once the clicked tick is found
          }
        }
      }
    }

    if (clickedTickIndex !== -1) {
      // An x-axis tick/label was clicked
      const dataIndex = clickedTickIndex; // This is the index into the data arrays
      const activeTooltips = chart.tooltip.getActiveElements();
      let isTooltipActiveForThisDataIndex = false;

      // Check if the currently active tooltip is for THIS specific dataIndex and for ALL relevant datasets
      if (activeTooltips.length > 0 && activeTooltips.every(el => el.index === dataIndex)) {
        const visibleDatasetsCount = chart.data.datasets.filter((_, dsIndex) => chart.isDatasetVisible(dsIndex)).length;
        if (activeTooltips.length === visibleDatasetsCount && visibleDatasetsCount > 0) {
          isTooltipActiveForThisDataIndex = true;
        }
      }

      if (isTooltipActiveForThisDataIndex) {
        // Tooltip for this dataIndex is already active, so hide it
        chart.tooltip.setActiveElements([], { x: 0, y: 0 });
      } else {
        // Tooltip for this dataIndex is not active, or a different tooltip is active. Show it.
        const newActiveElements: ActiveElement[] = [];
        chart.data.datasets.forEach((dataset, datasetIndex) => {
          // Include only if the dataset is visible
          if (chart.isDatasetVisible(datasetIndex)) {
            // And if the dataset actually has data at this specific index
            if (dataset.data && dataset.data.length > dataIndex && dataset.data[dataIndex] !== null && typeof dataset.data[dataIndex] !== 'undefined') {
              newActiveElements.push({ datasetIndex, index: dataIndex });
            }
          }
        });

        if (newActiveElements.length > 0) {
          // Set the new active elements for the tooltip and provide event position for Chart.js to place tooltip
          chart.tooltip.setActiveElements(newActiveElements, { x: event.x, y: event.y });
        } else {
          // If no elements to activate (e.g., all datasets hidden or no data at this point), clear any existing tooltips
          chart.tooltip.setActiveElements([], { x: 0, y: 0 });
        }
      }
      chart.update(); // Update the chart to reflect tooltip changes
    } else if (elementsAtEvent.length === 0) {
      // Click was not on an x-axis label AND not on a data point element (bar, point, etc.)
      // This means the click was on an empty part of the chart. Hide any active tooltip.
      if (chart.tooltip && chart.tooltip.getActiveElements().length > 0) {
        chart.tooltip.setActiveElements([], { x: 0, y: 0 });
        chart.update();
      }
    }
    // If elementsAtEvent.length > 0, a data point was clicked.
    // Chart.js default behavior for tooltips on data points (e.g., on hover or if configured for click)
    // should take over. Our current logic doesn't interfere if elementsAtEvent is populated,
    // unless the click also falls into an x-axis label region (which then takes precedence).
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

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: (context) => {
          const value = context.raw;
          return `${value} ppm`;
        },
        title: (context) => context[0].label,
      },
    },
    legend: {
      position: "bottom",
    },
  },
};

const doughnutChartData = computed(() => {
  return {
    labels: ["CO", "CO2"],
    datasets: [
      {
        data: [monitoringStore.latestData.co, monitoringStore.latestData.co2],
        backgroundColor: ["#00587A", "#FFD700"],
        hoverOffset: 4,
      },
    ],
  };
});

const prevWeek = () => {
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

  return monitoringStore.getWeekDateRange(targetMondayStringYYYYMMDD);
});

const conditionAir = computed(() => {
  if (monitoringStore.latestData) {
    return monitoringStore.airQualityConditions.find(
      (condition) =>
        condition.label.toLowerCase() ===
        monitoringStore.getAirQualityStatus(
          monitoringStore.latestData?.co,
          monitoringStore.latestData?.co2
        )
    );
  }
});

const formatToYYYYMMDD = (d: Date): string => {
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const selectedPeriod = ref("thisMonth");
const startDate = ref("");
const endDate = ref("");

const settingDatesFromPeriod = ref(false);

const getStartAndEndOfMonth = (date: Date): { start: string; end: string } => {
  const year = date.getFullYear();
  const month = date.getMonth();

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  return {
    start: formatToYYYYMMDD(startDate),
    end: formatToYYYYMMDD(endDate),
  };
};

const getStartAndEndOfCurrentMonth = (): { start: string; end: string } => {
  return getStartAndEndOfMonth(new Date());
};

const getStartAndEndOfLastMonth = (): { start: string; end: string } => {
  const today = new Date();
  const firstDayOfCurrentMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    1
  );
  const dateInLastMonth = new Date(firstDayOfCurrentMonth);
  dateInLastMonth.setDate(firstDayOfCurrentMonth.getDate() - 1);

  return getStartAndEndOfMonth(dateInLastMonth);
};

watch(selectedPeriod, (newPeriod) => {
  if (newPeriod !== "custom") {
    settingDatesFromPeriod.value = true;
    let dates;
    if (newPeriod === "thisMonth") {
      dates = getStartAndEndOfCurrentMonth();
    } else if (newPeriod === "lastMonth") {
      dates = getStartAndEndOfLastMonth();
    }

    startDate.value = dates.start;
    endDate.value = dates.end;

    setTimeout(() => {
      settingDatesFromPeriod.value = false;
    }, 0);
  }
});

watch([startDate, endDate], () => {
  if (!settingDatesFromPeriod.value) {
    selectedPeriod.value = "custom";
  }
});

const exportExcel = async () => {
  if (
    !startDate.value ||
    !endDate.value ||
    startDate.value === "Invalid Date" ||
    endDate.value === "Invalid Date"
  ) {
    await $swal.fire({
      icon: "warning",
      title: "Perhatian",
      text: "Mohon pilih rentang tanggal terlebih dahulu.",
      confirmButtonText: "OK",
    });
    return;
  }

  if (new Date(startDate.value) > new Date(endDate.value)) {
    await $swal.fire({
      icon: "warning",
      title: "Perhatian",
      text: "Tanggal Mulai tidak boleh setelah Tanggal Selesai.",
      confirmButtonText: "OK",
    });
    return;
  }

  const confirmResult = await $swal.fire({
    icon: "question",
    title: "Konfirmasi Ekspor",
    text: `Apakah Anda yakin ingin mengekspor data dari tanggal ${startDate.value} sampai ${endDate.value} ke Excel?`,
    showCancelButton: true,
    confirmButtonText: "Ya, Ekspor Data!",
    cancelButtonText: "Batal",
    reverseButtons: true,
  });

  if (confirmResult.isConfirmed) {
    const startDatetime = `${startDate.value}%2000:00:00`;
    const endDatetime = `${endDate.value}%2023:59:59`;
    const apiUrl = `environment-data/export-excel?start_datetime=${startDatetime}&end_datetime=${endDatetime}`;

    window.open(runtimeConfig.public.axios.baseURL + apiUrl, "_blank");

    await $swal.fire({
      icon: "success",
      title: "Berhasil",
      text: "Proses export telah dimulai. File Excel akan diunduh atau terbuka di tab baru.",
      confirmButtonText: "OK",
    });
  } else if (confirmResult.dismiss === $swal.DismissReason.cancel) {
  }
};

onMounted(() => {
  const initialDates = getStartAndEndOfCurrentMonth();
  startDate.value = initialDates.start;
  endDate.value = initialDates.end;

  settingDatesFromPeriod.value = true;
  startDate.value = initialDates.start;
  endDate.value = initialDates.end;
  setTimeout(() => {
    settingDatesFromPeriod.value = false;
  }, 0);

  console.log("Initial dates set:", startDate.value, endDate.value);
});

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

watch(currentWeek, () => {
  updateChartData();
});
</script>
