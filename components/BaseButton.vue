<template>
  <button
    :type="type"
    :disabled="disabled"
    class="flex px-6 py-2 text-sm transition-all duration-500 rounded-full md:text-base hover:translate-y-1"
    :class="[variantClasses, `text-${textAlign}`, addClass]"
    :style="{ width }"
    @click="handleClick($event)"
  >
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const { width, color, type, disabled, variant, textAlign } = defineProps({
  width: {
    type: String,
    default: "210px",
  },
  color: {
    type: String,
    default: "green",
  },
  type: {
    type: String,
    default: "button",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  variant: {
    type: String,
    default: "primary", 
    validator: (value) => ['primary', 'outline'].includes(value) 
  },
  textAlign: {
    type: String,
    default: "center",
  },
  addClass: {
    type: String,
    default: "",
  }
});

const emit = defineEmits(["click"]);

const handleClick = (event) => {
  event.stopPropagation();
  emit('click');
};

const variantClasses = computed(() => {
  // It's generally safer to use props.variant and props.color here
  // if these props could change dynamically and reactivity is critical.
  // However, following the existing pattern of using destructured variables:
  let baseClasses = 'justify-center focus:outline-none focus:ring-2 focus:ring-offset-2';

  if (variant === 'outline') {
    if (color === 'green') {
      return `${baseClasses} border border-green-900 text-green-900 bg-transparent hover:bg-green-900 hover:text-white focus:ring-green-500`;
    } else {
      // Fallback for other outline colors
      return `${baseClasses} border border-gray-500 text-gray-700 bg-transparent hover:bg-gray-200 focus:ring-gray-500`;
    }
  } else { // 'primary' variant
    if (color === 'green') {
      return `${baseClasses} bg-green-900 text-white hover:bg-green-800 focus:ring-green-500`;
    } else {
      // Fallback for other primary colors - attempts to use Tailwind's convention
      // Note: This requires bg-${color}-600, hover:bg-${color}-700, focus:ring-${color}-500 to exist.
      // If color is 'blue', it becomes 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'.
      // This might not cover all cases or custom color names without specific shades.
      return `${baseClasses} bg-${color}-600 text-white hover:bg-${color}-700 focus:ring-${color}-500`;
    }
  }
});
</script>