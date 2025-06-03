import { useAuthStore } from '~/store/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const isAuthenticated = authStore.isAuthenticated; // Relies on initializeAuth having been called

  const dashboardRoutes = /^\/dashboard($|\/.*)/;

  if (!isAuthenticated) {
    if (dashboardRoutes.test(to.path)) {
      return navigateTo('/login');
    }
  } else {
    if (to.path === '/login') {
      return navigateTo('/dashboard');
    }
  }
});
