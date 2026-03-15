<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { categories } from '../stores/categories.js';
import NomineeCard from '../components/NomineeCard.vue';
import CartBanner from '../components/CartBanner.vue';

const route = useRoute();
const router = useRouter();

const categoryId = computed(() => Number(route.params.id));
const category = computed(() => categories.value.find(c => c.id === categoryId.value));

const goBack = () => {
  router.push('/');
};
</script>

<template>
  <main class="max-w-7xl mx-auto px-6 py-12 pb-32">
    <div v-if="category">
      <!-- Back Button & Header Container -->
      <div class="bg-white rounded-[2rem] p-8 md:p-12 mb-8 shadow-sm border border-chocolate/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="space-y-4">
          <button @click="goBack" class="flex items-center gap-2 text-chocolate/60 hover:text-chocolate font-medium transition-colors bg-transparent border-0 p-0 hover:bg-transparent">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Categories
          </button>
          
          <h1 class="text-4xl md:text-5xl font-serif font-black text-chocolate uppercase tracking-wide">
            {{ category.name }}
          </h1>
          <p class="text-lg text-chocolate/70">
            Select your preferred candidates and specify vote quantity
          </p>
        </div>
        
        <div>
           <div class="inline-flex items-center gap-2 px-6 py-3 bg-[#e8dad5] text-[#5a2a03] font-bold rounded-full">
            ₦100 per vote
          </div>
        </div>
      </div>

      <!-- Nominees Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
        <NomineeCard 
          v-for="(nominee, index) in category.nominees" 
          :key="index"
          :nomineeName="nominee.name"
          :categoryName="category.name"
        />
      </div>
      
      <div v-if="!category.nominees || category.nominees.length === 0" class="text-center py-20 bg-white rounded-3xl border border-chocolate/5">
        <p class="text-xl text-chocolate/50">No nominees found for this category.</p>
      </div>
    </div>
    
    <div v-else class="text-center py-20">
      <h2 class="text-2xl font-bold text-chocolate mb-4">Category not found</h2>
      <button @click="goBack" class="bg-chocolate text-cream px-6 py-3 rounded-xl hover:bg-chocolate-hover transition-colors">Return Home</button>
    </div>

    <!-- Sticky Cart Banner -->
    <CartBanner />
  </main>
</template>
