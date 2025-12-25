<script setup lang="ts">
import { Camera } from 'lucide-vue-next';
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

import { usePhotoSessionStore, type PhotoSessionBgId } from '@/stores/photoSession';

type BgOption = {
  id: string;
  label: string;
  className: string;
};

const BG_OPTIONS: Array<BgOption & { id: PhotoSessionBgId }> = [
  { id: 'snow', label: 'Snow', className: 'bg-slate-50' },
  { id: 'sky', label: 'Sky', className: 'bg-blue-50' },
  { id: 'blush', label: 'Blush', className: 'bg-rose-50' },
  { id: 'butter', label: 'Butter', className: 'bg-amber-50' },
  { id: 'mint', label: 'Mint', className: 'bg-emerald-50' },
];

const router = useRouter();
const photoSessionStore = usePhotoSessionStore();

onMounted(async () => {
  if (!photoSessionStore.selectedLayoutType) {
    await router.replace({ name: 'choose-layout' });
  }
});

const selectedLayout = computed(() => photoSessionStore.selectedLayout);
const selectedBgId = computed(() => photoSessionStore.backgroundId);
const selectedBgClass = computed(() => {
  return BG_OPTIONS.find((o) => o.id === selectedBgId.value)?.className ?? 'bg-slate-50';
});

const setBg = (id: PhotoSessionBgId) => {
  photoSessionStore.setBackground(id);
};

const layoutGridClass = computed(() => {
  switch (selectedLayout.value.type) {
    case 'strip-4':
      return 'grid grid-cols-1 grid-rows-4';
    case 'strip-2':
      return 'grid grid-cols-1 grid-rows-2';
    case 'grid-6':
      return 'grid grid-cols-2 grid-rows-3';
    case 'grid-4':
      return 'grid grid-cols-2 grid-rows-2';
    default:
      return 'grid grid-cols-2 grid-rows-2';
  }
});
</script>

<template>
  <div class="relative mx-auto flex h-full w-[90vw] max-w-7xl flex-col pt-32 pb-16">
    <div class="mx-auto w-full">
      <div class="mt-10 flex flex-col gap-4 lg:flex-row">
        <!-- LEFT: Layout Preview -->
        <section class="self-start bg-white/70 py-4 shadow-sm ring-1 ring-slate-200 backdrop-blur lg:w-90">
          <div class="flex justify-center">
            <div
              class="w-full max-w-xs overflow-hidden rounded-2xl shadow-sm ring-1 ring-slate-200"
              :class="[selectedLayout.cssClass, selectedBgClass]"
            >
              <div class="h-full w-full p-4">
                <div class="h-full w-full gap-2" :class="layoutGridClass">
                  <div
                    v-for="n in selectedLayout.photoCount"
                    :key="n"
                    class="flex items-center justify-center rounded-xl bg-white/70 text-xs font-semibold text-slate-400 ring-1 ring-slate-200"
                  >
                    Photo {{ n }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- RIGHT: Choose Background -->
        <section class="flex-1 rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur">
          <div class="mb-2 flex items-center justify-between">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <Camera class="mr-2 h-5 w-5" />
              Take Photos
            </button>
          </div>

          <h3 class="font-poppins text-lg font-bold text-slate-900">Background Color</h3>

          <p class="mt-2 text-sm leading-relaxed text-slate-600">
            Choose a background color for your layout before taking photos.
          </p>

          <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <button
              v-for="opt in BG_OPTIONS"
              :key="opt.id"
              type="button"
              class="group inline-flex items-center gap-3 rounded-xl bg-white/70 px-3 py-3 text-left shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :class="selectedBgId === opt.id ? 'ring-2 ring-blue-400' : ''"
              @click="setBg(opt.id)"
            >
              <span class="h-6 w-6 rounded-lg ring-1 ring-black/5" :class="opt.className" aria-hidden="true" />
              <span class="text-sm font-medium text-slate-800">
                {{ opt.label }}
              </span>
            </button>
          </div>

          <div class="mt-6 rounded-xl bg-blue-50/70 p-4 ring-1 ring-blue-200/70">
            <p class="text-sm text-slate-700">Next step: we can show the camera preview here once you’re ready.</p>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>
