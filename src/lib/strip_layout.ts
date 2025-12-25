export interface StripLayout {
  id: string;
  type: string;
  title: string;
  description: string;
  photo_count: number;
  aspect_ratio: number;
  css_class: string;
  preview_image_url: string;
  created_at: string;
  display_order: number;
}

export const STRIP_LAYOUTS: StripLayout[] = [
  {
    id: 'strip-4',
    type: 'strip-4',
    title: 'The Signature',
    description: 'Size 2 x 6 Strip (4 Pose)',
    photo_count: 4,
    aspect_ratio: 0.33333333,
    css_class: 'strip-4',
    preview_image_url:
      '/testimoni/1.png',
    created_at: '2025-12-22T13:43:20.360125+00:00',
    display_order: 1,
  },
  {
    id: 'strip-2',
    type: 'strip-2',
    title: 'Portrait Mode',
    description: 'Size 6 x 2 Strip (2 Pose)',
    photo_count: 2,
    aspect_ratio: 0.33333333,
    css_class: 'strip-2',
    preview_image_url:
      '/testimoni/2.png',
    created_at: '2025-12-22T13:43:20.360125+00:00',
    display_order: 2,
  },
  {
    id: 'grid-6',
    type: 'grid-6',
    title: 'Mix & Match',
    description: 'Size 6 x 4 Strip (6 Pose)',
    photo_count: 6,
    aspect_ratio: 0.66666667,
    css_class: 'grid-6',
    preview_image_url:
      '/testimoni/3.png',
    created_at: '2025-12-22T13:43:20.360125+00:00',
    display_order: 3,
  },
  {
    id: 'grid-4',
    type: 'grid-4',
    title: 'Quad Grid',
    description: 'Size 6 x 4 Strip (4 Pose)',
    photo_count: 4,
    aspect_ratio: 0.66666667,
    css_class: 'grid-4',
    preview_image_url:
      '/testimoni/4.png',
    created_at: '2025-12-22T13:43:20.360125+00:00',
    display_order: 4,
  },
];
