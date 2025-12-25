import { defineStore } from 'pinia';

import { LAYOUTS, type LayoutConfig } from '@/lib/layouts';

export type PhotoSessionBgId = 'snow' | 'sky' | 'blush' | 'butter' | 'mint';

export const usePhotoSessionStore = defineStore('photoSession', {
  state: () => ({
    selectedLayoutType: null as LayoutConfig['type'] | null,
    backgroundId: 'snow' as PhotoSessionBgId,
  }),
  getters: {
    selectedLayout(state): LayoutConfig {
      const match = state.selectedLayoutType
        ? LAYOUTS.find((l) => l.type === state.selectedLayoutType)
        : undefined;

      return match ?? LAYOUTS[0];
    },
  },
  actions: {
    selectLayout(type: LayoutConfig['type']) {
      this.selectedLayoutType = type;
    },
    setBackground(id: PhotoSessionBgId) {
      this.backgroundId = id;
    },
    reset() {
      this.selectedLayoutType = null;
      this.backgroundId = 'snow';
    },
  },
});
