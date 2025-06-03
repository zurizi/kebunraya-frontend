<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-semibold">Daftar Kegiatan</h1>
      <button
        @click="showCreateModal = true"
        class="px-4 py-2 text-white bg-green-900 rounded-md shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Tambah Kegiatan Baru
      </button>
    </div>

    <!-- Search Input -->
    <div class="mb-4">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Cari kegiatan (judul)..."
        class="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:w-1/3"
      />
    </div>

    <!-- Loading State -->
    <div v-if="kegiatanListPending && !kegiatanList.length" class="py-4 text-center">
      Memuat data kegiatan...
    </div>
    <!-- Error State -->
    <div v-else-if="kegiatanListError" class="py-4 text-center text-red-500">
      Gagal memuat data kegiatan: {{ kegiatanListError.message || kegiatanListError }}
    </div>
    <!-- Data Table and No Data States -->
    <div v-else>
      <div v-if="kegiatanList && kegiatanList.length > 0">
        <BaseTable
          :columns="tableDisplayColumns"
          :data="kegiatanList"
        >
          <template #gambar="{ row }">
            <img
              v-if="row.gambar"
              :src="getFullImageUrl(row.gambar)"
              alt="Gambar Kegiatan"
              class="object-cover w-20 h-10 rounded"
            />
            <span v-else>Tidak ada gambar</span>
          </template>
          <template #actions="{ row }">
            <div class="flex items-center space-x-2">
              <button
                @click="handleEdit(row.id)"
                class="px-3 py-1 text-xs font-medium text-black bg-yellow-400 rounded shadow-sm hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-1"
              >
                Edit
              </button>
              <button
                @click="handleDelete(row.id)"
                class="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              >
                Hapus
              </button>
            </div>
          </template>
        </BaseTable>

        <div v-if="totalPages > 1" class="flex justify-center mt-6">
          <Pagination
            :current-page="currentPage"
            :total-pages="totalPages"
            @update:currentPage="handlePageChange($event)"
          />
        </div>
      </div>
      <div v-else-if="kegiatanList.length === 0 && kegiatanStore.searchText" class="py-4 text-center">
        Tidak ada kegiatan yang cocok dengan pencarian "{{ kegiatanStore.searchText }}".
      </div>
      <div v-else class="py-4 text-center">
        Tidak ada kegiatan tersedia.
      </div>
    </div>

    <!-- Modal for Creating Kegiatan -->
    <Modal :show="showCreateModal" title="Tambah Kegiatan Baru" @update:show="showCreateModal = $event" maxWidth="2xl">
      <KegiatanForm
        @submit="handleCreateKegiatan"
        @close="showCreateModal = false"
      />
    </Modal>

    <!-- Modal for Editing Kegiatan -->
    <Modal
      :show="showEditModal"
      title="Edit Kegiatan"
      @update:show="showEditModal = $event"
      maxWidth="2xl"
    >
      <div v-if="kegiatanDetailPending" class="py-4 text-center">Memuat detail kegiatan...</div>
      <KegiatanForm
        v-else-if="editingKegiatan"
        :isEditMode="true"
        :initialData="editingKegiatan"
        @submit="handleUpdateKegiatan"
        @close="showEditModal = false"
      />
      <div v-else-if="kegiatanDetailError" class="py-4 text-center text-red-500">
        Gagal memuat detail kegiatan: {{ kegiatanDetailError.message || 'Error tidak diketahui' }}
      </div>
       <div v-else class="py-4 text-center text-gray-500">
        Tidak ada data kegiatan untuk diedit atau kegiatan tidak ditemukan.
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { useKegiatanStore } from '~/store/kegiatan';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import BaseTable from '~/components/Table/BaseTable.vue';
import Pagination from '~/components/Pagination.vue';
import Modal from '~/components/Modal.vue';
import KegiatanForm from '~/components/dashboard/KegiatanForm.vue';
import { useNuxtApp, useRuntimeConfig } from "#app";

definePageMeta({ layout: 'dashboard' });

const nuxtApp = useNuxtApp();
const runtimeConfig = useRuntimeConfig();
const kegiatanStore = useKegiatanStore();

const {
  kegiatanList, kegiatanListPending, kegiatanListError,
  currentPage, totalPages,
  kegiatanDetail, kegiatanDetailPending, kegiatanDetailError,
  kegiatanCreateError, kegiatanUpdateError // For passing to form
} = storeToRefs(kegiatanStore);

const searchQuery = ref(kegiatanStore.searchText || '');
const showCreateModal = ref(false);
const showEditModal = ref(false);
const editingKegiatan = ref<any | null>(null);

const tableDisplayColumns = [
  { key: 'gambar', label: 'Gambar' },
  { key: 'judul', label: 'Judul' },
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'lokasi', label: 'Lokasi' },
  // deskripsi might be too long for table, consider showing in detail view or tooltip
  { key: 'actions', label: 'Aksi' }
];

const getFullImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
    return imagePath;
  }
  const base = runtimeConfig.public.imgURL || runtimeConfig.public.imageCDN || '';
  return `${base}/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`;
};

onMounted(() => {
  // Reset search query in store if current page's query is empty,
  // ensuring a fresh fetch if navigating back to this page.
  if (!searchQuery.value) {
      kegiatanStore.setSearchQuery('');
  }
  kegiatanStore.fetchKegiatanList();
});

function performSearch() {
  kegiatanStore.setSearchQuery(searchQuery.value);
}

const debouncedPerformSearch = debounce(performSearch, 500);

watch(searchQuery, () => {
  debouncedPerformSearch();
});

function handlePageChange(newPage: number) {
  kegiatanStore.updatePage(newPage);
}

function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function(this: any, ...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

async function handleCreateKegiatan(formData: FormData) {
  try {
    await kegiatanStore.createKegiatan(formData);
    showCreateModal.value = false;
    nuxtApp.$swal.fire('Berhasil!', 'Kegiatan berhasil ditambahkan.', 'success');
    await kegiatanStore.fetchKegiatanList();
  } catch (error: any) {
    // Error is already set in store by createKegiatan action
    const errData = kegiatanStore.kegiatanCreateError;
    let htmlMessage = errData?.message || 'Terjadi kesalahan saat menambahkan kegiatan.';
    if (errData?.errors) {
      htmlMessage += '<br><br>Details:<br>' + Object.values(errData.errors).flat().join('<br>');
    }
    nuxtApp.$swal.fire('Gagal!', htmlMessage, 'error');
  }
}

async function handleEdit(id: number | string) {
  kegiatanStore.resetKegiatanDetail(); // Reset detail state before fetching new one
  await kegiatanStore.fetchKegiatanDetail(id);
  if (kegiatanDetail.value && !kegiatanDetailError.value) {
    editingKegiatan.value = { ...kegiatanDetail.value };
    showEditModal.value = true;
  } else {
    const errorMsg = kegiatanDetailError.value?.message || `Kegiatan dengan ID ${id} tidak ditemukan atau gagal dimuat.`;
    nuxtApp.$swal.fire('Error!', errorMsg, 'error');
    // Ensure modal doesn't show if detail fetch failed
    showEditModal.value = false;
  }
}

async function handleUpdateKegiatan(formData: FormData) {
  if (!editingKegiatan.value?.id) {
    nuxtApp.$swal.fire('Error!', 'ID Kegiatan untuk diedit tidak ditemukan.', 'error');
    return;
  }
  try {
    await kegiatanStore.updateKegiatan(editingKegiatan.value.id, formData);
    showEditModal.value = false;
    nuxtApp.$swal.fire('Berhasil!', 'Kegiatan berhasil diupdate.', 'success');
    await kegiatanStore.fetchKegiatanList();
    editingKegiatan.value = null;
  } catch (error: any) {
    // Error is already set in store by updateKegiatan action
    const errData = kegiatanStore.kegiatanUpdateError;
    let htmlMessage = errData?.message || 'Terjadi kesalahan saat mengupdate kegiatan.';
    if (errData?.errors) {
      htmlMessage += '<br><br>Details:<br>' + Object.values(errData.errors).flat().join('<br>');
    }
    nuxtApp.$swal.fire('Gagal!', htmlMessage, 'error');
  }
}

async function handleDelete(id: number | string) {
  try {
    const result = await nuxtApp.$swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Anda tidak akan dapat mengembalikan tindakan ini!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      await kegiatanStore.deleteKegiatan(id);
      nuxtApp.$swal.fire('Dihapus!', 'Kegiatan berhasil dihapus.', 'success');
      // Refresh list only if current page might become empty or for consistency
      // Check if the list is empty on current page and go to previous if possible
      if (kegiatanList.value.length === 1 && currentPage.value > 1) {
        kegiatanStore.updatePage(currentPage.value - 1);
      } else {
        await kegiatanStore.fetchKegiatanList();
      }
    }
  } catch (error: any) {
     // Error is already set in store by deleteKegiatan action
    const errData = kegiatanStore.kegiatanDeleteError;
    let htmlMessage = errData?.message || 'Gagal menghapus kegiatan.';
    // Delete typically doesn't have field errors, but include for robustness
    if (errData?.errors) {
      htmlMessage += '<br><br>Details:<br>' + Object.values(errData.errors).flat().join('<br>');
    }
    nuxtApp.$swal.fire('Error!', htmlMessage, 'error');
  }
}
</script>
