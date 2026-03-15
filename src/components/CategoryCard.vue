<script setup>
defineProps({
  category: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <router-link :to="'/category/' + category.id" class="group relative bg-white p-6 rounded-3xl border border-chocolate/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden block">
    <!-- Icon Placeholder container -->
    <div class="w-14 h-14 mb-6 bg-cream rounded-2xl flex items-center justify-center text-chocolate/60 group-hover:bg-chocolate group-hover:text-cream transition-colors duration-300">
      <span v-if="category.icon" class="text-2xl" v-html="category.icon"></span>
      <svg v-else class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    </div>
    
    <h3 class="text-xl font-bold text-chocolate mb-2">{{ category.name }}</h3>
    <p class="text-sm text-chocolate/50">{{ category.nominees?.length || 0 }} nominee{{ category.nominees?.length !== 1 ? 's' : '' }} • Vote now</p>
    
    <!-- Decorative accent -->
    <div class="absolute -right-2 -bottom-2 w-16 h-16 bg-chocolate/5 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
  </router-link>
</template>
