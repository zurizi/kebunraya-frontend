<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <div>
      <label for="judul" class="block text-sm font-medium text-gray-700">Judul Kegiatan</label>
      <input
        type="text"
        id="judul"
        v-model="form.judul"
        required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
      />
    </div>

    <div>
      <label for="tanggal" class="block text-sm font-medium text-gray-700">Tanggal</label>
      <input
        type="date"
        id="tanggal"
        v-model="form.tanggal"
        required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
      />
    </div>

    <div>
      <label for="lokasi" class="block text-sm font-medium text-gray-700">Lokasi</label>
      <input
        type="text"
        id="lokasi"
        v-model="form.lokasi"
        required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
      />
    </div>

    <div>
      <label for="deskripsi" class="block text-sm font-medium text-gray-700">Deskripsi</label>
      <textarea
        id="deskripsi"
        v-model="form.deskripsi"
        rows="4"
        required
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
      ></textarea>
    </div>

    <div>
      <label for="gambar" class="block text-sm font-medium text-gray-700">Gambar (Bisa lebih dari satu)</label>
      <input
        type="file"
        id="gambar"
        multiple
        @change="handleFileUpload"
        accept="image/png, image/jpeg, image/gif"
        class="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />
      <div v-if="imagePreviewUrls.length" class="mt-2 grid grid-cols-3 gap-2">
        <div v-for="(url, index) in imagePreviewUrls" :key="index" class="relative">
          <img :src="url" alt="Preview Gambar Kegiatan" class="h-32 w-auto object-cover rounded-md shadow-sm" />
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-3">
      <button
        type="button"
        @click="$emit('close')"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Batal
      </button>
      <button
        type="submit"
        :disabled="isSubmitting || networkStore.isOffline"
        class="px-4 py-2 text-sm font-medium text-white bg-green-900 border border-transparent rounded-md shadow-sm hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-700 disabled:opacity-50"
      >
        {{ isEditMode ? 'Update Kegiatan' : 'Simpan Kegiatan' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits, onMounted } from 'vue';
import { useRuntimeConfig } from '#app';
import { useNetworkStore } from '~/store/network';

const networkStore = useNetworkStore();

interface FormDataType {
  judul: string;
  tanggal: string; // YYYY-MM-DD
  lokasi: string;
  deskripsi: string;
  gambar: File[]; // Changed to an array of Files
}

interface Props {
  isEditMode?: boolean;
  initialData?: any; // Define a more specific type if possible
  isSubmitting?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['submit', 'close']);
const runtimeConfig = useRuntimeConfig();

const form = ref<FormDataType>({
  judul: '',
  tanggal: '',
  lokasi: '',
  deskripsi: '',
  gambar: [], // Initialize as empty array
});

const imagePreviewUrls = ref<string[]>([]); // For multiple image previews

const getFullImageUrl = (imagePath: string | null | undefined): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:')) {
    return imagePath;
  }
  const base = runtimeConfig.public.imgURL || runtimeConfig.public.imageCDN || '';
  return `${base}/${imagePath.startsWith('/') ? imagePath.substring(1) : imagePath}`;
};

onMounted(() => {
  if (props.isEditMode && props.initialData) {
    populateForm(props.initialData);
  } else {
    resetForm(); // Ensure form is reset if not in edit mode or no initial data
  }
});

watch(() => props.initialData, (newData) => {
  if (props.isEditMode && newData) {
    populateForm(newData);
  } else {
    resetForm(); // Reset if initialData becomes null or not in edit mode
  }
}, { deep: true, immediate: true });

function resetForm() {
  form.value = {
    judul: '',
    tanggal: '',
    lokasi: '',
    deskripsi: '',
    gambar: [],
  };
  imagePreviewUrls.value.forEach(url => {
    if (url.startsWith('blob:')) URL.revokeObjectURL(url);
  });
  imagePreviewUrls.value = [];
  // Reset file input visually if possible (though direct manipulation is tricky)
  const fileInput = document.getElementById('gambar') as HTMLInputElement;
  if (fileInput) {
    fileInput.value = '';
  }
}

function populateForm(data: any) {
  form.value.judul = data.judul || '';
  form.value.tanggal = data.tanggal ? data.tanggal.split('T')[0] : '';
  form.value.lokasi = data.lokasi || '';
  form.value.deskripsi = data.deskripsi || '';
  form.value.gambar = []; // Reset gambar array in form

  imagePreviewUrls.value.forEach(url => {
    if (url.startsWith('blob:')) URL.revokeObjectURL(url);
  });
  imagePreviewUrls.value = [];

  if (data.gambar) {
    const gambarData = Array.isArray(data.gambar) ? data.gambar : [data.gambar];
    imagePreviewUrls.value = gambarData.map((g: string | File) => {
      if (typeof g === 'string') {
        return getFullImageUrl(g);
      } else if (g instanceof File) {
        // This case is unlikely for initialData from API, but good for consistency
        // If initialData could contain File objects, they should be added to form.value.gambar here
        // and their object URLs created for preview.
        // For now, assuming initialData.gambar are URLs if not Files.
        // form.value.gambar.push(g); // Example if files were part of initialData
        return URL.createObjectURL(g); // This line might be problematic if g is not a File from initialData
      }
      return '';
    }).filter(url => url);
     // In edit mode, initialData.gambar are URLs. We don't repopulate form.value.gambar with Files
     // until the user selects new files. The backend handles existing images separately.
  }
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files ? Array.from(target.files) : [];

  // Revoke previous blob URLs
  imagePreviewUrls.value.forEach(url => {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  });

  if (files.length > 0) {
    form.value.gambar = files; // Store new File objects
    imagePreviewUrls.value = files.map(file => URL.createObjectURL(file));
  } else {
    // If no files selected (e.g., user cleared selection), clear existing previews and files
    // This depends on whether clearing selection should remove existing images from server during edit
    // For now, if user selects no files, we clear local files and previews.
    // Backend logic will determine if existing images are kept or removed.
    form.value.gambar = [];
    imagePreviewUrls.value = [];
     // If editing and had existing images, and user clears selection,
     // we might want to revert to showing initialData's images.
     // This part needs careful consideration of UX.
     // For now, clearing selection clears previews.
     if (props.isEditMode && props.initialData?.gambar) {
        // Re-populate with initial non-file previews if user deselects new files
        const initialGambarData = Array.isArray(props.initialData.gambar) ? props.initialData.gambar : [props.initialData.gambar];
        imagePreviewUrls.value = initialGambarData.map((g: string) => getFullImageUrl(g)).filter(url => url);
     }
  }
}

function submitForm() {
  if (networkStore.isOffline) {
    console.warn("Form submission prevented: application is offline.");
    return;
  }

  const submissionData = new FormData();
  submissionData.append('judul', form.value.judul);
  submissionData.append('tanggal', form.value.tanggal);
  submissionData.append('lokasi', form.value.lokasi);
  submissionData.append('deskripsi', form.value.deskripsi);

  // Append new image files
  if (form.value.gambar && form.value.gambar.length > 0) {
    form.value.gambar.forEach((file) => {
      submissionData.append('gambar[]', file); // Use 'gambar[]' for array of files
    });
  } else if (props.isEditMode && (!form.value.gambar || form.value.gambar.length === 0)) {
    // If in edit mode and no new files are selected,
    // we might need to tell the backend to keep existing images.
    // This is often handled by *not* sending the 'gambar' field at all,
    // or sending a specific signal e.g. `gambar_is_cleared: true/false`.
    // For now, if no new images, 'gambar[]' won't be appended.
    // If initialData.gambar existed and user selected no new files,
    // and the intention is to *remove* all images, that needs explicit handling.
    // The current setup implies: new files replace old ones. No new files = keep old ones (if backend supports this).
  }


  emit('submit', submissionData);
}
</script>
