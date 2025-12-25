<script setup lang="ts">
import Navbar from '@/components/Navbar.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const showFooter = computed(() => {
  // default TRUE
  return route.meta.showFooter !== false;
});
</script>

<template>
  <div class="min-h-screen bg-[#F5F5F5] flex flex-col">
    <Navbar />

    <main class="flex-1 flex flex-col">
      <router-view />
    </main>
    <footer v-if="showFooter" class="py-4 text-center text-sm text-gray-500">
      Follow me on Instagram @dimpram_
    </footer>
  </div>
</template>
