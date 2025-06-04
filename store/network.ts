import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNetworkStore = defineStore('network', () => {
  const isOffline = ref(false)

  function setOfflineStatus(status: boolean) {
    isOffline.value = status
  }

  return {
    isOffline,
    setOfflineStatus,
  }
})
