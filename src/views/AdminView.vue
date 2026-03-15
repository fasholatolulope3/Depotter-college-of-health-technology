<script setup>
import { ref, onMounted } from 'vue';
import { useAdminStore } from '../stores/admin';
import { useRouter } from 'vue-router';

const adminStore = useAdminStore();
const router = useRouter();

const isAuthenticated = ref(false);
const password = ref('');
const error = ref('');

const login = () => {
  // Simple password check - in a real app this would be more secure
  if (password.value === 'admin123') {
    isAuthenticated.value = true;
    sessionStorage.setItem('admin_auth', 'true');
  } else {
    error.value = 'Invalid password';
  }
};

const approve = async (id) => {
  if (confirm('Are you sure you want to approve these votes?')) {
    await adminStore.approveTransaction(id);
  }
};


const reject = async (id) => {
  if (confirm('Are you sure you want to reject these votes?')) {
    await adminStore.rejectTransaction(id);
  }
};


const goBack = () => {
  router.push('/');
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};

onMounted(() => {
  if (sessionStorage.getItem('admin_auth') === 'true') {
    isAuthenticated.value = true;
  }
});
</script>

<template>
  <main class="max-w-6xl mx-auto px-6 py-12 pb-32 min-h-screen">
    <!-- Login Screen -->
    <div v-if="!isAuthenticated" class="max-w-md mx-auto mt-20 p-8 bg-white rounded-[2rem] border border-chocolate/10 shadow-xl">
      <div class="text-center mb-8">
        <div class="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-chocolate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="text-2xl font-serif font-bold text-chocolate uppercase tracking-wider">Admin Login</h1>
        <p class="text-chocolate/50 text-sm mt-2">Enter your password to access dashboard</p>
      </div>

      <form @submit.prevent="login" class="space-y-4">
        <div>
          <input 
            v-model="password" 
            type="password" 
            placeholder="Enter admin password" 
            class="w-full px-4 py-4 bg-cream/30 border border-chocolate/10 rounded-xl focus:ring-2 focus:ring-[#09A588] outline-none transition-all placeholder:text-chocolate/20 text-center text-lg"
          />
          <p v-if="error" class="text-red-500 text-xs mt-2 text-center">{{ error }}</p>
        </div>
        <button type="submit" class="w-full bg-[#09A588] text-white font-bold py-4 rounded-xl hover:bg-[#07856d] transition-all shadow-lg active:scale-[0.98]">
          Access Dashboard
        </button>
      </form>
    </div>

    <!-- Dashboard Content -->
    <div v-else>
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-center gap-4">
          <button @click="goBack" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-chocolate hover:bg-cream border border-chocolate/10 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 class="text-3xl font-serif font-bold text-chocolate uppercase tracking-wide">
            Admin Dashboard
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <span class="px-4 py-2 bg-cream rounded-full text-chocolate font-bold text-sm border border-chocolate/5">
            {{ adminStore.pendingTransactions.length }} Transactions
          </span>
          <button @click="isAuthenticated = false; sessionStorage.removeItem('admin_auth')" class="text-chocolate/40 hover:text-red-500 transition-colors text-sm font-bold uppercase tracking-widest">
            Logout
          </button>
        </div>
      </div>

      <div v-if="adminStore.pendingTransactions.length === 0" class="bg-white rounded-[2rem] p-12 text-center border border-chocolate/5 shadow-sm">
        <div class="w-20 h-20 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
          <svg class="w-10 h-10 text-chocolate/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 class="text-2xl font-serif font-bold text-chocolate mb-2">No pending transactions</h2>
        <p class="text-chocolate/50">All votes have been processed.</p>
      </div>

      <div v-else class="space-y-6">
        <div v-for="tx in adminStore.pendingTransactions" :key="tx.id" 
             class="bg-white rounded-[2rem] overflow-hidden border border-chocolate/5 shadow-sm hover:shadow-md transition-shadow">
          <div class="p-8">
            <div class="flex flex-col lg:flex-row gap-8">
              <!-- Left Side: Votes Summary & Actions -->
              <div class="flex-1 space-y-6">
                <!-- Status & Time -->
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="text-lg font-black text-chocolate uppercase tracking-wider">Transaction Record</h3>
                    <p class="text-[10px] text-chocolate/30 mt-1 uppercase tracking-widest font-black">{{ formatDate(tx.timestamp) }}</p>
                  </div>
                  <div :class="[
                    'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border',
                    tx.status === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
                    tx.status === 'approved' ? 'bg-green-50 text-green-600 border-green-200' : 
                    'bg-red-50 text-red-600 border-red-200'
                  ]">
                    {{ tx.status }}
                  </div>
                </div>

                <!-- Votes Detail -->
                <div class="bg-cream/20 rounded-2xl p-6 border border-chocolate/5">
                  <h4 class="text-xs font-black text-chocolate uppercase tracking-widest mb-4 border-b border-chocolate/10 pb-2 flex items-center justify-between">
                    <span>Votes Summary</span>
                    <span class="text-[10px] text-chocolate/30 font-medium lowercase">id: {{ tx.id }}</span>
                  </h4>
                  <div class="space-y-3">
                    <div v-for="(vote, idx) in tx.votes" :key="idx" class="flex justify-between items-center text-sm">
                      <div class="flex flex-col">
                        <span class="font-bold text-chocolate">{{ vote.nomineeName }}</span>
                        <span class="text-[10px] text-chocolate/40 font-medium uppercase">{{ vote.categoryName }}</span>
                      </div>
                      <span class="bg-white px-3 py-1 rounded-full border border-chocolate/10 font-bold text-chocolate">{{ vote.quantity }}</span>
                    </div>
                    <div class="pt-4 mt-4 border-t border-chocolate/10 flex justify-between items-center font-black text-chocolate text-base">
                      <span class="uppercase tracking-widest text-xs">Total Payment</span>
                      <span class="text-xl text-[#09A588]">₦{{ tx.totalCost.toLocaleString() }}</span>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div v-if="tx.status === 'pending'" class="flex flex-col sm:flex-row gap-4 pt-2">
                  <button @click="approve(tx.id)" class="flex-1 bg-[#09A588] hover:bg-[#07856d] text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95">
                    <svg class="w-5 h-5 bg-white/20 rounded-full p-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                    Confirm & Add Votes
                  </button>
                  <button @click="reject(tx.id)" class="bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div v-else-if="tx.status === 'approved'" class="text-center p-4 rounded-xl bg-green-50 text-green-700 font-bold border border-green-200 flex items-center justify-center gap-2 shadow-inner">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  Approved & Processed
                </div>
                <div v-else class="text-center p-4 rounded-xl bg-red-50 text-red-500 font-bold border border-red-200 shadow-inner italic">
                  Transaction Rejected
                </div>
              </div>

              <!-- Right Side: Receipt Image -->
              <div class="lg:w-80 shrink-0">
                <p class="text-[10px] font-black text-chocolate uppercase tracking-widest mb-3 px-2 flex justify-between items-center">
                  <span>Payment Receipt</span>
                  <span class="text-chocolate/20 text-[8px]">Click to expand</span>
                </p>
                <div class="bg-chocolate/5 rounded-2xl overflow-hidden border border-chocolate/10 aspect-[3/4] group relative cursor-zoom-in shadow-inner">
                  <img :src="tx.receiptImage" class="w-full h-full object-contain" />
                  <a :href="tx.receiptImage" target="_blank" class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span class="bg-white px-5 py-2 rounded-full font-bold text-chocolate shadow-2xl text-xs uppercase tracking-widest border border-chocolate/10">View Full Receipt</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
