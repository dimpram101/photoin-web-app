import MainLayout from '@/layouts/MainLayout.vue';
import AboutView from '@/views/AboutView.vue';
import ChooseLayoutPage from '@/views/ChooseLayoutPage.vue';
import PhotoSessionPage from '@/views/PhotoSessionPage.vue';
import PrivacyPage from '@/views/PrivacyPage.vue';
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
          component: AboutView,
        },
        {
          path: '/privacy-policy',
          name: 'privacy-policy',
          component: PrivacyPage,
        },
        {
          path: '/choose-layout',
          name: 'choose-layout',
          component: ChooseLayoutPage,
        },
        {
          path: '/photo-session',
          name: 'photo-session',
          component: PhotoSessionPage,
        },
      ],
    },
  ],
});

export default router;
