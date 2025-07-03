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
        <input 
          type="file"
          id="gambar"
          multiple
          @change="handleImageChange"
          accept="image/png, image/jpeg, image/gif"
          class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
        <div v-if="imagePreviewUrls.length" class="mt-2 grid grid-cols-3 gap-2">
          <div v-for="(url, index) in imagePreviewUrls" :key="index" class="relative">
            <img :src="url" alt="Preview Gambar Tanaman" class="max-h-40 w-auto rounded border p-1 shadow-sm" />
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 flex justify-end space-x-3">
      <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
        Batal
      </button>
      <button
        type="submit"
        :disabled="networkStore.isOffline"
        class="px-4 py-2 text-sm font-medium text-white bg-green-900 border border-transparent rounded-md shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50">
        Simpan
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, onMounted, ref, onUnmounted, watch, defineProps } from 'vue'; // Added watch, defineProps
import { useCategoriesStore } from '~/store/categories';
import { storeToRefs } from 'pinia';
import { useNetworkStore } from '~/store/network';

const networkStore = useNetworkStore();

const props = defineProps({
  isEditMode: {
    type: Boolean,
    default: false,
  },
  initialData: {
    type: Object, // Using Object directly, as PropType might not be available
    default: () => null,
  },
});

const emit = defineEmits(['submit', 'close']); // Added 'close' to defineEmits

const categoriesStore = useCategoriesStore();
const { categoryList, categoryListPending, categoryListError } = storeToRefs(categoriesStore);

const imagePreviewUrls = ref([]); // Changed to handle multiple previews

const initialFormData = {
  nama_ilmiah: '',
  nama_lokal: '',
  keluarga: '',
  umur: '',
  category_id: '',
  perawakan: '',
  persebaran: '',
  deskripsi: '',
  gambar: [], // Changed to an array to hold multiple files
};

const formData = reactive({ ...initialFormData });

function resetForm() {
  Object.assign(formData, { ...initialFormData, gambar: [] }); // Ensure gambar is reset to an empty array
  imagePreviewUrls.value.forEach(url => URL.revokeObjectURL(url));
  imagePreviewUrls.value = [];
}

watch(() => props.initialData, (newData) => {
  resetForm();
  if (props.isEditMode && newData) {
    for (const key in initialFormData) { // Iterate over initialFormData keys to avoid copying unexpected props
      if (newData.hasOwnProperty(key)) {
        if (key === 'gambar') {
          // Assuming initialData.gambar is an array of URLs or File objects
          if (Array.isArray(newData.gambar)) {
            formData.gambar = []; // Prepare for new File objects or keep existing if not changed
            imagePreviewUrls.value = newData.gambar.map(img => {
              if (typeof img === 'string') {
                return img; // Existing image URL
              } else if (img instanceof File) {
                formData.gambar.push(img); // Add file to formData
                return URL.createObjectURL(img); // Create preview URL
              }
              return null;
            }).filter(url => url !== null);
          } else if (typeof newData.gambar === 'string' && newData.gambar) {
            // Handle case where initialData.gambar is a single URL string (backward compatibility)
            imagePreviewUrls.value = [newData.gambar];
            formData.gambar = []; // No files initially, just URL
          } else {
            formData.gambar = [];
            imagePreviewUrls.value = [];
          }
        } else {
          formData[key] = newData[key];
        }
      }
    }
  }
}, { immediate: true, deep: true });


onMounted(() => {
  categoriesStore.fetchCategories();
});

const handleImageChange = (event) => {
  const files = Array.from(event.target.files);

  // Revoke old preview URLs
  imagePreviewUrls.value.forEach(url => {
    // Only revoke if it's an object URL created by createObjectURL
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
  imagePreviewUrls.value = [];
  formData.gambar = []; // Reset images array

  if (files.length > 0) {
    formData.gambar = files; // Store File objects
    imagePreviewUrls.value = files.map(file => URL.createObjectURL(file)); // Create new preview URLs
  }
};

// Cleanup object URLs on component unmount
onUnmounted(() => {
  imagePreviewUrls.value.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });
});

const handleSubmit = () => {
  if (networkStore.isOffline) {
    console.warn("Form submission prevented: application is offline.");
    // Optionally, use $swal here for a more visible warning.
    return;
  }
  // Create a plain object copy for submission, especially if not using FormData for everything
  // For FormData usage as in the store, passing `formData` (the reactive proxy) is fine.
  emit('submit', { ...formData }); 
};

// Expose resetForm to be called by parent if needed (e.g. after successful submit from parent view)
// defineExpose({ resetForm }); // Optional: if parent needs to trigger reset
</script>

