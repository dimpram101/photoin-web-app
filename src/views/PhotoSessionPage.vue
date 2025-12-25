<script setup lang="ts">
import Camera from '@/components/Camera.vue';
import PhotoStrip from '@/components/PhotoStrip.vue';
import { Photo } from '@/lib/photo';
import { usePhotoboothStore } from '@/stores/storePhotobooth';
import { Camera as CameraIcon, Download } from 'lucide-vue-next';
import { toPng } from 'html-to-image';
import { nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const { selectedLayout } = usePhotoboothStore();

if (!selectedLayout) {
  router.push({ name: 'choose-layout' });
}

const showCamera = ref(false);
const photos = ref<Photo[]>([]);
const stripRef = ref<HTMLElement | null>(null);
const isDownloading = ref(false);

const onCapture = (dataUrl: string) => {
  const newPhoto: Photo = {
    id: Date.now().toString(),
    dataUrl,
    timestamp: Date.now(),
  };
  photos.value.push(newPhoto);

  if (photos.value.length >= selectedLayout.photo_count) {
    showCamera.value = false;
  }
};

function onDeletePhoto(photoId: string) {
  photos.value = photos.value.filter((photo) => photo.id !== photoId);
}

function onCloseCamera() {
  showCamera.value = false;
}

async function downloadPhotoStrip() {
  if (!selectedLayout) return;
  if (photos.value.length < selectedLayout.photo_count) return;
  if (!stripRef.value) return;

  if (isDownloading.value) return;
  isDownloading.value = true;

  try {
    await nextTick();

    const dataUrl = await toPng(stripRef.value, {
      cacheBust: true,
      pixelRatio: 2,
      filter: (node) => {
        if (!(node instanceof HTMLElement)) return true;
        return node.dataset.exportExclude !== 'true';
      },
    });

    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    const filename = `PhotoIn-${selectedLayout.type}-${timestamp}.png`;

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('Failed to download photo strip:', error);
  } finally {
    isDownloading.value = false;
  }
}
</script>

<template>
  <div v-if="selectedLayout" class="mx-auto mt-32 flex h-full w-full max-w-7xl flex-col">
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
    </div>

    <div class="mt-8 grid grid-cols-1 items-start gap-12 sm:px-6 lg:grid-cols-12 lg:px-0">
      <div class="order-1 lg:order-1 lg:col-span-4">
        <div class="sticky top-24 flex flex-col items-center">
          <div
            class="relative transform overflow-hidden rounded-sm border-[6px] border-white bg-blue-700/50 shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            :class="selectedLayout?.type.includes('strip') ? 'w-55' : 'w-[320px]'"
            ref="stripRef"
          >
            <PhotoStrip :selectedLayout="selectedLayout" :photos="photos" :onDeletePhoto="onDeletePhoto" />
          </div>

          <div class="mt-8 flex w-full justify-center gap-4">
            <button
              class="flex cursor-pointer items-center gap-2 rounded-full bg-blue-400 px-6 py-2 font-semibold text-white shadow-md transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-300"
              @click="downloadPhotoStrip"
              :disabled="isDownloading || photos.length < selectedLayout.photo_count"
            >
              <Download class="h-5 w-5" /> Download
            </button>
            <button
              className="px-6 py-2 rounded-full bg-red-100 text-red-500 font-semibold hover:bg-red-200 transition-colors cursor-pointer"
              @click="photos = []"
            >
              Retake
            </button>
          </div>
        </div>
      </div>

      <div class="order-2 lg:order-2 lg:col-span-8">
        <button
          v-if="!showCamera && photos.length < selectedLayout.photo_count"
          @click="showCamera = true"
          class="mb-8 inline-flex cursor-pointer items-center gap-3 rounded-full bg-blue-100/70 px-5 py-3 font-semibold text-blue-600 shadow-sm ring-1 ring-blue-200 backdrop-blur transition hover:bg-blue-100"
        >
          <CameraIcon class="h-5 w-5 text-blue-500" />
          Take Photos
        </button>

        <div v-if="showCamera" class="mb-4">
          <Camera :selectedLayout="selectedLayout" :onCapture="onCapture" :onClose="onCloseCamera" />
        </div>

        <div class="flex flex-col gap-6">
          <section class="rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur">
            <h3 class="font-poppins text-lg font-bold text-slate-900">Instructions</h3>
            <ol class="mt-4 space-y-2 text-sm text-slate-600">
              <li class="flex gap-3">
                <span
                  class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/70"
                  >1</span
                >
                <span>Position yourself in front of the camera.</span>
              </li>
              <li class="flex gap-3">
                <span
                  class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/70"
                  >2</span
                >
                <span>Click the capture button to take photos.</span>
              </li>
              <li class="flex gap-3">
                <span
                  class="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700 ring-1 ring-blue-200/70"
                  >3</span
                >
                <span>Download your photo strip when finished!</span>
              </li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
