<script setup lang="ts">
import { useRouter } from 'vue-router';

import { isPopularLayout, LAYOUTS } from '@/lib/layouts';
import { usePhotoSessionStore } from '@/stores/photoSession';

const layouts = LAYOUTS;

const router = useRouter();
const photoSessionStore = usePhotoSessionStore();

const chooseLayout = async (layoutType: (typeof layouts)[number]['type']) => {
	photoSessionStore.selectLayout(layoutType);
	await router.push({ name: 'photo-session' });
};
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
				<button
					v-for="layout in layouts"
					:key="layout.id"
					type="button"
					class="group block rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/80 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
					:aria-label="`Select ${layout.title} layout`"
					@click="chooseLayout(layout.type)"
				>
					<div class="relative">
						<div
							class="relative w-full overflow-hidden rounded-2xl bg-white/70 shadow-sm ring-1 ring-slate-200 transition-all duration-300 group-hover:ring-slate-300"
							:class="layout.cssClass"
							:style="{ aspectRatio: String(layout.aspectRatio) }"
						>
							<img
								:src="layout.previewImage"
								:alt="`${layout.title} preview`"
								class="h-full w-full object-contain p-6"
								draggable="false"
								loading="lazy"
							/>

							<div
								aria-hidden="true"
								class="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-white/80 to-transparent"
							/>
						</div>

						<div
							v-if="isPopularLayout(layout)"
							class="absolute top-3 left-3 inline-flex items-center rounded-full bg-amber-100/90 px-3 py-1 text-xs font-semibold tracking-wide text-amber-800 uppercase ring-1 ring-amber-200"
						>
							POPULAR
						</div>
					</div>

					<div class="mt-4">
						<h3 class="font-poppins text-lg font-bold text-slate-900">{{ layout.title }}</h3>
						<p class="mt-1 text-sm leading-relaxed text-slate-600">{{ layout.description }}</p>

						<div class="mt-4 flex flex-wrap gap-2 text-sm">
							<span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">
								{{ layout.type }}
							</span>
							<span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">
								{{ layout.photoCount }} photos
							</span>
							<span class="rounded-full bg-white/70 px-3 py-1 shadow-sm ring-1 ring-slate-200">
								{{ layout.type.startsWith('strip') ? '2×6' : '4×6' }}
							</span>
						</div>
					</div>
				</button>
			</div>
		</div>
	</div>
</template>
