<script setup>
import { ref, onMounted } from 'vue';
import { useCartStore } from '../stores/cart';
import { useAdminStore } from '../stores/admin';
import { useDeadlineStore } from '../stores/deadline';
import { useRouter } from 'vue-router';

const cartStore = useCartStore();
const adminStore = useAdminStore();
const deadlineStore = useDeadlineStore();
const router = useRouter();

const customerEmail = ref('');
const isProcessing = ref(false);
const errorMessage = ref('');

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const finalizeVotes = async (reference, verifiedEmail) => {
  const transactionData = {
    votes: JSON.parse(JSON.stringify(cartStore.votes)),
    totalCost: cartStore.totalCost,
    status: 'approved',
    paystackReference: reference,
    customerEmail: verifiedEmail || customerEmail.value,
  };

  await adminStore.submitTransaction(transactionData);
  alert('Payment verified! Your votes have been counted.');
  cartStore.$patch({ votes: [] });
  router.push('/');
};

const handlePayment = () => {
  errorMessage.value = '';

  if (!customerEmail.value || !isValidEmail(customerEmail.value)) {
    errorMessage.value = 'Please enter a valid email address.';
    return;
  }

  if (!window.PaystackPop) {
    errorMessage.value = 'Payment provider failed to load. Please refresh the page and try again.';
    return;
  }

  isProcessing.value = true;

  const popup = new window.PaystackPop();
  popup.newTransaction({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: customerEmail.value,
    amount: Math.round(cartStore.totalCost * 100), // kobo
    currency: 'NGN',
    metadata: {
      custom_fields: [
        {
          display_name: 'Total Votes',
          variable_name: 'total_votes',
          value: cartStore.totalVotes,
        },
      ],
    },
    onSuccess: async (transaction) => {
      try {
        const response = await fetch('/api/verify-paystack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reference: transaction.reference,
            expectedAmount: cartStore.totalCost,
          }),
        });
        const result = await response.json();

        if (!result.verified) {
          throw new Error(result.error || 'Payment could not be verified.');
        }

        await finalizeVotes(transaction.reference, result.email);
      } catch (error) {
        console.error('Post-payment verification failed:', error);
        errorMessage.value =
          'We received your payment but could not verify it automatically. Please contact support with reference: ' +
          transaction.reference;
      } finally {
        isProcessing.value = false;
      }
    },
    onCancel: () => {
      isProcessing.value = false;
    },
    onError: (error) => {
      console.error('Paystack error:', error);
      errorMessage.value = 'Payment failed: ' + (error?.message || 'Please try again.');
      isProcessing.value = false;
    },
  });
};

const goBack = () => {
  router.back();
};

onMounted(() => {
  if (deadlineStore.isExpired) {
    alert('Voting has concluded. You cannot make any new payments.');
    router.push('/');
    return;
  }

  if (cartStore.totalVotes === 0) {
    router.push('/');
  }
});
</script>

<template>
  <main class="max-w-3xl mx-auto px-6 py-12 pb-32">
    <!-- Header -->
    <div class="mb-8 flex items-center gap-4">
      <button @click="goBack" class="w-10 h-10 rounded-full bg-white flex items-center justify-center text-chocolate hover:bg-cream border border-chocolate/10 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>
      <h1 class="text-3xl font-serif font-black text-chocolate uppercase tracking-wide">
        Checkout Summary
      </h1>
    </div>

    <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-chocolate/5 space-y-8">

      <!-- Votes Summary Section -->
      <section>
        <div class="flex items-center justify-between mb-4 border-b border-chocolate/10 pb-2">
          <h2 class="text-xl font-bold text-chocolate">Your Votes</h2>
          <span class="text-xs font-bold text-chocolate/30 uppercase tracking-widest">Card / Bank Payment</span>
        </div>
        <div class="space-y-4">
          <div v-for="(vote, index) in cartStore.votes" :key="index" class="flex justify-between items-center py-2 border-b border-chocolate/5 last:border-0">
            <div>
              <p class="font-bold text-chocolate">{{ vote.nomineeName }}</p>
              <p class="text-sm text-chocolate/50">{{ vote.categoryName }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-chocolate bg-cream px-3 py-1 rounded-full">{{ vote.quantity }} votes</p>
              <p class="text-sm text-chocolate/50 mt-1">₦{{ vote.quantity.toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <!-- Total Row -->
        <div class="mt-6 pt-4 border-t-2 border-chocolate/10 flex justify-between items-center text-xl font-black text-chocolate uppercase tracking-wide">
          <span>Total</span>
          <span>₦{{ cartStore.totalCost.toLocaleString() }}</span>
        </div>
      </section>

      <!-- Paystack Payment -->
      <section class="bg-cream-dark p-6 rounded-2xl border border-chocolate/5">
        <h2 class="text-xl font-bold text-chocolate mb-4">Pay Securely</h2>
        <p class="text-chocolate/80 mb-6">
          Pay <span class="font-bold">₦{{ cartStore.totalCost.toLocaleString() }}</span> with your card, bank transfer, or USSD via Paystack. Your votes are counted the moment payment is confirmed.
        </p>

        <form @submit.prevent="handlePayment" class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-chocolate/70 mb-1">Email Address</label>
            <input
              id="email"
              v-model="customerEmail"
              type="email"
              placeholder="you@example.com"
              required
              class="w-full px-4 py-3 bg-white border border-chocolate/10 rounded-xl focus:ring-2 focus:ring-[#09A588] outline-none transition-all"
            />
            <p class="text-xs text-chocolate/40 mt-1">Your payment receipt will be sent here.</p>
          </div>

          <p v-if="errorMessage" class="text-red-500 text-sm font-medium">{{ errorMessage }}</p>

          <button
            type="submit"
            :disabled="isProcessing"
            class="w-full bg-[#09A588] hover:bg-[#07856d] text-white font-bold py-4 px-8 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg v-if="!isProcessing" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <svg v-else class="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isProcessing ? 'Processing...' : 'Pay with Paystack' }}
          </button>

          <p class="text-xs text-center text-chocolate/50 mt-4 leading-relaxed">
            Payments are processed securely by Paystack. Votes are added automatically once your payment is verified.
          </p>
        </form>
      </section>

    </div>
  </main>
</template>
