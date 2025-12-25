import { defineStore } from 'pinia';

import { LAYOUTS, type LayoutConfig } from '@/lib/layouts';

export interface StickerObject {
  id: string;
  src: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export type PhotoFilterName =
  | 'Normal'
  | 'Vintage'
  | 'Grayscale'
  | 'Smooth'
  | 'BW'
  | 'Warm'
  | 'Cool'
  | 'Focus'
  | 'Candy'
  | '80s';

export type PhotoFilterValue = string;

export const FILTERS: Array<{ name: PhotoFilterName; value: PhotoFilterValue }> = [
  { name: 'Normal', value: 'none' },
  { name: 'Vintage', value: 'sepia(0.4) contrast(1.2) brightness(0.9)' },
  { name: 'Grayscale', value: 'grayscale(1)' },
  { name: 'Smooth', value: 'contrast(0.9) brightness(1.1) blur(0.5px)' },
  { name: 'BW', value: 'grayscale(1) contrast(1.3)' },
  { name: 'Warm', value: 'sepia(0.3) saturate(1.2) brightness(1.1)' },
  { name: 'Cool', value: 'hue-rotate(180deg) saturate(0.8)' },
  { name: 'Focus', value: 'contrast(1.2) brightness(1.1)' },
  { name: 'Candy', value: 'brightness(1.1) saturate(1.5) hue-rotate(-10deg)' },
  { name: '80s', value: 'contrast(1.1) brightness(1.1) saturate(1.5) sepia(0.2)' },
];

export type TimerSeconds = 0 | 3 | 5 | 10;
export type CameraFacingMode = 'user' | 'environment';

export type BackgroundColor =
  | '#948979'
  | '#1E3E62'
  | '#52A5CE'
  | '#2B2B23'
  | '#AFAB23'
  | '#876029'
  | '#EF6F4C';

export const BACKGROUND_COLORS: BackgroundColor[] = [
  '#948979',
  '#1E3E62',
  '#52A5CE',
  '#2B2B23',
  '#AFAB23',
  '#876029',
  '#EF6F4C',
];

export const usePhotoSessionStore = defineStore('photoSession', {
  state: () => ({
    selectedLayoutType: null as LayoutConfig['type'] | null,

    photos: [] as string[],

    filterName: 'Normal' as PhotoFilterName,
    filterValue: 'none' as PhotoFilterValue,
    showGridOverlay: false,
    timerSeconds: 3 as TimerSeconds,
    facingMode: 'user' as CameraFacingMode,

    backgroundColor: '#948979' as BackgroundColor,
    backgroundImageDataUrl: null as string | null,
    templateImageDataUrl: null as string | null,

    stickers: [] as StickerObject[],
    activeStickerId: null as string | null,
  }),
  getters: {
    selectedLayout(state): LayoutConfig {
      const match = state.selectedLayoutType
        ? LAYOUTS.find((l) => l.type === state.selectedLayoutType)
        : undefined;

      return match ?? LAYOUTS[0];
    },

    progressText(state): string {
      const layout = state.selectedLayoutType
        ? LAYOUTS.find((l) => l.type === state.selectedLayoutType)
        : undefined;
      const max = layout?.photoCount ?? LAYOUTS[0].photoCount;
      return `${state.photos.length}/${max}`;
    },

    isComplete(state): boolean {
      const layout = state.selectedLayoutType
        ? LAYOUTS.find((l) => l.type === state.selectedLayoutType)
        : undefined;
      const max = layout?.photoCount ?? LAYOUTS[0].photoCount;
      return state.photos.length >= max;
    },
  },
  actions: {
    selectLayout(type: LayoutConfig['type']) {
      this.selectedLayoutType = type;

      this.photos = [];
      this.stickers = [];
      this.activeStickerId = null;
    },

    setTimer(seconds: TimerSeconds) {
      this.timerSeconds = seconds;
    },

    toggleGridOverlay() {
      this.showGridOverlay = !this.showGridOverlay;
    },

    setGridOverlay(on: boolean) {
      this.showGridOverlay = on;
    },

    setFacingMode(mode: CameraFacingMode) {
      this.facingMode = mode;
    },

    toggleFacingMode() {
      this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    },

    setFilter(name: PhotoFilterName) {
      const match = FILTERS.find((f) => f.name === name) ?? FILTERS[0];
      this.filterName = match.name;
      this.filterValue = match.value;
    },

    setBackgroundColor(color: BackgroundColor) {
      this.backgroundColor = color;
      this.backgroundImageDataUrl = null;
    },

    setBackgroundImage(dataUrl: string | null) {
      this.backgroundImageDataUrl = dataUrl;
    },

    setTemplateImage(dataUrl: string | null) {
      this.templateImageDataUrl = dataUrl;
    },

    addPhoto(dataUrl: string) {
      const max = this.selectedLayout.photoCount;
      if (this.photos.length >= max) return;
      this.photos.push(dataUrl);
    },

    removePhoto(index: number) {
      if (index < 0 || index >= this.photos.length) return;
      this.photos.splice(index, 1);
    },

    clearPhotos() {
      this.photos = [];
    },

    addSticker(src: string) {
      const id = crypto.randomUUID();
      const sticker: StickerObject = {
        id,
        src,
        x: 40,
        y: 40,
        scale: 1,
        rotation: 0,
      };
      this.stickers.push(sticker);
      this.activeStickerId = id;
    },

    setActiveSticker(id: string | null) {
      this.activeStickerId = id;
    },

    updateSticker(partial: Partial<StickerObject> & { id: string }) {
      const idx = this.stickers.findIndex((s) => s.id === partial.id);
      if (idx === -1) return;
      this.stickers[idx] = { ...this.stickers[idx], ...partial };
    },

    deleteSticker(id: string) {
      this.stickers = this.stickers.filter((s) => s.id !== id);
      if (this.activeStickerId === id) this.activeStickerId = null;
    },
    reset() {
      this.selectedLayoutType = null;

      this.photos = [];

      this.filterName = 'Normal';
      this.filterValue = 'none';
      this.showGridOverlay = false;
      this.timerSeconds = 3;
      this.facingMode = 'user';

      this.backgroundColor = '#948979';
      this.backgroundImageDataUrl = null;
      this.templateImageDataUrl = null;

      this.stickers = [];
      this.activeStickerId = null;
    },
  },
});
