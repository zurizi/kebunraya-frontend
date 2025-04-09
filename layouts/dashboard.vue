<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <span class="text-xl font-bold">Dashboard Admin</span>
          </div>
          <div class="flex items-center space-x-4">
            <button class="text-gray-700 hover:text-gray-900">Logout</button>
          </div>
        </div>
      </div>
    </nav>
    <div class="flex">
      <aside class="w-64 bg-white shadow-lg h-screen">
        <div class="p-4">
          <nav class="space-y-2">
            <NuxtLink to="/dashboard" class="sidebar-link">Dashboard</NuxtLink>
            <NuxtLink to="/dashboard/kegiatan" class="sidebar-link">Kegiatan</NuxtLink>
            <NuxtLink to="/dashboard/konservasi" class="sidebar-link">Konservasi</NuxtLink>
          </nav>
        </div>
      </aside>
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.sidebar-link {
  @apply block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg;
}
</style>