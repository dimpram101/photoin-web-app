<script setup lang="ts">
import { Camera, Download, Trash2, X } from 'lucide-vue-next';
import { computed, ref } from 'vue';

import type { LayoutConfig } from '@/lib/layouts';
import type { StickerObject } from '@/stores/photoSession';

type Props = {
  layout: LayoutConfig;
  photos: string[];
  backgroundColor: string;
  backgroundImageDataUrl: string | null;
  templateImageDataUrl: string | null;
  stickers: StickerObject[];
  activeStickerId: string | null;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'removePhoto', index: number): void;
  (e: 'setActiveSticker', id: string | null): void;
  (e: 'updateSticker', partial: Partial<StickerObject> & { id: string }): void;
  (e: 'deleteSticker', id: string): void;
}>();

const rootEl = ref<HTMLElement | null>(null);

const gridClass = computed(() => {
  switch (props.layout.type) {
    case 'strip-4':
      return 'grid grid-cols-1 grid-rows-4 gap-3';
    case 'strip-2':
      return 'grid grid-cols-1 grid-rows-2 gap-3';
    case 'grid-6':
      return 'grid grid-cols-2 grid-rows-3 gap-3';
    case 'grid-4':
      return 'grid grid-cols-2 grid-rows-2 gap-3';
    default:
      return 'grid grid-cols-2 grid-rows-2 gap-3';
  }
});

const backgroundStyle = computed(() => {
  if (props.backgroundImageDataUrl) {
    return {
      backgroundImage: `url(${props.backgroundImageDataUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    } as const;
  }

  return {
    backgroundColor: props.backgroundColor,
  } as const;
});

const onStickerPointerDown = (ev: PointerEvent, stickerId: string) => {
  const root = rootEl.value;
  if (!root) return;

  const sticker = props.stickers.find((s) => s.id === stickerId);
  if (!sticker) return;

  emit('setActiveSticker', stickerId);

  const rect = root.getBoundingClientRect();
  const startX = ev.clientX;
  const startY = ev.clientY;
  const startStickerX = sticker.x;
  const startStickerY = sticker.y;

  (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);

  const onMove = (e: PointerEvent) => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    const nextX = Math.max(0, Math.min(rect.width - 40, startStickerX + dx));
    const nextY = Math.max(0, Math.min(rect.height - 40, startStickerY + dy));

    emit('updateSticker', { id: stickerId, x: nextX, y: nextY });
  };

  const onUp = () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
  };

  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
};

const zoomSticker = (id: string, delta: number) => {
  const sticker = props.stickers.find((s) => s.id === id);
  if (!sticker) return;

  const next = Math.max(0.4, Math.min(2.5, sticker.scale + delta));
  emit('updateSticker', { id, scale: next });
};

const rotateSticker = (id: string) => {
  const sticker = props.stickers.find((s) => s.id === id);
  if (!sticker) return;

  emit('updateSticker', { id, rotation: (sticker.rotation + 15) % 360 });
};

const downloadPng = async () => {
  const layout = props.layout;
  const canvas = document.createElement('canvas');

  const isStrip = layout.type.startsWith('strip');
  const baseWidth = isStrip ? 800 : 1200;
  const baseHeight = Math.round(baseWidth / layout.aspectRatio);

  const scale = 3;
  canvas.width = baseWidth * scale;
  canvas.height = baseHeight * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.scale(scale, scale);

  // background
  if (props.backgroundImageDataUrl) {
    const bg = new Image();
    bg.src = props.backgroundImageDataUrl;
    await bg.decode();

    // cover
    const cw = baseWidth;
    const ch = baseHeight;
    const ir = bg.width / bg.height;
    const cr = cw / ch;
    let dw = cw;
    let dh = ch;
    if (ir > cr) {
      dh = ch;
      dw = dh * ir;
    } else {
      dw = cw;
      dh = dw / ir;
    }
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;
    ctx.drawImage(bg, dx, dy, dw, dh);
  } else {
    ctx.fillStyle = props.backgroundColor;
    ctx.fillRect(0, 0, baseWidth, baseHeight);
  }

  // template overlay (optional)
  if (props.templateImageDataUrl) {
    const tpl = new Image();
    tpl.src = props.templateImageDataUrl;
    await tpl.decode();
    ctx.globalAlpha = 0.35;
    ctx.drawImage(tpl, 0, 0, baseWidth, baseHeight);
    ctx.globalAlpha = 1;
  }

  // layout padding + grid
  const pad = 24;
  const gap = 16;
  const signatureH = 36;

  const contentW = baseWidth - pad * 2;
  const contentH = baseHeight - pad * 2 - signatureH;

  let cols = 1;
  let rows = 4;
  if (layout.type === 'strip-2') {
    cols = 1;
    rows = 2;
  } else if (layout.type === 'strip-4') {
    cols = 1;
    rows = 4;
  } else if (layout.type === 'grid-4') {
    cols = 2;
    rows = 2;
  } else if (layout.type === 'grid-6') {
    cols = 2;
    rows = 3;
  }

  const cellW = (contentW - gap * (cols - 1)) / cols;
  const cellH = (contentH - gap * (rows - 1)) / rows;

  // photos
  for (let i = 0; i < layout.photoCount; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;

    const x = pad + c * (cellW + gap);
    const y = pad + r * (cellH + gap);

    // slot
    ctx.fillStyle = 'rgba(255,255,255,0.65)';
    roundRect(ctx, x, y, cellW, cellH, 16);
    ctx.fill();

    if (props.photos[i]) {
      const img = new Image();
      img.src = props.photos[i];
      await img.decode();

      // cover inside cell
      const ir = img.width / img.height;
      const cr = cellW / cellH;
      let dw = cellW;
      let dh = cellH;
      if (ir > cr) {
        dh = cellH;
        dw = dh * ir;
      } else {
        dw = cellW;
        dh = dw / ir;
      }

      const dx = x + (cellW - dw) / 2;
      const dy = y + (cellH - dh) / 2;

      ctx.save();
      roundRect(ctx, x, y, cellW, cellH, 16);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    }
  }

  // stickers overlay (relative to root element dimensions)
  const root = rootEl.value;
  if (root) {
    const rect = root.getBoundingClientRect();
    const sx = baseWidth / rect.width;
    const sy = baseHeight / rect.height;

    for (const s of props.stickers) {
      const img = new Image();
      img.src = s.src;
      await img.decode();

      const w = 80 * s.scale;
      const h = 80 * s.scale;

      ctx.save();
      ctx.translate(s.x * sx + w / 2, s.y * sy + h / 2);
      ctx.rotate((s.rotation * Math.PI) / 180);
      ctx.drawImage(img, -(w / 2), -(h / 2), w, h);
      ctx.restore();
    }
  }

  // signature
  ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
  ctx.font = '700 18px system-ui, -apple-system, Segoe UI, Roboto, Arial';
  ctx.textAlign = 'center';
  ctx.fillText('G.STUDIO', baseWidth / 2, baseHeight - pad);

  const dataUrl = canvas.toDataURL('image/png');
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = `photostrip_${ts}.png`;
  a.click();
};

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
};

defineExpose({
  downloadPng,
});
</script>

<template>
  <div class="rounded-2xl bg-white/70 p-4 shadow-sm ring-1 ring-slate-200 backdrop-blur">
    <div class="mb-3 flex items-center justify-between gap-3">
      <div>
        <p class="font-poppins text-sm font-semibold text-slate-900">Preview</p>
        <p class="text-xs text-slate-500">{{ photos.length }}/{{ layout.photoCount }}</p>
      </div>

      <button
        type="button"
        class="inline-flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        @click="downloadPng"
      >
        <Download class="h-4 w-4" />
        Download
      </button>
    </div>

    <div
      ref="rootEl"
      class="relative w-full overflow-hidden rounded-2xl ring-1 ring-slate-200"
      :class="layout.cssClass"
      :style="[backgroundStyle, { aspectRatio: String(layout.aspectRatio) }]"
      @pointerdown.self="emit('setActiveSticker', null)"
    >
      <div v-if="templateImageDataUrl" class="pointer-events-none absolute inset-0 opacity-30">
        <img :src="templateImageDataUrl" alt="Template" class="h-full w-full object-cover" draggable="false" />
      </div>

      <div class="relative h-full w-full p-4">
        <div class="h-full w-full" :class="gridClass">
          <div
            v-for="slotIndex in layout.photoCount"
            :key="slotIndex"
            class="relative overflow-hidden rounded-2xl bg-white/65 ring-1 ring-slate-200"
          >
            <div class="aspect-3/2 w-full">
              <img
                v-if="photos[slotIndex - 1]"
                :src="photos[slotIndex - 1]"
                :alt="`Photo ${slotIndex}`"
                class="h-full w-full object-contain"
                draggable="false"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center text-slate-400"
              >
                <Camera class="h-6 w-6" />
              </div>
            </div>

            <button
              v-if="photos[slotIndex - 1]"
              type="button"
              class="absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white/80 text-slate-700 shadow-sm ring-1 ring-slate-200 transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              :aria-label="`Delete photo ${slotIndex}`"
              @click="emit('removePhoto', slotIndex - 1)"
            >
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>

        <!-- Stickers layer -->
        <div class="absolute inset-0">
          <div
            v-for="s in stickers"
            :key="s.id"
            class="absolute"
            :style="{
              left: `${s.x}px`,
              top: `${s.y}px`,
              transform: `rotate(${s.rotation}deg) scale(${s.scale})`,
              transformOrigin: 'top left',
            }"
            @pointerdown.prevent="onStickerPointerDown($event, s.id)"
          >
            <div
              class="relative rounded-xl p-1"
              :class="activeStickerId === s.id ? 'ring-2 ring-blue-500' : 'ring-1 ring-transparent'"
            >
              <img :src="s.src" alt="Sticker" class="h-20 w-20 select-none object-contain" draggable="false" />

              <div v-if="activeStickerId === s.id" class="absolute -top-3 -right-3 flex gap-1">
                <button
                  type="button"
                  class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
                  aria-label="Zoom in"
                  @click.stop="zoomSticker(s.id, 0.1)"
                >
                  +
                </button>
                <button
                  type="button"
                  class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
                  aria-label="Zoom out"
                  @click.stop="zoomSticker(s.id, -0.1)"
                >
                  −
                </button>
                <button
                  type="button"
                  class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white"
                  aria-label="Rotate"
                  @click.stop="rotateSticker(s.id)"
                >
                  ↻
                </button>
                <button
                  type="button"
                  class="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/90 text-rose-600 shadow-sm ring-1 ring-slate-200 hover:bg-white"
                  aria-label="Delete"
                  @click.stop="emit('deleteSticker', s.id)"
                >
                  <X class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute inset-x-0 bottom-0 flex items-center justify-center pb-3">
        <span class="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200">
          PhotoIn
        </span>
      </div>
    </div>
  </div>
</template>
