<template>
  <div
    ref="container"
    class="relative w-full h-[800px] overflow-hidden border rounded-xl bg-gray-100"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
    @wheel.prevent="onWheel"
  >
    <div class="absolute z-10 flex space-x-2 top-4 right-4">
      <button
        @click="zoomIn"
        class="p-2 bg-white rounded shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="scale >= MAX_SCALE"
      >
        +
      </button>
      <button
        @click="zoomOut"
        class="p-2 bg-white rounded shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="scale <= MIN_SCALE"
      >
        -
      </button>
      <button
        @click="resetZoom"
        class="p-2 bg-white rounded shadow hover:bg-gray-100"
      >
        Reset
      </button>
    </div>

    <div
      class="w-full h-full"
      :style="{
        transform: `translate(${dragPosition.x}px, ${dragPosition.y}px) scale(${scale})`,
        transformOrigin: '0 0',
      }"
    >
      <img
        ref="image"
        src="/pages/maps/map.png"
        alt="Map"
        class="pointer-events-none select-none max-w-none"
        @dragstart.prevent
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";

const scale = ref(1);
const dragPosition = reactive({ x: 0, y: 0 });
const startPosition = reactive({ x: 0, y: 0 });

const image = ref<HTMLImageElement | null>(null);
const container = ref<HTMLDivElement | null>(null);

let isDragging = false;

const MIN_SCALE = 0.7;
const MAX_SCALE = 1.3;
const ZOOM_STEP = 0.1;

const clampDragPosition = (x: number, y: number, currentScale: number) => {
  if (!container.value || !image.value) {
    return { x, y };
  }

  const containerWidth = container.value.clientWidth;
  const containerHeight = container.value.clientHeight;
  const imageNaturalWidth = image.value.naturalWidth;
  const imageNaturalHeight = image.value.naturalHeight;

  const scaledWidth = imageNaturalWidth * currentScale;
  const scaledHeight = imageNaturalHeight * currentScale;

  let boundXMin, boundXMax, boundYMin, boundYMax;

  if (scaledWidth < containerWidth) {
    boundXMin = boundXMax = (containerWidth - scaledWidth) / 2;
  } else {
    boundXMin = containerWidth - scaledWidth;
    boundXMax = 0;
  }

  if (scaledHeight < containerHeight) {
    boundYMin = boundYMax = (containerHeight - scaledHeight) / 2;
  } else {
    boundYMin = containerHeight - scaledHeight;
    boundYMax = 0;
  }

  const clampedX = Math.max(boundXMin, Math.min(boundXMax, x));
  const clampedY = Math.max(boundYMin, Math.min(boundYMax, y));

  return { x: clampedX, y: clampedY };
};

const centerImage = () => {
  if (image.value && container.value) {
    const containerWidth = container.value.clientWidth;
    const containerHeight = container.value.clientHeight;
    const imageNaturalWidth = image.value.naturalWidth;
    const imageNaturalHeight = image.value.naturalHeight;

    const centerX = (containerWidth - imageNaturalWidth * scale.value) / 2;
    const centerY = (containerHeight - imageNaturalHeight * scale.value) / 2;

    dragPosition.x = centerX;
    dragPosition.y = centerY;
  }
};

const resetZoom = () => {
  scale.value = 1;

  nextTick(() => {
    centerImage();
  });
};

const onMouseDown = (event: MouseEvent) => {
  if (event.target !== container.value && event.target !== image.value) {
    return;
  }

  isDragging = true;

  startPosition.x = event.clientX - dragPosition.x;
  startPosition.y = event.clientY - dragPosition.y;

  if (container.value) {
    container.value.style.cursor = "grabbing";
  }
};

const onMouseMove = (event: MouseEvent) => {
  if (isDragging && container.value && image.value) {
    const newX = event.clientX - startPosition.x;
    const newY = event.clientY - startPosition.y;

    const clampedPosition = clampDragPosition(newX, newY, scale.value);

    dragPosition.x = clampedPosition.x;
    dragPosition.y = clampedPosition.y;
  }
};

const onMouseUp = () => {
  isDragging = false;

  if (container.value) {
    container.value.style.cursor = "grab";
  }
};

const onWheel = (event: WheelEvent) => {
  const zoomDirection = event.deltaY > 0 ? -1 : 1;
  const newScale = scale.value + zoomDirection * ZOOM_STEP;

  const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));

  if (clampedScale !== scale.value) {
    scale.value = clampedScale;

    const clampedPosition = clampDragPosition(
      dragPosition.x,
      dragPosition.y,
      scale.value
    );

    dragPosition.x = clampedPosition.x;
    dragPosition.y = clampedPosition.y;
  }
};

const zoomIn = () => {
  const newScale = scale.value + ZOOM_STEP;
  const clampedScale = Math.min(MAX_SCALE, newScale);
  if (clampedScale !== scale.value) {
    scale.value = clampedScale;
    const clampedPosition = clampDragPosition(
      dragPosition.x,
      dragPosition.y,
      scale.value
    );
    dragPosition.x = clampedPosition.x;
    dragPosition.y = clampedPosition.y;
  }
};

const zoomOut = () => {
  const newScale = scale.value - ZOOM_STEP;
  const clampedScale = Math.max(MIN_SCALE, newScale);
  if (clampedScale !== scale.value) {
    scale.value = clampedScale;
    const clampedPosition = clampDragPosition(
      dragPosition.x,
      dragPosition.y,
      scale.value
    );
    dragPosition.x = clampedPosition.x;
    dragPosition.y = clampedPosition.y;
  }
};

onMounted(() => {
  const imgElement = image.value;
  if (imgElement) {
    if (imgElement.complete) {
      centerImage();
    } else {
      imgElement.addEventListener("load", () => {
        centerImage();
      });

      imgElement.addEventListener("error", () => {
        console.error("Error loading image");
      });
    }
  }

  if (container.value) {
    container.value.style.cursor = "grab";
  }
});

import { onBeforeUnmount } from "vue";

onBeforeUnmount(() => {
  const imgElement = image.value;
  if (imgElement) {
    imgElement.removeEventListener("load", () => {
      /* handler */
    });
    imgElement.removeEventListener("error", () => {
      /* handler */
    });
  }

  if (container.value) {
    container.value.style.cursor = "";
  }
});
</script>

<style scoped>
/* Hapus transisi pada w-full jika tidak diinginkan saat drag/zoom */
/* Transisi yang diinginkan mungkin pada transform saja */
/* .w-full {
  transition: transform 0.2s ease-out;
} */

/* Tambahkan transisi hanya pada properti transform jika diinginkan */
/*
.w-full {
    transition-property: transform;
    transition-duration: 0.2s;
    transition-timing-function: ease-out;
}
*/

/* Pointer events none dan user select none sudah ada di template */
</style>
