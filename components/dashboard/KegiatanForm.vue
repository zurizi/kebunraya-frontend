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
      <label for="gambar" class="block text-sm font-medium text-gray-700">Gambar</label>
      <input
        type="file"
        id="gambar"
        @change="handleFileUpload"
        class="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
      />
      <img v-if="imagePreviewUrl && !form.gambar" :src="imagePreviewUrl" alt="Preview" class="mt-2 h-32 w-auto object-cover rounded-md"/>
      <img v-if="form.gambar && typeof form.gambar !== 'string'" :src="newImagePreview" alt="New Preview" class="mt-2 h-32 w-auto object-cover rounded-md"/>
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
  gambar: File | string | null; // File for new/updated image, string for existing image URL, null if no image
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
  gambar: null,
});

const imagePreviewUrl = ref<string | null>(null); // For existing image preview
const newImagePreview = ref<string | null>(null); // For new image preview before upload

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
  }
});

watch(() => props.initialData, (newData) => {
  if (props.isEditMode && newData) {
    populateForm(newData);
  }
}, { deep: true, immediate: true });


function populateForm(data: any) {
  form.value = {
    judul: data.judul || '',
    tanggal: data.tanggal ? data.tanggal.split('T')[0] : '', // Assuming date might come as ISO string
    lokasi: data.lokasi || '',
    deskripsi: data.deskripsi || '',
    gambar: null, // Will be set to existing URL string if no new file is chosen
  };
  if (data.gambar && typeof data.gambar === 'string') {
    imagePreviewUrl.value = getFullImageUrl(data.gambar);
  } else {
    imagePreviewUrl.value = null;
  }
  newImagePreview.value = null; // Reset new image preview
}

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    form.value.gambar = file;
    // Create a URL for previewing the new image
    const reader = new FileReader();
    reader.onload = (e) => {
      newImagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    imagePreviewUrl.value = null; // Clear existing image preview if a new one is chosen
  }
}

function submitForm() {
  if (networkStore.isOffline) {
    console.warn("Form submission prevented: application is offline.");
    // Optionally: use $swal here if a more prominent user notification is desired directly from the form.
    // const { $swal } = useNuxtApp(); // Make sure to import useNuxtApp
    // $swal.fire('Offline', 'Tidak dapat mengirim formulir saat offline. Periksa koneksi Anda.', 'warning');
    return;
  }

  const formData = new FormData();
  formData.append('judul', form.value.judul);
  formData.append('tanggal', form.value.tanggal);
  formData.append('lokasi', form.value.lokasi);
  formData.append('deskripsi', form.value.deskripsi);

  if (form.value.gambar instanceof File) {
    formData.append('gambar', form.value.gambar);
  } else if (props.isEditMode && typeof form.value.gambar === 'string' && form.value.gambar) {
    // If in edit mode and image is a string (path to existing), backend might not need it
    // or might need a specific field to indicate "no change" or the path itself.
    // For now, we only append if it's a new File.
    // If the backend requires the existing image path to be sent back, adjust here.
  }

  // If in edit mode and no new image is selected, initialData.gambar (string) might be needed by the parent.
  // The current logic only sends a new file.
  // If the parent needs to know if the image was cleared or kept, further logic is needed.

  emit('submit', formData);
}
</script>
