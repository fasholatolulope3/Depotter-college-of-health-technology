<script setup>
import { ref, computed } from 'vue';
import HeroBanner from '../components/HeroBanner.vue';
import CategorySearch from '../components/CategorySearch.vue';
import CategoryCard from '../components/CategoryCard.vue';
import { categories } from '../stores/categories.js';

const searchQuery = ref('');
const currentPage = ref(1);

const filteredCategories = computed(() => {
  return categories.value.filter(category => 
    category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const paginationItems = [1, 2, 3];
</script>

<template>
  <main>
    <HeroBanner />

    <section class="max-w-7xl mx-auto px-6 py-16 space-y-12">
      <div class="space-y-2">
        <h2 class="text-3xl font-serif font-bold text-chocolate">Categories</h2>
        <p class="text-chocolate/60">Select a category to view nominees and vote.</p>
      </div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <CategorySearch v-model="searchQuery" />
        
        <div class="flex gap-2">
          <button 
            v-for="page in paginationItems" 
            :key="page"
            @click="currentPage = page"
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
              currentPage === page ? 'bg-chocolate text-cream shadow-lg' : 'bg-white border text-chocolate hover:bg-cream-dark'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <CategoryCard 
          v-for="cat in filteredCategories" 
          :key="cat.id" 
          :category="cat" 
        />
      </div>

      <!-- Mobile Pagination -->
      <div class="flex justify-end gap-2 pt-8">
        <button 
            v-for="page in paginationItems" 
            :key="page"
            @click="currentPage = page"
            :class="[
              'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all',
              currentPage === page ? 'bg-chocolate text-cream shadow-lg' : 'bg-white border text-chocolate hover:bg-cream-dark'
            ]"
          >
            {{ page }}
          </button>
      </div>
    </section>
  </main>
</template>
