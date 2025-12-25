export type Color = {
  name: string;
  hex: string;
  url?: string;
  labelColor: 'text-black' | 'text-white';
};

export const colors: Color[] = [
  { name: 'White', hex: '#ffffff', labelColor: 'text-black' },
  { name: 'Black', hex: '#000000', labelColor: 'text-white' },
  { name: 'Light Gray', hex: '#f3f4f6', labelColor: 'text-black' },
  { name: 'Gray', hex: '#6b7280', labelColor: 'text-white' },
  { name: 'Blue', hex: '#3b82f6', labelColor: 'text-white' },
  { name: 'Sky', hex: '#0ea5e9', labelColor: 'text-white' },
  { name: 'Purple', hex: '#a78bfa', labelColor: 'text-black' },
  { name: 'Pink', hex: '#f472b6', labelColor: 'text-black' },
  { name: 'Red', hex: '#ef4444', labelColor: 'text-white' },
  { name: 'Orange', hex: '#fb923c', labelColor: 'text-black' },
  { name: 'Yellow', hex: '#fde047', labelColor: 'text-black' },
  { name: 'Green', hex: '#22c55e', labelColor: 'text-white' },
  { name: 'Teal', hex: '#14b8a6', labelColor: 'text-white' },
  { name: 'Indigo', hex: '#6366f1', labelColor: 'text-white' },
  { name: 'Brown', hex: '#a16207', labelColor: 'text-white' },
  { name: 'Karpet', hex: '', url: '/template/graphic1.jpeg', labelColor: 'text-white' },
  { name: 'Ntah', hex: '', url: '/template/17.jpeg', labelColor: 'text-white' },
  { name: 'Catur', hex: '', url: '/template/9.jpeg', labelColor: 'text-white' },
  { name: 'Catur 2', hex: '', url: '/template/4.jpeg', labelColor: 'text-white' },
];
