import axios from "axios";
import { defineNuxtPlugin, useRuntimeConfig } from "#app"; // useRuntimeConfig might be needed if not already imported
import { useLoadingStore } from '~/store/loading'; // Import the loading store

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const loadingStore = useLoadingStore(); // Initialize the store

  const api = axios.create({
    baseURL: config.public.axios.baseURL,
    headers: {
      common: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  });

  api.interceptors.request.use(
    (config) => {
      const storedToken = localStorage.getItem("authToken");

      if (storedToken) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }

      // Show loader for non-GET requests
      if (config.method && config.method.toUpperCase() !== 'GET') {
        loadingStore.show();
      }

      return config;
    },
    (error) => {
      // If request fails, ensure loader is hidden if it was a non-GET request
      // Need to access original method, error.config should have it
      if (error.config && error.config.method && error.config.method.toUpperCase() !== 'GET') {
        loadingStore.hide();
      }
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      // Hide loader for non-GET requests on successful response
      if (response.config && response.config.method && response.config.method.toUpperCase() !== 'GET') {
        loadingStore.hide();
      }
      return response;
    },
    (error) => {
      // Hide loader for non-GET requests on error response
      if (error.config && error.config.method && error.config.method.toUpperCase() !== 'GET') {
        loadingStore.hide();
      }

      if (error.response && error.response.status === 401) {
        // Handle 401, e.g., redirect to login
        // Make sure not to hide loader again if already handled by the above check
      }
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      api: api,
    },
  };
});
