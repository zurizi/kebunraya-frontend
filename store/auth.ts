import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useNuxtApp } from "#app";

export const useAuthStore = defineStore("auth", () => {
  const { $api } = useNuxtApp();

  const token = ref(null);
  const user = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  const isAuthenticated = computed(() => !!token.value);

  const login = async (payload) => {
    isLoading.value = true;
    error.value = null;
    token.value = null;
    user.value = null;

    try {
      const loginData = await $api.post("/login", payload);

      if (
        loginData &&
        loginData.data &&
        loginData.data.data &&
        loginData.data.data.access_token &&
        loginData.data.data.user
      ) {
        token.value = loginData.data.data.access_token;
        user.value = loginData.data.data.user;

        if (process.client) {
          localStorage.setItem("authToken", loginData.data.data.access_token);
        }
      } else {
        error.value =
          loginData?.data?.message ||
          "Login failed: Unexpected response data structure from API.";
        console.error(error.value, loginData);

        token.value = null;
        user.value = null;
        if (process.client) {
          localStorage.removeItem("authToken");
        }
      }
    } catch (err) {
      error.value =
        err.data?.message ||
        err.message ||
        "An unexpected API error occurred during login.";

      token.value = null;
      user.value = null;
      if (process.client) {
        localStorage.removeItem("authToken");
      }
      console.error("Login API error:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async () => {
    isLoading.value = true;
    error.value = null;
    try {
      await $api.post("/logout");
    } catch (err) {
      console.error("Logout API call failed:", err);
    } finally {
      token.value = null;
      user.value = null;
      if (process.client) {
        localStorage.removeItem("authToken");
      }

      isLoading.value = false;
    }
  };

  const initializeAuth = async () => {
    if (process.client) {
      const storedToken = localStorage.getItem("authToken");

      if (storedToken) {
        token.value = storedToken;
      } else {
        token.value = null;
        user.value = null;
      }
    }
  };

  return {
    token,
    user,
    isLoading,
    error,

    isAuthenticated,

    login,
    logout,
    initializeAuth,
  };
});
