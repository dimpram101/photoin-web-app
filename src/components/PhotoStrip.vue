<script setup lang="ts">
import { type Photo } from '@/lib/photo';
import { type StripLayout } from '@/lib/strip_layout';
import { usePhotoboothStore } from '@/stores/storePhotobooth';
import { Image, X } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const props = defineProps<{
  selectedLayout: StripLayout;
  photos: Photo[];
  onDeletePhoto: (photoId: string) => void;
}>();

const photoboothStore = usePhotoboothStore();
const { selectedColor, placedStickers } = storeToRefs(photoboothStore);
const { updateSticker, removeSticker } = photoboothStore;

const draggingSticker = ref<string | null>(null);
const resizingSticker = ref<string | null>(null);
const rotatingSticker = ref<string | null>(null);
const dragOffset = ref({ x: 0, y: 0 });
const initialSize = ref({ width: 0, height: 0 });
const initialRotation = ref(0);
const rotationCenter = ref({ x: 0, y: 0 });
const containerRef = ref<HTMLElement | null>(null);

function onMouseDown(stickerId: string, event: MouseEvent) {
  draggingSticker.value = stickerId;
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();

  dragOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  event.preventDefault();
}

function onMouseMove(event: MouseEvent) {
  if (!draggingSticker.value || !containerRef.value) return;

  const sticker = placedStickers.value.find((s) => s.id === draggingSticker.value);
  if (!sticker) return;

  const containerRect = containerRef.value.getBoundingClientRect();
  const x = ((event.clientX - containerRect.left - dragOffset.value.x) / containerRect.width) * 100;
  const y = ((event.clientY - containerRect.top - dragOffset.value.y) / containerRect.height) * 100;

  // Calculate sticker size in percentage
  const stickerWidthPercent = (sticker.width / containerRect.width) * 100;
  const stickerHeightPercent = (sticker.height / containerRect.height) * 100;

  // Allow sticker to go halfway out of bounds on each side
  const minX = -(stickerWidthPercent / 2);
  const maxX = 100 - (stickerWidthPercent / 2);
  const minY = -(stickerHeightPercent / 2);
  const maxY = 100 - (stickerHeightPercent / 2);

  const clampedX = Math.max(minX, Math.min(maxX, x));
  const clampedY = Math.max(minY, Math.min(maxY, y));

  updateSticker(draggingSticker.value, { x: clampedX, y: clampedY });
}

function onMouseUp() {
  draggingSticker.value = null;
  resizingSticker.value = null;
  rotatingSticker.value = null;
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('mousemove', onResizeMove);
  document.removeEventListener('mouseup', onResizeUp);
  document.removeEventListener('mousemove', onRotateMove);
  document.removeEventListener('mouseup', onRotateUp);
}

// Resize handlers
function onResizeStart(stickerId: string, event: MouseEvent) {
  event.stopPropagation();
  resizingSticker.value = stickerId;

  const sticker = placedStickers.value.find((s) => s.id === stickerId);
  if (sticker) {
    initialSize.value = { width: sticker.width, height: sticker.height };
    dragOffset.value = { x: event.clientX, y: event.clientY };
  }

  document.addEventListener('mousemove', onResizeMove);
  document.addEventListener('mouseup', onResizeUp);
  event.preventDefault();
}

function onResizeMove(event: MouseEvent) {
  if (!resizingSticker.value) return;

  const deltaX = event.clientX - dragOffset.value.x;
  const deltaY = event.clientY - dragOffset.value.y;

  // Use the larger delta to maintain aspect ratio
  const delta = Math.max(deltaX, deltaY);

  const newWidth = Math.max(30, initialSize.value.width + delta);
  const newHeight = Math.max(30, initialSize.value.height + delta);

  updateSticker(resizingSticker.value, { width: newWidth, height: newHeight });
}

function onResizeUp() {
  resizingSticker.value = null;
  document.removeEventListener('mousemove', onResizeMove);
  document.removeEventListener('mouseup', onResizeUp);
}

// Rotate handlers
function onRotateStart(stickerId: string, event: MouseEvent) {
  event.stopPropagation();
  rotatingSticker.value = stickerId;

  const sticker = placedStickers.value.find((s) => s.id === stickerId);
  if (sticker && containerRef.value) {
    const target = (event.currentTarget as HTMLElement).parentElement;
    if (target) {
      const rect = target.getBoundingClientRect();
      rotationCenter.value = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };

      initialRotation.value = sticker.rotation;
      const angle = Math.atan2(
        event.clientY - rotationCenter.value.y,
        event.clientX - rotationCenter.value.x
      );
      dragOffset.value = { x: angle * (180 / Math.PI), y: 0 };
    }
  }

  document.addEventListener('mousemove', onRotateMove);
  document.addEventListener('mouseup', onRotateUp);
  event.preventDefault();
}

function onRotateMove(event: MouseEvent) {
  if (!rotatingSticker.value) return;

  const angle = Math.atan2(
    event.clientY - rotationCenter.value.y,
    event.clientX - rotationCenter.value.x
  );
  const currentAngle = angle * (180 / Math.PI);
  const rotation = initialRotation.value + (currentAngle - dragOffset.value.x);

  updateSticker(rotatingSticker.value, { rotation });
}

function onRotateUp() {
  rotatingSticker.value = null;
  document.removeEventListener('mousemove', onRotateMove);
  document.removeEventListener('mouseup', onRotateUp);
}

function getLayoutGrid() {
  switch (props.selectedLayout.type) {
    case 'strip-4':
      return 'grid-cols-1 grid-rows-4';
    case 'strip-2':
      return 'grid-cols-1 grid-rows-2';
    case 'grid-4':
      return 'grid-cols-2 grid-rows-2';
    case 'grid-6':
      return 'grid-cols-2 grid-rows-3';
    default:
      return 'grid-cols-1 grid-rows-4';
  }
}
</script>

<template>
  <div class="bg-transparent">
    <div
      ref="containerRef"
      class="relative mx-auto overflow-hidden shadow-lg"
      :style="`aspect-ratio: ${props.selectedLayout.aspect_ratio}; width: 100%`"
    >
      <div class="z-0 flex h-full flex-col">
        <div class="grid min-h-0 grow gap-1 p-4" :class="getLayoutGrid()">
          <div
            v-for="(photo, index) in props.selectedLayout.photo_count"
            :key="props.photos[index]?.id || index"
            class="relative h-full w-full overflow-hidden"
          >
            <template v-if="props.photos[index]">
              <img
                :src="props.photos[index].dataUrl"
                :alt="`Photo ${index + 1}`"
                class="photo-image h-full w-full border-2 border-white/20 object-cover shadow-sm"
                style="transform: scaleX(-1)"
              />
              <button
                @click="props.onDeletePhoto(props.photos[index].id)"
                class="absolute top-2 right-2 z-10 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-red-500"
                data-export-exclude="true"
              >
                <X class="h-3 w-3" />
              </button>
            </template>
            <template v-else>
              <div
                class="flex h-full w-full items-center justify-center border-2 border-dashed border-black/10 bg-black/5"
              >
                <Image class="h-6 w-6 text-black/20" />
              </div>
            </template>
          </div>
        </div>
        <div class="pb-2 text-center">
          <p
            :class="`font-serif tracking-wider ${selectedColor.labelColor} italic`"
            style="text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); font-size: 6px"
          >
            PhotoIn
          </p>
        </div>
      </div>

      <!-- Stickers Layer -->
      <div
        v-for="sticker in placedStickers"
        :key="sticker.id"
        class="absolute select-none group"
        :style="{
          left: `${sticker.x}%`,
          top: `${sticker.y}%`,
          width: `${sticker.width}px`,
          height: `${sticker.height}px`,
          transform: `rotate(${sticker.rotation}deg)`,
          zIndex: 10,
        }"
      >
        <div class="relative w-full h-full cursor-move" @mousedown="(e) => onMouseDown(sticker.id, e)">
          <img
            :src="sticker.url"
            :alt="`Sticker ${sticker.stickerId}`"
            class="h-full w-full object-contain pointer-events-none select-none"
            draggable="false"
          />

          <!-- Delete button -->
          <button
            @click.stop="removeSticker(sticker.id)"
            class="absolute -top-2 -right-2 z-20 rounded-full bg-red-500 p-1 text-white shadow-lg transition-colors hover:bg-red-600 opacity-0 group-hover:opacity-100"
            data-export-exclude="true"
          >
            <X class="h-3 w-3" />
          </button>

          <!-- Resize handle (bottom-right corner) -->
          <div
            @mousedown.stop="(e) => onResizeStart(sticker.id, e)"
            class="absolute -bottom-2 -right-2 z-20 w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity"
            data-export-exclude="true"
          >
            <div class="absolute inset-0 flex items-center justify-center">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            </div>
          </div>

          <!-- Rotate handle (bottom-left corner) -->
          <div
            @mousedown.stop="(e) => onRotateStart(sticker.id, e)"
            class="absolute -bottom-2 -left-2 z-20 w-6 h-6 bg-green-500 rounded-full border-2 border-white shadow-lg cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
            data-export-exclude="true"
          >
            <div class="absolute inset-0 flex items-center justify-center">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
