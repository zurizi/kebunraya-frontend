<template>
  <button
    :type="type"
    :disabled="disabled"
    class="flex px-6 py-2 text-base transition-all duration-500 rounded-full hover:translate-y-1"
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
  if (variant === 'outline') {
    return `bg-green-900 text-${color}  justify-center`;
  } else { 
    return `bg-${color} text-white justify-center`;
  }
});
</script>