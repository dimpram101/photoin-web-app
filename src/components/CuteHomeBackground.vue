<script setup lang="ts">
import gsap from 'gsap';
import { onBeforeUnmount, onMounted, ref } from 'vue';

const rootEl = ref<HTMLElement | null>(null);
let gsapCtx: gsap.Context | null = null;
let gsapMm: gsap.MatchMedia | null = null;

onMounted(() => {
  if (!rootEl.value) return;

  gsapCtx = gsap.context(() => {
    const q = gsap.utils.selector(rootEl.value as HTMLElement);

    gsapMm = gsap.matchMedia();
    gsapMm.add('(prefers-reduced-motion: no-preference)', () => {
      const stickers = q('[data-sticker]') as HTMLElement[];
      if (!stickers.length) return;

      gsap.set(stickers, {
        transformOrigin: '50% 50%',
        willChange: 'transform',
        force3D: true,
      });

      stickers.forEach((el, index) => {
        const floatDistance = gsap.utils.random(10, 22);
        const swayDistance = gsap.utils.random(6, 14);
        const rotateAmount = gsap.utils.random(1.5, 4);
        const duration = gsap.utils.random(2.8, 4.4);

        gsap.to(el, {
          y: -floatDistance,
          x: swayDistance,
          rotation: `+=${rotateAmount}`,
          duration,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: index * 0.12,
        });
      });
    });
  }, rootEl.value);
});

onBeforeUnmount(() => {
  gsapMm?.revert();
  gsapMm = null;
  gsapCtx?.revert();
  gsapCtx = null;
});
</script>

<template>
  <div ref="rootEl" class="relative h-screen overflow-hidden">
    <!-- Background base -->
    <div aria-hidden="true" class="absolute inset-0 bg-linear-to-br from-slate-50 via-blue-50 to-rose-50" />

    <!-- Soft blobs -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div class="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
      <div class="absolute top-24 -right-24 h-96 w-96 rounded-full bg-rose-200/40 blur-3xl" />
      <div class="absolute -bottom-32 left-1/3 h-112 w-md -translate-x-1/2 rounded-full bg-amber-200/35 blur-3xl" />
    </div>

    <!-- Sticker/photo overlay layer (place your stickers/photos in here) -->
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div
        data-sticker
        class="absolute top-32 left-6 flex h-16 w-16 rotate-[-10deg] items-center justify-center overflow-hidden rounded-2xl bg-white/70 shadow-lg ring-1 ring-black/5 backdrop-blur"
      >
        <img src="/icons/sticker22.png" alt="Sticker" class="h-full w-full object-contain" draggable="false" />
      </div>
      <div
        data-sticker
        class="absolute top-44 right-10 h-20 w-20 rotate-[8deg] rounded-3xl bg-white/70 shadow-lg ring-1 ring-black/5 backdrop-blur"
      >
        <img src="/icons/flower.png" alt="Sticker" class="h-full w-full object-contain p-2" draggable="false" />
      </div>
      <div
        data-sticker
        class="absolute bottom-16 left-10 h-14 w-24 rotate-6 rounded-2xl bg-white/70 shadow-lg ring-1 ring-black/5 backdrop-blur"
      >
        <img src="/icons/cat.png" alt="Sticker" class="h-full w-full object-contain py-1" draggable="false" />
      </div>
      <div
        data-sticker
        class="absolute right-12 bottom-24 h-24 w-16 -rotate-6 rounded-2xl bg-white/70 shadow-lg ring-1 ring-black/5 backdrop-blur"
      >
        <img src="/icons/teddy-bear.png" alt="Sticker" class="h-full w-full object-contain px-1" draggable="false" />
      </div>

      <!-- a few tiny sparkle dots -->
      <div class="absolute top-48 left-1/4 h-2 w-2 rounded-full bg-white/80" />
      <div class="absolute top-64 right-1/3 h-1.5 w-1.5 rounded-full bg-white/70" />
      <div class="absolute bottom-40 left-1/2 h-2 w-2 rounded-full bg-white/70" />
    </div>

    <!-- Page content -->
    <div class="relative mx-auto flex h-full w-[90vw] max-w-7xl flex-col pt-32">
      <div class="flex flex-1 flex-col">
        <slot class="flex-1" />
      </div>

      <footer class="text-center text-sm text-slate-400 pb-4">
        Follow me on Instagram @dimpram_
      </footer>
    </div>
  </div>
</template>
