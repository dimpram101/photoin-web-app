export interface LayoutConfig {
  id: string;
  type: 'strip-2' | 'strip-4' | 'grid-4' | 'grid-6';
  title: string;
  description: string;
  photoCount: number;
  aspectRatio: number;
  cssClass: string;
  previewImage: string;
  displayOrder?: number;
}

export const LAYOUTS: LayoutConfig[] = [
  {
    id: 'strip-4',
    type: 'strip-4',
    title: 'The Signature',
    description: 'Size 2 x 6 Strip (4 Pose)',
    photoCount: 4,
    aspectRatio: 0.33333333,
    cssClass: 'strip-4',
    previewImage: 'https://jdpwcysfkjqvnjtmkmle.supabase.co/storage/v1/object/public/LayoutType/spotlight/type%201.png',
    displayOrder: 1,
  },
  {
    id: 'strip-2',
    type: 'strip-2',
    title: 'Portrait Mode',
    description: 'Size 6 x 2 Strip (2 Pose)',
    photoCount: 2,
    aspectRatio: 0.33333333,
    cssClass: 'strip-2',
    previewImage: 'https://jdpwcysfkjqvnjtmkmle.supabase.co/storage/v1/object/public/LayoutType/spotlight/type%202.png',
    displayOrder: 2,
  },
  {
    id: 'grid-6',
    type: 'grid-6',
    title: 'Mix & Match',
    description: 'Size 6 x 4 Strip (6 Pose)',
    photoCount: 6,
    aspectRatio: 0.66666667,
    cssClass: 'grid-6',
    previewImage: 'https://jdpwcysfkjqvnjtmkmle.supabase.co/storage/v1/object/public/LayoutType/spotlight/type%203.png',
    displayOrder: 3,
  },
  {
    id: 'grid-4',
    type: 'grid-4',
    title: 'Quad Grid',
    description: 'Size 6 x 4 Strip (4 Pose)',
    photoCount: 4,
    aspectRatio: 0.66666667,
    cssClass: 'grid-4',
    previewImage: 'https://jdpwcysfkjqvnjtmkmle.supabase.co/storage/v1/object/public/LayoutType/spotlight/type%204.png',
    displayOrder: 4,
  },
];

export const isPopularLayout = (layout: LayoutConfig) => layout.type === 'strip-4' || layout.type === 'grid-6';
