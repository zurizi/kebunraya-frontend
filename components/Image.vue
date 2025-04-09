<template>
  <component
    :is="isSvg ? 'img' : NuxtImg"
    :src="src"
    :alt="alt"
    :class="computedClass"
    v-bind="!isSvg ? nuxtImgProps : {}"
  />
</template>

<script setup>
import { computed } from "vue";
import { NuxtImg } from "#components";

const props = defineProps({
  src: String,
  alt: String,
  class: String,
  quality: Number, 
});

const computedClass = computed(() => {
  return props.class ? `${props.class}` : "";
});

const isSvg = computed(() => {
  return props.src?.endsWith(".svg");
});

const nuxtImgProps = computed(() => ({
  format: "webp",
  densities: "x1",
  quality: props.quality || 100,
}));
</script>
