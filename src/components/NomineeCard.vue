<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { categories } from '../stores/categories';

const props = defineProps({
  nomineeName: {
    type: String,
    required: true
  },
  categoryName: {
    type: String,
    required: true
  }
});

import { useAdminStore } from '../stores/admin';
import { useDeadlineStore } from '../stores/deadline';

const route = useRoute();
const cartStore = useCartStore();
const adminStore = useAdminStore();
const deadlineStore = useDeadlineStore();
const categoryId = computed(() => Number(route.params.id));

const quantity = computed(() => 
  cartStore.getQuantity(categoryId.value, props.nomineeName)
);

const increment = () => {
  cartStore.addVote(categoryId.value, props.categoryName, props.nomineeName);
};

const decrement = () => {
  cartStore.removeVote(categoryId.value, props.nomineeName);
};

// Calculate total approved votes from the admin store (persisted in localStorage)
const displayVotes = computed(() => {
  return adminStore.pendingTransactions
    .filter(tx => tx.status === 'approved')
    .reduce((total, tx) => {
      // Find votes for this specific nominee in this category
      const nomineeVotes = tx.votes.find(v => 
        v.nomineeName === props.nomineeName && 
        v.categoryId === categoryId.value
      );
      return total + (nomineeVotes ? nomineeVotes.quantity : 0);
    }, 0);
});
</script>

<template>
  <div class="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-chocolate/5 group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
    <!-- Image/Poster Area with gradient overlay -->
    <div class="relative w-full aspect-[4/3] bg-chocolate bg-gradient-to-br from-[#8a3800] to-[#3d1c02] flex items-center justify-center p-6 overflow-hidden">
      <!-- Checked State Icon -->
      <div v-if="quantity > 0" class="absolute top-4 right-4 z-20 w-8 h-8 bg-chocolate-hover rounded-full flex items-center justify-center shadow-lg border-2 border-white text-white">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <!-- Placeholder decorative background elements -->
      <div class="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-300 via-transparent to-transparent"></div>
      
      <div class="relative z-10 text-center space-y-2 w-full border border-white/20 p-6 flex flex-col items-center justify-center h-full">
        <p class="text-white/80 text-xs font-semibold tracking-[0.2em] uppercase">Pharmacy Department</p>
        <h3 class="text-white text-3xl font-serif font-bold uppercase leading-none tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 pb-1">
          Award<br/>Day
        </h3>
        <div class="h-px w-2/3 bg-gradient-to-r from-transparent via-white/50 to-transparent my-2"></div>
        <p class="text-red-400 font-bold text-sm tracking-widest uppercase">Tagged: <span class="text-white/90 font-normal tracking-wide">Resilience Reimagined</span></p>
      </div>
    </div>

    <!-- Content Area -->
    <div class="p-8 space-y-6">
      <div class="space-y-2">
        <h2 class="text-2xl font-serif font-bold text-chocolate uppercase leading-tight">{{ nomineeName }}</h2>
        <p class="text-chocolate/50 text-sm font-medium">{{ displayVotes }} vote{{ displayVotes !== 1 ? 's' : '' }}</p>
      </div>
      
      <!-- Vote quantity selector matching the design -->
      <div v-if="!deadlineStore.isExpired" class="bg-chocolate/5 rounded-full flex items-center p-2 relative">
        <button 
          @click="decrement" 
          :disabled="quantity === 0"
          :class="[
            'w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed',
            quantity > 0 ? 'text-chocolate hover:bg-cream' : 'text-chocolate/30'
          ]"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
          </svg>
        </button>
        
        <div class="flex-1 text-center font-bold text-chocolate text-lg">
          {{ quantity }}
        </div>
        
        <button 
          @click="increment" 
          class="w-10 h-10 rounded-full bg-white text-chocolate flex items-center justify-center hover:bg-cream transition-colors shadow-sm"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      <div v-else class="bg-red-50 text-red-500 text-center rounded-full py-3 font-bold text-sm border border-red-100 uppercase tracking-widest">
        Voting Closed
      </div>
    </div>
  </div>
</template>

