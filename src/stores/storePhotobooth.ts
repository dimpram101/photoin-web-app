import { type Color, colors } from '@/lib/color';
import { type Photo } from '@/lib/photo';
import { type StripLayout } from '@/lib/strip_layout';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePhotoboothStore = defineStore('photobooth', () => {
  const selectedLayout = ref<StripLayout | null>(null);
  const selectedColor = ref<Color>(colors[0] ?? { name: 'White', hex: '#ffffff', labelColor: 'text-black' });
  const photos = ref<Photo[]>([]);

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
  };
});
