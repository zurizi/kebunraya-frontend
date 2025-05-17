// plugins/firebase.client.ts
import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging'
import { getFunctions, type Functions } from 'firebase/functions' // Impor getFunctions

export default defineNuxtPlugin(async (nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: runtimeConfig.public.firebaseApiKey,
    authDomain: runtimeConfig.public.firebaseAuthDomain,
    projectId: runtimeConfig.public.firebaseProjectId,
    storageBucket: runtimeConfig.public.firebaseStorageBucket,
    messagingSenderId: runtimeConfig.public.firebaseMessagingSenderId,
    appId: runtimeConfig.public.firebaseAppId,
    measurementId: runtimeConfig.public.firebaseMeasurementId,
  }

  let firebaseApp: FirebaseApp | null = null
  let messaging: Messaging | null = null
  let functions: Functions | null = null // Tambahkan instance functions

  if (typeof window !== 'undefined') {
    firebaseApp = initializeApp(firebaseConfig)
    messaging = getMessaging(firebaseApp)
    functions = getFunctions(firebaseApp) // Inisialisasi Functions

    // (Opsional: Jika Anda berada di region selain us-central1, konfigurasikan di sini)
    // import { connectFunctionsEmulator } from 'firebase/functions';
    // if (process.env.NODE_ENV === 'development') {
    //   connectFunctionsEmulator(functions, "localhost", 5001);
    // }


    onMessage(messaging, (payload) => {
      console.log('Message received in foreground. ', payload)
      alert(`Foreground message: ${payload.notification?.title} - ${payload.notification?.body}`)
    })
  }

  return {
    provide: {
      firebaseApp,
      messaging,
      functions, // Sediakan instance functions
    },
  }
})