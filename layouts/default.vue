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
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// const { $firebase, $messaging } = useNuxtApp();

// const requestPermission = async () => {
//   try {
//     const permission = await Notification.requestPermission();
//     if (permission === 'granted') {
//       console.log('Notification permission granted.');
//       const token = await getToken($messaging, {
//         vapidKey: 'BHGH9DNq_6HCFSHH4gOIBUgtmMOJp7el56HZoiv7d8s-zbP8yBpPILxLyyR9hz02EEA0gy9rR22Q7RGVycx6FgA	', // Ganti dengan VAPID Key dari Firebase Console
//       });
//       console.log('Device token:', token);
//       // Kirim token ke server Anda untuk menyimpan
//     } else {
//       console.log('Notification permission denied.');
//     }
//   } catch (error) {
//     console.error('Error getting token:', error);
//   }
// };

// onMounted(() => {
//   requestPermission();

//   // Tangani pesan saat aplikasi di foreground
//   onMessage($messaging, (payload) => {
//     console.log('Message received in foreground:', payload);
//     // Tampilkan notifikasi atau update UI
//   });
// });
</script>
<style scoped>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-gray-900;
}
</style>
