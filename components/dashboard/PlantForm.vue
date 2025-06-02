<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label for="nama_ilmiah" class="block text-sm font-medium text-gray-700">Nama Ilmiah</label>
      <input type="text" id="nama_ilmiah" v-model="formData.nama_ilmiah" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
    </div>

    <div>
      <label for="nama_lokal" class="block text-sm font-medium text-gray-700">Nama Lokal</label>
      <input type="text" id="nama_lokal" v-model="formData.nama_lokal" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
    </div>

    <div>
      <label for="keluarga" class="block text-sm font-medium text-gray-700">Keluarga</label>
      <input type="text" id="keluarga" v-model="formData.keluarga" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
    </div>

    <div>
      <label for="umur" class="block text-sm font-medium text-gray-700">Umur</label>
      <input type="text" id="umur" v-model="formData.umur" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
    </div>

    <div>
      <label for="category_id" class="block text-sm font-medium text-gray-700">Category ID</label>
      <input type="text" id="category_id" v-model="formData.category_id" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
    </div>

    <div>
      <label for="perawakan" class="block text-sm font-medium text-gray-700">Perawakan</label>
      <input type="text" id="perawakan" v-model="formData.perawakan" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
    </div>

    <div>
      <label for="persebaran" class="block text-sm font-medium text-gray-700">Persebaran</label>
      <input type="text" id="persebaran" v-model="formData.persebaran" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
    </div>

    <div>
      <label for="deskripsi" class="block text-sm font-medium text-gray-700">Deskripsi</label>
      <textarea id="deskripsi" v-model="formData.deskripsi" rows="4" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
    </div>

    <div>
      <label for="gambar" class="block text-sm font-medium text-gray-700">Gambar</label>
      <input type="file" id="gambar" @change="handleFileUpload" accept="image/*" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100">
    </div>

    <div>
      <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Submit
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue';

const emit = defineEmits(['submit']);

const formData = reactive({
  nama_ilmiah: '',
  nama_lokal: '',
  keluarga: '',
  umur: '',
  category_id: '',
  perawakan: '',
  persebaran: '',
  deskripsi: '',
  gambar: null,
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

<style scoped>
/* Basic styling for presentation */
form div {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.25rem;
}
input[type="text"],
textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
input[type="file"] {
  padding: 0.5rem;
}
button {
  padding: 0.75rem 1.5rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
</style>
