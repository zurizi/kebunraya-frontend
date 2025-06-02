<template>
  <form @submit.prevent="handleSubmit">
    <div class="max-h-[70vh] overflow-y-auto p-1 pr-2 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
        <div>
          <label for="nama_ilmiah" class="block text-sm font-medium text-gray-700">Nama Ilmiah</label>
          <input type="text" id="nama_ilmiah" v-model="formData.nama_ilmiah" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
        </div>
        <div>
          <label for="nama_lokal" class="block text-sm font-medium text-gray-700">Nama Lokal</label>
          <input type="text" id="nama_lokal" v-model="formData.nama_lokal" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
        </div>
        <div>
          <label for="keluarga" class="block text-sm font-medium text-gray-700">Keluarga</label>
          <input type="text" id="keluarga" v-model="formData.keluarga" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
        </div>
        <div>
          <label for="umur" class="block text-sm font-medium text-gray-700">Umur</label>
          <input type="text" id="umur" v-model="formData.umur" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
        </div>
         <div>
          <label for="category_id" class="block text-sm font-medium text-gray-700">Kategori</label>
          <select
            id="category_id"
            v-model="formData.category_id"
            :disabled="categoryListPending"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          >
            <option value="" disabled>-- Pilih Kategori --</option> <!-- Removed 'selected' here as v-model handles it -->
            <option v-for="category in categoryList" :key="category.id" :value="category.id">
              {{ category.nama_kategori }}
            </option>
          </select>
          <p v-if="categoryListPending" class="mt-1 text-sm text-gray-500">Memuat kategori...</p>
          <p v-if="categoryListError" class="mt-1 text-sm text-red-600">
            Gagal memuat kategori. {{ categoryListError.message || '' }}
          </p>
        </div>
        <div>
          <label for="perawakan" class="block text-sm font-medium text-gray-700">Perawakan</label>
          <input type="text" id="perawakan" v-model="formData.perawakan" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
        </div>
      </div>

      <div>
        <label for="persebaran" class="block text-sm font-medium text-gray-700">Persebaran</label>
        <input type="text" id="persebaran" v-model="formData.persebaran" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
      </div>

      <div>
        <label for="deskripsi" class="block text-sm font-medium text-gray-700">Deskripsi</label>
        <textarea id="deskripsi" v-model="formData.deskripsi" rows="4" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"></textarea>
      </div>

      <div>
        <label for="gambar" class="block text-sm font-medium text-gray-700">Gambar</label>
        <input type="file" id="gambar" @change="handleFileUpload" accept="image/*" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
      </div>
    </div>

    <div class="mt-6 flex justify-end space-x-3">
       <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
        Batal
      </button>
      <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-green-900 border border-transparent rounded-md shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
        Simpan
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useCategoriesStore } from '~/store/categories';
import { storeToRefs } from 'pinia';

const emit = defineEmits(['submit']);

const categoriesStore = useCategoriesStore();
const { categoryList, categoryListPending, categoryListError } = storeToRefs(categoriesStore);

const formData = reactive({
  nama_ilmiah: '',
  nama_lokal: '',
  keluarga: '',
  umur: '',
  category_id: '', // Ensures default option "Pilih Kategori" is selected
  perawakan: '',
  persebaran: '',
  deskripsi: '',
  gambar: null,
});

onMounted(() => {
  categoriesStore.fetchCategories();
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    formData.gambar = file;
  }
};

const handleSubmit = () => {
  emit('submit', formData);
};
</script>

