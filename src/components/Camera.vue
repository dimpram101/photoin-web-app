<script setup lang="ts">
import { Grid, MoreHorizontal, Sparkles, X } from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { FILTERS, type PhotoFilterName, type TimerSeconds } from '@/stores/photoSession';

defineOptions({
  name: 'PhotoCamera',
});

type FacingMode = 'user' | 'environment';

type Props = {
  isActive: boolean;
  filterName: PhotoFilterName;
  filterValue: string;
  showGrid: boolean;
  timerSeconds: TimerSeconds;
  facingMode: FacingMode;
  captureAspect: number;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'captured', dataUrl: string): void;
  (e: 'error', message: string): void;
  (e: 'close'): void;
  (e: 'setFilter', name: PhotoFilterName): void;
  (e: 'setTimer', seconds: TimerSeconds): void;
  (e: 'toggleGrid'): void;
}>();

const videoEl = ref<HTMLVideoElement | null>(null);
const streamRef = ref<MediaStream | null>(null);
const isReady = ref(false);
const isStarting = ref(false);
const isCapturing = ref(false);
const countdown = ref<number | null>(null);

const isFlashing = ref(false);
const isCountingDown = ref(false);
const showFilterModal = ref(false);
const showFilterSelector = ref(false);

const previewThumbSrc =
  'https://images.unsplash.com/photo-1600567494125-2d7fc89962ca?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const mirrorClass = computed(() => (props.facingMode === 'user' ? '-scale-x-100' : ''));
const aspectStyle = computed(() => ({ aspectRatio: String(props.captureAspect || 3 / 2) }));

const activeFilter = computed(() => FILTERS.find((f) => f.name === props.filterName) ?? FILTERS[0]);

const timerOptions = computed((): TimerSeconds[] => [3, 5, 10]);

const stopStream = () => {
  isReady.value = false;
  const stream = streamRef.value;
  streamRef.value = null;
  if (!stream) return;
  for (const track of stream.getTracks()) track.stop();
};

const startStream = async () => {
  if (!props.isActive) return;
  if (!videoEl.value) return;

  stopStream();
  isStarting.value = true;

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: props.facingMode },
      audio: false,
    });

    streamRef.value = stream;
    videoEl.value.srcObject = stream;
    await videoEl.value.play();
    isReady.value = true;
  } catch (err) {
    emit('error', err instanceof Error ? err.message : 'Failed to start camera');
  } finally {
    isStarting.value = false;
  }
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const startCountdown = async () => {
  if (!isReady.value || isCapturing.value) return;
  if (isCountingDown.value) return;

  const seconds = props.timerSeconds;
  isCountingDown.value = true;

  if (seconds <= 0) {
    await takePhotoNow();
    isCountingDown.value = false;
    return;
  }

  countdown.value = seconds;
  for (let t = seconds; t >= 1; t--) {
    countdown.value = t;
    await wait(1000);
  }

  countdown.value = 0;
  await wait(120);

  await takePhotoNow();
  countdown.value = null;
  isCountingDown.value = false;
};

const takePhotoNow = async () => {
  if (!videoEl.value || !isReady.value) return;
  if (isCapturing.value) return;

  isCapturing.value = true;
  try {
    const video = videoEl.value;
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (!vw || !vh) return;

    const targetAspect = props.captureAspect || 3 / 2;
    const currentAspect = vw / vh;

    let sx = 0;
    let sy = 0;
    let sw = vw;
    let sh = vh;

    if (currentAspect > targetAspect) {
      // crop sides
      sw = Math.floor(vh * targetAspect);
      sx = Math.floor((vw - sw) / 2);
    } else {
      // crop top/bottom
      sh = Math.floor(vw / targetAspect);
      sy = Math.floor((vh - sh) / 2);
    }

    // Keep output size reasonable for tall ratios.
    const maxSide = 1200;
    const outW = targetAspect >= 1 ? maxSide : Math.round(maxSide * targetAspect);
    const outH = targetAspect >= 1 ? Math.round(maxSide / targetAspect) : maxSide;

    const canvas = document.createElement('canvas');
    canvas.width = outW;
    canvas.height = outH;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.filter = activeFilter.value.value;

    if (props.facingMode === 'user') {
      // mirror to match preview
      ctx.translate(outW, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, outW, outH);

    isFlashing.value = true;
    await wait(200);
    isFlashing.value = false;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    emit('captured', dataUrl);
  } finally {
    isCapturing.value = false;
  }
};

watch(
  () => props.isActive,
  async (active) => {
    if (active) await startStream();
    else stopStream();
  },
  { immediate: true },
);

watch(
  () => props.facingMode,
  async () => {
    if (props.isActive) await startStream();
  },
);

onMounted(async () => {
  if (props.isActive) await startStream();
});

onBeforeUnmount(() => {
  stopStream();
});
</script>

<template>
  <div class="relative flex w-full flex-col items-center justify-center bg-black">
    <div
      class="relative w-full overflow-hidden bg-black"
      :style="aspectStyle"
    >
      <!-- Top overlay (badge + close) -->
      <div class="pointer-events-none absolute top-4 left-4 right-4 z-20 flex items-start justify-between">
        <div
          class="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-sm font-medium text-white backdrop-blur-md ring-1 ring-white/10"
        >
          <span class="relative mr-1 inline-flex h-2.5 w-2.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
            <span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
          </span>
          Live Camera
        </div>

        <button
          type="button"
          class="pointer-events-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-md ring-1 ring-white/10 transition-all hover:bg-white hover:text-black"
          aria-label="Close camera"
          @click="emit('close')"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <video
        ref="videoEl"
        autoplay
        playsinline
        muted
        class="h-full w-full object-cover"
        :class="mirrorClass"
        :style="{ filter: activeFilter.value }"
      />

      <!-- Grid overlay -->
      <div v-if="props.showGrid" aria-hidden="true" class="pointer-events-none absolute inset-0 z-10">
        <div class="absolute top-1/3 left-0 h-px w-full bg-white/40" />
        <div class="absolute top-2/3 left-0 h-px w-full bg-white/40" />
        <div class="absolute top-0 left-1/3 h-full w-px bg-white/40" />
        <div class="absolute top-0 left-2/3 h-full w-px bg-white/40" />
      </div>

      <div
        v-if="isFlashing"
        class="pointer-events-none absolute inset-0 bg-white opacity-70 transition-opacity duration-200"
      />

      <div
        v-if="!isReady"
        class="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold text-white"
      >
        {{ isStarting ? 'Starting camera…' : 'Camera is off' }}
      </div>

      <div
        v-if="countdown !== null"
        class="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      >
        <div class="text-center">
          <div class="animate-pulse text-8xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
            {{ countdown }}
          </div>
        </div>
      </div>

      <!-- Bottom controls -->
      <div class="absolute bottom-6 z-20 w-full px-6">
        <div class="flex items-center justify-between">
          <!-- Timer selector (left) -->
          <div
            class="flex flex-1 justify-start transition-opacity duration-300"
            :class="isCountingDown ? 'pointer-events-none opacity-0' : 'opacity-100'"
          >
            <div class="flex rounded-full bg-black/40 p-1 backdrop-blur-md ring-1 ring-white/20">
              <button
                v-for="t in timerOptions"
                :key="t"
                type="button"
                class="h-8 w-8 rounded-full text-xs font-bold transition-all"
                :class="props.timerSeconds === t ? 'bg-white text-black' : 'text-white hover:bg-white/20'"
                @click="emit('setTimer', t)"
              >
                {{ t }}s
              </button>
            </div>
          </div>

          <!-- Capture button (center) -->
          <div
            class="flex justify-center transition-all duration-300"
            :class="isCountingDown ? 'scale-75 opacity-50' : 'scale-100 opacity-100'"
          >
            <button
              type="button"
              :disabled="!isReady || isCapturing || isCountingDown"
              class="group relative flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg ring-4 ring-gray-200 transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              @click="startCountdown"
            >
              <span class="h-12 w-12 rounded-full bg-red-500 transition-colors group-hover:bg-red-600" />
            </button>
          </div>

          <!-- Filter & grid (right) -->
          <div
            class="flex flex-1 items-center justify-end gap-2 transition-opacity duration-300"
            :class="isCountingDown ? 'pointer-events-none opacity-0' : 'opacity-100'"
          >
            <button
              type="button"
              class="flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md ring-1 ring-white/20 transition-all"
              :class="props.showGrid ? 'bg-white text-black' : 'bg-black/30 text-white hover:bg-white/20'"
              title="Toggle Grid"
              @click="emit('toggleGrid')"
            >
              <Grid class="h-5 w-5" />
            </button>

            <button
              type="button"
              class="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white shadow-lg backdrop-blur-md transition-all hover:bg-white/20"
              :class="showFilterSelector ? 'bg-white text-blue-600' : ''"
              title="Filters"
              @click="showFilterSelector = !showFilterSelector"
            >
              <Sparkles class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Floating filter selector -->
      <div
        v-if="showFilterSelector && !showFilterModal"
        class="absolute bottom-28 left-1/2 z-30 -translate-x-1/2 animate-in slide-in-from-bottom-5 duration-200"
      >
        <div class="flex items-center gap-3 rounded-full border border-white/30 bg-white/20 p-2 shadow-lg backdrop-blur-md">
          <button
            v-for="f in FILTERS.slice(0, 5)"
            :key="f.name"
            type="button"
            class="relative h-10 w-10 overflow-hidden rounded-full border-2 transition-transform hover:scale-110"
            :class="props.filterName === f.name ? 'scale-110 border-blue-500 ring-2 ring-blue-500/50' : 'border-white'"
            :title="f.name"
            @click="emit('setFilter', f.name)"
          >
            <img
              :src="previewThumbSrc"
              :alt="String(f.name)"
              class="h-full w-full object-cover"
              :style="{ filter: f.value }"
              draggable="false"
            />
          </button>

          <div class="mx-1 h-6 w-px bg-white/30" />

          <button
            type="button"
            class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-colors hover:bg-blue-700"
            aria-label="All filters"
            @click="showFilterModal = true"
          >
            <MoreHorizontal class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Filter modal -->
      <div
        v-if="showFilterModal"
        class="absolute inset-0 z-50 flex flex-col rounded-3xl bg-black/80 p-6 backdrop-blur-sm animate-in fade-in duration-200"
      >
        <div class="mb-6 flex items-center justify-between text-white">
          <h3 class="text-xl font-bold">All Filters</h3>
          <button
            type="button"
            class="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
            aria-label="Close filters"
            @click="showFilterModal = false"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <div class="grid grid-cols-4 gap-4 overflow-y-auto pb-4">
          <button
            v-for="f in FILTERS"
            :key="f.name"
            type="button"
            class="group flex flex-col items-center gap-2"
            @click="emit('setFilter', f.name); showFilterModal = false"
          >
            <div
              class="h-16 w-16 overflow-hidden rounded-full border-2 transition-all group-hover:scale-105"
              :class="props.filterName === f.name ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-transparent'"
            >
              <img
                :src="previewThumbSrc"
                :alt="String(f.name)"
                class="h-full w-full object-cover"
                :style="{ filter: f.value }"
                draggable="false"
              />
            </div>
            <span class="text-xs font-medium" :class="props.filterName === f.name ? 'text-blue-400' : 'text-white/80'">
              {{ f.name }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
