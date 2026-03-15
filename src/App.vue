<script setup>
import CountdownTimer from './components/CountdownTimer.vue';
</script>

<template>
  <div class="min-h-screen bg-cream selection:bg-chocolate/10 flex flex-col">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-chocolate/5 px-6 py-4 flex items-center justify-between">
      <router-link to="/" class="flex items-center gap-2">
        <div class="w-10 h-10 bg-chocolate rounded-lg flex items-center justify-center text-cream font-serif font-bold text-xl">
          DA
        </div>
        <span class="font-serif font-bold text-xl hidden sm:inline-block text-chocolate">Pharmacy Department Award Day</span>
      </router-link>
      <CountdownTimer />
    </nav>

    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="bg-chocolate-hover text-cream/50 py-12 px-6 border-t border-white/5 mt-auto">
      <div class="max-w-7xl mx-auto text-center space-y-4">
        <p class="text-sm tracking-widest uppercase">Pharmacy Department Award Day &copy; 2026</p>
        <p class="text-xs">Pharmacy Department</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Smooth focus transitions */
*:focus-visible {
  outline: 2px solid var(--color-chocolate-hover);
  outline-offset: 4px;
}

/* Route transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
