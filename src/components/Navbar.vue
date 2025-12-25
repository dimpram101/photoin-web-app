<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Github, Menu, X } from 'lucide-vue-next';
import { onMounted, onUnmounted, ref } from 'vue';

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

onMounted(() => {
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <nav
    :class="[
      'fixed top-4 left-1/2 z-50 -translate-x-1/2 font-poppins transition-all duration-300',
      isScrolled ? 'bg-white/95 shadow-2xl backdrop-blur-xl' : 'bg-white/70 shadow-lg backdrop-blur-md',
    ]"
    class="w-[92vw] max-w-6xl rounded-2xl border border-gray-200/50 px-4 py-3 sm:px-6"
  >
    <div class="flex items-center justify-between gap-3">
      <!-- Logo -->
      <router-link
        to="/"
        class="inline-flex items-center gap-2 rounded-xl px-2 py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        aria-label="Go to home"
        @click="closeMobileMenu"
      >
        <span
          class="bg-linear-to-r from-blue-600 via-sky-500 to-indigo-600 bg-clip-text text-xl font-bold text-transparent"
        >
          PhotoIn
        </span>
      </router-link>

      <!-- Navigation Links (Desktop) -->
      <ul class="hidden items-center gap-1 rounded-full bg-gray-100/60 py-1.5 md:flex">
        <li>
          <router-link
            to="/"
            class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
            :class="
              $route.path === '/'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
            "
          >
            Home
          </router-link>
        </li>
        <li>
          <router-link
            to="/about"
            class="rounded-full px-5 py-2 text-sm font-medium transition-all duration-200"
            :class="
              $route.path === '/about'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
            "
          >
            About
          </router-link>
        </li>
        <li>
          <router-link
            to="/privacy-policy"
            class="rounded-full px-5 py-2 text-sm font-medium whitespace-nowrap transition-all duration-200"
            :class="
              $route.path === '/privacy-policy'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:bg-white/50 hover:text-gray-900'
            "
          >
            Privacy
          </router-link>
        </li>
      </ul>

      <div class="flex items-center gap-2">
        <!-- GitHub Link -->
        <a
          href="https://github.com/"
          target="_blank"
          rel="noopener"
          class="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-gray-100 to-gray-200 transition-all duration-300 hover:scale-110 hover:from-blue-500 hover:to-purple-600 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          aria-label="GitHub"
        >
          <Github :size="20" class="text-gray-700 transition-colors duration-300 group-hover:text-white" />
        </a>

        <!-- Mobile Menu Button -->
        <button
          type="button"
          class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100/70 text-gray-700 transition-colors hover:bg-gray-200/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 md:hidden"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-menu"
          aria-label="Toggle navigation"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <Menu v-if="!isMobileMenuOpen" :size="20" />
          <X v-else :size="20" />
        </button>
      </div>
    </div>

    <!-- Navigation Links (Mobile) -->
    <div id="mobile-menu" class="md:hidden" :class="isMobileMenuOpen ? 'mt-3 block' : 'hidden'">
      <ul class="flex flex-col gap-1 rounded-xl bg-gray-100/60 p-1.5">
        <li>
          <router-link
            to="/"
            class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            :class="$route.path === '/' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-700 hover:bg-white/60'"
            @click="closeMobileMenu"
          >
            Home
          </router-link>
        </li>
        <li>
          <router-link
            to="/about"
            class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            :class="$route.path === '/about' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-700 hover:bg-white/60'"
            @click="closeMobileMenu"
          >
            About
          </router-link>
        </li>
        <li>
          <router-link
            to="/privacy-policy"
            class="rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            :class="
              $route.path === '/privacy-policy' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-700 hover:bg-white/60'
            "
            @click="closeMobileMenu"
          >
            Privacy
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>
