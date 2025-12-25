import MainLayout from '@/layouts/MainLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
          meta: {
            showFooter: false,
          }
        },
        {
          path: '/about',
          name: 'about',
          component: () => import('@/views/AboutView.vue'),
        },
        {
          path: '/privacy-policy',
          name: 'privacy-policy',
          component: () => import('@/views/PrivacyPage.vue'),
        },
      ],
    },
  ],
});

export default router;
