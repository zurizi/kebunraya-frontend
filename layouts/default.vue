<template>
  <div class="min-h-screen bg-white">
    <AppHeader />
    <main class="pt-24 pb-0 3xl:pt-28">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from "vue";

async function requestNotificationPermission() {
  if ("Notification" in window) {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Izin notifikasi diberikan.");
      return true;
    } else if (permission === "denied") {
      console.log("Izin notifikasi ditolak.");
      return false;
    } else {
      console.log("Pengguna menutup permintaan izin.");
      return false;
    }
  } else {
    console.log("Browser tidak mendukung notifikasi.");
    return false;
  }
}

async function showLocalNotification() {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Notifikasi Lokal dari Nuxt 3 (Tombol)", {
      body: "Ini adalah contoh notifikasi lokal yang dipicu oleh tombol.",
      icon: '/icons/android/android-launchericon-192-192.png',
      vibrate: [100, 200, 100],
      data: { customData: "Data tambahan notifikasi" },
    });
    console.log("Izin notifikasi diberikan. tombol");
  } else {
    console.log("Izin notifikasi belum diberikan atau ditolak.");
  }
}

async function requestAndShowNotification() {
  const granted = await requestNotificationPermission();
  if (granted) {
    showLocalNotification();
  }
}

onMounted(() => {
  requestAndShowNotification();
});
</script>
<style scoped>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-gray-900;
}
</style>
