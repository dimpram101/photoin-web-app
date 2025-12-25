<script setup lang="ts">
import { Download, RotateCcw, Upload } from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import Camera from '@/components/Camera.vue';
import PhotoStrip from '@/components/PhotoStrip.vue';
import {
  BACKGROUND_COLORS,
  FILTERS,
  usePhotoSessionStore,
  type BackgroundColor,
  type PhotoFilterName,
  type TimerSeconds,
} from '@/stores/photoSession';

const router = useRouter();
const photoSessionStore = usePhotoSessionStore();

const stripRef = ref<InstanceType<typeof PhotoStrip> | null>(null);
const showCamera = ref(true);
const lastError = ref<string | null>(null);

const selectedLayout = computed(() => photoSessionStore.selectedLayout);
const progressText = computed(() => photoSessionStore.progressText);
const isComplete = computed(() => photoSessionStore.isComplete);

const captureAspect = computed(() => selectedLayout.value?.aspectRatio ?? 3 / 2);

onMounted(async () => {
  if (!photoSessionStore.selectedLayoutType) {
    await router.replace({ name: 'choose-layout' });
    return;
  }

  // If user comes back after completion, keep camera closed.
  showCamera.value = !isComplete.value;
});

const closeCameraIfComplete = () => {
  if (photoSessionStore.isComplete) {
    showCamera.value = false;
  }
};

const onCaptured = (dataUrl: string) => {
  photoSessionStore.addPhoto(dataUrl);
  closeCameraIfComplete();
};

const onUpload = async (ev: Event) => {
  const input = ev.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const dataUrl = await fileToDataUrl(file);
  const cropped = await cropToAspect(dataUrl, captureAspect.value, photoSessionStore.filterValue);
  photoSessionStore.addPhoto(cropped);
  closeCameraIfComplete();
  input.value = '';
};

const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });

const cropToAspect = async (dataUrl: string, aspect: number, filter: string) => {
  const img = new Image();
  img.src = dataUrl;
  await img.decode();

  const iw = img.width;
  const ih = img.height;
  const current = iw / ih;

  let sx = 0;
  let sy = 0;
  let sw = iw;
  let sh = ih;

  if (current > aspect) {
    sw = Math.floor(ih * aspect);
    sx = Math.floor((iw - sw) / 2);
  } else {
    sh = Math.floor(iw / aspect);
    sy = Math.floor((ih - sh) / 2);
  }

  const maxSide = 1200;
  const outW = aspect >= 1 ? maxSide : Math.round(maxSide * aspect);
  const outH = aspect >= 1 ? Math.round(maxSide / aspect) : maxSide;
  const canvas = document.createElement('canvas');
  canvas.width = outW;
  canvas.height = outH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;

  ctx.filter = filter;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);
  return canvas.toDataURL('image/png');
};

const setFilter = (name: PhotoFilterName) => {
  photoSessionStore.setFilter(name);
};

const setTimer = (seconds: TimerSeconds) => {
  photoSessionStore.setTimer(seconds);
};

const setBackgroundColor = (color: BackgroundColor) => {
  photoSessionStore.setBackgroundColor(color);
};

const onBackgroundUpload = async (ev: Event) => {
  const input = ev.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const dataUrl = await fileToDataUrl(file);
  photoSessionStore.setBackgroundImage(dataUrl);
  input.value = '';
};

const onTemplateUpload = async (ev: Event) => {
  const input = ev.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const dataUrl = await fileToDataUrl(file);
  photoSessionStore.setTemplateImage(dataUrl);
  input.value = '';
};

const stickerSources = [
  '/icons/cat.png',
  '/icons/flower.png',
  '/icons/hedgehog.png',
  '/icons/teddy-bear.png',
  '/icons/sticker22.png',
];

const retake = () => {
  photoSessionStore.clearPhotos();
  showCamera.value = true;
};

const download = async () => {
  await stripRef.value?.downloadPng();
};
</script>

<template>
  <div class="relative mx-auto flex h-full w-[90vw] max-w-7xl flex-col pt-24 pb-10 lg:pt-24">
    <div class="mx-auto w-full max-w-6xl">
      <div class="mb-4 text-center">
        <span
          class="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700 uppercase shadow-sm ring-1 ring-blue-200/70"
        >
          Photo Session
        </span>
      </div>

      <div class="text-center">
        <h1 class="font-poppins text-3xl leading-[1.08] font-extrabold tracking-tight text-slate-900 md:text-4xl">
          Capture your set
        </h1>
        <h2
          class="mt-2 bg-linear-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text font-poppins text-3xl leading-[1.08] font-extrabold tracking-tight text-transparent md:text-4xl"
        >
          {{ selectedLayout.title }}
        </h2>
        <p class="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-slate-600/90 md:text-base">
          Progress: <span class="font-semibold text-slate-700">{{ progressText }}</span>
        </p>
      </div>

      <div class="mt-7 grid grid-cols-1 gap-3 lg:grid-cols-12">
        <!-- LEFT: Sticky preview -->
        <div class="lg:col-span-5">
          <div class="lg:sticky lg:top-20">
            <PhotoStrip
              ref="stripRef"
              :layout="selectedLayout"
              :photos="photoSessionStore.photos"
              :background-color="photoSessionStore.backgroundColor"
              :background-image-data-url="photoSessionStore.backgroundImageDataUrl"
              :template-image-data-url="photoSessionStore.templateImageDataUrl"
              :stickers="photoSessionStore.stickers"
              :active-sticker-id="photoSessionStore.activeStickerId"
              @remove-photo="photoSessionStore.removePhoto"
              @set-active-sticker="photoSessionStore.setActiveSticker"
              @update-sticker="photoSessionStore.updateSticker"
              @delete-sticker="photoSessionStore.deleteSticker"
            />

            <div class="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                @click="download"
              >
                <Download class="h-4.5 w-4.5" />
                Download
              </button>
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-white/70 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                @click="retake"
              >
                <RotateCcw class="h-4.5 w-4.5" />
                Retake
              </button>
            </div>
          </div>
        </div>

        <!-- RIGHT: Controls -->
        <div class="lg:col-span-7">
          <div class="grid grid-cols-1 gap-3">
            <!-- A. Photo Capture -->
            <section class="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="font-poppins text-lg font-bold text-slate-900">Photo Capture</h3>
                  <p class="mt-1 text-sm text-slate-600">Live camera view or upload photos.</p>
                </div>
                <div class="text-sm font-semibold text-slate-700">
                  {{ photoSessionStore.photos.length }}/{{ selectedLayout.photoCount }}
                </div>
              </div>

              <div
                v-if="lastError"
                class="mt-4 rounded-xl bg-rose-50/70 p-4 text-sm text-rose-700 ring-1 ring-rose-200"
              >
                {{ lastError }}
              </div>

              <div class="mt-3 grid grid-cols-1 gap-3">
                <Camera
                  v-if="showCamera"
                  :is-active="showCamera && !isComplete"
                  :filter-name="photoSessionStore.filterName"
                  :filter-value="photoSessionStore.filterValue"
                  :show-grid="photoSessionStore.showGridOverlay"
                  :timer-seconds="photoSessionStore.timerSeconds"
                  :facing-mode="photoSessionStore.facingMode"
                  :capture-aspect="captureAspect"
                  @captured="onCaptured"
                  @error="(m) => (lastError = m)"
                  @close="showCamera = false"
                  @set-filter="photoSessionStore.setFilter"
                  @set-timer="photoSessionStore.setTimer"
                  @toggle-grid="photoSessionStore.toggleGridOverlay"
                />

                <div class="rounded-2xl bg-white/70 p-3 shadow-sm ring-1 ring-slate-200">
                  <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div>
                      <label class="text-xs font-semibold text-slate-600">Filter</label>
                      <select
                        class="mt-1 w-full rounded-xl bg-white/80 px-3 py-1.5 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        :value="photoSessionStore.filterName"
                        @change="setFilter(($event.target as HTMLSelectElement).value as PhotoFilterName)"
                      >
                        <option v-for="f in FILTERS" :key="f.name" :value="f.name">{{ f.name }}</option>
                      </select>
                    </div>

                    <div>
                      <label class="text-xs font-semibold text-slate-600">Timer</label>
                      <div class="mt-1 grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          class="rounded-xl bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
                          :class="photoSessionStore.timerSeconds === 0 ? 'ring-2 ring-blue-400' : ''"
                          @click="setTimer(0)"
                        >
                          0s
                        </button>
                        <button
                          type="button"
                          class="rounded-xl bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
                          :class="photoSessionStore.timerSeconds === 3 ? 'ring-2 ring-blue-400' : ''"
                          @click="setTimer(3)"
                        >
                          3s
                        </button>
                        <button
                          type="button"
                          class="rounded-xl bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
                          :class="photoSessionStore.timerSeconds === 5 ? 'ring-2 ring-blue-400' : ''"
                          @click="setTimer(5)"
                        >
                          5s
                        </button>
                      </div>
                    </div>

                    <div class="md:col-span-2">
                      <div class="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          class="inline-flex items-center justify-center rounded-xl bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
                          :class="photoSessionStore.showGridOverlay ? 'ring-2 ring-blue-400' : ''"
                          @click="photoSessionStore.toggleGridOverlay"
                        >
                          Grid overlay
                        </button>
                        <button
                          type="button"
                          class="inline-flex items-center justify-center rounded-xl bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
                          @click="photoSessionStore.toggleFacingMode"
                        >
                          {{ photoSessionStore.facingMode === 'user' ? 'Front camera' : 'Back camera' }}
                        </button>

                        <label
                          class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
                        >
                          <Upload class="h-4 w-4" />
                          Upload photo
                          <input type="file" accept="image/*" class="hidden" @change="onUpload" />
                        </label>

                        <button
                          v-if="!showCamera && !isComplete"
                          type="button"
                          class="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-1.5 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700"
                          @click="showCamera = true"
                        >
                          Open camera
                        </button>
                      </div>

                      <p class="mt-2 text-xs text-slate-500">
                        Camera auto-closes when you reach {{ selectedLayout.photoCount }} photos.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <!-- B. Background Customization -->
            <section class="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur">
              <h3 class="font-poppins text-lg font-bold text-slate-900">Background</h3>
              <p class="mt-1 text-sm text-slate-600">Pick a preset color or upload a custom image.</p>

              <div class="mt-3 grid grid-cols-7 gap-2">
                <button
                  v-for="c in BACKGROUND_COLORS"
                  :key="c"
                  type="button"
                  class="h-9 w-9 rounded-full shadow-sm ring-2 ring-transparent transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  :style="{ backgroundColor: c }"
                  :class="
                    photoSessionStore.backgroundColor === c && !photoSessionStore.backgroundImageDataUrl
                      ? 'ring-blue-500'
                      : 'ring-transparent'
                  "
                  :aria-label="`Set background color ${c}`"
                  @click="setBackgroundColor(c)"
                />
              </div>

              <div class="mt-4 flex flex-wrap items-center gap-2">
                <label
                  class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
                >
                  <Upload class="h-4 w-4" />
                  Upload background
                  <input type="file" accept="image/*" class="hidden" @change="onBackgroundUpload" />
                </label>
                <button
                  v-if="photoSessionStore.backgroundImageDataUrl"
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
                  @click="photoSessionStore.setBackgroundImage(null)"
                >
                  Remove background image
                </button>
              </div>
            </section>

            <!-- Templates (paper texture placeholder) -->
            <section class="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur">
              <h3 class="font-poppins text-lg font-bold text-slate-900">Paper Templates</h3>
              <p class="mt-1 text-sm text-slate-600">You’ll add presets later. For now, you can upload one.</p>

              <div class="mt-4 flex flex-wrap items-center gap-2">
                <label
                  class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
                >
                  <Upload class="h-4 w-4" />
                  Upload template
                  <input type="file" accept="image/*" class="hidden" @change="onTemplateUpload" />
                </label>
                <button
                  v-if="photoSessionStore.templateImageDataUrl"
                  type="button"
                  class="inline-flex items-center justify-center rounded-xl bg-white/80 px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
                  @click="photoSessionStore.setTemplateImage(null)"
                >
                  Remove template
                </button>
              </div>
            </section>

            <!-- C. Stickers -->
            <section class="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="font-poppins text-lg font-bold text-slate-900">Stickers</h3>
                  <p class="mt-1 text-sm text-slate-600">Tap to add, then drag in preview.</p>
                </div>
                <div class="text-xs font-semibold text-slate-500">Scrollable</div>
              </div>

              <div class="mt-3 max-h-36 overflow-auto rounded-xl bg-white/60 p-2 ring-1 ring-slate-200">
                <div class="grid grid-cols-6 gap-2 sm:grid-cols-8">
                  <button
                    v-for="src in stickerSources"
                    :key="src"
                    type="button"
                    class="flex aspect-square items-center justify-center rounded-xl bg-white/70 p-2 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-white"
                    :aria-label="`Add sticker ${src}`"
                    @click="photoSessionStore.addSticker(src)"
                  >
                    <img :src="src" alt="Sticker" class="h-full w-full object-contain" draggable="false" />
                  </button>
                </div>
              </div>

              <p class="mt-3 text-xs text-slate-500">Note: this is a Vue implementation (not react-draggable).</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
