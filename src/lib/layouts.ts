export interface LayoutConfig {
  id: string;
  type: 'strip-2' | 'strip-4' | 'grid-4' | 'grid-6';
  title: string;
  description: string;
  photoCount: number;
  aspectRatio: number;
  cssClass: string;
  previewImage: string;
}

export const LAYOUTS: LayoutConfig[] = [
  {
    id: 'the-signature',
    type: 'strip-4',
    title: 'The Signature',
    description: '2×6 strip, 4 photos vertically.',
    photoCount: 4,
    aspectRatio: 2 / 6,
    cssClass: 'aspect-[2/6]',
    previewImage: '/icons/sticker22.png',
  },
  {
    id: 'portrait-mode',
    type: 'strip-2',
    title: 'Portrait Mode',
    description: '2×6 strip, 2 photos vertically.',
    photoCount: 2,
    aspectRatio: 2 / 6,
    cssClass: 'aspect-[2/6]',
    previewImage: '/icons/hedgehog.png',
  },
  {
    id: 'mix-and-match',
    type: 'grid-6',
    title: 'Mix & Match',
    description: '4×6 grid, 6 photos (2×3).',
    photoCount: 6,
    aspectRatio: 4 / 6,
    cssClass: 'aspect-[4/6]',
    previewImage: '/icons/flower.png',
  },
  {
    id: 'quad-grid',
    type: 'grid-4',
    title: 'Quad Grid',
    description: '4×6 grid, 4 photos (2×2).',
    photoCount: 4,
    aspectRatio: 4 / 6,
    cssClass: 'aspect-[4/6]',
    previewImage: '/icons/cat.png',
  },
];

export const isPopularLayout = (layout: LayoutConfig) =>
  layout.type === 'strip-4' || layout.type === 'grid-6';
