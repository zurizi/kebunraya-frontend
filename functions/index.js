import { https } from "firebase-functions";
import { apps, initializeApp, messaging } from "firebase-admin";

if (apps.length === 0) {
  initializeApp();
}

export const sendTestNotification = https.onCall(async (data, context) => {
  const fcmToken = data.token;

  if (!fcmToken) {
    console.error("Tidak ada token FCM yang disediakan.");
    throw new https.HttpsError(
      "invalid-argument",
      "Fungsi harus dipanggil dengan argumen 'token' yang berisi token FCM target."
    );
  }

  const payload = {
    token: fcmToken,
    notification: {
      title: "Tes Notifikasi dari Aplikasi!",
      body: "Ini adalah notifikasi yang dikirim melalui tombol di aplikasi Nuxt 3 Anda.",
    },
    data: {
      customKey: "customValue",
      source: "NuxtAppButton",
    },
  };

  try {
    const response = await messaging().send({
      token: fcmToken,
      notification: payload.notification,
      data: payload.data,
    });

    console.log("Successfully sent message:", response);
    return { success: true, messageId: response.messageId };
  } catch (error) {
    console.error("Error sending message:", error);
    throw new https.HttpsError(
      "unknown",
      "Gagal mengirim notifikasi.",
      error.message
    );
  }
});
