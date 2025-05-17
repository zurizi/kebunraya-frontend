// composables/useFCM.ts
import { getMessaging, getToken as getFCMToken, type Messaging } from 'firebase/messaging'

export const useFCM = () => {
  const { $messaging } = useNuxtApp()
  const runtimeConfig = useRuntimeConfig()
  const fcmToken = ref<string | null>(null)
  const notificationPermission = ref<NotificationPermission | null>(null)

  const requestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        notificationPermission.value = await Notification.requestPermission()
        if (notificationPermission.value === 'granted') {
          console.log('Notification permission granted.')
          await activateToken()
        } else {
          console.log('Notification permission denied.')
          fcmToken.value = null
        }
      } catch (error) {
        console.error('Error requesting notification permission: ', error)
        fcmToken.value = null
      }
    } else {
      console.log('Notifications not supported in this browser or context.')
      fcmToken.value = null
    }
  }

  const activateToken = async () => {
    if (!$messaging) {
      console.error('Firebase Messaging is not initialized.')
      fcmToken.value = null
      return
    }

    try {
      const currentToken = await getFCMToken($messaging as Messaging, {
        vapidKey: runtimeConfig.public.firebaseVapidKey,
      })
      if (currentToken) {
        console.log('FCM Token:', currentToken)
        fcmToken.value = currentToken
        // Kirim token ini ke server Anda untuk disimpan dan digunakan untuk mengirim notifikasi
      } else {
        console.log('No registration token available. Request permission to generate one.')
        fcmToken.value = null
      }
    } catch (err) {
      console.error('An error occurred while retrieving token. ', err)
      fcmToken.value = null
    }
  }

  // Panggil activateToken jika izin sudah diberikan sebelumnya saat aplikasi dimuat
  // atau setelah service worker terdaftar.
  onMounted(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
        notificationPermission.value = Notification.permission;
        if (notificationPermission.value === 'granted') {
            await activateToken();
        }
    }
  });

  return {
    fcmToken,
    notificationPermission,
    requestPermission,
    activateToken, // Jika Anda ingin mengaktifkannya secara manual setelah izin
  }
}