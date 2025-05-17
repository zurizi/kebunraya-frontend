<template>
  <div>
    <h1>Nuxt 3 FCM Demo</h1>
    <div v-if="fcmToken && notificationPermission === 'granted'">
      <button @click="triggerTestNotification" :disabled="isSending">
        {{ isSending ? "Mengirim..." : "Kirim Notifikasi Tes ke Diri Sendiri" }}
      </button>
      <p v-if="sendResult">{{ sendResult }}</p>
    </div>
    <p v-else-if="notificationPermission !== 'granted'">
      Silakan izinkan notifikasi terlebih dahulu.
    </p>
  </div>
</template>

<script setup lang="ts">
import { httpsCallable } from "firebase/functions"; // Impor httpsCallable
import { onMounted, ref, computed, watch } from "vue";
import { useFCM } from "@/composables/useFCM";
import { useNuxtApp } from "#app";

const { $functions } = useNuxtApp(); // Dapatkan instance Functions dari plugin
const { fcmToken, notificationPermission, requestPermission } = useFCM(); // Gunakan composable Anda

const isSending = ref(false);
const sendResult = ref<string | null>(null);

const triggerTestNotification = async () => {
  if (!$functions) {
    sendResult.value = "Error: Firebase Functions tidak terinisialisasi.";
    console.error("Firebase Functions instance is not available.");
    return;
  }

  if (!fcmToken.value) {
    sendResult.value = "Error: Token FCM tidak tersedia.";
    console.error("FCM token is not available.");
    return;
  }

  isSending.value = true;
  sendResult.value = null;

  try {
    // Nama fungsi harus sama dengan yang Anda ekspor di `functions/index.js`
    const sendSelfNotificationFunction = httpsCallable(
      $functions,
      "sendTestNotification"
    );
    const response: any = await sendSelfNotificationFunction({
      token: fcmToken.value,
    });

    console.log("Function call response:", response);
    if (response.data.success) {
      sendResult.value = `Notifikasi berhasil dikirim! Message ID: ${response.data.messageId}`;
      console.log("Successfully triggered test notification:", response.data);
    } else {
      sendResult.value = `Gagal mengirim notifikasi: ${
        response.data.message || "Error tidak diketahui dari fungsi"
      }`;
      console.error("Error from callable function:", response.data);
    }
  } catch (error: any) {
    console.error("Error calling Firebase Function:", error);
    sendResult.value = `Error saat memanggil fungsi: ${
      error.message || "Terjadi kesalahan"
    }`;
    // error.details mungkin juga berisi informasi berguna
  } finally {
    isSending.value = false;
  }
};

onMounted(async () => {
  if (notificationPermission.value === "default") {
    // Pertimbangkan untuk meminta izin di sini atau menunggu interaksi pengguna
  }
});
</script>
