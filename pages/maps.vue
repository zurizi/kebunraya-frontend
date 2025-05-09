<template>
  <div class="relative w-full">
    <MapsSiderbar :isOpen="isSidebarOpen" />
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-30 bg-black opacity-25"
      @click="isSidebarOpen = false"
    ></div>

    <button
      @click="isSidebarOpen = !isSidebarOpen"
      class="absolute left-0 z-40 px-3 py-1.5 mb-4 text-black transition-transform duration-300 bg-white top-4"
      :class="
        !isSidebarOpen
          ? 'ease-in translate-x-0 bg-opacity-50 rounded-r-2xl'
          : 'bg-opacity-75 ease-out translate-x-64 left-4 rounded-s-2xl'
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="5"
        stroke="currentColor"
        class="w-6 transition-transform duration-300"
        :class="{ 'rotate-180': isSidebarOpen }"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
        />
      </svg>
    </button>

    <div
      ref="container"
      class="relative w-full h-[800px] overflow-hidden border rounded-xl bg-gray-100 select-none"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
      @wheel.prevent="onWheel"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
      @touchcancel="onTouchEnd"
    >
      <div
        v-if="!isSidebarOpen"
        class="absolute z-40 flex space-x-2 zoom-controls-panel top-4 right-4"
      >
        <button
          @click="zoomIn"
          class="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="scale >= MAX_SCALE"
        >
          +
        </button>
        <button
          @click="zoomOut"
          class="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="scale <= MIN_SCALE"
        >
          -
        </button>
        <button
          @click="resetZoom"
          class="p-2 text-sm bg-white shadow rounded-xl hover:bg-gray-100"
        >
          Reset
        </button>
      </div>

      <div class="absolute z-20 top-20 right-6 md:hidden" v-if="!isSidebarOpen">
        <div class="grid grid-cols-3 grid-rows-3 gap-0.5 w-36 h-36 opacity-80">
          <button
            @mousedown="startContinuousPan('up')"
            @touchstart.prevent="startContinuousPan('up')"
            @mouseup="stopContinuousPan"
            @touchend.prevent="stopContinuousPan"
            @mouseleave="stopContinuousPan"
            class="col-start-2 row-start-1 pan-button"
          >
            ⬆️
          </button>
          <button
            @mousedown="startContinuousPan('left')"
            @touchstart.prevent="startContinuousPan('left')"
            @mouseup="stopContinuousPan"
            @touchend.prevent="stopContinuousPan"
            @mouseleave="stopContinuousPan"
            class="col-start-1 row-start-2 pan-button"
          >
            ⬅️
          </button>
          <div class="col-start-2 row-start-2"></div>
          <button
            @mousedown="startContinuousPan('right')"
            @touchstart.prevent="startContinuousPan('right')"
            @mouseup="stopContinuousPan"
            @touchend.prevent="stopContinuousPan"
            @mouseleave="stopContinuousPan"
            class="col-start-3 row-start-2 pan-button"
          >
            ➡️
          </button>
          <button
            @mousedown="startContinuousPan('down')"
            @touchstart.prevent="startContinuousPan('down')"
            @mouseup="stopContinuousPan"
            @touchend.prevent="stopContinuousPan"
            @mouseleave="stopContinuousPan"
            class="col-start-2 row-start-3 pan-button"
          >
            ⬇️
          </button>
        </div>
      </div>

      <div
        class="w-full h-full"
        :style="{
          transform: `translate(${dragPosition.x}px, ${dragPosition.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          touchAction: 'none',
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, onBeforeUnmount } from "vue";

const isSidebarOpen = ref(false);

const scale = ref(1);
const dragPosition = reactive({ x: 0, y: 0 });
const startPosition = reactive({ x: 0, y: 0 });
const touchStartPosition = reactive({ x: 0, y: 0 });

const image = ref<HTMLImageElement | null>(null);
const container = ref<HTMLDivElement | null>(null);

let isDragging = false;
let isTouchPanning = false;

const MIN_SCALE = 0.5;
const MAX_SCALE = 3.0;
const ZOOM_STEP = 0.1;
const PAN_STEP = 25;
const PAN_INTERVAL_DELAY = 50;

let panIntervalId = ref<number | null>(null);
let currentPanDirection = ref<string | null>(null);

const clampDragPosition = (x: number, y: number, currentScale: number) => {
  if (!container.value || !image.value || image.value.naturalWidth === 0) {
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
  if (image.value && container.value && image.value.naturalWidth > 0) {
    const containerWidth = container.value.clientWidth;
    const containerHeight = container.value.clientHeight;
    const imageNaturalWidth = image.value.naturalWidth;
    const imageNaturalHeight = image.value.naturalHeight;

    const centerX = (containerWidth - imageNaturalWidth * scale.value) / 2;
    const centerY = (containerHeight - imageNaturalHeight * scale.value) / 2;

    const clamped = clampDragPosition(centerX, centerY, scale.value);
    dragPosition.x = clamped.x;
    dragPosition.y = clamped.y;
  }
};

const resetZoom = () => {
  scale.value = 1;
  nextTick(() => {
    centerImage();
  });
};

const onMouseDown = (event: MouseEvent) => {
  const targetElement = event.target as HTMLElement;
  if (
    targetElement?.closest(".pan-button") ||
    targetElement?.closest(".zoom-controls-panel")
  ) {
    return;
  }
  isDragging = true;
  startPosition.x = event.clientX - dragPosition.x;
  startPosition.y = event.clientY - dragPosition.y;
  if (container.value) container.value.style.cursor = "grabbing";
};

const onMouseMove = (event: MouseEvent) => {
  if (isDragging && image.value) {
    const newX = event.clientX - startPosition.x;
    const newY = event.clientY - startPosition.y;
    const clampedPosition = clampDragPosition(newX, newY, scale.value);
    dragPosition.x = clampedPosition.x;
    dragPosition.y = clampedPosition.y;
  }
};

const onMouseUp = () => {
  if (isDragging) {
    isDragging = false;
    if (container.value) container.value.style.cursor = "grab";
  }
};

const onTouchStart = (event: TouchEvent) => {
  const targetElement = event.target as HTMLElement;

  const onPanButton = targetElement?.closest(".pan-button");
  const onZoomControls = targetElement?.closest(".zoom-controls-panel");

  if (onPanButton || onZoomControls) {
    return;
  }

  if (event.touches.length === 1) {
    event.preventDefault();
    isTouchPanning = true;
    const touch = event.touches[0];
    touchStartPosition.x = touch.clientX - dragPosition.x;
    touchStartPosition.y = touch.clientY - dragPosition.y;
  }
};

const onTouchMove = (event: TouchEvent) => {
  if (isTouchPanning && event.touches.length === 1 && image.value) {
    event.preventDefault();
    const touch = event.touches[0];
    const newX = touch.clientX - touchStartPosition.x;
    const newY = touch.clientY - touchStartPosition.y;
    const clampedPosition = clampDragPosition(newX, newY, scale.value);
    dragPosition.x = clampedPosition.x;
    dragPosition.y = clampedPosition.y;
  }
};

const onTouchEnd = () => {
  if (isTouchPanning) {
    isTouchPanning = false;
  }
};

const onWheel = (event: WheelEvent) => {
  if (!container.value) return;
  event.preventDefault();
  const zoomDirection = event.deltaY > 0 ? -1 : 1;
  const newScaleAttempt = scale.value + zoomDirection * ZOOM_STEP;
  const oldScale = scale.value;

  scale.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScaleAttempt));

  if (scale.value !== oldScale) {
    const containerRect = container.value.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left;
    const mouseY = event.clientY - containerRect.top;

    const imageXBeforeZoom = (mouseX - dragPosition.x) / oldScale;
    const imageYBeforeZoom = (mouseY - dragPosition.y) / oldScale;

    dragPosition.x = mouseX - imageXBeforeZoom * scale.value;
    dragPosition.y = mouseY - imageYBeforeZoom * scale.value;

    const clampedPosition = clampDragPosition(
      dragPosition.x,
      dragPosition.y,
      scale.value
    );
    dragPosition.x = clampedPosition.x;
    dragPosition.y = clampedPosition.y;
  }
};

const applyZoomCentered = (newScaleValue: number) => {
  const oldScale = scale.value;
  scale.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScaleValue));

  if (
    scale.value !== oldScale &&
    container.value &&
    image.value &&
    image.value.naturalWidth > 0
  ) {
    const containerWidth = container.value.clientWidth;
    const containerHeight = container.value.clientHeight;

    const centerX = containerWidth / 2;
    const centerY = containerHeight / 2;

    const imageXBeforeZoom = (centerX - dragPosition.x) / oldScale;
    const imageYBeforeZoom = (centerY - dragPosition.y) / oldScale;

    dragPosition.x = centerX - imageXBeforeZoom * scale.value;
    dragPosition.y = centerY - imageYBeforeZoom * scale.value;

    const clamped = clampDragPosition(
      dragPosition.x,
      dragPosition.y,
      scale.value
    );
    dragPosition.x = clamped.x;
    dragPosition.y = clamped.y;
  }
};

const zoomIn = () => {
  applyZoomCentered(scale.value + ZOOM_STEP);
};

const zoomOut = () => {
  applyZoomCentered(scale.value - ZOOM_STEP);
};

const panImageImmediate = (direction: string) => {
  let dx = 0;
  let dy = 0;
  const step = PAN_STEP;

  const diagonalStep = step * 0.7071; // Math.sqrt(step^2 / 2)

  switch (direction) {
    case "up":
      dy = step;
      break;
    case "down":
      dy = -step;
      break;
    case "left":
      dx = step;
      break;
    case "right":
      dx = -step;
      break;
    case "up-left":
      dy = diagonalStep;
      dx = diagonalStep;
      break;
    case "up-right":
      dy = diagonalStep;
      dx = -diagonalStep;
      break;
    case "down-left":
      dy = -diagonalStep;
      dx = diagonalStep;
      break;
    case "down-right":
      dy = -diagonalStep;
      dx = -diagonalStep;
      break;
    default:
      return;
  }

  const newX = dragPosition.x + dx;
  const newY = dragPosition.y + dy;

  const clampedPosition = clampDragPosition(newX, newY, scale.value);
  dragPosition.x = clampedPosition.x;
  dragPosition.y = clampedPosition.y;
};

const startContinuousPan = (direction: string) => {
  stopContinuousPan();
  currentPanDirection.value = direction;
  panImageImmediate(direction);
  panIntervalId.value = setInterval(() => {
    if (currentPanDirection.value) {
      panImageImmediate(currentPanDirection.value);
    }
  }, PAN_INTERVAL_DELAY) as unknown as number;
};

const stopContinuousPan = () => {
  if (panIntervalId.value !== null) {
    clearInterval(panIntervalId.value);
    panIntervalId.value = null;
  }
  currentPanDirection.value = null;
};

const handleImageLoad = () => {
  nextTick(() => {
    centerImage();
  });
};
const handleImageError = () => {
  console.error("Gagal memuat gambar peta.");
};

onMounted(() => {
  const imgElement = image.value;
  if (imgElement) {
    if (imgElement.complete && imgElement.naturalWidth > 0) {
      handleImageLoad();
    } else {
      imgElement.addEventListener("load", handleImageLoad);
      imgElement.addEventListener("error", handleImageError);
    }
  }

  if (container.value) {
    container.value.style.cursor = "grab";
  }
});

onBeforeUnmount(() => {
  const imgElement = image.value;
  if (imgElement) {
    imgElement.removeEventListener("load", handleImageLoad);
    imgElement.removeEventListener("error", handleImageError);
  }
  if (container.value) {
    container.value.style.cursor = "";
  }
  stopContinuousPan();
});
</script>

<style scoped>
.pan-button {
  @apply p-1 bg-white rounded-full shadow-md active:bg-gray-200 aspect-square flex justify-center items-center text-xl;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
</style>
