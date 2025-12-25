<script setup lang="ts">
import { Photo } from '@/lib/photo';
import { StripLayout } from '@/lib/strip_layout';
import { Image, X } from 'lucide-vue-next';

const props = defineProps<{
  selectedLayout: StripLayout;
  photos: Photo[];
  onDeletePhoto: (photoId: string) => void;
}>();

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
    <!-- aspect 0.333333 or 0.66666667-->
    <div
      class="relative mx-auto overflow-hidden shadow-lg"
      :style="`aspect-ratio: ${props.selectedLayout.aspect_ratio}; width: 100%`"
    >
      <div class="z-0 flex h-full flex-col">
        <!-- options are (grid-cols-1 grid-rows-4), (grid-cols-1 grid-rows-4), (grid-cols-2 grid-rows-2), (grid-cols-2 grid-rows-3) -->
        <div class="grid min-h-0 grow gap-1 p-2" :class="getLayoutGrid()">
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
              <!-- Uncomment below if you have readonly and onDeletePhoto props -->

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
            class="font-serif tracking-wider text-white/90 italic"
            style="text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); font-size: 6px;"
          >
            PhotoIn
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
