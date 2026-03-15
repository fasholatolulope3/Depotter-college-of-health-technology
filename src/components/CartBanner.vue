<script setup>
import { useCartStore } from '../stores/cart';
import { useDeadlineStore } from '../stores/deadline';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const deadlineStore = useDeadlineStore();
const router = useRouter();

const proceedToPreview = () => {
  router.push('/checkout');
};
</script>

<template>
  <div 
    v-show="cartStore.totalVotes > 0 && !deadlineStore.isExpired"
    class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1a1a1a] shadow-2xl rounded-full px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-4 md:gap-16 w-[95%] max-w-2xl border border-white/10 backdrop-blur-md transition-all duration-300 transform translate-y-0"
  >
    <div class="flex items-center gap-4 md:gap-8">
      <!-- Total Votes -->
      <div class="flex flex-col">
        <span class="text-[8px] md:text-[10px] font-bold tracking-widest text-white/50 uppercase leading-none mb-1">Votes</span>
        <span class="text-white font-bold text-lg md:text-xl leading-none">{{ cartStore.totalVotes }}</span>
      </div>
      
      <!-- Total Amount -->
      <div class="flex flex-col border-l border-white/10 pl-4 md:pl-0 md:border-0">
        <span class="text-[8px] md:text-[10px] font-bold tracking-widest text-white/50 uppercase leading-none mb-1">Total</span>
        <span class="text-white font-bold text-lg md:text-xl leading-none">₦{{ cartStore.totalCost.toLocaleString() }}</span>
      </div>
    </div>

    <!-- action button -->
    <button 
      @click="proceedToPreview"
      class="bg-[#8a3800] hover:bg-[#5a2a03] text-white font-bold py-2.5 md:py-3 px-5 md:px-8 rounded-full transition-colors whitespace-nowrap shadow-lg flex-shrink-0 text-sm md:text-base"
    >
      Proceed
    </button>
  </div>

</template>
