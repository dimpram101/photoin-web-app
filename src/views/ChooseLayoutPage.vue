<script setup lang="ts">
import { STRIP_LAYOUTS, StripLayout } from '@/lib/strip_layout';
import { usePhotoboothStore } from '@/stores/storePhotobooth';
import { useRouter } from 'vue-router';

const photoboothStore = usePhotoboothStore();
const router = useRouter();

function selectLayout(layout: StripLayout) {
  photoboothStore.setSelectedLayout(layout);
  router.push({ name: 'photo-session'})
}
</script>

<template>
  <div class="relative mx-auto flex h-full w-[90vw] max-w-7xl flex-col pt-32 pb-16">
    <div class="mx-auto w-full max-w-6xl">
      <div class="mb-6 text-center">
        <span
          class="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-4 py-1.5 text-xs font-semibold tracking-wide text-blue-700 uppercase shadow-sm ring-1 ring-blue-200/70"
        >
          Choose Layout
        </span>
      </div>

      <div class="text-center">
        <h1 class="font-poppins text-4xl leading-[1.08] font-extrabold tracking-tight text-slate-900 md:text-5xl">
          Pick your photo layout
        </h1>
        <h2
          class="mt-2 bg-linear-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text font-poppins text-4xl leading-[1.08] font-extrabold tracking-tight text-transparent md:text-5xl"
        >
          and start snapping
        </h2>
        <p class="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-slate-600/90 md:text-lg">
          Choose one of the layouts below.
        </p>
      </div>

      <div class="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="layout in STRIP_LAYOUTS"
          :key="layout.id"
          class="flex cursor-pointer flex-col rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur transition hover:scale-[1.02]"
          @click="selectLayout(layout)"
        >
          <div class="flex flex-1 flex-col items-center justify-center">
            <img
              :src="layout.preview_image_url"
              :alt="layout.title"
              class="mx-auto mb-4 h-auto max-w-full rounded-md border border-gray-300 shadow-sm"
            />
          </div>
          <p for="">
            {{ layout.title }}
          </p>
          <p for="">
            {{ layout.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
