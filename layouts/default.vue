
<template>
  <div class="min-h-screen bg-white">
    <AppHeader />
    <main class="pt-24 pb-32 3xl:pt-28">
      <slot />
    </main>
    <Footer />

  </div>
</template>

<style scoped>
.nav-link {
  @apply inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-700 hover:text-gray-900;
}
</style>