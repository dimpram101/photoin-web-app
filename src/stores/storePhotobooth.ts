import { type Color, colors } from '@/lib/color';
import { type Photo } from '@/lib/photo';
import { type StripLayout } from '@/lib/strip_layout';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export type PlacedSticker = {
  id: string;
  stickerId: string;
  url: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export const usePhotoboothStore = defineStore('photobooth', () => {
  const selectedLayout = ref<StripLayout | null>(null);
  const selectedColor = ref<Color>(colors[0] ?? { name: 'White', hex: '#ffffff', labelColor: 'text-black' });
  const photos = ref<Photo[]>([]);
  const placedStickers = ref<PlacedSticker[]>([]);

  function setSelectedLayout(layout: StripLayout | null) {
    selectedLayout.value = layout;
  }

  function setSelectedColor(color: Color) {
    selectedColor.value = color;
  }

  const getSelectedLayout = () => selectedLayout.value;
  const getSelectedColor = () => selectedColor.value;

  function addPhoto(photo: Photo) {
    photos.value.push(photo);
  }

  function clearPhotos() {
    photos.value = [];
  }

  function removePhoto(photoId: string) {
    photos.value = photos.value.filter((photo) => photo.id !== photoId);
  }

  function addSticker(sticker: PlacedSticker) {
    placedStickers.value.push(sticker);
  }

  function updateSticker(stickerId: string, updates: Partial<PlacedSticker>) {
    const index = placedStickers.value.findIndex((s) => s.id === stickerId);
    if (index !== -1) {
      placedStickers.value[index] = { ...placedStickers.value[index], ...updates };
    }
  }

  function removeSticker(stickerId: string) {
    placedStickers.value = placedStickers.value.filter((s) => s.id !== stickerId);
  }

  function clearStickers() {
    placedStickers.value = [];
  }

  return {
    selectedLayout,
    setSelectedLayout,
    getSelectedLayout,
    selectedColor,
    setSelectedColor,
    getSelectedColor,
    photos,
    addPhoto,
    clearPhotos,
    removePhoto,
    placedStickers,
    addSticker,
    updateSticker,
    removeSticker,
    clearStickers,
  };
});
