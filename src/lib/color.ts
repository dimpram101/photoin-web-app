export type Color = {
  name: string;
  hex: string;
  url?: string;
  labelColor: 'text-black' | 'text-white';
};

export const colors: Color[] = [
  { name: 'Light Gray', hex: '#f3f4f6', labelColor: 'text-black' },
  { name: 'Yellow', hex: '#fde047', labelColor: 'text-black' },
  { name: 'Peach', hex: '#ffdab9', labelColor: 'text-black' },
  { name: 'Pink', hex: '#f472b6', labelColor: 'text-black' },
  { name: 'Sky', hex: '#0ea5e9', labelColor: 'text-white' },
  { name: 'Blue', hex: '#3b82f6', labelColor: 'text-white' },
  { name: 'Green', hex: '#22c55e', labelColor: 'text-white' },
  { name: 'Teal', hex: '#14b8a6', labelColor: 'text-white' },
  { name: 'Coral', hex: '#ff7f50', labelColor: 'text-white' },
  { name: 'Gray', hex: '#6b7280', labelColor: 'text-white' },
  { name: 'Brown', hex: '#a16207', labelColor: 'text-white' },
  // Templates (no hex, order as before)
  { name: 'Catur 2', hex: '', url: '/template/4.jpeg', labelColor: 'text-black' },
  { name: 'Ocean Paper', hex: '', url: '/template/ocean-paper.jpg', labelColor: 'text-black' },
  { name: 'Pink Divide', hex: '', url: '/template/pink-divide.jpg', labelColor: 'text-black' },
  { name: 'Towel Paper', hex: '', url: '/template/towel-paper.jpg', labelColor: 'text-black' },
  { name: 'Karpet', hex: '', url: '/template/graphic1.jpeg', labelColor: 'text-white' },
  { name: 'Ntah', hex: '', url: '/template/17.jpeg', labelColor: 'text-white' },
  { name: 'Catur', hex: '', url: '/template/9.jpeg', labelColor: 'text-white' },
  { name: 'Sky Gleam', hex: '', url: '/template/sky-gleam.jpg', labelColor: 'text-white' },
];
