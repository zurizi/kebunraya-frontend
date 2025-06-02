<template>
  <Transition name="modal">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center h-screen p-4 m-0 bg-black bg-opacity-50"
      @click.self="handleOverlayClick"
    >
      <div
        class="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-xl"
        :style="{ maxWidth: maxWidth }"
      >
        <div
          v-if="showHeader"
          class="flex items-center justify-between px-4 py-3 border-b border-gray-200"
        >
          <slot name="header">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ title }}
            </h3>
            <button
              v-if="showHeader"
              @click="closeModal"
              class="text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </slot>
        </div>

        <div class="p-4">
          <slot></slot>
        </div>

        <div
          v-if="showFooter"
          class="flex justify-end px-4 py-3 space-x-2 border-t border-gray-200"
        >
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps, defineEmits, watch, onUnmounted } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Modal Title",
  },
  showHeader: {
    type: Boolean,
    default: true,
  },
  showFooter: {
    type: Boolean,
    default: true,
  },
  maxWidth: {
    type: String,
    default: "sm",
  },
  closeOnOverlayClick: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:show", "close"]);

const closeModal = () => {
  emit("update:show", false);
  emit("close");
};

const handleOverlayClick = () => {
  if (props.closeOnOverlayClick) {
    closeModal();
  }
};

watch(
  () => props.show,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);

onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .bg-white,
.modal-leave-active .bg-white {
  transition: transform 0.3s ease;
}

.modal-enter-from .bg-white,
.modal-leave-to .bg-white {
  transform: scale(0.95);
}
</style>
