import { type StripLayout } from '@/lib/strip_layout';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePhotoboothStore = defineStore('photobooth', () => {
  const selectedLayout = ref<StripLayout | null>(null);

  function setSelectedLayout(layout: StripLayout | null) {
    selectedLayout.value = layout;
  }

  const getSelectedLayout = () => selectedLayout.value;

  return {
    selectedLayout,
    setSelectedLayout,
    getSelectedLayout,
  };
});
