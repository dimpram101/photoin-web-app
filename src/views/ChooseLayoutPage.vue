<script setup lang="ts">
import { STRIP_LAYOUTS, type StripLayout } from '@/lib/strip_layout';
import { usePhotoboothStore } from '@/stores/storePhotobooth';
import gsap from 'gsap';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const photoboothStore = usePhotoboothStore();
const router = useRouter();

const rootEl = ref<HTMLElement | null>(null);
let gsapCtx: gsap.Context | null = null;
let gsapMm: gsap.MatchMedia | null = null;

function selectLayout(layout: StripLayout) {
  photoboothStore.setSelectedLayout(layout);
  router.push({ name: 'photo-session' });
}

onMounted(() => {
  if (!rootEl.value) return;

  gsapCtx = gsap.context(() => {
    const q = gsap.utils.selector(rootEl.value as HTMLElement);

    // Entrance animation
    const cards = q('[data-layout-card]') as HTMLElement[];
    if (cards.length) {
      gsap.fromTo(
        cards,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.06 },
      );
    }

    // Subtle floating animation (respect reduced motion)
    gsapMm = gsap.matchMedia();
    gsapMm.add('(prefers-reduced-motion: no-preference)', () => {
      const floatEls = q('[data-layout-float]') as HTMLElement[];
      if (!floatEls.length) return;

      gsap.set(floatEls, {
        transformOrigin: '50% 50%',
        willChange: 'transform',
        force3D: true,
      });

      floatEls.forEach((el, index) => {
        const floatDistance = gsap.utils.random(6, 14);
        const swayDistance = gsap.utils.random(4, 10);
        const rotateAmount = gsap.utils.random(0.8, 2.2);
        const duration = gsap.utils.random(3.0, 4.6);

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
  <div ref="rootEl" class="relative mx-auto flex h-full w-[90vw] max-w-7xl flex-col pt-32 pb-16">
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

      <div class="relative mt-10">
        <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
          <div class="absolute -top-8 left-8 h-28 w-28 rounded-full bg-blue-200/40 blur-2xl" />
          <div class="absolute right-10 -bottom-10 h-32 w-32 rounded-full bg-rose-200/40 blur-2xl" />
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div
            v-for="layout in STRIP_LAYOUTS"
            :key="layout.id"
            data-layout-card
            class="group flex cursor-pointer flex-col rounded-2xl bg-white/70 p-6 shadow-sm ring-1 ring-slate-200 backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
            @click="selectLayout(layout)"
          >
            <div class="flex flex-1 flex-col items-center justify-center">
              <div
                data-layout-float
                class="flex w-full items-center justify-center rounded-xl bg-white/60 p-3 ring-1 ring-slate-200/70"
              >
                <img
                  :src="layout.preview_image_url"
                  :alt="layout.title"
                  class="mx-auto h-72 w-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
            </div>
            <p class="mt-4 font-semibold text-slate-900">
              {{ layout.title }}
            </p>
            <p class="mt-1 text-sm text-slate-600">
              {{ layout.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
