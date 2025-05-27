import axios from "axios";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
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
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
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
