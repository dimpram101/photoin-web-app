<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { StripLayout } from '@/lib/strip_layout';
import { FlipHorizontal, Grid, Sparkle, X } from 'lucide-vue-next';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
  onCapture: (photoUrl: string) => void;
  selectedLayout: StripLayout;
  onClose: () => void;
}>();

const filters = [
  { name: 'Normal', value: 'none' },
  { name: 'Vintage', value: 'sepia(0.4) contrast(1.2) brightness(0.9)' },
  { name: 'Grayscale', value: 'grayscale(1)' },
  { name: 'Smooth', value: 'contrast(0.9) brightness(1.1) blur(0.5px)' },
  { name: 'B&W', value: 'grayscale(1) contrast(1.2)' },
  { name: 'Cyber', value: 'saturate(2) hue-rotate(180deg) contrast(1.1)' },
  { name: 'Bittersweet', value: 'contrast(1.1) brightness(1.1) sepia(0.3) saturate(1.5)' },
  { name: 'OG Vintage', value: 'sepia(0.6) contrast(1.3) brightness(0.8)' },
  { name: 'Fresh', value: 'brightness(1.1) contrast(1.1) saturate(1.2)' },
  { name: 'Citrus', value: 'sepia(0.3) saturate(2) hue-rotate(20deg)' },
  { name: '2015', value: 'sepia(0.2) contrast(1.1) saturate(1.1)' },
  { name: 'Focus', value: 'contrast(1.2) brightness(1.1)' },
  { name: 'Candy', value: 'brightness(1.1) saturate(1.5) hue-rotate(-10deg)' },
  { name: '80s', value: 'contrast(1.1) brightness(1.1) saturate(1.5) sepia(0.2)' },
];

const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const stream = ref<MediaStream | null>(null);

const timer = ref<number>(3);
const showGrid = ref<boolean>(false);
const showFilterOptions = ref<boolean>(false);
const activeFilter = ref<{ name: string; value: string } | null>(filters[0]);
const isCountingDown = ref<boolean>(false);
const countdown = ref<number | null>(null);
const isFlashing = ref<boolean>(false);
const isMirrored = ref<boolean>(true);

function startCountdown() {
  if (isCountingDown.value) return;

  isCountingDown.value = true;
  countdown.value = timer.value;

  let countdownInterval = setInterval(() => {
    countdown.value -= 1;

    if (countdown.value <= 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      isCountingDown.value = false;
      countdown.value = 0;
      takePhoto();
    }
  }, 1000);
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function takePhoto() {
  if (!videoRef.value) return;

  const canvas = canvasRef.value;
  const video = videoRef.value;
  const ctx = canvas?.getContext('2d');

  if (!canvas || !ctx) return;

  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  const containerRect = video.parentElement?.getBoundingClientRect();
  const containerWidth = containerRect?.width || videoWidth;
  const containerHeight = containerRect?.height || videoHeight;

  const videoAspectRatio = videoWidth / videoHeight;
  const containerAspectRatio = containerWidth / containerHeight;

  let renderWidth, renderHeight, offsetX, offsetY;

  if (containerAspectRatio > videoAspectRatio) {
    renderWidth = videoWidth;
    renderHeight = videoWidth / containerAspectRatio;
    offsetX = 0;
    offsetY = (videoHeight - renderHeight) / 2;
  } else {
    renderWidth = videoHeight * containerAspectRatio;
    renderHeight = videoHeight;
    offsetX = (videoWidth - renderWidth) / 2;
    offsetY = 0;
  }

  canvas.width = renderWidth;
  canvas.height = renderHeight;

  ctx.filter = activeFilter.value.value;

  isFlashing.value = true;
  await nextTick();
  await sleep(500);

  try {
    // Mirror the image if needed
    if (!isMirrored.value) {
      ctx.translate(renderWidth, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, offsetX, offsetY, renderWidth, renderHeight, 0, 0, renderWidth, renderHeight);

    const photoDataUrl = canvas.toDataURL('image/png', 0.9);
    console.log('Photo captured:', photoDataUrl);
    props.onCapture(photoDataUrl);
  } finally {
    setTimeout(() => {
      isFlashing.value = false;
    }, 120);
  }
}

async function startCamera() {
  try {
    // Ask for camera permission first
    await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    // Try with facingMode: 'user'
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    stream.value = mediaStream;
    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream;
      videoRef.value.play();
    }
  } catch (error) {
    console.error('Error accessing camera:', error);
    // Fallback to default video if facingMode fails
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      stream.value = mediaStream;
      if (videoRef.value) {
        videoRef.value.srcObject = mediaStream;
        videoRef.value.play();
      }
    } catch (err) {
      console.error('Error accessing camera with default video:', err);
    }
  }
}

function stopCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
    stream.value = null;
  }
}

onMounted(() => {
  startCamera();
});

onUnmounted(() => {
  stopCamera();
});

function getCameraContainerStyle() {
  const baseStyle = { width: '100%', 'max-width': '100%' };

  switch (props.selectedLayout.type) {
    case 'strip-4':
      return { ...baseStyle, 'aspect-ratio': '4/3' };
    case 'grid-6':
      return { ...baseStyle, 'aspect-ratio': '1/1', 'max-width': '500px' };
    case 'strip-2':
      return { ...baseStyle, 'aspect-ratio': '2/3', 'max-width': '420px' };
    case 'grid-4':
      return { ...baseStyle, 'aspect-ratio': '2/3', 'max-width': '420px' };
    default:
      return { ...baseStyle, 'aspect-ratio': '3/2' };
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isFlashing"
      class="pointer-events-none fixed inset-0 z-9999 bg-white opacity-95 transition-opacity duration-200"
    ></div>
  </Teleport>

  <div class="rounded-lg bg-white p-2 sm:p-4">
    <div class="relative flex w-full flex-col items-center justify-center bg-black">
      <div
        class="pointer-events-none absolute top-4 right-4 left-4 z-10 flex items-center justify-between opacity-0"
      ></div>

      <div class="relative mx-auto w-full overflow-hidden" :style="getCameraContainerStyle()">
        <video
          ref="videoRef"
          autoplay
          playsinline
          muted
          class="h-full w-full object-cover"
          :style="{
            transform: isMirrored ? 'scaleX(-1)' : 'none',
            filter: activeFilter ? activeFilter.value : filters[0].value,
          }"
        />

        <button
          @click="props.onClose()"
          class="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 p-1 text-white shadow-md transition hover:bg-black/60"
          aria-label="Close Camera"
        >
          <X class="h-5 w-5" />
        </button>

        <div
          v-if="countdown !== null && isCountingDown"
          class="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
        >
          <div className="text-center">
            <div className="text-8xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] animate-pulse">
              {{ countdown }}
            </div>
          </div>
        </div>

        <div class="pointer-events-none absolute inset-0 z-10" v-if="showGrid">
          <div class="absolute top-1/3 left-0 h-px w-full bg-white/50 shadow-sm"></div>
          <div class="absolute top-2/3 left-0 h-px w-full bg-white/50 shadow-sm"></div>
          <div class="absolute top-0 left-1/3 h-full w-px bg-white/50 shadow-sm"></div>
          <div class="absolute top-0 left-2/3 h-full w-px bg-white/50 shadow-sm"></div>
        </div>

        <div class="absolute bottom-6 z-20 flex w-full items-center justify-between px-6">
          <!-- Time Selector -->
          <div
            class="flex flex-1 justify-start transition-opacity duration-300"
            :class="isCountingDown ? 'pointer-events-none opacity-0' : 'opacity-100'"
          >
            <div class="flex rounded-full border border-white/20 bg-black/40 p-1 backdrop-blur-md">
              <button
                v-for="x in [1, 3, 5, 10]"
                :key="x"
                @click="timer = x"
                :class="timer === x ? 'bg-white/30' : 'bg-transparent'"
                class="h-8 w-8 cursor-pointer rounded-full text-xs font-bold text-white transition-all hover:bg-white/20"
              >
                {{ x }}s
              </button>
            </div>
          </div>
          <!-- Capture Button (Center) -->
          <div class="flex flex-1 justify-center">
            <button
              @click="startCountdown"
              :disabled="isCountingDown"
              class="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-white/80 shadow-lg transition-all hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Capture"
            >
              <span class="block h-10 w-10 rounded-full border-2 border-gray-300 bg-white/90"></span>
            </button>
          </div>

          <!-- filter toggle (right) -->
          <div
            class="flex flex-1 items-center justify-end gap-2 transition-opacity duration-300"
            :class="isCountingDown ? 'pointer-events-none opacity-0' : 'opacity-100'"
          >
            <!-- mirror toggle -->
            <button
              @click="isMirrored = !isMirrored"
              class="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 p-1 text-white shadow-md transition hover:bg-black/60"
              :class="isMirrored ? 'ring-2 ring-white' : ''"
              aria-label="Toggle Mirror"
            >
              <FlipHorizontal class="h-5 w-5" />
            </button>

            <!-- Grid Toggle -->
            <button
              @click="showGrid = !showGrid"
              class="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 p-1 text-white shadow-md transition hover:bg-black/60"
              :class="showGrid ? 'ring-2 ring-white' : ''"
              aria-label="Toggle Grid Overlay"
            >
              <Grid class="h-5 w-5" />
            </button>

            <!-- filter toggle -->
            <button
              @click="showFilterOptions = !showFilterOptions"
              class="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 p-1 text-white shadow-md transition hover:bg-black/60"
              :class="showFilterOptions ? 'ring-2 ring-white' : ''"
              aria-label="Toggle Filter Options"
            >
              <Sparkle class="h-5 w-5" />
            </button>
          </div>

          <div
            v-if="showFilterOptions"
            class="animate-in slide-in-from-bottom-5 absolute bottom-28 left-1/2 z-30 -translate-x-1/2 transform duration-200"
          >
            <div
              class="grid grid-cols-7 grid-rows-2 gap-3 rounded-2xl border border-white/30 bg-white/20 p-2 shadow-lg backdrop-blur-md"
              style="width: 340px; max-width: 95vw"
            >
              <button
                v-for="filter in filters"
                :key="filter.name"
                @click="activeFilter = filter"
                class="relative h-10 w-10 overflow-hidden rounded-full border-2 transition-transform hover:scale-110"
                :class="
                  activeFilter && activeFilter.name === filter.name
                    ? 'scale-110 border-blue-500 ring-2 ring-blue-500/50'
                    : 'border-white'
                "
                :title="filter.name"
              >
                <img
                  src="https://images.unsplash.com/photo-1600567494125-2d7fc89962ca?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  :alt="filter.name"
                  class="h-full w-full object-cover"
                  :style="{ filter: filter.value }"
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <canvas ref="canvasRef" class="hidden" />
    </div>
  </div>
</template>
