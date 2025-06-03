import { useAuthStore } from '~/store/auth';

export default defineNuxtPlugin(async (nuxtApp) => {
  const authStore = useAuthStore(nuxtApp.$pinia); // Pass Pinia instance if needed, or let Pinia auto-inject
  // Check if already initialized to prevent multiple calls if not necessary,
  // though initializeAuth itself should be idempotent.
  if (!authStore.token) {
    await authStore.initializeAuth();
  }
});
