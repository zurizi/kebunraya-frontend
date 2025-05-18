<template>
  <div class="min-h-screen bg-white">
    <AppHeader />
    <main class="pt-24 pb-0 3xl:pt-28">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useNuxtApp } from "#app";

const { $swal } = useNuxtApp();

const deferredPrompt = ref(null as any);

const showInstallPromptSwal = async () => {
  const result = await $swal.fire({
    icon: "info",
    title: "Instal Aplikasi?",
    text: "Instal aplikasi ini ke perangkat Anda untuk pengalaman yang lebih baik (akses cepat, offline, dll.).",
    showCancelButton: true,
    confirmButtonText: "Instal Sekarang!",
    cancelButtonText: "Nanti Saja",
    allowOutsideClick: false,
    allowEscapeKey: false,
  });

  if (result.isConfirmed) {
    console.log(deferredPrompt);
    if (deferredPrompt) {
      deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);

      if (outcome === "accepted") {
        await $swal.fire("Berhasil!", "Aplikasi sedang diinstal.", "success");
      } else {
        await $swal.fire("Dibatalkan", "Instalasi dibatalkan.", "info");
      }

      deferredPrompt.value = null;
    }
  } else if (result.dismiss === $swal.DismissReason.cancel) {
    console.log("User dismissed the PWA install SweetAlert");
  }
};

onMounted(() => {
  // Log status standalone (opsional, untuk informasi)
  console.log(
    "Current display mode:",
    window.matchMedia("(display-mode: standalone)").matches
      ? "standalone (installed)"
      : "browser"
  );

  // --- INI LOGIKA YANG BENAR UNTUK MEMICU SWEETALERT ---
  // Tambahkan event listener untuk 'beforeinstallprompt'
  // Ini hanya dipanggil oleh browser saat PWA siap diinstal
  window.addEventListener("beforeinstallprompt", (e) => {
    console.log("beforeinstallprompt event fired."); // <-- PASTIKAN PESAN INI MUNCUL DI KONSOL
    // Cegah prompt bawaan browser muncul secara otomatis
    e.preventDefault();
    // Simpan event tersebut
    deferredPrompt.value = e; // Jika pakai ref: deferredPrompt.value = e;

    // Tampilkan SweetAlert kustom kita
    showInstallPromptSwal();
  });
  // if (window.matchMedia("(display-mode: standalone)").matches) {
  //   console.log("Aplikasi sudah berjalan dalam mode standalone (terinstal).");
  // } else {
  //   showInstallPromptSwal();
  // }
});
</script>

<style scoped>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-gray-900;
}
</style>
