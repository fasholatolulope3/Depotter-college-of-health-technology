<script setup>
defineProps({
  category: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <router-link 
    :to="'/category/' + category.id" 
    class="group relative p-6 rounded-3xl border border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden block"
    style="background-image: url('/hero-bg.jpeg'); background-size: cover; background-position: center;"
  >
    <!-- Overlay -->
    <div class="absolute inset-0 bg-chocolate/85 backdrop-blur-[2px] transition-colors duration-300 group-hover:bg-chocolate/75 z-0"></div>

    <!-- Icon Placeholder container -->
    <div class="relative z-10 w-14 h-14 mb-6 bg-white/10 rounded-2xl flex items-center justify-center text-white/80 group-hover:bg-white group-hover:text-chocolate transition-colors duration-300 border border-white/10">
      <span v-if="category.icon" class="text-2xl" v-html="category.icon"></span>
      <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
    
    <h3 class="relative z-10 text-xl font-bold text-white mb-2">{{ category.name }}</h3>
    <p class="relative z-10 text-sm text-white/60">{{ category.nominees?.length || 0 }} nominee{{ category.nominees?.length !== 1 ? 's' : '' }} • Vote now</p>
    
    <!-- Decorative accent -->
    <div class="absolute -right-2 -bottom-2 w-16 h-16 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
  </router-link>
</template>
