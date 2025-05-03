<template>
    <aside
      :class="{
        'translate-x-0 ease-out': isOpen,
        '-translate-x-full ease-in': !isOpen,
      }"
      class="fixed left-0 z-40 h-screen p-4 overflow-y-auto transition-transform duration-300 bg-white bg-opacity-50 shadow-lg top-24 3xl:top-28 w-80"
    >
      <nav class="pb-24">
        <ul>
          <li v-for="(zona, zonaIndex) in numberedSidebarData" :key="zonaIndex" class="mb-4 list-none">
            <h3 class="mb-2 text-lg font-bold">{{ zona.title }}</h3>
            <ul class="ml-4 list-disc list-inside">
              <li v-for="(item) in zona.items" :key="item.number" class="list-none">
                <span class="mr-1 font-semibold">{{ item.number }}.</span> {{ item.text }}
                <ul
                  v-if="item.subItems"
                  class="ml-4 list-[lower-alpha] list-inside"
                >
                  <li
                    v-for="(subItem, subItemIndex) in item.subItems"
                    :key="subItemIndex"
                  >
                    {{ subItem }}
                  </li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </aside>
  </template>
  
  <script setup>
  import { ref, computed } from "vue"; // Import 'computed'
  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: true,
    },
  });
  
  // Data sidebar asli (tidak berubah)
  const sidebarData = ref([
    {
      title: "ZONA PENERIMA",
      items: [
        {
          text: "Gerbang dan loket",
          subItems: ["Utama", "Sekunder", "Tersier"],
        },
        { text: "Parkir" },
        { text: "Pusat Informasi Pengunjung" },
        { text: "Restoran" },
        { text: "Souvenir shop/UMKM" },
        { text: "Plaza" },
        { text: "Sculpture/artwork" },
      ],
    },
    {
      title: "ZONA PENGELOLA",
      items: [
        { text: "Kantor Pengelola" },
        { text: "Herbarium" },
        { text: "Area Parkir" },
        { text: "Area Pembibitan" },
        { text: "Kantor Pembibitan" },
        { text: "Loading area" },
        { text: "Rumah Paranet dan Rumah Kaca" },
        { text: "Gudang" },
        { text: "Bengkel" },
        { text: "Workshop composting" },
      ],
    },
    {
      title: "ZONA KOLEKSI",
      items: [
        { text: "Koleksi Tematik Tumbuhan Obat" },
        {
          text: "Koleksi Tematik Koleksi Tematik Tumbuhan etnobotani adat Bulungan, Dayak dan Tidung",
        },
        { text: "Koleksi Tematik Tumbuhan Buah Kalimantan" },
        { text: "Koleksi Tematik Tumbuhan Kayu Bernilai Ekonomi" },
        { text: "Koleksi Tematik Tumbuhan Rawa Gambut dan Tumbuhan Air" },
        { text: "Koleksi Tematik Tumbuhan Hias" },
        { text: "Koleksi Anggrek Kalimantan" },
        { text: "Area koleksi tumbuhan spontan" },
        { text: "Area konservasi in situ / area pengembangan" },
      ],
    },
    {
      title: "ZONA WISATA DAN BUDAYA",
      items: [
        { text: "Deck" },
        { text: "Jembatan" },
        { text: "Embung" },
        { text: "Menara Pandang" },
        { text: "Children Play Ground" },
        { text: "Pintu Air" },
        { text: "Lapangan rumput" },
        { text: "Rumah adat Bulungan, Dayak, dan Tidung" },
        { text: "Area outbond" },
        { text: "Area kemping" },
        { text: "Amphiteater" },
        { text: "Flower bed" },
        { text: "Kanal air" },
        { text: "Gazebo" },
        { text: "Toilet" },
        { text: "Halte" },
        { text: "Mushola" },
      ],
    },
    {
      title: "ZONA PENGEMBANGAN",
      items: [{ text: "Area pengembangan" }],
    },
  ]);
  
  // Computed property untuk memproses data dan menambahkan nomor urut global
  const numberedSidebarData = computed(() => {
    let globalIndex = 1; // Inisialisasi counter
    const processedData = []; // Array baru untuk menyimpan data yang sudah diproses
  
    // Iterasi melalui setiap zona
    for (const zona of sidebarData.value) {
      const processedZona = {
        title: zona.title,
        items: [] // Array baru untuk item zona ini
      };
  
      // Iterasi melalui setiap item dalam zona
      for (const item of zona.items) {
        const processedItem = {
          number: globalIndex, // Tambahkan nomor urut global
          text: item.text, // Simpan teks asli
        };
  
        // Jika item punya sub-item, salin juga
        if (item.subItems) {
          processedItem.subItems = item.subItems;
        }
  
        processedZona.items.push(processedItem); // Tambahkan item yang sudah diproses ke zona baru
        globalIndex++; // Tingkatkan counter global untuk item berikutnya
      }
  
      processedData.push(processedZona); // Tambahkan zona yang sudah diproses ke data baru
    }
  
    return processedData; // Kembalikan data yang sudah diberi nomor
  });
  </script>
  
  <style scoped>
  /* Optional: Hide scrollbar for a cleaner look */
  .overflow-y-auto::-webkit-scrollbar {
    display: none; /* For Chrome, Safari, and Opera */
  }
  
  .overflow-y-auto {
    -ms-overflow-style: none; /* For Internet Explorer and Edge */
    scrollbar-width: none; /* For Firefox */
  }
  </style>